create table courses
(
	id serial primary key,
	code varchar(255),
	name varchar(255),
	description text
);

create table people
(
	id serial primary key,
	name varchar(255)
);

create table lecturers
(
	id serial primary key,
	person int references people(id)
);

create table users
(
	id serial primary key,
	person int references people(id),
	username varchar(255),
	nickname varchar(255)
);

create table offerings
(
	id serial primary key,
	course int references courses(id),
	lecturer int references lecturers(id),
	year int,
	semester int
);

create table reviews
(
	id serial primary key,
	offering int references offerings(id),
	rating int,
	feedback text
);
