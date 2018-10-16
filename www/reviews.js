function update_review(score,post){
    pId = post.split("_")[1];
    console.log(pId);
    //remove text node
    var div = document.getElementById('review_'+pId);
    div.removeChild(div.childNodes[0]);
    div.insertBefore(document.createTextNode(score),div.childNodes[0]);
    
}
function updown_Listener(){
    $(".uprev").click(function(e) {
        e.preventDefault();
        console.log($(this).attr('pid'));
        var post = $(this).attr('pid');
        $.ajax({
            url: '/cgi-bin/index.cgi/rate_review',
            async: false,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify({"type":0, "post":post}),
            success: function(response) {
                console.log(response);
				update_review(response,post);
            }, error: function(result,ts,err) {
                console.log(result);
                console.log([result,ts,err]);
            }
        });
        
    });
}

function flag_Listener() {
   $(".flag").click(function(e) {
      e.preventDefault();
      console.log($(this).attr('pid'));
      var post = $(this).attr('pid');

      $.ajax({
         url: '/cgi-bin/index.cgi/flagPost',
         async: false,
         type: 'POST',
         dataType: 'json',
         contentType: 'application/json',
         data: JSON.stringify({"post": post}),
         success: function(response) {
            console.log(response);
         }, error: function(result,ts,err) {
            console.log(result);
            console.log([result,ts,err]);
         }
      });
 
   });
}
