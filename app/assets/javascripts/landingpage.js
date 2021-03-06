$(document).ready(function(){
  //Until I find a fix
  // location.reload(true);

  // $.auth
  // .validateToken()
  // .then(function(user) {
  //   currentUser = user
  //   window.location.replace("/dashboard")
  // })
  // .fail(function(resp) {
  // });

  $('#signupForm').submit(function(event){
    event.preventDefault();
    var data = {
      email: $('#signupEmail').val(),
      password: $('#signupPassword').val(),
      password_confirmation: $('#signupConfirmPassword').val(),
      name: $('#signupName').val()
    }
    $.auth
    .emailSignUp(data)
    .then(function(user) {
      location.reload(true);
    })
    .fail(function(resp){
      alert('Signup failure');
    });
  })

  $('#loginForm').submit(function(event){
    event.preventDefault();
    var data = {
      email: $('#signinEmail').val(),
      password: $('#signinPassword').val(),
    }
    $.auth
    .emailSignIn(data)
    .then(function(user) {
      location.reload(true);
    })
    .fail(function(resp) {
      alert('Authentication failure');
    });
  })

})
