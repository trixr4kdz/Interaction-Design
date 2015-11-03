$(function () {

	$("#search-button").click(function () {
		$.getJSON (
                           "http://localhost:3000/v2/blog/" + $("#search-term").val() + "/info", 
			{
				// base-hostname: $("#search-term").val(),
				api_key: "1yk3GzGkBaDRoW7niKqMk00xyIPBJ8UccF0zrmvcVk95fHNqJv"
			}
		).done(function (result) {
			console.log(result);
		});
	});

});
