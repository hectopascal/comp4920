function showAccountSettings(){

    get_user_info();

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


    var complete_courses_div = document.createElement("div");
    complete_courses_div.setAttribute("class","row");

    var results_container = document.createElement("div");
    results_container.id="completed_courses";
    results_container.setAttribute("class",'col scrollable');

    var find_completed_container = document.createElement("div");
    find_completed_container.setAttribute('id',"add_complete");
    find_completed_container.setAttribute("class",'col');

    complete_courses_div.appendChild(results_container);
    complete_courses_div.appendChild(find_completed_container);
    main.appendChild(complete_courses_div);
    get_all_completed();


    //REVIEWS AND RECOMMENDED ROW
    var recv = document.createElement("div")
    recv.setAttribute('class','form-group row');


    //REVIEWED COURSES ROW
    var reviews_container = document.createElement("div");
    reviews_container.id="reviews_container";
    reviews_container.setAttribute("class",'col scrollable');
    main.appendChild(document.createElement('p'));
    recv.appendChild(reviews_container);


    //recommended courses
    var recommended_div = document.createElement("div");
    recommended_div.setAttribute("class",'col scrollable');
    var ul = document.createElement("ul");
	ul.setAttribute('class','list-group');
    ul.id ="rec_list";
    var rec_h1 = document.createElement("h1");
    rec_h1.appendChild(document.createTextNode("Recommended for you:"));
    recommended_div.appendChild(rec_h1);

    recommended_div.appendChild(ul);
    recv.appendChild(recommended_div);

       main.appendChild(recv);
    get_recommended_courses();
    get_all_reviewed();
    main.appendChild(document.createElement("p"));
    addCoursesPage();
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
    var div = document.createElement('div');
	var ul = document.createElement("ul");
	ul.setAttribute('class','list-group');
    ul.id ="completed_list";
    if (results.length !==0) {
        for(var i=0; i<results.length; ++i){
		    var li = document.createElement("li");
            li.setAttribute('class','list-group-item course_done');
			li.id = "completed_"+results[i][0];
            var button = document.createElement("button");
            button.setAttribute('class','btn btn-danger delete btn-sm');
            button.appendChild(document.createTextNode("Remove"));
            li.appendChild(button);
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
    container.appendChild(div);
    div.appendChild(ul);


    $('.delete').on('click', function(){
        var el = $(this).closest('.course_done');
        uncompleteCourse(el.attr('id'));
        cuteHide(el);
    });
}


// Animated element removal
function cuteHide(el) {
  $(el).animate({opacity: '0'}, 150, function(){
    $(el).animate({height: '0px'}, 150, function(){
      $(el).remove();
    });
  });
}



// adds an item to list (only frontend display)
function addToList(c_code){
    var ul = document.getElementById('completed_list');
    var li = document.createElement("li");
    li.setAttribute('class','list-group-item course_done');
    li.id = "completed_"+c_code;
    var button = document.createElement("button");
    button.setAttribute('class','btn btn-danger delete btn-sm');
    button.appendChild(document.createTextNode("Remove"));
    li.appendChild(button);
    li.appendChild(document.createTextNode(c_code));
    ul.appendChild(li);


    $('.delete').unbind().on('click', function(){
        var el = $(this).closest('.course_done');
        uncompleteCourse(el.attr('id'));
        cuteHide(el);
    });


}

function display_codes(results,complete){
    var container = document.getElementById("results_container");
    if(results.length !== 0){
        console.log(results);
        console.log(complete);
        for (var i = 0 ; i < results.length; i++){
                //DISPLAY RESULTS
                var c_code = results[i][1];

                var checked = false;
                var rightdiv = document.createElement('div');
                rightdiv.setAttribute('class','ml-3');
                var button = document.createElement('button');
                button.setAttribute('class',"btn btn-default");
                button.id="add_"+c_code;
                button.appendChild(document.createTextNode("Uncompleted"));

                rightdiv.appendChild(document.createTextNode(c_code));
                rightdiv.appendChild(button);

                if(complete[0][0][0] === true){
                    button.classList.remove('btn-default');
                    button.removeChild(button.firstChild);

                    button.appendChild(document.createTextNode("Completed"));
                    button.classList.add('btn-success');
                    var checked = true;
                }

                container.appendChild(rightdiv);
            }

                addCompletedListener(c_code,checked);
    } else {
        container.appendChild(document.createElement('p'));
        container.appendChild(document.createTextNode("No courses found. Please enter exact course code."));
    }



    $('.delete').unbind().on('click', function(){
        var el = $(this).closest('.course_done');
        uncompleteCourse(el.attr('id'));
        cuteHide(el);
    });

}


function rmFromList(code){
    console.log(code);
	var elem = document.getElementById("completed_"+code);
    cuteHide(elem);
}

function uncompleteCourse(code){
    //remove from list, remove from db
    var course = code.split('_')[1];
    console.log((course));
    post_courses(DELCOMP,course);

    //if completed button exists, toggle.
    var comp_button = document.getElementById("add_"+course) ;
    if(comp_button){// toggle button
        console.log("BLAHBLAH");
        var buttontext = document.createTextNode("Uncompleted");
        var checked = false;
        $(comp_button).empty();
        $(comp_button).append(buttontext);
        $(comp_button).toggleClass('btn-default btn-success');
        addCompletedListener(course,checked);
    }
}


function addCoursesPage(){
    var container = document.createElement("div");
    container.setAttribute("class","jumbotron");

    var header = document.createElement("h1");
    header.appendChild(document.createTextNode("Add your completed courses"));
    container.appendChild(header);
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
    var main =document.getElementById('add_complete');
    main.appendChild(container);

    var results_container = document.createElement("div");
    results_container.id="results_container";
    results_container.setAttribute("class",'container-fluid');
    main.appendChild(results_container);
    searchCourseCodeListener();

}
