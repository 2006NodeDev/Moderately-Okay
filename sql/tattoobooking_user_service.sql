create schema tattoobooking_user_service; 
set schema 'tattoobooking_user_service';

create table users(
	user_id serial primary key,
	first_name text not null,
	last_name text not null,
	birthday date not null,
	phone_number text,
	email text
);


