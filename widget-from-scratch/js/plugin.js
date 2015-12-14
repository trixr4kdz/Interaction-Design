(function ($) {
    $.fn.dimmer = function () {
        this
            .mousedown(slideDrag)
            .mouseover(mouseIsOver)
            console.log($(".slider").offset().top);
        // trackSlide(".slider");
    }

    var mouseIsOver = function () {
        $(this)
            .css("border-color", "gray")
            .mouseout(function () {
                $(this).css("border-color", "black");
            })
    }

    var slideDrag = function (event) {
        $(this)
            .offset({
                top: event.clientY
            })
            .mousemove(slideMove)
            .mouseup(slideCleanUp)
            .css("background", "gray")
    }

    var slideMove = function (event) {
        $(this)
            .offset({
                top: event.clientY
            })
        console.log("FUNCK")
    }

    var slideCleanUp = function (event) {
         $(this)
            .offset({
                top: event.clientY
            })
            .unbind("mousemove", slideMove)
            .css("background", "white");
    }

    var clampSlider = function (offset, element) {
        var containerTop = $("#slider-container").offset().top;
        var containerBottom = containerTop + $("#slider-container").height();
        var sliderTop = offset.top;
        var sliderBottom = sliderTop+ $(element).height();
        offset.top = sliderTop < containerTop 
                        ? containerTop 
                        : sliderTop;
        offset.top = sliderBottom > containerBottom
                        ? containerBottom - sliderBottom
                        : sliderTop
        return offset;
    }

    // var trackSlide = function (target) {
    //     var isSliding = false;
    //     $(target)
    //         .mouseover(function () {
    //             $(this)
    //                 .css("background-color", "gray")
    //                 .mousedown(function () {
    //                     isSliding = false;
    //                     $(this).css({
    //                         background: "yellow"
    //                     })
    //                 .mousemove(function () {
    //                     isSliding = true;
    //                 })
    //             })
    //         })
    //         .mouseup(function () {
    //             var wasSliding = isSliding;
    //             isSliding = false;
    //             if (wasSliding) {
    //                 $(target).css("background-color", "gray");
    //             }
    //         })
    //         .mouseout(function () {
    //             // if (!isSliding) {
    //                 $(target).css("background-color", "white");
    //             // }
    //         })
    // }

    $(".slider").dimmer();

}) (jQuery);