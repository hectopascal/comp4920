function appendRating(rating)
{
	var crating = document.createElement('span');
	for(i = 0; i < 5; i++)
	{

		var irating = document.createElement('i');
		crating.appendChild(irating);
		if(rating >= 1)
			irating.setAttribute('class', 'fas fa-star star-rating');
		else
			irating.setAttribute('class', 'far fa-star star-rating-empty');
			
		rating--;
	}
	crating.setAttribute('class', 'ml-2');

	return crating;
}

function appendPost(user_title, rating, post)
{
	var cpost = document.createElement('div');
	cpost.setAttribute('class', 'py-2 bg-light');
    var cpost_title = document.createElement('div');
	cpost_title.setAttribute('class', 'post-header d-flex bg-dark text-white p-1 rounded');
	cpost_title.appendChild(document.createTextNode(user_title + ' posted:'));
	cpost.appendChild(cpost_title);

	var ccontent = document.createElement('div');
	ccontent.setAttribute('class', 'pl-2 p-1');
	ccontent.appendChild(document.createTextNode(post));
	cpost.appendChild(ccontent);

	return cpost;
}

function appendCourse(c_code, c_title, c_faculty, c_school, c_study_level,
	c_terms, c_campus, c_hours, c_info, rating)
{
	var celem  = document.createElement('div');
	var cflex  = document.createElement('div');
	cflex.setAttribute('class', 'd-flex align-content-start flex-wrap mb-2');
	{
		var cbadge = document.createElement('span');
		cbadge.setAttribute('class', 'my-2 mx-1 badge badge-dark');
		cbadge.appendChild(document.createTextNode('COURSE'));
		var slevel_badge = document.createElement('span');

		if(c_study_level == 'UGRD')
			slevel_badge.setAttribute('class', 'my-2 ml-1 mr-2 badge badge-success');
		else
			slevel_badge.setAttribute('class', 'my-2 ml-1 mr-2 badge badge-warning');

		slevel_badge.appendChild(document.createTextNode(c_study_level));
		cflex.appendChild(cbadge);
		cflex.appendChild(slevel_badge);
	}
	var cnode  = document.createElement('h4');
	var cnode1 = document.createElement('p');
	var title  = document.createTextNode(c_code + ': ' + c_title);
	var info   = document.createTextNode(c_info);
	cnode.appendChild(title);


	cflex.appendChild(cnode);

	celem.appendChild(cflex);
	cnode1.appendChild(info);
	celem.appendChild(cnode1);

	cflex.appendChild(appendRating(rating));

	var ccomments = document.createElement('div');
	var load_prompt = document.createElement('button');
	var load_prompt_i = document.createElement('i');
	load_prompt.setAttribute('type', 'submit');
	load_prompt.setAttribute('class', 'btn btn-default showReviews');
	load_prompt.setAttribute('data-toggle', 'collapse');
	load_prompt.setAttribute('href', '#' + c_code + '_forum');
	load_prompt.setAttribute('role', 'button');
	load_prompt.setAttribute('aria-expanded', 'false');
	load_prompt.setAttribute('aria-controls', c_code + '_forum');
	load_prompt.setAttribute('course', c_code);
	load_prompt.setAttribute('toggled', 'n');

	load_prompt_i.setAttribute('class', 'fas fa-chevron-down');

	load_prompt.appendChild(load_prompt_i);

	var collapsing_forum = document.createElement('div');
	var ttt  = document.createTextNode('I did not enjoy this course.');
	collapsing_forum.setAttribute('class', 'collapse');
	collapsing_forum.setAttribute('id', c_code + '_forum');
	/*
	collapsing_forum.appendChild(appendPost('stupid', 4, 'hmmm... course not very good'));
	collapsing_forum.appendChild(appendPost('idiot', 4, 'it\'s alright'));
	collapsing_forum.appendChild(appendPost('user', 4, 'amazing course but quite difficult'));
	collapsing_forum.appendChild(appendPost('user1', 4, 'horrible lecturer'));
	collapsing_forum.appendChild(appendPost('user2', 4, 'hello'));
	*/

	load_prompt.addEventListener('click', function()
		{
			this.classList.toggle('active');

			if(this.getAttribute('toggled') === 'y')
			{

				this.setAttribute('toggled', 'n');
				this.children[0].setAttribute('class', 'fas fa-chevron-down');
			}
			else
			{
				this.setAttribute('toggled', 'y');
				this.children[0].setAttribute('class', 'fas fa-chevron-up');
			}
		});

	ccomments.appendChild(load_prompt);
	ccomments.setAttribute('class', 'd-flex justify-content-center mt-2 mb-2');


	celem.appendChild(ccomments);
	celem.appendChild(collapsing_forum);

	celem.setAttribute("class", 'p-3 bg-white course_summary');
	celem.setAttribute("style", 'margin-top:20px;margin-bottom:20px; box-shadow:0 0 4px 0 rgba(0,0,0,0.2); border-radius:10px;');
    celem.setAttribute("id",c_code);
	document.getElementById('main_body').appendChild(celem);
}

