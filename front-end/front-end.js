$(function () {

	key = "1yk3GzGkBaDRoW7niKqMk00xyIPBJ8UccF0zrmvcVk95fHNqJv";
	var name = "";

	$("#search-button").click(function () {
		mainSearch();
	});

	$("#search-term").keypress(function(e) {
	    if(e.which == 13) {
	        mainSearch();
	    }
	});

	$("#tag-term").keypress (function(e) {
		if(e.which == 13) {
	        tagSearch();
	    }
	    $("#tag-radio-buttons").show();
	})

	$("#tag-button").click(function () {
		tagSearch();
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
			url: "http://api.tumblr.com/v2/blog/" + $("#search-term").val() + '.tumblr.com' + "/avatar/512",
			dataType: "jsonp",
   			data: {
   				api_key: key
   			},
   			success: function(avatar){
				$("#avatar-image").attr({
					src: avatar.response.avatar_url, 
					alt: "avatar"
				});
				if ($("#search-term").val() == "") {
            		$("#main-field").show();
            	} 
            	else {
            		$("#main-field").hide();
            	}
   			}
		}).done(function (result) {
			console.log(result);
			if (result.meta.msg == "Not Found") {
				console.log("User does not exist");
			}
		})	
	});
	// });

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
		$.ajax ({
			url: "http://localhost:3000/v2/blog/" + $("#search-term").val() + ".tumblr.com" + "/posts",
			data: {
				api_key: key
			},
			dataType: "jsonp",
			success: function(posts){
				var postings = posts.response.posts;
				var text = "";
				for (var i in postings) {
  					var p = postings[i];
  					// text += '<li><img src=' + p.photos[0].original_size.url +'><a href='+ p.post_url +'>'+ p.source_title +'</a></li>';
				}
				$("ul").append(text);
  				// Fill and UL with the posts
    		}
		}).done(function (result) {
			console.log(result);

			$("body").append(result);
		})
	}

	function generateRandomID() {
    	var text = "";
    	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    	for(var i = 0; i < 7; i++) {
        	text += possible.charAt(Math.floor(Math.random() * possible.length));
    	}
    	return text;
    	//Maybe instead of the blog-name, use the associated IDs
	}

	function mainSearch() {
		$.ajax ({
	        url: "http://localhost:3000/v2/blog/" + $("#search-term").val() + ".tumblr.com" + "/info", 
	        error: (function (jqXHR, textStatus, errorThrown) {
	        	$('#blog-title').text ("SORRY, THAT BLOG DOES NOT EXIST :(");
	        	if ($("#search-term").val() == "") {
            		$("#main-field").show();
            		$("#like-div").hide();
            	}
            	else {
            		$("#main-field").hide();
            	}
	        }),
			data:
			{
				api_key: key
			}
		}).done(function (result) {
			var title = result.response.blog.title;
			var name = result.response.blog.name;
			var description = result.response.blog.description
			var likes = result.response.blog.likes;
			var posts = result.response.blog.posts;
			$("#blog-title").text("Blog Title: " + title);
			$("#blog-name").text("Name: " + name);
			if (description !== "") {
				$("#blog-description").text("Description: " + description);	
			}
			if (likes !== undefined) {
				$("#likes-results").text("Total Likes: " + likes);
			}
			if (posts !== undefined) {
				$("#posts-results").text("Total Posts: " + posts);
				$("#posts").show();
			}

			$("#like-div").show();

			
			if ($("#name").prop("checked")) {
				console.log("hello");

			}
		})
		getPosts();
	}

	function tagSearch() {
		$.ajax ({
			url: "http://localhost:3000/v2/tagged", 
			data: {
				tag: $("#tag-term").val(),
				api_key: key,
			},
			error: (function (jqXHR, textStatus, errorThrown) {
            	if ($("#tag-term").val() == "") {
            		$("#tag-field").show();
            		$("#newList").remove();

            	}
            })
		}).done(function (result) {
			console.log (result);
			var n = result.response.length;
			$("#newList").remove();
			if (n >= 20) {
				if ($("#tag-radio-ten").prop("checked")) {
					n = 10;
				}
				else if ($("#tag-radio-fifteen").prop("checked")) {
					n = 15;
				}
				else if ($("#tag-radio-twenty").prop("checked")) {
					n = 20;
				}
			}
			$("#tag-list").append(
				"<ul id='newList'></ul>"
			);
			for (i = 0; i < n; i++) {
				name = result.response[i].blog_name;
				var stuff;
				if (result.response[i].photos !== undefined) {
					stuff = $("<img/>").attr({
						src: result.response[i].photos[0].original_size.url,
						alt: "image",
						width: "256px"
					})
				}
				else {
					stuff = $("<p>This blog does not have an image associated with it.</p>");
				}
				$("#newList").append("<li><label><input type='radio' name='optradio' id='blog-name-" + i + "' value='" + name +  "' onclick='taggedToSearchField(value)'> " +
					name + " </label></li>");
				$("#newList").append(stuff);	
				$("#newList").append("<br> <br>")
				console.log(stuff);

			}
			if ($("#tag-term").val() != "") {
            	$("#tag-field").hide();
            }
		})
	}
});

function taggedToSearchField(name) {
	$("#search-term").val(name);
	$("#search-term").text(name);
}
