const API_URL = 'http://localhost:3030';

const renderUsers = (users) => {
  console.log('renderUsers', typeof users, users)
  users.map((user, index) => {
    
    const { streams = [] } = user;
    console.log('streams =>', streams)
    let userStramsEl = '<span class="pl-4 pb-5">Nothing</span>';
    if (streams && streams.length > 0) {
      userStramsEl = streams.reduce((accumulator, stream) => {
        accumulator += `<li class="list-group-item">${stream.videos.title}</li>`;
        return accumulator;
      }, '');
    }
    console.log(user._id, streams)
    const userEl = `
      <div class="col-md-4">
      <div class="card" style="width: 20rem;">
        <img class="card-img-top" src="http://via.placeholder.com/350x150&text=${user.firstName}" alt="Card image cap">
        <div class="card-block">
          <h4 class="card-title pl-4 pt-4">Watching</h4>
        </div>
        <ul class="list-group list-group-flush">${userStramsEl}</ul>
        <div class="card-block p-4">
          <a href="#" class="card-link">Card link</a>
          <a href="#" class="card-link">Another link</a>
        </div>
      </div>
    </div>`;
    $('#users').append(userEl);
  });
  
}



$( document ).ready(() => {
  
  (async () => {
    try {  
      let users = await fetch(`${API_URL}/users`);
      let parsedUsers = await users.json();
  
      console.log('ES7 Async+fetch/users >>>', parsedUsers.data);
      // renderUsers(parsedUsers);
      renderUsers(parsedUsers.data)
    } catch (error) {
      console.log(error);
    }
  })();
  
  // const users = getUsers();
  // console.log(users);
  // , {
  //   method: 'get'
  // }).then(function(response) {
  //   console.log(response.body);
  // }).catch(function(err) {
  //   // Error :(
  //     console.log(err);
  // });  
});
