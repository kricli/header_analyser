$(document).ready(function(){

  PubSub.subscribe('auth.emailRegistration.success', function(ev, msg) {
    console.log(msg)
    // alert('Check your email!');
  });

  PubSub.subscribe('auth.emailRegistration.error', function(ev, msg) {
    console.log(msg)
    // alert('There was a error submitting your request. Please try again!');
  });

  PubSub.subscribe('auth.emailSignIn.success', function(ev, msg) {
    console.log(msg)
    // alert('Welcome' + $.auth.user.name + '! Change your password!');
  });

  PubSub.subscribe('auth.emailSignIn.error', function(ev, msg) {
    console.log(msg)
    // alert('There was an error authenticating your account!');
  });

  $.auth.configure({
    apiUrl: 'http://localhost:3000'
  });

  $('#signupForm').submit(function(event){
    event.preventDefault();
    var data = {
      email: $('#signupEmail').val(),
      password: $('#signupPassword').val(),
      password_confirmation: $('#signupConfirmPassword').val(),
      name: $('#signupName').val()
    }
    $.auth.emailSignUp(data);
  })

  $('#loginForm').submit(function(event){
    event.preventDefault();
    var data = {
      email: $('#signinEmail').val(),
      password: $('#signinPassword').val(),
    }
    $.auth.emailSignIn(data);
  })

  $('#headerForm').submit(function(event){
    event.preventDefault();
    var data = {
      'header': {
        'text': $('#headerInput').val(),
      }
    };
    $.ajax({
      type: "POST",
      url: "/headers/create",
      data: data,
      success: function(data) {
        console.log(JSON.stringify(data))
        var str = JSON.stringify(data, undefined, 4);
        output(syntaxHighlight(str));
      }
    });
  })

});
