function showAccountSettings(){
    clear_children('main_body');
    
    var container = document.createElement("div");
    container.setAttribute("class","container");
    //HEADER
    var header = document.createElement("h1");
    header.appendChild(document.createTextNode("Account Preferences"));
    container.appendChild(header);
    //FORM START
    var f = document.createElement("form");
    f.setAttribute('method',"post");
    f.setAttribute("accept-charset","utf-8");
    f.setAttribute("class","form-inline") 
    
    //NAME AND PASS GROUP
    //TODO separate container/div for password change 
    
        
    var div1 = document.createElement('div');
    div1.id    = "addcoursespage";
    div1.setAttribute('class','form-group');
     
    var email = document.createElement("input");
    email.type = "text";
    email.setAttribute('class',"mr-sm-2 form-control form-control-lg");
    email.setAttribute("readponly","readonly");
    dispname.name = "email";
    dispname.id = "email"; 
    var dispname = document.createElement("input");
    dispname.type = "text";
    dispname.setAttribute('class',"mr-sm-2 form-control form-control-lg");
    dispname.name = "dispname";
    dispname.id = "dispname";
    
    //TODO 
    //GET USER'S CURRENT DISPLAY NAME AS PLACEHOLDER
    //GET USER'S EMAIL AS PLACEHOLDER
    dispname.placeholder= "Display Name";
    email.placeholder   = "Email";


    //COMPLETED COURSES PART
    var i = document.createElement("input");
    i.type = "text";
    i.setAttribute('class',"mr-sm-2 form-control form-control-lg");
    i.name = "program";
    i.id = "program";
    i.placeholder = "Program";
    div.appendChild(i);

    i = document.createElement("input");
    i.type = "text";
    i.setAttribute('class',"mr-sm-2 form-control form-control-lg");
    i.name = "major";
    i.id = "major";
    i.placeholder="Major";
   
    var s = document.createElement("button");
    s.type = "submit";
    s.value = "Submit";
    s.appendChild(document.createTextNode("Search"));
    s.id = "codesearchbutton";
    s.setAttribute('class',"btn btn-primary");
    
    var p = document.createElement('p');
    div.appendChild(p);
    div.appendChild(i);
    div.appendChild(s);

    f.appendChild(div);
    container.appendChild(f);
    var main =document.getElementById('main_body');
    main.appendChild(container);
   
    var results_container = document.createElement("div");
    results_container.id="results_container";
    results_container.setAttribute("class",'container-fluid');
    main.appendChild(results_container);
    searchCourseCodeListener();




}


//TODO
function display_completed(results) {
	var container = document.createElement("div");
	container.setAttribute("class","container");
	var ul = document.createElement("ul");
	
    if (results.length !==0) {
        for(var i=0; i<results.length; ++i){
		    var li = document.createElement("li");
            li.appendChild(document.createTextNode(results[i]));
        }
	
    }
   <div id="container">
 <ul>
  <li>A</li>
  <li>B</li>
  <li>C</li>
  <li id="innerelement">D</li>
  <li>E</li>
  <li>F</li>
  <li>G</li>
  </ul>
 </div>
<button id="mybutton">SCROLL TO D</button> 
}

function addCoursesPage(){
    var container = document.createElement("div");
    container.setAttribute("class","jumbotron");
    
    var header = document.createElement("h1");
    header.appendChild(document.createTextNode("Add your completed courses"));
    container.appendChild(header);
    clear_children('main_body'); 
    var f = document.createElement("form");
    f.setAttribute('method',"post");
    f.setAttribute("accept-charset","utf-8");
    f.setAttribute("class","form-inline") 
    var div = document.createElement('div');
    div.id    = "addcoursespage";
    div.setAttribute('class','form-group');


    var i = document.createElement("input");
    i.type = "text";
    i.setAttribute('class',"mr-sm-2 form-control form-control-lg");
    i.name = "course";
    i.id = "searchcode";
    i.placeholder = "Search course code...";

    var s = document.createElement("button");
    s.type = "submit";
    s.value = "Submit";
    s.appendChild(document.createTextNode("Search"));
    s.id = "codesearchbutton";
    s.setAttribute('class',"btn btn-primary");
    
    var p = document.createElement('p');
    div.appendChild(p);
    div.appendChild(i);
    div.appendChild(s);

    f.appendChild(div);
    container.appendChild(f);
    var main =document.getElementById('main_body');
    main.appendChild(container);
   
    var results_container = document.createElement("div");
    results_container.id="results_container";
    results_container.setAttribute("class",'container-fluid');
    main.appendChild(results_container);
    searchCourseCodeListener();

}

