$(function () {

	key = "1yk3GzGkBaDRoW7niKqMk00xyIPBJ8UccF0zrmvcVk95fHNqJv";

	$("#search-button").click(function () {
		$.getJSON (
            "http://localhost:3000/v2/blog/" + $("#search-term").val() + ".tumblr.com" + "/info", 
			{
				api_key: key
			}
		).done(function (result) {
			console.log(result);
			$('#blog-title').text("Blog Title: " + result.response.blog.title);
			$('#blog-details').html("Blog Name: " + result.response.blog.name + "<br>" + "Blog description: " + result.response.blog.description)
		})
		getPosts();
	});

	// $("#tag-button").click(function () {
	// 	$.getJSON (
	// 		"http://localhost:3000/v2/tagged", 
	// 		{
	// 			tag: $('#tag-term').val(),
	// 			api_key: key
	// 		}
	// 	).done(function (result) {
	// 		console.log (result);
	// 		if ($("#tag-radio-ten")) {

	// 		}
	// 		else if ($("#tag-radio-fifteen")) {

	// 		}
	// 		else if ($("#tag-radio-twenty")) {
	// 			$('#body').append (result.response.)
	// 		}
	// 	})
	// });

	$("#random-button").click(function () {
		random_id = generateRandomID();
		$.getJSON (
			"http://localhost:3000/v2/blog/" + random_id + ".tumblr.com" + "/info",
			{
				api_key: key
			}
		).done(function (result) {
			if (result.response.meta.status == 404) {
				$('#blog-details').html("User " + random_id + "does not exist");
			}
			$('#blog-title').text("Blog Title: " + result.response.blog.title);
			$('#blog-details').html("Blog Name: " + result.response.blog.name + "<br>" + "Blog description: " + result.response.blog.description)
			console.log(result);
		})
	});

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
	});

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

	function generateRandomID() {
    	var text = "";
    	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    	for(var i = 0; i < 7; i++) {
        	text += possible.charAt(Math.floor(Math.random() * possible.length));
    	}
    	return text;
	}

});