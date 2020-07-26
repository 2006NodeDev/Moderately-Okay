create schema tattoobooking_user_service; 
set schema 'tattoobooking_user_service';


create table roles(
	role_id serial primary key,
	"role" text not null
);


create table users(
	user_id serial primary key,
	username text not null unique,
	"password" text not null,
	first_name text not null,
	last_name text not null,
	birthday date not null,
	phone_number text,
	email text not null,
	"role" int references roles("role_id")
);

insert into roles ("role") values
('admin'),
('customer'),
('artist');


insert into users ("username", "password", "first_name", "last_name", "birthday", "phone_number", "email", "role")
values ('csimper3', 'f00f1ghters', 'Cassius', 'Simper', '2/19/1992', '985-170-6499', 'csimper3@walk.com', 1),
('oryland4', 'w33z3r', 'Odette', 'Ryland', '1/13/1999', '977-833-8510', 'oryland4@undone.com', 2),
('c.turpin', 'g33k', 'Cale', 'Turpen', '10/8/1976', '625-519-2240', 'cale.turpen@geekink.com', 3),
('blazeortiz', 'bl4z3!', 'Johnny', 'Ortiz', '6/20/1980', '606-676-1758', 'johnny@inklahoma.com', 3),
('BIGG', 'laz@r3tto', 'Chris', 'Munoz', '4/30/1982', '273-801-0707', 'bigg@niteowl.com', 3),
('Caroline_Divine', 'sp00kycuTe', 'Caroline', 'Fedelle', '1/4/1992', '685-710-2144', 'carolinedivine@tattoo.com', 3),
('afratbrother11', 'pass1234$', 'Alethea', 'Farbrother', '2/14/1976', '260-999-5395', 'afarbrother3@patch.com', 2),
('ahuckstepp', 'c00k14s', 'Allen', 'Huckstepp', '8/26/2001', '520-469-2513', 'ahuckstepp@university.edu', 2),
('jhosten2', 'b1@ckCan4ry', 'Joey', 'Hosten', '7/18/1997', '575-642-3661', 'jhosten2@cbc.ca', 2)