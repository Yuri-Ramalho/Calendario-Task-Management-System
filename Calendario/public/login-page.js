document.addEventListener('DOMContentLoaded', function() {
  Parse.initialize('yArd5jI5uzEul4ob6EsljpN9okK0pzy4ttt994Ky', '7hmaVfjipCJYzGFijg6SqXxpgepy4KfBjmzWkX09');
  Parse.serverURL = 'https://parseapi.back4app.com/';
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {

      const user = await Parse.User.logIn(email, password);

      const welcomeAlert = document.getElementById('welcomeAlert');
      welcomeAlert.innerHTML = `Welcome, ${user.get('username')}!`;
      welcomeAlert.style.display = 'block';


      setTimeout(function() {
        window.location.href = 'calendar.html';
      }, 2000);
      
    } catch (error) {

      const alertDiv = document.getElementById('alert');
    

      alertDiv.className = 'alert';
      alertDiv.style.display = 'none';
    
      if (error.code === Parse.Error.OBJECT_NOT_FOUND) {

        alertDiv.innerHTML = 'Invalid username or password.';
        alertDiv.classList.add('alert-danger');
      } else {

        console.error('Error during login:', error.message);
      }


      alertDiv.style.display = 'block';
    }
  });
});
