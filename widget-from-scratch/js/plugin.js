(function ($) {
    $.fn.dimmer = function () {
        $("body").append($("<div/>", {
            id: "slider-container",
            class: "black-overlay white-overlay"
        }));
        $("#slider-container").append($("<div/>", {
            class: "slider"
        }));

        trackSlide();
    }

    var trackSlide = function (event) {
        $(".slider").mouseover(function () {
            $(".slider").css("background-color", "gray");
        })
        $(".slider").mouseout(function () {
            $(".slider").css("background-color", "white");
        })
    }

    $("#slider-container").dimmer();

}) (jQuery);