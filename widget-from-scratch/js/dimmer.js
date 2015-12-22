(function ($) {
    var OPACITY_CONSTANT = 0.15;
    var HALFWAY_POINT = 0.5;
    var clicking = false;

    $.fn.dimmer = function (options) { 

        var settings = {
            mainColor: "lightblue",
            width: "16px"
        };
        $.extend(settings, options);
        setSliderArea(this);

        this
            .find("div.slider")
            .each(function () { 
                $(this)
                    .mouseover(mouseIsOver)
                    .mousedown(startDrag);
                $(document).mouseup(endDrag);
            });
        $("div.slider-main")
            .click(clickedSliderMain)
            .css({
                "background": settings.mainColor,
                "width": settings.width
            });
    }

    var adjustBrightness = function (element) { 
        var sliderCenter    = $(".slider-main").height() * HALFWAY_POINT;
        var sliderPosition  = $(".slider").offset().top;
        var opacity         = Math.log(Math.abs(sliderCenter - sliderPosition)) * OPACITY_CONSTANT;
        var backgroundColor = sliderPosition > sliderCenter ? "#000" : "#FFF";

        $(element)
            .css("background", backgroundColor)
            .css("opacity", opacity);
    }

    var adjustSliderColoring = function (element) { 
        var sliderPosition = $(".slider").offset().top;
        $(element).css("height", sliderPosition);
    }

    var clickedSliderMain = function (event) { 
        var slider = $(".slider");
        var newTop = event.pageY - slider.height() / 2;
        var offset = clampSlider ({
                top: newTop
            }, 
            slider
        );
        slider.offset(offset);
        adjustBrightness(".overlay");
        adjustSliderColoring(".color-container");
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
            });
    }

    var startDrag = function (event) { 
        clicking = true; // JD: 2
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
            );
            $(this)
                .offset(offset)
                .mouseup(endDrag);
            adjustBrightness(".overlay");
            adjustSliderColoring(".color-container");
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
        var sliderTop       = offset.top;
        var sliderBottom    = sliderTop + $(element).height();
        var containerTop    = $(".slider-main").offset().top;
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