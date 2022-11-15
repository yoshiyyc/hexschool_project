$(document).ready(function () {
    $(".hamburger-icon").click(function (e) { 
        e.preventDefault();
        $(".nav-menu").toggleClass("nav-menu--open");
    });

    $(".dropdown > .nav-menu__link").click(function (e) { 
        e.preventDefault();
    });

    $(".dropdown").click(function (e) { 
        $(this).find(".nav-menu__link").toggleClass("nav-menu__link--selected");
        $(this).siblings().find(".nav-menu__link").removeClass("nav-menu__link--selected");
        $(this).siblings().find(".nav-submenu").slideUp();
        $(this).find(".nav-submenu").slideToggle(200);
    });

    $(".nav-submenu__link").click(function (e) { 
        $(".nav-menu").toggleClass("nav-menu--open");
    });

    $(".merchandise__heart--empty").click(function (e) { 
        e.preventDefault();
        $(this).parent().find(".merchandise__heart--filled").toggle();
    });

    $(".merchandise__heart--filled").click(function (e) { 
        e.preventDefault();
        $(this).parent().find(".merchandise__heart--filled").toggle();
    });

    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true,
        'fadeDuration': 300,
        'imageFadeDuration': 300
    })

});