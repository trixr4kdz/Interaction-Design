$(function () {

	key = "1yk3GzGkBaDRoW7niKqMk00xyIPBJ8UccF0zrmvcVk95fHNqJv";

	$("#search-button").click(function () {
		$.ajax ({
            url: "http://localhost:3000/v2/blog/" + $("#search-term").val() + ".tumblr.com" + "/info", 
            error: (function (jqXHR, textStatus, errorThrown) {
            	console.log(jqXHR.status);
            	console.log(errorThrown);
            	$('#blog-title').text ("SORRY, THAT BLOG DOES NOT EXIST :(");
            }),
			data:
			{
				api_key: key
			}
		}).done(function (result) {
			console.log(result);
			$('#blog-title').text("Blog Title: " + result.response.blog.title);
			$('#blog-details').html("Blog Name: " + result.response.blog.name + "<br>" + "Blog description: " + result.response.blog.description)
		})
		getPosts();
	});

	$("#tag-button").click(function () {
		$.ajax ({
			url: "http://localhost:3000/v2/tagged", 
			data: {
				tag: $('#tag-term').val(),
				api_key: key
			},
			error: (function (jqXHR, textStatus, errorThrown) {
            	console.log(jqXHR.status);
            	console.log(errorThrown);
            	if ($("#tag-term").val() == "") {
            		alert ("Search field is empty");
            	} 
            	
            })
		}).done(function (result) {
			console.log (result);
			if ($("#tag-radio-ten").prop("checked")) {
				alert ("TEN");
			}
			else if ($("#tag-radio-fifteen").prop("checked")) {
				alert ("FIFTEEN");
			}
			else if ($("#tag-radio-twenty").prop("checked")) {
				alert ("TWENTY");
			}
		})
	});

	$("#random-button").click(function () {
		random_id = generateRandomID();
		$.ajax ({
			url: "http://localhost:3000/v2/blog/" + random_id + ".tumblr.com" + "/info",
			data:{
				api_key: key
			},
			error: (function (jqXHR, textStatus, errorThrown) {
            	console.log(jqXHR.status);
            	console.log(errorThrown);
            	$('#blog-title').text ("SORRY, THAT BLOG DOES NOT EXIST :(");
            	$('#blog-details').text ("");
            	$("#avatar-image").attr({
					src: "", 
					alt: ""
				})
            })
		}).done(function (result) {
			if (result.response.meta.status == 404) {
				$('#blog-details').html("User " + random_id + "does not exist");
			}
			$('#blog-title').text("Blog Title: " + result.response.blog.title);
			$('#blog-details').html("Blog Name: " + result.response.blog.name + "<br>" + "Blog description: " + result.response.blog.description)
			console.log(result);
		})
	});

	$("#avatar-button").click(function () {
		$.ajax ({
			url: "http://api.tumblr.com/v2/blog/" + $("#search-term").val() + '.tumblr.com' + "/avatar/512?api_key=1yk3GzGkBaDRoW7niKqMk00xyIPBJ8UccF0zrmvcVk95fHNqJv",
			dataType: 'jsonp',
   			success: function(avatar){
  				console.log("HELLO");
  		 		//var img = $("<img/>").attr({
				// 	src: avatar.response.avatar_url,
				// 	alt: "avatar"
				// })	
				$("#avatar-image").attr({
					src: avatar.response.avatar_url, 
					alt: "avatar"
				})
   			}
		}).done(function (result, textStatus, jqXHR) {
			console.log(result);

		 //    var binary = "";
		 //    var responseText = jqXHR.responseText;
		 //    var responseTextLen = responseText.length;

		 //    for ( i = 0; i < responseTextLen; i++ ) {
		 //        binary += String.fromCharCode(responseText.charCodeAt(i) & 255)
		 //    }
		 //    var url = "data:image/gif;base64,"+btoa(binary); // TODO fix hardcode
   //  		console.log(url);
			// var img = $("<img/>").attr({
			// 	src: url,
			// 	alt: "avatar"
			});
			// $('body').append(img);
		})
	// });

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