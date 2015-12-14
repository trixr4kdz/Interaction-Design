(function ($) {
    $.fn.dimmer = function () {
        $("body")
            .append($("<div/>", {
                id: "slider-container",
            }))
            .append($("<div/>", {
                class: "overlay"
            }));

        $("#slider-container").append($("<div/>", {
            class: "slider"
        }));


        trackSlide(".slider");
    }

    var trackSlide = function (target) {
        var isSliding = false;
        $(target)
            .mouseover(function () {
                $(this)
                    .css("background-color", "gray")
                    .mousedown(function () {
                        isSliding = false;
                        // console.log("DOWN");
                        $(this).css({
                            background: "yellow"
                        })
                    .mousemove(function () {
                        isSliding = true;
                    })
                })
            })
            .mouseup(function () {
                var wasSliding = isSliding;
                isSliding = false;
                if (wasSliding) {
                    $(target).css("background-color", "gray");
                }
            })
            .mouseout(function () {
                // if (!isSliding) {
                    $(target).css("background-color", "white");
                // }
            })
    }

    var startSlide = function (event) {
        var jThis = $(target),
            startOffset = jThis.offset();

        target.moving = jThis;
        target.deltaY = event.pageY - startOffset.top;

        event.stopPropagation();
    }

    var startMove = function (event) {
        $.each(event.changedTouches, function (index, touch) {
            // Highlight the element.
            $(touch.target).addClass("box-highlight");

            // Take note of the box's current (global) location.
            var jThis = $(touch.target),
                startOffset = jThis.offset();

            // Set the drawing area's state to indicate that it is
            // in the middle of a move.
            touch.target.movingBox = jThis;

            touch.target.deltaX = touch.pageX - startOffset.left;
            touch.target.deltaY = touch.pageY - startOffset.top;
        });

        // Eat up the event so that the drawing area does not
        // deal with it.
        event.stopPropagation();
    };

    var trackDrag = function (event) {
        $.each(event.changedTouches, function (index, touch) {
            // Don't bother if we aren't tracking anything.
            var element = touch.target;
            if (element.movingBox) {
                // Reposition the object.
                var newLeft = touch.pageX - element.deltaX;
                var newTop = touch.pageY - element.deltaY;
                var offset = snapBox ({
                        left: newLeft, 
                        top: newTop
                    }, 
                    element
                );
                element.movingBox.offset(offset);
            }
        });

        // Don't do any touch scrolling.
        event.preventDefault();
    };

    var endDrag = function (event) {
        $.each(event.changedTouches, function (index, touch) {
            var element = touch.target;
            if (element.movingBox) {
                element.movingBox = null;
            }
        });
    };




    $("#slider-container").dimmer();

}) (jQuery);