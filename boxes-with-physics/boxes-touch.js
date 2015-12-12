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
                    $(element).offset (offset);

                    if (boxBottom > OUTER_BOX_BOTTOM || offset.top < OUTER_BOX_TOP) {
                        element.velocity.y *= -0.5;
                        offset.top = OUTER_BOX_TOP;

                        if (Math.abs(element.velocity.y) < 0.1) {
                            element.velocity.y = 0;
                        }
                    }

                    if (boxRight > OUTER_BOX_RIGHT || offset.left < OUTER_BOX_LEFT) {
                        offset.left = OUTER_BOX_LEFT;
                        element.velocity.x *= -0.5;
                        

                        if (Math.abs(element.velocity.x) < 0.1) {
                            element.velocity.x = 0;
                        }
                        //console.log("left/right " + offset.left);
                    }
                }

                // if (offset.left < OUTER_BOX_LEFT) {
                //     offset.left = OUTER_BOX_LEFT;
                //     console.log("left");
                // }

                // if (offset.top < OUTER_BOX_TOP) {
                //     offset.top = OUTER_BOX_TOP;
                //     console.log("top");
                // }

                // if (boxRight > OUTER_BOX_RIGHT) {
                //     $(touch.target).offset().left = OUTER_BOX_RIGHT;
                //     console.log("right");
                // }

                // if (boxBottom > OUTER_BOX_LEFT) {
                //     $(touch.target).offset().left = OUTER_BOX_RIGHT;
                //     console.log("bottom");
                // }


                
            });
            lastTimestamp = timestamp;
        }
        window.requestAnimationFrame (updateBoxPositions);
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
            if (touch.target.movingBox) {
                // Reposition the object.
                touch.target.movingBox.offset({
                    left: touch.pageX - touch.target.deltaX,
                    top: touch.pageY - touch.target.deltaY
                });

                if ($(touch.target).offset().left < OUTER_BOX_LEFT) {
                    touch.target.movingBox.offset.left = OUTER_BOX_LEFT;
                    console.log("WAT");
                }


                // if target.offset() is not in outer box, 
                // then stop the box from being dragged
                // that is, keep the target.offset() be the same as the OUTER_BOX_side
                // console.log("MOVING " + $(touch.target).offset().left);

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
            if (touch.target.movingBox) {
                // Change state to "not-moving-anything" by clearing out
                // touch.target.movingBox.
                touch.target.movingBox = null;
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
