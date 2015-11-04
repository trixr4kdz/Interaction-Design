$(function () {

	key = "1yk3GzGkBaDRoW7niKqMk00xyIPBJ8UccF0zrmvcVk95fHNqJv";
	var title = "";
	var likes = "";
	var posts = "";
	var name = "";
	var description = "";

	$("#search-button").click(function () {
		searchBlog();
		printBlogTitle();
		getLikes();
		getPosts();
		getAvatar();
	});

	// $('#search-button').keypress (function (e) {
	// 	if (e.which == '13' || e.keyCode == '13') {
	// 		e.preventDefault();
	// 		searchBlog();
	// 	}
	// });

	function printBlogTitle () {
		$('#blog-title').text(title);
	}

	function searchBlog() {
		$.getJSON (
            "http://localhost:3000/v2/blog/" + $("#search-term").val() + ".tumblr.com" + "/info", 
			{
				api_key: key
			}
		).done(function (result) {
			console.log(result);
			title = result.response.blog.title;
			// name = result.response.blog.name;
			// likes = result.response.blog.likes;
			// posts = result.response.blog.posts;
			// description = result.response.blog.description;
			
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

	function getAvatar() {
		$.getJSON (
			"http://localhost:3000/v2/blog/" + $("#search-term").val() + ".tumblr.com" + "/avatar"
		).done(function (result) {
			console.log(result);

			$('body').append(result);
		})
	}

});