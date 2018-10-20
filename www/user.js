function showAccountSettings(){
    
    get_user_info()
    clear_children('main_body');
    
    var container = document.createElement("div");
    container.setAttribute("class","jumbotron");

    //HEADER
    var header = document.createElement("h1");
    header.appendChild(document.createTextNode("Account Preferences"));
    container.appendChild(document.createElement("p"));
    container.appendChild(header);
    container.appendChild(document.createElement("p"));
    //FORM START
    var f = document.createElement("form");
    f.id = "user_settings";
    f.setAttribute('method',"post");
    f.setAttribute("accept-charset","utf-8");
    
    var div = document.createElement('div');
    div.setAttribute('class','form-group row'); 
    
    var label = document.createElement("label");
    label.appendChild(document.createTextNode("Username"));
    label.setAttribute("for","email");
    label.setAttribute('class','col-sm-2 col-form-label col-form-label-lg');
    
    var div2 = document.createElement('div');
    div2.setAttribute('class','col-sm-10');
    var email = document.createElement("input");
    email.type = "text";
    email.setAttribute('class',"form-control form-control-lg");
    email.setAttribute("readonly","readonly");
    email.name  = "email";
    email.id    = "email"; 
    email.value = user_email;
    user_email  ='';
    div2.appendChild(email)
    div.appendChild(label);
    div.appendChild(div2);
    f.appendChild(div);
    f.appendChild(document.createElement('p'));


    //NEW formgroup
    div = document.createElement('div');
    div.setAttribute('class','form-group row'); 
    label = document.createElement("label");
    label.appendChild(document.createTextNode("Display Name"));
    label.setAttribute("for","dispname");
    label.setAttribute('class','col-sm-2 col-form-label col-form-label-lg');
    div2 = document.createElement("div");
    div2.setAttribute('class','col-sm-10');

    var dispname    = document.createElement("input");
    dispname.type   = "text";
    dispname.setAttribute('class',"form-control form-control-lg");
    dispname.name   = "dispname";
    dispname.id     = "dispname";
    dispname.value= user_display_name;
    user_display_name   ='';
    div.appendChild(label);
    div2.appendChild(dispname);
    div.appendChild(div2);
    f.appendChild(div); 
    
    
    //NEW formgroup program and major
    div = document.createElement('div');
    div.setAttribute('class','form-group row'); 
    label = document.createElement("label");
    label.appendChild(document.createTextNode("Program"));
    label.setAttribute("for","program");
    label.setAttribute('class','col-sm-2 col-form-label col-form-label-lg');
    
    div2 = document.createElement("div");
    div2.setAttribute('class','col-sm-10');
    var i = document.createElement("input");
    i.type = "text";
    i.setAttribute('class',"mr-sm-2 form-control form-control-lg");
    i.name = "program";
    i.id = "program";
    i.placeholder = "Program";
    i.value = user_program;
    div.appendChild(label);
    div2.appendChild(i);
    div.appendChild(div2);
    f.appendChild(div);
    
    div = document.createElement('div');
    div.setAttribute('class','form-group row'); 
    div2 = document.createElement("div");
    div2.setAttribute('class','col-sm-10');
    label = document.createElement("label");
    label.appendChild(document.createTextNode("Major"));
    label.setAttribute("for","major");
    label.setAttribute('class','col-sm-2 col-form-label col-form-label-lg');
    i = document.createElement("input");
    i.type = "text";
    i.value = user_major;
    i.setAttribute('class',"mr-sm-2 form-control form-control-lg");
    i.name = "major";
    i.id = "major";
    i.placeholder="Major";
    div.append(label);
    div2.appendChild(i);
    div.append(div2);
    f.appendChild(div);

    // TODO IMPLEMENT SAVE SETTINGS

    var s = document.createElement("button");
    s.type = "submit";
    s.value = "Submit";
    s.appendChild(document.createTextNode("Save"));
    s.id = "savesettingsbutton";
    s.setAttribute('class',"btn btn-primary");
    f.appendChild(s); 

    container.appendChild(f);
    var main =document.getElementById('main_body');
    main.appendChild(container);
    settingsPageListener();


    var results_container = document.createElement("div");
    results_container.id="completed_courses";
    results_container.setAttribute("class",'container-fluid');
    main.appendChild(results_container);
    get_all_completed();

    var reviews_container = document.createElement("div"); 
    reviews_container.id="reviews_container";
    reviews_container.setAttribute("class",'container-fluid');
    main.appendChild(document.createElement('p'));
    main.appendChild(reviews_container);
    get_all_reviewed();
    main.appendChild(document.createElement("p"));
}

function display_reviewed(results){
    var container = document.getElementById('reviews_container');
    
    var ul = document.createElement("ul");
	ul.setAttribute('class','list-group');
    if (results.length !==0) {
        for(var i=0; i<results.length; ++i){
		    var li = document.createElement("li");
            li.setAttribute('class','list-group-item');
            li.appendChild(document.createTextNode(results[i][5]+": "+ results[i][2]));
            ul.appendChild(li);
        }
    }
    
    var header = document.createElement("h1");
    header.appendChild(document.createTextNode("Reviewed Courses"));
    container.appendChild(header);
    container.appendChild(ul);
}

function display_completed(results) {
    var container = document.getElementById('completed_courses');
	var ul = document.createElement("ul");
	ul.setAttribute('class','list-group');
    if (results.length !==0) {
        for(var i=0; i<results.length; ++i){
		    var li = document.createElement("li");
            li.setAttribute('class','list-group-item');
            li.appendChild(document.createTextNode(results[i][0]));
            ul.appendChild(li);
        }
    }
    var header = document.createElement("h1");
    header.appendChild(document.createTextNode("Completed Courses"));
    var p = document.createElement('p');
    p.appendChild(document.createTextNode("Please go to 'Add Courses' to edit list"));

    container.appendChild(header);
    container.appendChild(p);
    container.appendChild(ul);
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

