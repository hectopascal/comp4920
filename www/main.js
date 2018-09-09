
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
			slevel_badge.setAttribute('class', 'my-2 mx-1 badge badge-success');
		else
			slevel_badge.setAttribute('class', 'my-2 mx-2 badge badge-warning');

		slevel_badge.appendChild(document.createTextNode(c_study_level));
		cflex.appendChild(cbadge);
		cflex.appendChild(slevel_badge);
	}
	var cnode  = document.createElement('h4');
	cnode.setAttribute('class', 'ml-2');
	var cnode1 = document.createElement('p');
	var title  = document.createTextNode(c_code + ': ' + c_title);
	var info   = document.createTextNode(c_info);
	cnode.appendChild(title);


	cflex.appendChild(cnode);

	celem.appendChild(cflex);
	cnode1.appendChild(info);
	celem.appendChild(cnode1);

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
	cflex.appendChild(crating);

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
	collapsing_forum.appendChild(ttt);

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
				console.log('hi');
				this.setAttribute('toggled', 'y');
				this.children[0].setAttribute('class', 'fas fa-chevron-up');
			}
		});

	ccomments.appendChild(load_prompt);
	ccomments.setAttribute('class', 'd-flex justify-content-center mt-2');
	celem.appendChild(ccomments);

	celem.appendChild(collapsing_forum);

	celem.setAttribute("class", 'p-3 bg-white');
	celem.setAttribute("style", 'margin-top:20px;margin-bottom:20px; box-shadow:0 0 4px 0 rgba(0,0,0,0.2); border-radius:10px;');

	document.getElementById('main_body').appendChild(celem);
}

function main()
{
	appendCourse('COMP1911', 'Computing 1A', 'Faculty of Engineering', 'School of Computer Science', 'UGRD',
		1, 'Kensington', 6, 'This course introduces students to the basics of programming. The objective of this course is for students to develop proficiency in program design and construction using a high-level programming language. Topics covered include: fundamental programming concepts, the C programming language, programming style, program design and organisation, program testing and debugging. Practical experience of these topics is supplied through laboratory exercises and programming assignments.', 4);
	appendCourse('COMP9337', 'Securing Wireless Networks', 'Faculty of Engineering', 'School of Computer Science', 'PGRD',
		1, 'Kensington', 5, 'With exponential growth of the internet, security of a network has become increasingly challenging. This subject will explore the security vulnerabilities in both fixed and wireless networks and cover the fundamental concepts and advanced issues with an emphasis on the internet architecture and protocols.', 3);
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
