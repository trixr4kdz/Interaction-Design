(function ($) {
    $.fn.dimmer = function (options) {

        // var defaultProperties = {

        // }
        // $.extend(options, defaultProperties);
        setSliderArea(this);

        var clicking = false;
        this
            .find("div.slider")
            .each(function () {
                $(this)
                    .mouseover(mouseIsOver)
                    .mousedown(startDrag);
                $(document).mouseup(endDrag);
            })
        $("div.slider-main").click(clickedSliderMain);
    }

    var adjustBrightness = function () {
        var sliderCenter = $(".slider-main").height() * 0.5;
        var sliderPosition = $(".slider").offset().top;
        var opacity = Math.log(Math.abs(sliderCenter - sliderPosition)) * 0.15;
        if (sliderPosition > sliderCenter) {
            $(".overlay")
                .css("background", "#000")
                .css("opacity", opacity);
        } else {
            $(".overlay")
                .css("background", "#FFF")
                .css("opacity", opacity);
        }
    }

    var adjustSliderColoring = function () {
        var sliderPosition = $(".slider").offset().top;
        $(".color-container").css("height", sliderPosition);
    }

    var clickedSliderMain = function (event) {
        var newTop = event.pageY - $(".slider").height() / 2;
        var offset = clampSlider ({
                top: newTop
                }, 
                $(".slider")
            )
            $(".slider")
                .offset(offset)
        adjustBrightness();
        adjustSliderColoring();
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
            }))
            .append($("<div/>", {
                class: "color-container"
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
        $(this).mousemove(trackDrag);
        event.stopPropagation();
    }

    var trackDrag = function (event) {
        if (clicking) {
            var newTop = event.pageY - this.deltaY;
            $(this).css("background", "gray");
            var offset = clampSlider ({
                top: newTop
                }, 
                this
            )
            $(this)
                .offset(offset)
                .mouseup(endDrag);
            adjustBrightness();
            adjustSliderColoring();
        }
        event.preventDefault();
    }

    var endDrag = function (event) {
        clicking = false;
        $(".slider")
            .unbind("mousemove", startDrag)
            .css("background", "white");
    }

    var clampSlider = function (offset, element) {
        var sliderTop = offset.top;
        var sliderBottom = sliderTop + $(element).height();
        var containerTop = $(".slider-main").offset().top;
        var containerBottom = containerTop + $(".slider-main").height();
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