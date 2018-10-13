function showAccountSettings(){
    

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

