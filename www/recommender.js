function recommender_setup() {

}

// could simply be called once a day, up updated after every review post
function update_recommender(){
    $.ajax({
        type: "POST",
        url: './recommender.py',
        success: function(response) {
            console.log("updated course_recommendations");
            // upload to db
            upload_recommendations();

        }, error: function(result,ts,err) {
            console.log([result,ts,err]);
        }
    });
}

function update_recommender() {
    $.ajax({
        type: "POST"
        url: '/cgi-bin/index.cgi/updateRecommender',
        Success: function(response) {
            console.log("db updated");
		}, error: function(result,ts,err) {
            console.log([result,ts,err]);
		}
    })
}
