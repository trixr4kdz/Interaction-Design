$(function () {

	key = "1yk3GzGkBaDRoW7niKqMk00xyIPBJ8UccF0zrmvcVk95fHNqJv"; /* JD: 1, 9 */
	var name = "";
	var title = "";
	var name = "";
	var description = "";
	var likes = "";
	var posts = "";

	$(".search-button").click(function () {
		$(".blogger-avatar-name").text ($("#search-term").val());
		mainSearch();
	});

	$("#search-term").keypress(function(e) { // JD: 10
	    if(e.which == 13) { // JD: 11, 12
	        mainSearch();
	    }
	});

	$("#tag-term").keypress (function(e) {
		if(e.which == 13) { // JD: 11, 12
	        tagSearch();
	    }
	})

	$("#tag-term").click (function () {
		$("#tag-radio-buttons").show();
	})

	$("#tag-button").click(function () { // JD: 13
		tagSearch();
	});

	$("#posts-button").click(function () {
		$("#show-posts ul").empty();
		name = $("#search-term").val();
		$(".blogger-avatar-name").text(name);
		getPosts();
	})

	$("#random-button").click(function () {
		random_id = generateRandomID(); // JD: 14, 15
		$.ajax ({
			url: "http://localhost:3000/v2/blog/" + random_id + ".tumblr.com" + "/info",
			data:{
				api_key: key
			},
			error: (function (jqXHR, textStatus, errorThrown) {
            	console.log(errorThrown);
            	$("#search-term").val(random_id);
            	removeResults();
            })
		}).done(function (result) {
			name = random_id;
			showResults(result);
			showErrorMessages (name);
		}) // JD: 16
	});

	function showErrorMessages (name) { // JD: 17
		$("#search-term").val(name);
		$(".blogger-avatar-name").text(name);
        // JD: 12, 18
		($("#search-term").val() == "") ? ($("#main-field").show()) && removeResults() : ($("#main-field").hide());
	}

	$("#avatar-button").click(function () {
		$.ajax ({
			url: "http://api.tumblr.com/v2/blog/" + $("#search-term").val() + '.tumblr.com' + "/avatar/512",
			dataType: "jsonp",
   			data: {
   				api_key: key
   			},
   			success: function(avatar){ // JD: 10, 19
   				name = $("#search-term").val()
   				$("#avatar-header").show();
				$("#avatar-image").attr({
					src: avatar.response.avatar_url, 
					alt: "avatar"
				});
				showErrorMessages (name);
   			}
		}).done(function (result) {
			console.log(result);
			if (result.meta.msg == "Not Found") { // JD: 12
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
			success: function(posts){ // JD: 10, 19
				$.each(posts.response.posts, function(i, item) { // JD: 10
               		var content = item.body;
               		$("#show-posts").show();
               		if (item.body !== undefined) {
                		$("#show-posts ul").append('<li class="post">' + content + '</li>');
                	}
                	if (item.type === "photo") {
                		var img = makeImageTag (item.photos[0].original_size.url, "post");
                		$("#show-posts ul").append('<li class="post">' + '</li>');
                		$("#show-posts ul").append(img); // JD: 21
                	}
            	})
            }
		}).done(function (result) {
			console.log(result);
		})
	}

	function generateRandomID() { // JD: 17
    	var text = "";
    	var possible = "abcdefghijklmnopqrstuvwxyz";
    	var num_letters = Math.floor(Math.random() * 5) + 1;
    	for(var i = 0; i < num_letters; i++) { // JD: 11
        	text += possible.charAt(Math.floor(Math.random() * possible.length));
    	}
    	return text;
	}

	function removeResults() { // JD: 17
		$("#blog-title").text ("SORRY, THAT BLOG DOES NOT EXIST :(");
    	$("#blog-name").text ("");
    	$("#likes-results").text ("");
    	$("#posts-results").text (""); // JD: 22
    	$("#blog-description").html("");
    	$("#posts").hide();
    	$("#hidden-avatar-description").hide();
    	$("#avatar-image").attr({src: "", alt: ""});
		$("#show-posts").hide();
		$("#avatar-header").hide(); // JD: 23
		$("#show-posts ul").empty();
	}

	function showResults(result) { // JD: 17
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
		if (posts !== undefined) {
			$("#posts-results").text("Total Posts: " + posts);
			$("#posts").show();
		}
	}

	function mainSearch() { // JD: 17
		$.ajax ({
	        url: "http://localhost:3000/v2/blog/" + $("#search-term").val() + ".tumblr.com" + "/info", 
	        error: (function (jqXHR, textStatus, errorThrown) {
	        	removeResults();
                // JD: 12, 18
	        	($("#search-term").val() == "") ? $("#main-field").show() : $("#main-field").hide();
	        }),
			data:
			{ // JD: 23
				api_key: key
			}
		}).done(function (result) { // JD: 24
			showResults(result);
		})
	}

	function tagSearch() { // JD: 17
		$.ajax ({
			url: "http://localhost:3000/v2/tagged", 
			data: {
				tag: $("#tag-term").val(),
				api_key: key,
			},
			error: (function (jqXHR, textStatus, errorThrown) {
            	if ($("#tag-term").val() == "") { // JD: 12, 25
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
				} // JD: 26
				else if ($("#tag-radio-twenty").prop("checked")) {
					n = 20;
				} // JD: 26
				else {
					n = 10;
				}
			}
			$("#tag-list").append(
				"<ul id='newList'></ul>"
			);
			for (i = 0; i < n; i++) { // JD: 27
				name = result.response[i].blog_name;
				var link = "";
				var photo = result.response[i].photos;
                // JD: 18, 28
				(photo !== undefined) ? ((link = result.response[i].photos[0].original_size.url) && (stuff = makeImageTag (link, "image"))) : stuff = $("<p>This user does not have a photo associated with it.</p>")
                // JD: 28
				$("#newList").append("<li><label><input type='radio' name='optradio' id='blog-name-" + i + "' value='" + name +  "' onclick='taggedToSearchField(value)'> " +
					name + " </label></li>");
				$("#newList").append(stuff);
				$("#newList").append("<br> <br>") // JD: 16, 21
			}
			if ($("#tag-term").val() != "") { // JD: 25
            	$("#tag-field").hide();
            }
		})
	}

	function makeImageTag (source, a) { // JD: 17
		var img = $("<img/>").attr({
			src: source,
			alt: a,
			width: "256px",
			height: "256px"
		})
		return img; // JD: 29
	}
});

// JD: 30
function taggedToSearchField(name) { // JD: 17
	$("#search-term").val(name);
	$("#search-term").text(name); // JD: 21
	$(".blogger-avatar-name").text(name);
}