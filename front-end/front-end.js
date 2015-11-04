$(function () {

	key = "1yk3GzGkBaDRoW7niKqMk00xyIPBJ8UccF0zrmvcVk95fHNqJv";
	var title = "";
	var likes = "";
	var posts = "";
	var name = "";
	var description = "";

	$("#search-button").click(function () {
		$.getJSON (
            "http://localhost:3000/v2/blog/" + $("#search-term").val() + ".tumblr.com" + "/info", 
			{
				api_key: key
			}
		).done(function (result) {
			console.log(result);
			$('#blog-title').text("Blog Title: " + result.response.blog.title)
			$('#blog-details').text("Blog Name: " + result.response.blog.name + "\n"
				+ "Blog description: " + result.response.blog.description
			)
			if (result.response.blog.ask_anon) {

			}
		})
		getPosts();
		// getAvatar();
	});

	$("#tag-button").click(function () {
		$.getJSON (
			"http://localhost:3000/v2/tagged", 
			{
				tag: $('#tag-term').val(),
				api_key: key
			}

			).done(function (result) {
				console.log (result);
				if ($("#tag-radio-ten")) {

				}
				else if ($("#tag-radio-ten")) {

				}
				else if ()
				// $('#body').append (result.response.)
			})
	})

	$("#avatar-button").click(function () {
		$.getJSON (
			"http://localhost:3000/v2/blog/" + $("#search-term").val() + ".tumblr.com" + "/avatar/512"
		).done(function (result) {
			console.log(result);
			var img = $("<img/>").attr({
				src: result,
				alt: "avatar"
			});

			$('body').append(img);
		})
	})

	// function getLikes() {
	// 	$.getJSON (
	// 		"http://localhost:3000/v2/blog/" + $("#search-term").val() + ".tumblr.com" + "/likes",
	// 		{
	// 			api_key: key
	// 		}
	// 	).done(function (result) {
	// 		console.log(result);
	// 		likes = result;
	// 	})

	// }

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