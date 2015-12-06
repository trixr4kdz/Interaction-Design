$(function () {

    var api_key = "1yk3GzGkBaDRoW7niKqMk00xyIPBJ8UccF0zrmvcVk95fHNqJv";
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

    $("#search-term").keypress(function (e) { 
        if (e.which === 13) { 
            mainSearch();
        }
    });

    $("#tag-term").keypress (function (e) { 
        if (e.which === 13) { 
            tagSearch();
        }
    })

    $("#tag-term").click (function () { 
        $("#tag-radio-buttons").show();
    })

    $("#tag-button").click(tagSearch);

    $("#posts-button").click(function () { 
        $("#show-posts ul").empty();
        name = $("#search-term").val();
        $(".blogger-avatar-name").text(name);
        getPosts();
    })

    $("#random-button").click(function () { 
        var random_id = generateRandomID(); // JD: 15
        $.ajax ({ 
            url: "http://localhost:3000/v2/blog/" + random_id + ".tumblr.com" + "/info",
            data:{ 
                api_key: api_key
            },
            error: (function (jqXHR, textStatus, errorThrown) { 
                console.log (errorThrown);
                $("#search-term").val(random_id);
                removeResults();
            })
        }).done(function (result) { 
            name = random_id;
            showResults(result);
            showErrorMessages (name);
        });
    });

    var showErrorMessages = function (name) { 
        $("#search-term").val(name);
        $(".blogger-avatar-name").text (name);
        if ($("#search-term").val() === "") { 
            $("#main-field").show();
            removeResults();
        } else { 
            $("#main-field").hide();
        }
    }

    $("#avatar-button").click(function () { 
        $.ajax ({ 
            url: "http://api.tumblr.com/v2/blog/" + $("#search-term").val() + '.tumblr.com' + "/avatar/512",
            dataType: "jsonp",
            data: { 
                api_key: api_key
            },
            success: function (avatar) {  // JD: 10
                name = $("#search-term").val()
                $("#avatar-header").show();
                $("#avatar-image").attr({ 
                    src: avatar.response.avatar_url, 
                    alt: "avatar"
                });
                showErrorMessages (name);
            }
        }).done(function (result) { 
            console.log (result);
            if (result.meta.msg === "Not Found") { // JD: 12
                console.log ("User does not exist");
            }
        })
    });

    var getPosts = function () { 
        $.ajax ({ 
            url: "http://localhost:3000/v2/blog/" + $("#search-term").val() + ".tumblr.com" + "/posts",
            data: {
                api_key: api_key
            },
            dataType: "jsonp",
            success: function (posts) {  // JD: 10
                $.each(posts.response.posts, function (i, item) {  // JD: 10
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
            console.log (result);
        })
    }

    var generateRandomID = function () { 
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz";
        var num_letters = Math.floor(Math.random() * 5) + 1;
        for (var i = 0; i < num_letters; i++) {  // JD: 11
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    var removeResults = function () { 
        $("#blog-title").text("SORRY, THAT BLOG DOES NOT EXIST :(");
        $("#blog-name", "#likes-results", "#posts-results").text("");
        $("#blog-description").html("");
        $("#posts", "#hidden-avatar-description", "#show-posts", "#avatar-header").hide();
        $("#avatar-image").attr({src: "", alt: ""});
        $("#show-posts ul").empty();
    }

    var showResults = function (result) { 
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
            $("#likes-results").text ("Total Likes: " + likes);
        }
        if (posts !== undefined) { 
            $("#posts-results").text ("Total Posts: " + posts);
            $("#posts").show ();
        }
    }

    var mainSearch = function () { 
        $.ajax ({ 
            url: "http://localhost:3000/v2/blog/" + $("#search-term").val() + ".tumblr.com" + "/info", 
            error: (function (jqXHR, textStatus, errorThrown) { 
                removeResults();
                if ($("#search-term").val() === "") { 
                    $("#main-field").show();
                } else { 
                    $("#main-field").hide();
                }
            }),
            data: {  // JD: 23
                api_key: api_key
            }
        }).done (function (result) {  // JD: 24
            showResults(result);
        })
    }

    var tagSearch = function () { 
        $.ajax ({ 
            url: "http://localhost:3000/v2/tagged", 
            data: { 
                tag: $("#tag-term").val(),
                api_key: api_key,
            },
            error: (function (jqXHR, textStatus, errorThrown) { 
                if ($("#tag-term").val() === "") {  // JD: 12, 25
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
            for (i = 0; i < n; i++) {  // JD: 27
                name = result.response[i].blog_name;
                var link = "";
                var photo = result.response[i].photos;
                // JD: 28
                if (photo !== undefined) { 
                    link = result.response[i].photos[0].original_size.url;
                    stuff = makeImageTag (link, "image");
                } else { 
                    stuff = $("<p>This user does not have a photo associated with it.</p>");
                }
                // JD: 28
                $("#newList")
                    .append("<li><label><input type='radio' name='tag-results' id='blog-name-" + i + "' value='" + name +  "' onclick='taggedToSearchField(value)'> " +
                    name + " </label></li>")
                    .append(stuff)
                    .append("<br> <br>"); 
            }
            if ($("#tag-term").val() != "") {  // JD: 25
                $("#tag-field").hide();
            }
        })
    }

    var makeImageTag = function (source, a) { 
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
var taggedToSearchField = function (name) { 
    $("#search-term")
        .val(name)
        .text(name); 
    $(".blogger-avatar-name").text(name);
}