function display_search(results){
    
    var main = document.getElementById('main_body');
    while(main.firstChild){
        main.removeChild(main.firstChild);
    }

    if(results !== ""){
        //console.log(results);
        //var courses = JSON.parse(results);
        for (var i = 0 ; i < results.length; i++){
            appendCourse(results[i][1], results[i][2], "Faculty of Engineering", "School of Computer Science", "UGRD", 1 , 'Kensington', 6, results[i][3], 3);
        }
        addReviewSection();
        submitReviewListener();
    } else {
        //do nothing
    }
}

function display_reviews(c_code, results)
{
	var c_forum = document.getElementById(c_code + '_forum');
	c_forum.innerHTML = "";
	for(var i = 0; i < results.length; i++)
	{
		c_forum.appendChild(appendPost(results[i][3], results[i][1], results[i][2]));
	}
}

//function navbar()
//{
function rate_reviews(){
    var header = document.getElementsByClassName('post-header');
    console.log(header.length);
    for(var i=0;i<header.length;i++){
    	var up = document.createElement('i');
        up.setAttribute("class","fas fa-arrow-up");
	    var down = document.createElement('i');
        down.setAttribute("class","fas fa-arrow-down");
        header[i].appendChild(up);
        header[i].appendChild(down);
        
    }
}

function navbar(){
	var navbar = document.createElement('nav');
	navbar.class = "navbar navbar-expand-lg navbar-light bg-light";
	
	var title = document.createElement('anchor');
	title.value = 'Comp Electives';

    navbar.appendChild(title);
  /*<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Link</a>
      </li>
*/	
	var dropdown 	= document.createElement('li');
	dropdown.class 	= "nav-item dropdown";
	navbar.appendChild(dropdown);
	var filters 	= document.createElement('a');
	filters.value 	= "Filter";
	filters.class	= "nav-link dropdown-toggle" 
	filters.href	= "#";
	filters.id		= "navbarDropdown";
	filters.role	= "button";
	filters.setAttribute("data-toggle","dropdown");
	filters.setAttribute("aria-haspopup","true");
	filters.setAttribute("aria-expanded","false");

    var dropdownmenu = document.createElement('div');
    dropdownmenu.class="dropdown-menu" 
    dropdownmenu.setAttribute("aria-labelledby","navbarDropdown");
    filters.appendChild(dropdownmenu);
    dropdown.append(filters);

    var item    = document.createElement('a');
    item.id     = "filter_comp";
    item.class  ="dropdown-item";
    item.value  = "COMP";
    var seng    = document.createElement('a');
    seng.id     = "filter_seng";
    seng.class  ="dropdown-item";
    seng.value  = "SENG";
    var binf    = document.createElement('a');
    binf.id     = "filter_binf";
    binf.class  ="dropdown-item";
    binf.value  = "BINF";
    dropdownmenu.appendChild(item);
    dropdownmenu.appendChild(seng);
    dropdownmenu.appendChild(binf);
    
    var search = document.createElement('form');
    search.class="form-inline my-2 my-lg-0";
    navbar.appendChild(search);
    var searchField     = document.createElement('input');
    searchField.class   ="form-control mr-sm-2"; 
    searchField.type    ="text"; 
    searchField.id      = "searchField";
    searchField.placeholder ="Search"; 
    searchField.setAttribute("aria-label","Search");

    var searchButton    = document.createElement("button");
    searchButton.id     = "searchButton";
    searchButton.class  ="btn btn-outline-success my-2 my-sm-0";
    
    search.appendChild(searchField);
    search.appendChild(searchButton);
    document.getElementById('main_body').append(navbar);
}

