$(function () {

	key = "1yk3GzGkBaDRoW7niKqMk00xyIPBJ8UccF0zrmvcVk95fHNqJv";
	var title = "";
	var likes = "";
	var posts = "";
	var name = "";
	var description = "";

	$("#search-button").click(function () {
		// searchBlog();
		// printBlogTitle();
		getLikes();
		getPosts();
	});

	$('#search-button').keypress (function (e) {
		if (e.which == '13' || e.keyCode == '13') {
			e.preventDefault();
			searchBlog();
		}
	});

	function printBlogTitle () {
	$('#blog-title').text (title);
}

// function printProperties () {
	
// 	if ($('#name').attr('checked')) {
// 		$('#blog-details').text(name);
// 	}
// 	if ($('#likes').attr('checked')) {
// 		$('#blog-details').text(likes);
// 	}
// 	if ($('#posts').attr('checked')) {
// 		$('#blog-details').text(posts);
// 	}
// 	if ($('#description').attr('checked')) {
// 		$('#blog-details').text(description);
// 	}
// }

	function searchBlog() {
		$.getJSON (
            "http://localhost:3000/v2/blog/" + $("#search-term").val() + ".tumblr.com" + "/info", 
			{
				api_key: key
			}
		).done(function (result) {
			console.log(result);
			title = result.response.blog.title;
			name = result.response.blog.name;
			likes = result.response.blog.likes;
			posts = result.response.blog.posts;
			description = result.response.blog.description;
			if (!result.response.blog.ask_anon) {
				console.log ("OK");
			}
			// if (result.meta.status === 404) {
			// 	alert ("User does not exist!");
			// }
		});
	}

	function getLikes() {
		$.getJSON (
			"http://localhost:3000/v2/blog/" + $("#search-term").val() + ".tumblr.com" + "/likes",
			{
				api_key: key
			}
		).done(function (result) {
			console.log(result);
			likes = result;
		})

	}

	function getPosts() {
		$.getJSON (
			"http://localhost:3000/v2/blog/" + $("#search-term").val() + ".tumblr.com" + "/posts",
			{
				api_key: key
			}
		).done(function (result) {
			console.log(result);

			$('body').append(result);
		})
	}

});


