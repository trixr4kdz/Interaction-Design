(function ($) {
    var lastTimestamp = 0;
    var FRAME_RATE = 100;
    var MS_BETWEEN_FRAMES = 1000 / FRAME_RATE;

    var OUTER_BOX_HEIGHT = $("#drawing-area").height();
    var OUTER_BOX_WIDTH = $("#drawing-area").width();
    var OUTER_BOX_TOP = $("#drawing-area").offset().top;
    var OUTER_BOX_LEFT = $("#drawing-area").offset().left;
    var OUTER_BOX_RIGHT = OUTER_BOX_WIDTH + OUTER_BOX_LEFT;
    var OUTER_BOX_BOTTOM = OUTER_BOX_HEIGHT + OUTER_BOX_TOP;
    var FLICK_CONSTANT = 30;

    /**
     * Sets up the given jQuery collection as the drawing area(s).
     */
    var setDrawingArea = function (jQueryElements) {
        // Set up any pre-existing box elements for touch behavior.
        jQueryElements
            .addClass("drawing-area")
            
            // Event handler setup must be low-level because jQuery
            // doesn't relay touch-specific event properties.
            .each(function (index, element) {
                element.addEventListener("touchmove", trackDrag, false);
                element.addEventListener("touchend", endDrag, false);
            })

            .find("div.box").each(function (index, element) {
                element.addEventListener("touchstart", startMove, false);
                element.addEventListener("touchend", unhighlight, false);

                element.velocity = {x: 0, y: 0};
                element.acceleration = {x: 0, y: 0};
            });
    };

    var updateBoxPositions = function (timestamp) {
        var timePassed = timestamp - lastTimestamp;
        if (timePassed > MS_BETWEEN_FRAMES) {
            $("div.box").each (function (index, element) {
                var offset = $(element).offset();
                offset.left += element.velocity.x * timePassed;
                offset.top += element.velocity.y * timePassed;
                
                var boxLeft = offset.left;
                var boxRight = offset.left + $(element).width();
                var boxBottom = offset.top + $(element).height();

                if (!element.movingBox) {
                    element.velocity.x += element.acceleration.x * timePassed;
                    element.velocity.y += element.acceleration.y * timePassed;
                    
                    if (boxBottom > OUTER_BOX_BOTTOM || offset.top < OUTER_BOX_TOP) {
                        element.velocity.y *= -0.5;
                        
                        if (Math.abs(element.velocity.y) < 0.1) {
                            element.velocity.y = 0;
                        }
                    }

                    if (boxRight > OUTER_BOX_RIGHT || offset.left < OUTER_BOX_LEFT) {
                        element.velocity.x *= -0.5;

                        if (Math.abs(element.velocity.x) < 0.1) {
                            element.velocity.x = 0;
                        }
                    }
                    offset = snapBox (offset, element);
                    $(element).offset (offset);
                }
            });
            lastTimestamp = timestamp;
        }
        window.requestAnimationFrame (updateBoxPositions);
    }

    var snapBox = function (offset, element) {
        var boxRight = offset.left + $(element).width();
        var boxBottom = offset.top + $(element).height();
        offset.top = offset.top < OUTER_BOX_TOP 
                       ? OUTER_BOX_TOP 
                       : offset.top;
        offset.top = boxBottom > OUTER_BOX_BOTTOM 
                       ? OUTER_BOX_BOTTOM - $(element).height()
                       : offset.top;

        offset.left = offset.left < OUTER_BOX_LEFT 
                        ? OUTER_BOX_LEFT 
                        : offset.left;
        offset.left = boxRight > OUTER_BOX_RIGHT 
                        ? OUTER_BOX_RIGHT - $(element).width() 
                        : offset.left
        return offset;
    }

    /**
     * Begins a box move sequence.
     */
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

    /**
     * Tracks a box as it is rubberbanded or moved across the drawing area.
     */
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
                element.movingBox.lastLastX = element.movingBox.lastX;
                element.movingBox.lastLastY = element.movingBox.lastY;
                element.movingBox.lastX = touch.pageX;
                element.movingBox.lastY = touch.pageY;
            }
        });

        // Don't do any touch scrolling.
        event.preventDefault();
    };

    /**
     * Concludes a drawing or moving sequence.
     */
    var endDrag = function (event) {
        $.each(event.changedTouches, function (index, touch) {
            var element = touch.target;
            if (element.movingBox) {
                // Change state to "not-moving-anything" by clearing out
                // element.movingBox.
                
                if (element.movingBox.lastLastX === undefined){
                    element.movingBox.lastLastX = touch.pageX;
                    element.movingBox.lastLastY = touch.pageY;
                }
                element.velocity.x = (touch.pageX - element.movingBox.lastLastX) / FLICK_CONSTANT;
                element.velocity.y = (touch.pageY - element.movingBox.lastLastY) / FLICK_CONSTANT;
                element.movingBox = null;
            }
        });
    };

    /**
     * Indicates that an element is unhighlighted.
     */
    var unhighlight = function () {
        $(this).removeClass("box-highlight");
    };

    var changeBoxDimensionOnOrientationChange = function () {
        window.addEventListener ("orientationchange", function (event) { 
            if (window.orientation === 90) {
                console.log("90");
            }
            // window.orientation.set("portrait");
            // $("#drawing-area")
            //     .width($(window).width() * 0.95)
            //     .height($(window).height() * 0.95);
            //     console.log($("#drawing-area").top);
        });
    };

    var createRandomBoxes = function () {
        var width = Math.floor(Math.random() * 256);
        var height = Math.floor(Math.random() * 256);
        box.css("width", width + "px");
        box.css("height", height + "px");
        box.css("left", Math.floor(Math.random() * OUTER_BOX_WIDTH + "px"));
        box.css("right", Math.floor(Math.random() * OUTER_BOX_HEIGHT + "px"));
    };

    $.fn.boxesTouch = function () {
        setDrawingArea(this);
        window.requestAnimationFrame (updateBoxPositions);
        window.addEventListener ("devicemotion", function (event) {
            $("div.box").each(function (index, element) {
                element.acceleration.x = event.accelerationIncludingGravity.x / 10000;
                element.acceleration.y = -event.accelerationIncludingGravity.y / 10000;
            })
        });
        changeBoxDimensionOnOrientationChange();
    };

} (jQuery));
