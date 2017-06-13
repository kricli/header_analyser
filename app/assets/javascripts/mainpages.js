$(document).ready(function(){
  $(function(){
    var current = location.pathname;
    $('#side-menu li a').each(function(){
      var $this = $(this);
      // if the current path is like this link, make it active
      if($this.attr('href').indexOf(current) !== -1){
        $this.addClass('active');
      }
    })
  })

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
