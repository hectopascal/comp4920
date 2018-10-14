const MAIN = 0;
const SEARCH = 1;
const FILTER = 2;
const COMPLETE = 3;
const ADDCOMP = 4;
const DELCOMP = 5;
var curpage = MAIN;
var last_query = '';
var hitbottom= true;

var offset=0;
var userId=0;

function clear_children(elemId){
    var elem = document.getElementById(elemId); 
    while(elem.firstChild){
        elem.removeChild(elem.firstChild);
    }


}

