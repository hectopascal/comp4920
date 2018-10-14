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

function appendPost(user_title, rating, post,pId, score)
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
    
    //rate reviews functionality
    var div = document.createElement('div');
    div.setAttribute("class", "d-flex justify-content-end");
    div.setAttribute('id',"review_"+pId);
    cpost_title.appendChild(div);
    div.appendChild(document.createTextNode(score));
    var up = document.createElement('i');
    up.setAttribute("class","fas fa-arrow-up uprev mr-2 ml-2");
	up.setAttribute('pid',"post_"+pId);
    var down = document.createElement('i');
    down.setAttribute("class","fas fa-arrow-down downrev");
	down.setAttribute('pid',"post_"+pId);
    div.appendChild(up);
    div.appendChild(down);

	return cpost;
}

function appendCourse(c_code, c_title, c_faculty, c_school, c_study_level,
	c_terms, c_campus, c_hours, c_info, rating, c_num_reviews,
    type = 'reviews')
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
	var info   = document.createElement('div');
    info.innerHTML = c_info;
	cnode.appendChild(title);


	cflex.appendChild(cnode);

	celem.appendChild(cflex);
	cnode1.appendChild(info);
	celem.appendChild(cnode1);

	cflex.appendChild(appendRating(rating));

    var reviewCount = document.createElement('span');
    reviewCount.innerHTML = '(' + c_num_reviews + ')';
    reviewCount.setAttribute('style', 'margin-left: 5px;');
    cflex.appendChild(reviewCount);
	if (type == 'addcourses'){
        var rightdiv = document.createElement('div');
        rightdiv.setAttribute('class','ml-3');
        var addButton = document.createElement('button');
        addButton.setAttribute('class',"btn btn-default");
        addButton.id="add_"+c_code;
        addButton.appendChild(document.createTextNode("Uncompleted"));
        rightdiv.appendChild(addButton);
        cflex.appendChild(rightdiv);
    }

    if (type == 'reviews'){
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

    }
	celem.setAttribute("class", 'p-3 bg-white course_summary');
	celem.setAttribute("style", 'margin-top:20px;margin-bottom:20px; box-shadow:0 0 4px 0 rgba(0,0,0,0.2); border-radius:10px;');
    celem.setAttribute("id",c_code);
    return celem;
}
function display_courses(results,containerId='main_body',complete=false){
	var container = document.getElementById(containerId);
    console.log(complete);
    if(results.length !== 0){
        console.log(results);
        //var courses = JSON.parse(results);

        for (var i = 0 ; i < results.length; i++){
            var rating = results[i][4];

            var c_code = results[i][1]; 
            if(!document.getElementById(c_code)){
                var type = 'reviews';
                if (containerId === 'results_container'){
                    type = 'addcourses';
                }
				if(results[i][6] == "Undergraduate")
	                container.appendChild(appendCourse(c_code, results[i][2], "Faculty of Engineering", "School of Computer Science", "UGRD", 1 , 'Kensington', 6, results[i][3], rating, results[i][5],type));
				else
	                container.appendChild(appendCourse(c_code, results[i][2], "Faculty of Engineering", "School of Computer Science", "PGRD", 1 , 'Kensington', 6, results[i][3], rating, results[i][5],type));
                //insert review section
                if(containerId==='results_container' ){
                    var checked = false;
                    if(complete[0][0][0] === true){
                        var button = document.getElementById('add_'+c_code);
                        button.classList.remove('btn-default');
                        button.removeChild(button.firstChild);

                        button.appendChild(document.createTextNode("Completed"));
                        button.classList.add('btn-success');
                        var checked = true;
                    }
                    addCompletedListener(c_code,checked);
               
                } else{
                    var tog_rev = document.createElement('button');
                    tog_rev.type = 'submit';
                    tog_rev.setAttribute('data-toggle','collapse');
                    tog_rev.setAttribute('data-target', '#reviewDiv'+c_code);
                    tog_rev.textContent = "Review";
                    tog_rev.setAttribute('class',  "tog_rev btn btn-info btn-lg");
                    var node = document.getElementById(c_code);
                    node.insertBefore(reviewForm(c_code),node.childNodes[2]);
                    node.insertBefore(tog_rev,node.childNodes[2]);        

                }
            }
        }
        if(containerId==='main_body'){
            submitReviewListener();
	    	showReviewListener();
        }        
    } else {
        if (containerId=== "results_container"){
            container.appendChild(document.createElement('p'));
            container.appendChild(document.createTextNode("No courses found. Please enter exact course code."));
        } else{

            container.appendChild(document.createElement('p'));
            container.appendChild(document.createTextNode("No courses matching your query found. Try again?"));
        }
    } 
}
function getRating(course){
    var rating=0;
    $.ajax({
        url: '/cgi-bin/index.cgi/meanrating',
        async: false,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        data: course,
            success: function(response) {
                rating = response[0][0];
            },
            error: function(result,ts,err) {
                console.log([result,ts,err]);
            }
    });
  return rating;
}

function display_reviews(c_code, results)
{
	var c_forum = document.getElementById(c_code + '_forum');
	c_forum.innerHTML = "";
    var postID_arr = new Array(results.length);
    console.log(results);
	results.sort(function(a,b){
        return b[4]-a[4];
    });
    console.log(results);
    for(var i = 0; i < results.length; i++)
	{
		c_forum.appendChild(appendPost(results[i][3], results[i][1], results[i][2],results[i][0], results[i][4]));
	}

    updown_Listener();
}


function reviewForm(c_code)
{
    var div = document.createElement('div');
    div.setAttribute('class', "form-group toggle collapse accordion-group");
    div.setAttribute('data-parent','#main_body');
    div.id    = "reviewDiv"+c_code;
   

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
    c.setAttribute('class',"form-control");
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
function changeTo_addCoursesPage(){
    clear_children('main_body');
    addCoursesPage();

}
function main()
{
	offset = 0;
	curpage = MAIN;
	try_authenticate();
	/* Try authenticating with cookie if there is one */
	$.ajax({
		url: '/cgi-bin/index.cgi/courses',
		async: false,
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify({"limit":10,"offset":offset}),
		success: function(response) {
			clear_children('main_body');
			display_courses(response);
            offset+=10;
		}, error: function(result,ts,err) {
			console.log([result,ts,err]);
		}
	});
}

