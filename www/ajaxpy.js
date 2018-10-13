function post_courses(type,query,containerId='main_body'){
    var limit = 10;
    if(type === MAIN){
        $.ajax({
            url: '/cgi-bin/index.cgi/courses',
            async: false,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify({"limit":limit,"offset":offset}),
            success: function(response) {
                display_courses(response);
                
                hitbottom=true;
                offset+=limit;
            }, error: function(result,ts,err) {
                console.log([result,ts,err]);
            }
        });
    	   
    } else if (type === SEARCH){
        $.ajax({
            url: '/cgi-bin/index.cgi/search',
            async: false,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({'term':query, 'offset':offset}),
            success: function(response) {
                console.log(response);
				display_courses(response);
				
                last_query = query;
				curpage = SEARCH;
                offset+=limit;
                hitbottom=true;
            }, error: function(result,ts,err) {
                console.log([result,ts,err]);
            }
        }); 
        
    } else if (type === FILTER){
        var data = JSON.stringify({'term':query, 'offset':offset});
        
        if(containerId!='main_body'){
            data = JSON.stringify({'term':query, 'offset':offset, 'exact':'0'});
        }
        $.ajax({
            url: '/cgi-bin/index.cgi/filter',
            async: false,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8',
            data: data,
            success: function(response) {
				display_courses(response,containerId);
                last_query = query;
				curpage = FILTER;
                offset+=limit;
                hitbottom=true;
            }, error: function(result,ts,err) {
                console.log(result);
                console.log([result,ts,err]);
            }
        });
    } else if (type === COMPLETE){
        var data = JSON.stringify({'term':query, 'user':1});
        
        $.ajax({
            url: '/cgi-bin/index.cgi/completedcourses',
            async: false,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8',
            data: data,
            success: function(response) {
                console.log((response));
                complete = response.splice(-1,1);
                display_courses(response,containerId,complete);
				curpage = COMPLETE;
                hitbottom=false;
            }, error: function(result,ts,err) {
                console.log(result);
                console.log([result,ts,err]);
            }
        });

    } else if (type === ADDCOMP || type === DELCOMP){
        var data = JSON.stringify({'course':query, 'user':1, 'type':'ADD'});
        if(type === DELCOMP){
            data = JSON.stringify({'course':query, 'user':1, 'type':'DEL'});
        }
        $.ajax({
            url: '/cgi-bin/index.cgi/addcompleted',
            async: false,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8',
            data: data,
            success: function(response) {
                console.log((response));
                hitbottom=false;
            }, error: function(result,ts,err) {
                console.log(result);
                console.log([result,ts,err]);
            }
        });

    }


}
document.addEventListener("DOMContentLoaded", main);
function addCompletedListener(c_code,checked){
    $("#add_"+c_code).click(function() {
        var course = $(this).attr('id').split('_')[1];
        console.log(course);
        var buttontext = document.createTextNode("Uncompleted");
        if(checked ===false){
            post_courses(ADDCOMP,course);
            var buttontext = document.createTextNode("Completed");
            checked = true;
        } else{
            post_courses(DELCOMP,course);
            checked = false;
        }

        $(this).empty();
        $(this).append(buttontext);
        $(this).toggleClass('btn-default btn-success ');
    });

}
function submitReviewListener(){
    $(".submitReview" ).click(function(e) {
        e.preventDefault();
        c_code = $(this).attr("course"); 
        $.ajax({
            url: '/cgi-bin/index.cgi/submit',
            async: false,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8',
            data: $('#reviewform_'+c_code).serialize(),
            success: function(response) {
                console.log(response);
                console.log("review success");
                $('#nBox_'+c_code).val('');
                $('#rBox_'+c_code).val('');
                $('#rList_'+c_code).val(1);
				$("#review-success").fadeTo(2000, 500).slideUp(500, function(){
                 	$("#review-success").slideUp(500);
                });

            },
            error: function(result,ts,err) {
                console.log([result,ts,err]);
                console.log("review failure");
                $("#success-failure").fadeTo(2000, 500).slideUp(500, function(){
                 	$("#success-failure").slideUp(500);
                });

            }
        });

    });
}
function searchCourseCodeListener(){
     
    $("#codesearchbutton").click(function(e) {
        var search = $('#searchcode').val();
        console.log(search);
        clear_children("results_container");
        offset=0;
        e.preventDefault();
        post_courses(COMPLETE,search,'results_container');      
    });

}
function showReviewListener()
{
	$('.showReviews').click(function(e) {
		e.preventDefault();
        c_code = $(this).attr("course"); 
		console.log('showing reviews for ' + c_code);
		$.ajax({
			url: '/cgi-bin/index.cgi/get_reviews',
			async: false,
			type: 'POST',
			dataType: 'json',
			contentType: 'application/json; charset=UTF-8',
			data: c_code,
			success: function(response) {
				console.log(response);
				display_reviews(c_code, response);

			}, error: function(result,ts,err) {
				console.log([result,ts,err]);
			}
		});
	});
}

