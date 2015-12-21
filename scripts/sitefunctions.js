$(document).ready(function(){
    $("#headermenu").load("menu.html", function(){
        $(".cross").hide();
        $(".menu").hide();
        $(".hamburger").click(function() {
          $(".menu").animate({width: 'toggle'}, 300, function() {
            $(".hamburger").hide();
            $(".cross").show();
          });
        });

        $(".cross").click(function() {
          $(".menu").animate({width: 'toggle'}, 300, function() {
            $(".cross").hide();
            $(".hamburger").show();
          });
        });
    });
});