function reviewForm(k,c_code)
{
    var div = document.createElement('div');
    div.setAttribute('class', "form-group toggle collapse accordion-group");
    div.setAttribute('data-parent','#main_body');
    div.id    = "reviewDiv"+k.toString();
   

    var f = document.createElement("form");
    f.setAttribute('class','courseform');
    f.setAttribute('method',"post");
    f.setAttribute("accept-charset","utf-8");
    //f.setAttribute('action',"/cgi-bin/index.cgi/submit");

    f.id = "reviewform_"+c_code;
    //----COURSE IDENTIFIER----//
    var c = document.createElement("input");
    c.type = "hidden";
    c.name = "course";
    c.value = c_code;
    c.class = "form-control"
    //----USER DISPLAY NAME----//
    var i = document.createElement("input");
    i.type = "text";
    i.class = "control-label-col-sm-2 form-control";
    i.name = "dispname";
    i.id = "nBox_"+c_code;
    i.placeholder = "Display Name";

    //----REVIEW TEXT SPACE ----//
    var review = document.createElement("textarea");
    review.cols = "50";
    review.rows = "4";
    review.class = "form-control";
    review.type = "textarea";
    review.name = "review";
    review.id = "rBox_"+c_code;
    review.placeholder = "Write your review here...";

    //create a rating dropdown //
    // TODO (to beautify to stars later)
    var r = document.createElement("SELECT");
    r.id = "rList_"+c_code;
    r.name = "rating";
    for (var k = 1; k<=5; k++){
        var z = document.createElement("option");
        var val = k.toString();
        z.setAttribute("value", val);
        t = document.createTextNode(val);
        z.appendChild(t);
        r.appendChild(z);
    }

    //create a submit button
    var s = document.createElement("input");
    s.type = "submit";
    s.value = "Submit";
    s.setAttribute('class','submitReview');
    
    s.id = "submit_"+c_code;
    s.setAttribute("course",c_code);
    // add all elements to the form
    f.appendChild(c);
    var p = document.createElement('p');
    f.appendChild(p);

    f.appendChild(i);
    p = document.createElement('p');
    f.appendChild(p);
    
    f.appendChild(document.createTextNode("Rate the course:  "))
    f.appendChild(r);
	p = document.createElement('p');
    f.appendChild(p);
    
    f.appendChild(review);
    p = document.createElement('p');
    f.appendChild(p); 

    f.appendChild(s);
    
    div.appendChild(f);
    return div;

}
function addReviewSection(){

    // Review form
    var course_list = document.getElementsByClassName("course_summary");
    
    for(var k = 0; k<course_list.length;k++){
        var tog_rev = document.createElement('button');
        tog_rev.type = 'submit';
        tog_rev.setAttribute('data-toggle','collapse');
        tog_rev.setAttribute('data-target', '#reviewDiv'+k.toString());
        tog_rev.textContent = "Review";
        tog_rev.setAttribute('class',  "tog_rev btn btn-info btn-lg");
        var node = course_list[k];
        node.insertBefore(reviewForm(k,node.id),node.childNodes[2]);
        node.insertBefore(tog_rev,node.childNodes[2]);        
    
    }


    //append alerts
    var alert_div = document.createElement('div');
    alert_div.setAttribute('class', "alert alert-success");
    alert_div.id = "review-success";
    var close_alert = document.createElement('button');
    close_alert.setAttribute("data-dismiss","alert");
    close_alert.setAttribute("class","close");
    
    alert_div.appendChild(close_alert);
	alert_div.appendChild(document.createTextNode("Review successfully submitted"));
	document.getElementById('main_body').appendChild(alert_div);

    alert_div = document.createElement('div');
    alert_div.setAttribute('class', "alert alert-danger");
    alert_div.id    = "review-failure";   
    close_alert = document.createElement('button');
    close_alert.setAttribute("data-dismiss","alert");
    close_alert.setAttribute("class","close");

	alert_div.appendChild(close_alert);
    alert_div.appendChild(document.createTextNode("Review submission failed"));
	document.getElementById('main_body').appendChild(alert_div);

}
function main()
{
    appendCourse('COMP1911', 'Computing 1A', 'Faculty of Engineering', 'School of Computer Science', 'UGRD',
		1, 'Kensington', 6, 'This course introduces students to the basics of programming. The objective of this course is for students to develop proficiency in program design and construction using a high-level programming language. Topics covered include: fundamental programming concepts, the C programming language, programming style, program design and organisation, program testing and debugging. Practical experience of these topics is supplied through laboratory exercises and programming assignments.', 4);
	appendCourse('COMP9337', 'Securing Wireless Networks', 'Faculty of Engineering', 'School of Computer Science', 'PGRD',
		1, 'Kensington', 5, 'With exponential growth of the internet, security of a network has become increasingly challenging. This subject will explore the security vulnerabilities in both fixed and wireless networks and cover the fundamental concepts and advanced issues with an emphasis on the internet architecture and protocols.', 3);

//    navbar();
    addReviewSection();
    rate_reviews();
}
document.addEventListener("DOMContentLoaded", main);

function submitReviewListener(){
    $(".submitReview" ).click(function(e) {
        e.preventDefault();
        console.log("hello");
        console.log($(this).attr("course"));
        c_code = $(this).attr("course"); 
        $.ajax({
            url: '/cgi-bin/index.cgi/submit',
            async: false,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8',
            data: //JSON.stringify({'name':'yannnnie'}),
                $('#reviewform_'+c_code).serialize(),
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

$(document).ready(function(){

    $("[data-toggle=popover]").popover({
        html: true, 
        content: function() {
            return $('#popover-content').html();
        }
    });

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

    $('#review-success').hide();
    $('#review-failure').hide();
    $("#searchButton" ).click(function(e) {
        e.preventDefault();
        console.log("searched");
        console.log($('#searchForm').serialize());
        $.ajax({
            url: '/cgi-bin/index.cgi/search',
            async: false,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8',
            data:$('#searchForm').serialize(),
            success: function(response) {
                console.log(response);
				display_search(response);
            }, error: function(result,ts,err) {
                console.log([result,ts,err]);
            }
        });
        
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
            contentType: 'application/json; charset=UTF-8',
            data: {"user":username, "pass":password},
            success: function(response) {
				console.log("login success");
				//login_success();
            }, error: function(result,ts,err) {
				console.log("login failed");
                console.log([result,ts,err]);
            }
        });
        
    });
    submitReviewListener();
});
