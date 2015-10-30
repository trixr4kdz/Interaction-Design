$(function () {

	$("#search-button").click(function () {
		$.getJSON (
			"https://api.tumblr.com/v2/blog/" + $("#search-term").val() + ".tumblr.com" + "/info", 
			{
				api_key: "1yk3GzGkBaDRoW7niKqMk00xyIPBJ8UccF0zrmvcVk95fHNqJv"
			}
		).done(function (result) {
			console.log(result);
		});
	});

});