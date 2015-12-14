(function ($) {
    $.fn.dimmer = function (options) {

        // var defaultProperties = {

        // }
        // $.extend(options, defaultProperties);
        setSliderArea(this);
        this
            .find("div.slider")
            .each(function () {
                $(this)
                    // .mousedown(slideDrag)
                    .mousedown(startDrag)
                    .mouseover(mouseIsOver)
                    .mouseup(endDrag)
            })
        offset = clampSlider($("div.slider").offset(), this);
        $(this).offset(offset);
        console.log("MAIN " + ($(".slider-main").offset().top + $(".slider-main").height()));
        console.log("SLIDER " + $(".slider").offset().top + $(".slider").height());
    }

    var setSliderArea = function (jQueryElements) {
        jQueryElements
            .append($("<div/>", {
               class: "slider-main",
            }))
            .append($("<div/>", {
               class: "overlay"
            }));

        $(".slider-main")
            .append($("<div/>", {
                class: "slider"
            }));
    }

    var mouseIsOver = function () {
        $(this)
            .css("border-color", "gray")
            .mouseout(function () {
                $(this).css("border-color", "black");
            })
    }

    var startDrag = function (event) {
        var jThis = $(this),
            startOffset = jThis.offset();
        this.deltaY = event.pageY - startOffset.top;
        $(this).mousemove(trackDrag);
        console.log(this.deltaY);
    }

    var trackDrag = function (event) {
        $(this).offset({
            top: event.pageY - this.deltaY
        })
        $()
        console.log("event.pageY " + event.clientY);
        console.log("offset " + $(this).offset().top)
    }

    var endDrag = function (event) {
        var lastY = event.pageY;

            $(this).offset({
                top: lastY
            })
            .mouseup(slideCleanUp)
        
        console.log("lastY " + lastY);

    }

    var slideCleanUp = function (event) {
         $(this)
            .offset({
                top: event.clientY
            })
            .unbind("mousemove", startDrag)
            .css("background", "white");
    }

    var clampSlider = function (offset, element) {
        var containerTop = $(".slider-main").offset().top;
        var containerBottom = containerTop + $(".slider-main").height();
        var sliderTop = offset.top;
        var sliderBottom = sliderTop+ $(element).height();
        offset.top = sliderTop < containerTop 
                        ? containerTop 
                        : sliderTop;
        offset.top = sliderBottom > containerBottom
                        ? containerBottom - sliderBottom
                        : sliderTop
        console.log(containerBottom);
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


}) (jQuery);