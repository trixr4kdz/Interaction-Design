$(function () {

	key = "1yk3GzGkBaDRoW7niKqMk00xyIPBJ8UccF0zrmvcVk95fHNqJv";
	title = "";

	$("#search-button").click(function () {
		searchBlog();
		printBlogTitle();
	});

	$('#search-button').keypress (function (e) {
		if (e.which == '13' || e.keyCode == '13') {
			e.preventDefault();
			searchBlog();
		}
	});

	$('#search-button').on ('keypress', function (event) {
		if (e.keyCode == 13) {
			searchBlog();
		}
		
	})
});

function printBlogTitle (result) {
	$('#text-output').text (title);
}

function searchBlog () {
	$.getJSON (
            "http://localhost:3000/v2/blog/" + $("#search-term").val() + ".tumblr.com" + "/info", 
			{
				api_key: key
			}
		).done(function (result) {
			console.log(result);
			console.log(result.response.blog.title);
			title = result.response.blog.title;
			if (!result.response.blog.ask_anon) {
				console.log ("OK");
			}
			// if (result.meta.status === 404) {
			// 	alert ("User does not exist!");
			// }
		});
}
