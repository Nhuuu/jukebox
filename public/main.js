$(document).ready(function(){
  // alert window auto disappear
  $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#success-alert").slideUp('close');
  });
  // materialize side menu on mobile
  $('.sidenav').sidenav();
  // materialize carousel
});

$(document).ready(function(){
  $('.collapsible').collapsible();
});