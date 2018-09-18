var activeReview = 'COMP1911';

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
	cpost_title.setAttribute('class', 'd-flex bg-dark text-white p-1 rounded');
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
	load_prompt.setAttribute('class', 'btn btn-default');
	load_prompt.setAttribute('data-toggle', 'collapse');
	load_prompt.setAttribute('href', '#' + c_code + '_forum');
	load_prompt.setAttribute('role', 'button');
	load_prompt.setAttribute('aria-expanded', 'false');
	load_prompt.setAttribute('aria-controls', c_code + '_forum');
	load_prompt.setAttribute('toggled', 'n');

	load_prompt_i.setAttribute('class', 'fas fa-chevron-down');

	load_prompt.appendChild(load_prompt_i);

	var collapsing_forum = document.createElement('div');
	var ttt  = document.createTextNode('I did not enjoy this course.');
	collapsing_forum.setAttribute('class', 'collapse');
	collapsing_forum.setAttribute('id', c_code + '_forum');
	collapsing_forum.appendChild(appendPost('stupid', 4, 'hmmm... course not very good'));
	collapsing_forum.appendChild(appendPost('idiot', 4, 'it\'s alright'));
	collapsing_forum.appendChild(appendPost('user', 4, 'amazing course but quite difficult'));
	collapsing_forum.appendChild(appendPost('user1', 4, 'horrible lecturer'));
	collapsing_forum.appendChild(appendPost('user2', 4, 'hello'));

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

function reviewForm(k,c_code)
{
    var div = document.createElement('div');
    div.setAttribute('class', "toggle collapse accordion-group");
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
    
    //----USER DISPLAY NAME----//
    var i = document.createElement("input");
    i.type = "text";
    i.class = "control-label-col-sm-2";
    i.name = "dispname";
    i.id = "nBox_"+c_code;
    i.placeholder = "Display Name";

    //----REVIEW TEXT SPACE ----//
    var review = document.createElement("textarea");
    review.cols = "50";
    review.rows = "4";
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

function main()
{
	appendCourse('COMP1911', 'Computing 1A', 'Faculty of Engineering', 'School of Computer Science', 'UGRD',
		1, 'Kensington', 6, 'This course introduces students to the basics of programming. The objective of this course is for students to develop proficiency in program design and construction using a high-level programming language. Topics covered include: fundamental programming concepts, the C programming language, programming style, program design and organisation, program testing and debugging. Practical experience of these topics is supplied through laboratory exercises and programming assignments.', 4);
	appendCourse('COMP9337', 'Securing Wireless Networks', 'Faculty of Engineering', 'School of Computer Science', 'PGRD',
		1, 'Kensington', 5, 'With exponential growth of the internet, security of a network has become increasingly challenging. This subject will explore the security vulnerabilities in both fixed and wireless networks and cover the fundamental concepts and advanced issues with an emphasis on the internet architecture and protocols.', 3);


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
   	/*
	appendCourse('COMP2521: Data Structures and Algorithms', 'The goal of this course is to deepen students\' understanding of data structures and algorithms and how these can be employed effectively in the design of software systems.', 2);
	appendCourse('COMP1521: Computer Systems Fundamentals', 'This course provides a programmer\'s view on how a computer system executes programs, manipulates data and communicates.', 4);
	appendCourse('COMP1531: Software Engineering Fundamentals', 'This course provides an introduction to software engineering principles: basic software lifecycle concepts, modern development methodologies, conceptual modeling and how these activities relate to programming.', 4);
	appendCourse('COMP3121: Algorithms and Programming Techniques', 'Correctness and efficiency of algorithms. Computational complexity: time and space bounds. Techniques for best-case, worst-case and average-case time and space analysis.', 3)
	appendCourse('COMP2511: Object-Oriented Design & Programming', 'This course aims to introduce students to the principles of object-oriented design and to fundamental techniques in object-oriented programming.', 2);
	appendCourse('COMP4920: Management and Ethics', 'This course will develop a framework on which management and ethical issues can be developed.', 0);
	appendCourse('COMP3900: Computer Science Project', 'A capstone software project. Students work in teams to define, implement and evaluate a real-world software system.', 1);
	*/
}

document.addEventListener("DOMContentLoaded", main);
$(document).ready(function(){

    $(".submitReview" ).click(function(e) {
        
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
            },
            error: function(result,ts,err) {
                console.log([result,ts,err]);
            }
        });

    });


});
