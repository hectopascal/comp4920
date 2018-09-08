
function appendCourse(c_title, c_info, rating)
{
	var celem  = document.createElement('div');
	var cnode  = document.createElement('h4');
	var cnode1 = document.createElement('p');
	var title  = document.createTextNode(c_title);
	var info   = document.createTextNode(c_info);
	cnode.appendChild(title);
	celem.appendChild(cnode);
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
	crating.setAttribute('class', 'mr-2');
	celem.appendChild(crating);

	celem.appendChild(document.createTextNode('As rated by X users.'));

	var ccomments = document.createElement('div');
	var load_prompt = document.createElement('button');
	var load_prompt_i = document.createElement('i');
	load_prompt.setAttribute('type', 'submit');
	load_prompt.setAttribute('class', 'btn btn-default');
	load_prompt_i.setAttribute('class', 'fas fa-chevron-down');
	load_prompt.appendChild(load_prompt_i);

	ccomments.appendChild(load_prompt);
	ccomments.setAttribute('class', 'd-flex justify-content-center mt-2');
	celem.appendChild(ccomments);

	celem.setAttribute("class", 'p-3 bg-white');
	celem.setAttribute("style", 'margin-top:20px;margin-bottom:20px; box-shadow:0 0 4px 0 rgba(0,0,0,0.2); border-radius:10px;');

	document.getElementById('main_body').appendChild(celem);
}

function main()
{
	appendCourse('COMP1511: Programming Fundamentals', 'An introduction to problem-solving via programming, which aims to have students develop proficiency in using a high level programming language.', 1);
	appendCourse('COMP2521: Data Structures and Algorithms', 'The goal of this course is to deepen students\' understanding of data structures and algorithms and how these can be employed effectively in the design of software systems.', 2);
	appendCourse('COMP1521: Computer Systems Fundamentals', 'This course provides a programmer\'s view on how a computer system executes programs, manipulates data and communicates.', 4);
	appendCourse('COMP1531: Software Engineering Fundamentals', 'This course provides an introduction to software engineering principles: basic software lifecycle concepts, modern development methodologies, conceptual modeling and how these activities relate to programming.', 4);
	appendCourse('COMP3121: Algorithms and Programming Techniques', 'Correctness and efficiency of algorithms. Computational complexity: time and space bounds. Techniques for best-case, worst-case and average-case time and space analysis.', 3)
	appendCourse('COMP2511: Object-Oriented Design & Programming', 'This course aims to introduce students to the principles of object-oriented design and to fundamental techniques in object-oriented programming.', 2);
	appendCourse('COMP4920: Management and Ethics', 'This course will develop a framework on which management and ethical issues can be developed.', 0);
	appendCourse('COMP3900: Computer Science Project', 'A capstone software project. Students work in teams to define, implement and evaluate a real-world software system.', 1);
}

document.addEventListener("DOMContentLoaded", main);
