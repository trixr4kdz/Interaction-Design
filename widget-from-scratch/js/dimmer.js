(function ($) {
    $.fn.dimmer = function (options) {

        // var defaultProperties = {

        // }
        // $.extend(options, defaultProperties);
        var clicking = false;
        setSliderArea(this);
        this
            .find("div.slider")
            .each(function () {
                $(this)
                    .mousedown(startDrag)
                    .mouseover(mouseIsOver)
                    .mouseup(endDrag)
                // if (clicking) {
                //     $(this).mousemove(trackDrag);
                // }
            })
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
        clicking = true;
        var jThis = $(this),
            startOffset = jThis.offset();
        this.deltaY = event.pageY - startOffset.top;
        if (clicking) {
            $(this).mousemove(trackDrag);
        }
        console.log(this.deltaY);
    }

    var trackDrag = function (event) {
        var newTop = event.pageY - this.deltaY;
        $(this).css("background", "gray");
        var offset = clampSlider ({
            top: newTop
            }, 
            this
        )
        console.log("offset " + offset.top)
        console.log("event.pageY " + event.pageY);
        // console.log("offset " + $(this).offset().top)

        $(this).offset(offset);
        console.log($(this).offset().top);
    }

    var endDrag = function (event) {
        clicking = false;
        console.log("endDrag")
        var lastY = event.pageY;
        // $(this).offset({
        //     top: lastY
        // })
        // .mouseup(slideCleanUp)
    }

    // var slideCleanUp = function (event) {
    //      $(this)
    //         .offset({
    //             top: event.clientY
    //         })
    //         .unbind("mousemove", startDrag)
    //         .css("background", "white");
    // }

    var clampSlider = function (offset, element) {
        var containerTop = $(".slider-main").offset().top;
        var containerBottom = containerTop + $(".slider-main").height();
        var sliderTop = offset.top;
        var sliderBottom = sliderTop + $(element).height();

        if (sliderTop < containerTop) {
            offset.top = containerTop;
        } else if (sliderBottom > containerBottom) {
            offset.top = containerBottom - $(element).height();
        } else {
            offset.top = sliderTop;
        }
        return offset;
    }

}) (jQuery);