$(document).ready(function(){
	$(window).scroll(function() { //if scrolled to bottom, ajax post and buffer more
		if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight && hitbottom){
            hitbottom=false; //flag to prevent event from firing too many times
            console.log(offset);
            
            if(curpage == MAIN){
                post_courses(MAIN);
            } else if(curpage==SEARCH) {
                post_courses(SEARCH,last_query); 
            } else if (curpage == FILTER){
                post_courses(FILTER,last_query);
            }
		}
	});

    $("[data-toggle=popover]").popover({
        html: true, 
        content: function() {
            return $('#popover-content').html();
        }
    });
    $('#useradd').click(function(e){
        changeTo_addCoursesPage();
    });
    $('#review-success').hide();
    $('#review-failure').hide();
    $("#searchButton" ).click(function(e) {
        var search = $('#searchField').val();
        offset=0;
		clear_children('main_body');
        e.preventDefault();
        post_courses(SEARCH,search);      
    });

    $(".filter").click(function(e) {
        var filter = $(this).attr('id');
        offset=0;
		clear_children('main_body');
        e.preventDefault();
        post_courses(FILTER,filter);
        
    });

	$("#loginButton" ).click(function(e) {
        e.preventDefault();
		var username = document.getElementById("username").value;
		var password = document.getElementById("password").value;
        console.log("username: "+username);
        console.log("password: "+password);
        $.ajax({
            url: '/cgi-bin/index.cgi/login',
            async: false,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({"user":username, "pass":password}),
            success: function(response) {
				console.log("login success");
				console.log(response);
				if(response.success)
				{
					/* TODO: Set a browser cookie here so we can track sessions, maybe just set a hidden element to the
					session token temporarily? */
					var login_button = document.getElementById("login_button");
					var signup_button = document.getElementById("signupButton");
					login_button.setAttribute("style", 'display:none');
					signup_button.setAttribute("style", 'display:none');

					document.getElementById("username_runnup").setAttribute("style", "display:block");
					var username_text = document.getElementById("username_text");
					username_text.innerHTML = username;
					username_text.setAttribute("style", "display:block");

					document.getElementById("username_runnup").setAttribute("style", "display:block");

					document.getElementById("logoutButton").setAttribute("style", "display:block");
					// This cookie will exist until the browser closes */
//					document.cookie = "username="+username.toString()+";session_token="+response.token.toString();
					document.cookie = "username="+username.toString();
					document.cookie = "session="+response.token.toString();
				}
				//login_success();
            }, error: function(result,ts,err) {
				console.log("login failed");
                console.log([result,ts,err]);
            }
        });
    });

	$("#register-submit").click(function(e) {
        e.preventDefault();

        $("#signupModal .form-feedback").removeClass('invalid');

        var password = $("#signupModal input[name=password]").val()
        var passwordConfirm = $("#signupModal input[name=confirm-password]").val() 
        if (password === passwordConfirm) {
            var data = {
                user: $("#signupModal input[name=username]").val(),
                pass: $("#signupModal input[name=password]").val(),
                name: $("#signupModal input[name=nickname]").val()
            }

            $.ajax({
                url: '/cgi-bin/index.cgi/signup',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function(response) {
                    if (response.success) {
                        $("#signupModal").trigger('click');
                    } else {
                        $("#signupModal .form-feedback").html(response.message);
                        $("#signupModal .form-feedback").addClass("invalid");
                    }
                }, error: function(result,st,err) {
                    console.log("login failed");
                    console.log([result,st,err]);
                }
            });
        } else {
            $("#signupModal .form-feedback").html("Passwords do not match!");
            $("#signupModal .form-feedback").addClass("invalid");
        }
    });
});


