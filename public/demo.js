const API_URL = 'http://localhost:3030';

const renderUsers = (users) => {
  console.log('renderUsers', typeof users, users)
  users.map((user, index) => {
    const userEl = `
      <div class="col-md-4">
      <div class="card" style="width: 20rem;">
        <img class="card-img-top" src="http://via.placeholder.com/350x150&text=${user.firstName}" alt="Card image cap">
        <div class="card-block">
          <h4 class="card-title pl-4 pt-4">Watching</h4>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Cras justo odio</li>
          <li class="list-group-item">Dapibus ac facilisis in</li>
          <li class="list-group-item">Vestibulum at eros</li>
        </ul>
        <div class="card-block">
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
