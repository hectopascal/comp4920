<html>
	<head>
		<link rel="stylesheet" href="style.css">
		<!-- bootstrap CSS -->
		<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
		<!-- Font Fonts -->
		<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins">
		<!-- Bootrap JS & JQuery -->
<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script>
		<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
        <script src="main.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	</head>

	<body class="bg-light" style="padding-top:5rem;">
		<nav class="navbar navbar-expand-md navbar-dark fixed-top" style="background-color:#ef6c30">
			<a class="navbar-brand " style="font-family:'Poppins'; font-size:24px; font-weight:900; font-style:italic" href="#">Rear Window</a>
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar"
			 aria-controls="navbar" aria-expanded="false" aria-label="Toggle Navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbar">
				<ul class="navbar-nav mr-auto">
					<li class="nav-item active">
						<a class="nav-link" href="#">About</a>
					</li>
					<li class="nav-item active">
						<a class="nav-link" href="#">Contact</a>
					</li>
				</ul>
				<form id="searchForm" class="form-inline my-2 my-lg-0" method="post" accept-charset="utf-8">
					<input id="searchField" name="searchfield" class="form-control mr-sm-2" type="text" placeholder="Course name / code">
					<button type="submit" id="searchButton" class="btn btn-light my-2 my-sm-0 mr-2">Search</button>
				</form>
</div>
		
		</nav>
		<button data-placement="bottom" data-toggle="popover" data-title="" data-container="body" type="button" class="btn btn-light my-2 my-sm-0 mr-2" data-html="true" href="#" id="login">Login</button>
  	<div id="popover-content" class="hide">
    <form class="form-inline" role="form">
      <div class="form-group">
        <input id="username" placeholder="Email" class="form-control" type="email">
		<p>
        <input id="password" placeholder="Password" class="form-control" minlength="6" type="password">
        <button type="submit" class="btn btn-primary" id="loginButton">Login</button>
      </div>
    </form>
  </div>
		<main id="main_body" role="main" class="container">
        </main>
	</body>

</html>
