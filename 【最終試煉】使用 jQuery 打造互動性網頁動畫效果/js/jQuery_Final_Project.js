$(document).ready(function () {
    $(".dropdown").mouseenter(function (e) { 
        e.preventDefault();
        $(this).addClass("nav__link--active");
        $(this).siblings(".nav-submenu").slideDown();
    });

    $(".nav-menu__item").mouseleave(function () { 
        $(".dropdown").removeClass("nav__link--active");
        $(".nav-submenu").slideUp(200);
    });

    $(".top-link").click(function (e) { 
        e.preventDefault();
        $("html, body").animate({
            scrollTop: 0
        }, 700);
    });

    const swiper = new Swiper('.swiper', {
        // Optional parameters
        loop: true,
        spaceBetween: 0,
        centeredSlides: true,
        speed: 1200,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true,
        'fadeDuration':300,
        'imageFadeDuration': 300
      })
});