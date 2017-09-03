const API_URL = 'http://localhost:3030';
let availableVideos;

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

const renderUsers = (users) => {
  console.log('renderUsers', typeof users, users)
  users.map((user, index) => {
    
    let { streams = [] } = user;
    if (typeof streams._id !== 'undefined') {
      streams = [streams]
    }
    console.log('streams =>', streams)
    let userStramsEl = '<span class="pl-4 pb-5">Nothing</span>';
    if (streams && streams.length > 0) {
      userStramsEl = streams.reduce((accumulator, stream) => {
        accumulator += `<li class="list-group-item">${stream.videos.title}</li>`;
        return accumulator;
      }, '');
    }
    console.log(user._id, streams)
    const videoDropdown = getVideosDropdown(user._id, availableVideos)
    const userEl = `
      <div class="col-md-4">
      <div class="card" style="width: 20rem;">
        <img class="card-img-top" src="http://via.placeholder.com/350x150&text=${user.firstName}" alt="Card image cap">
        <div class="card-block">
          <h4 class="card-title pl-4 pt-4">Watching</h4>
        </div>
        <ul class="list-group list-group-flush">${userStramsEl}</ul>
        <div class="card-block p-4">
          <h5>Watch new video</h5>
          ${videoDropdown}
        </div>
        <div class="card-block p-4">
          <div><small>ID: ${user._id}</small></div>
          <div><small>Active streams: ${streams.length}</small></div>
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
      console.log(error);
    }
  })();
});
