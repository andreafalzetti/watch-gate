const API_URL = 'http://localhost:3030';
let availableVideos;

const clearAlert = (user) => {
  $(`#alert_${user}`).empty() 
}

const showAlert = (user) => {
  const alertEl = `
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      <strong>Alert!</strong> You are watching 3 concurrent streams. Stop one if you wish to watch something else.
    </div>`

  $(`#alert_${user}`).html(alertEl)
}

const refreshUser = async (user) => {
  (async () => {
    try {  
      let users = await fetch(`${API_URL}/users/${user}`);
      
      let parsedUsers = await users.json();
      clearAlert(parsedUsers._id)
      updateUserStreams(parsedUsers)
    } catch (error) {
      console.log(error);
    }
  })();
};

const stopStream = (user, stream) => {
  console.log('stopStream', user, stream);
  fetch(`${API_URL}/streams/${stream}`, {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
    .then(res => {
      console.log(res)
      refreshUser(user)
    });
};

const requestToWatch = (user) => {
  const video = $(`#videos_${user}`).val();
  // console.log('requestToWatch ==>', user, video)
  fetch(`${API_URL}/catalog`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user, video })
  }).then(res => res.json())
    .then(res => console.log(res));
};

const getVideosDropdown = (userId, videos) => {
  const videosDropdown = `
    <div class="input-group">
      <select id='videos_${userId}' class='form-control'>
        ${videos.map(video => {
          return `<option value='${video._id}'>${video.title}</option>`
        })}        
      </select>
      <span class="input-group-btn">
        <button class="btn btn-success" type="button" onClick="requestToWatch('${userId}')">Go!</button>
      </span>
    </div>
  `;
  return videosDropdown;
};

const updateUserStreams = (user) => {
  console.log('updateUser', typeof user, user)
  $(`#${user._id} .watching`).slideUp('slow', () => {
    let { streams = [] } = user;
    if (streams === null ) {
      streams = [];
    }
    if (typeof streams !== 'undefined' && typeof streams._id !== 'undefined') {
      streams = [streams]
    }
    let userStramsEl = '<span class="pl-4 pb-5">Nothing</span>';
    if (streams && streams.length > 0) {
      userStramsEl = streams.reduce((accumulator, stream) => {
        accumulator += `<li class="list-group-item">${stream.videos.title} <button onClick="stopStream('${user._id}', '${stream._id}')" class="btn btn-link btn-sm">Stop</button></li>`;
        return accumulator;
      }, '');      
    }
    $(`#active_streams_${user._id}`).text(streams.length);
    $(`#${user._id} .watching`).html(userStramsEl).slideDown(400);
  });
};

const renderUsers = (users) => {
  console.log('renderUsers', typeof users, users)
  users.map((user, index) => {
    
    let { streams = [] } = user;
    if (streams === null ) {
      streams = [];
    }
    if (typeof streams !== 'undefined' && typeof streams._id !== 'undefined') {
      streams = [streams]
    }
    let userStramsEl = '<span class="pl-4 pb-5">Nothing</span>';
    if (streams && streams.length > 0) {
      userStramsEl = streams.reduce((accumulator, stream) => {
        accumulator += `<li class="list-group-item">${stream.videos.title} <button onClick="stopStream('${user._id}', '${stream._id}')" class="btn btn-link btn-sm">Stop</button></li>`;
        return accumulator;
      }, '');
    }
    console.log(user._id, streams)
    const videoDropdown = getVideosDropdown(user._id, availableVideos)
    const userEl = `
      <div class="col-md-4" id="${user._id}">
      <div class="card" style="width: 20rem;">
        <img class="card-img-top" src="http://via.placeholder.com/350x150&text=${user.firstName}" alt="Card image cap">
        <div class="card-block" id="alert_${user._id}"></div>
        <div class="card-block">
          <h4 class="card-title pl-4 pt-4">Watching <button class="btn btn-link btn-sm" onClick="refreshUser('${user._id}')"><i class="fa fa-refresh" aria-hidden="true"></i></button></h4>                    
        </div>
        <ul class="list-group list-group-flush watching">${userStramsEl}</ul>
        <div class="card-block p-4">
          <h5>Watch new video</h5>
          ${videoDropdown}
        </div>
        <div class="card-block p-4">
          <div><small>ID: ${user._id}</small></div>
          <div><small>Active streams: <span id="active_streams_${user._id}">${streams.length}</span></small></div>
        </div>
      </div>
    </div>`;
    $('#users').append(userEl);
  });
};

$( document ).ready(() => {  
  (async () => {
    try {  
      let users = await fetch(`${API_URL}/users`);
      let parsedUsers = await users.json();

      let videos = await fetch(`${API_URL}/videos`);
      let parsedVideos = await videos.json();
  
      console.log('users >>>', parsedUsers.data);
      console.log('videos >>>', parsedVideos.data);
      
      availableVideos = parsedVideos.data;

      renderUsers(parsedUsers.data)
    } catch (error) {
      console.error(error);
    }
  })();

  const socket = io.connect(API_URL);
  socket.on('connect', () => {
    console.log('connected')
    // $('#chat').addClass('connected');
  });

  socket.on('approved', (msg) => {
    console.log('approved_watch_request', msg);
    const { user } = msg;
    refreshUser(user);
  });
  socket.on('rejected', (msg) => {
    console.log('rejected_watch_request', msg);
    const { user } = msg;
    showAlert(user); 
  });
  
  $(".alert").alert()  
});
