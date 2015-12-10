(function ($) {
    var lastTimestamp = 0;
    var FRAME_RATE = 10;
    var MS_BETWEEN_FRAMES = 1000 / FRAME_RATE;

    var OUTER_BOX_HEIGHT = $("#drawing-area").height();
    var OUTER_BOX_WIDTH = $("#drawing-area").width();
    var OUTER_BOX_TOP = $("#drawing-area").offset().top;
    var OUTER_BOX_LEFT = $("#drawing-area").offset().left;
    // var OUTER_BOX_RIGHT = 

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

                element.velocity = {x:0, y:0.05};
                element.acceleration = {x:0, y: 0};
            });
    };

    var updateBoxPositions = function (timestamp) {
        var timePassed = timestamp - lastTimestamp;
        if (timePassed > MS_BETWEEN_FRAMES) {
            $("div.box").each (function (index, element) {
                var offset = $(element).offset();
                offset.left += element.velocity.x * timePassed; //Velocity per unit of time. Should be multiplied by the amount of time
                offset.top += element.velocity.y * timePassed;  //NVM already did
                
                element.velocity.x += element.acceleration.x * timePassed;
                element.velocity.y += element.acceleration.y * timePassed;
                $(element).offset (offset);
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

                // touch.target.velocityX = touch.pageX - touch.target.lastX;
                // touch.target.velocityY = touch.pageY - touch.target.lastY;
                
                // touch.target.lastX = touch.pageX;
                // touch.target.lastY = touch.pageY;
                
                // console.log("velocityX " + touch.target.velocityX);
                // console.log("velocityY " + touch.target.velocityY);
                // console.log(touch.pageX - touch.target.deltaX);
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

    $.fn.boxesTouch = function () {
        setDrawingArea(this);
        window.requestAnimationFrame (updateBoxPositions);
        window.addEventListener ('devicemotion', function (event) {
            $("div.box").each(function (index, element) {
                element.acceleration.x = event.accelerationIncludingGravity.x / 10000;
                element.acceleration.y = -event.accelerationIncludingGravity.y / 10000;
            })
        });
    };

    // $(window).on("orientationchange", function (event) { 
    //     $("$console").text("This device is in " + event.orientation + " mode!");
    // });

    // $(window).orientationchange();

}(jQuery));
