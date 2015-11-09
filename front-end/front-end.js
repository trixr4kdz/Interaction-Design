$(function () {

	key = "1yk3GzGkBaDRoW7niKqMk00xyIPBJ8UccF0zrmvcVk95fHNqJv";
	var name = "";
	var title = "";
	var name = "";
	var description = "";
	var likes = "";
	var posts = "";

	$(".search-button").click(function () {
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

	$("#posts-button").click(function () {
		getPosts();
	})

	$("#random-button").click(function () {
		random_id = generateRandomID();
		$.ajax ({
			url: "http://localhost:3000/v2/blog/" + random_id + ".tumblr.com" + "/info",
			data:{
				api_key: key
			},
			error: (function (jqXHR, textStatus, errorThrown) {
            	console.log(errorThrown);
            	removeResults();
            })
		}).done(function (result) {
			name = random_id
			showResults(result);
			$("#search-term").val(name)
			$(".blogger-avatar-name").text(name);
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

	function getPosts() {
		$.ajax ({
			url: "http://localhost:3000/v2/blog/" + $("#search-term").val() + ".tumblr.com" + "/posts",
			data: {
				api_key: key
			},
			dataType: "jsonp",
			success: function(posts){
				$.each(posts.response.posts, function(i, item) {
               		var content = item.body;
                	$("#Posts ul").append('<li>' + content + '</li>')
            	})
            	console.log(posts)
            }
		}).done(function (result) {
			console.log(result);
		})
	}

	function generateRandomID() {
    	var text = "";
    	var possible = "abcdefghijklmnopqrstuvwxyz";

    	var num_letters = Math.floor(Math.random() * 5) + 1;
    	for(var i = 0; i < num_letters; i++) {
        	text += possible.charAt(Math.floor(Math.random() * possible.length));
    	}
    	return text;
	}

	function removeResults() {
		$("#blog-title").text ("SORRY, THAT BLOG DOES NOT EXIST :(");
    	$("#blog-name").text ("");
    	$("#likes-results").text ("");
    	$("#posts-results").text ("");
    	$("#blog-description").html("");
    	$("#posts").hide();
    	$("#hidden-avatar-description").hide();
    	$("#avatar-image").attr({
			src: "", 
			alt: ""
		});
	}

	function showResults(result) {
		removeResults();
		title = result.response.blog.title;
		name = result.response.blog.name;
		description = result.response.blog.description
		likes = result.response.blog.likes;
		posts = result.response.blog.posts;
		$("#blog-title").text("Blog Title: " + title);
		$("#blog-name").text("Name: " + name);
		if (description !== "") {
			$("#blog-description").html("Description: " + description);	
		}
		if (likes !== undefined) {
			$("#likes-results").text("Total Likes: " + likes);
		}
		if (posts !== undefined || posts !== 0) {
			$("#posts-results").text("Total Posts: " + posts);
			$("#posts").show();
		}
	}

	function mainSearch() {
		$.ajax ({
	        url: "http://localhost:3000/v2/blog/" + $("#search-term").val() + ".tumblr.com" + "/info", 
	        error: (function (jqXHR, textStatus, errorThrown) {
	        	removeResults();
	        	if ($("#search-term").val() == "") {
            		$("#main-field").show();
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
			showResults(result);
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
			$("#radio-prompt").show();
			var n = result.response.length;
			$("#newList").remove();
			if (n >= 20) {
				if ($("#tag-radio-fifteen").prop("checked")) {
					n = 15;
				}
				else if ($("#tag-radio-twenty").prop("checked")) {
					n = 20;
				}
				else {
					n = 10;
				}
			}
			$("#tag-list").append(
				"<ul id='newList'></ul>"
			);
			for (i = 0; i < n; i++) {
				name = result.response[i].blog_name;
				var link = "";
				var anchor = "";
				var photo = result.response[i].photos;
				if (photo !== undefined) {
					link = result.response[i].photos[0].original_size.url;
					anchor = $("<a/>").attr({
						id: "image-link-" + i,
						href: link
					})
					stuff = $("<img/>").attr({
						src: link,
						alt: "image",
						width: "256px"
					})
					$("#newList").append(anchor);
					// $("a").append(stuff);
					console.log(anchor.attr("id"));
				}
				else {
					stuff = $("<p>This blog does not have an image associated with it.</p>");
				}
				link = "";
				anchor = "";

				$("#newList").append("<li><label><input type='radio' name='optradio' id='blog-name-" + i + "' value='" + name +  "' onclick='taggedToSearchField(value)'> " +
					name + " </label></li>");

				$("#newList").append(stuff);
				$("#newList").append("<br> <br>")
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
	$(".blogger-avatar-name").text(name);
}