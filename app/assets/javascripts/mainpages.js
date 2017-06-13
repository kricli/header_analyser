
$(document).ready(function(){
  var currentUser

  $.auth
  .validateToken()
  .then(function(user) {
    currentUser = user
    $('#name').text(" " + user.name)
  })
  .fail(function(resp) {
    window.location.replace("/")
  });

  $('#logout').click(function(){
    $.auth
    .signOut()
    .then(function(data) {
      window.location.replace("/")
    })
  })

})
