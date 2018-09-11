var i = 0; /* Set Global Variable i */
function increment(){
    i += 1; /* Function for automatic increment of field's "Name" attribute. */
}
function removeElement(parentDiv, childDiv){
    if (childDiv == parentDiv){
        alert("The parent div cannot be removed.");
    }
    else if (document.getElementById(childDiv)){
        var child = document.getElementById(childDiv);
        var parent = document.getElementById(parentDiv);
        parent.removeChild(child);
    }
    else{
        alert("Child div has already been removed or does not exist.");
        return false;
    }
}
function nameFunction(){

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


    var r = document.createElement('span');
    var y = document.createElement("INPUT");
    y.setAttribute("type", "text");
    y.setAttribute("placeholder", "Name");
    var g = document.createElement("IMG");
    g.setAttribute("src", "delete.png");
    increment();
    y.setAttribute("Name", "textelement_" + i);
    r.appendChild(y);
    g.setAttribute("onclick", "removeElement('myForm','id_" + i + "')");
            r.appendChild(g);r.setAttribute("id", "id_" + i);
            reviewForm.appendChild(r)
            document.getElementById("myForm").appendChild(reviewForm);

}


