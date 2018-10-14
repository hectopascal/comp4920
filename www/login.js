function login_setup(){
	var popover = document.createElement("div");
	popover.class="hide";
	document.getElementById("login").append(popover);
	
	var login_form	= document.createElement("form");
    login_form.class="form-inline";
	login_form.role	="form";
	popover.appendChild(login_form);
	
	var form_div = document.createElement("div");
	form_div.class = "form-group";
	login_form.appendChild(form_div);
	
	var user = document.createElement("input");
	user.type = "email";
	user.class = "form-control";
	var pass = document.createElement("input");
	pass.type = "password";
	pass.class = "form-control";
	var login_button = document.createElement("button");
	login_button.type = "submit";
    login_button.class="btn btn-primary";
	login_button.id="loginButton">
	form_div.appendChild(user);
	form_div.appendChild(pass);
	form_div.appendChild(login_button);
      <div class="form-group">
        <input type="checkbox" id="signupCheckbox">
        <label > I am signing up for an account</label>
        <input placeholder="Email" class="form-control" type="email">
        <input placeholder="Password" class="form-control" minlength="6" type="password">
        <button type="submit" class="btn btn-primary" id="loginOrSignupButton">Login/Sign up » </button>
      </div>
}
function login_success(){

	//do something

}
