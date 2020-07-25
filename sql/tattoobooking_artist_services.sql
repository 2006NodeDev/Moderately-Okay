create schema tattoobooking_artist_service; 
set schema 'tattoobooking_artist_service';


create table artists(
	artist_id serial primary key,
	first_name text not null,
	last_name text not null
);

create table shops(
	shop_id serial primary key,
	shop_name text not null,
	address text not null,
	phone_number text not null,
	email text not null,
	open_at time,
	close_at time
);

create table styles(
	style_id serial primary key,
	style_name text not null
);

create table shop_artists(
	shop int references shops ("shop_id"),
	artist int references artists ("artist_id")
);

create table artist_styles(
	artist int references artists ("artist_id"),
	"style" int references styles ("style_id")
);

create table tattoo_details(
	tattoo_id serial primary key,
	"user" int references tattoobooking_user_service.users("user_id"),
	"style" int references styles ("style_id"),
	"size" text,
	"location" text,
	image text,
	color BOOLEAN,
	artist int references artists ("artist_id"),
	shop int references shops ("shop_id")
);

insert into styles ("style_name") values 
('neo-trad'),
('trad'),
('modern'),
('tribal'),
('new school'),
('Japanese'),
('blackwork'),
('illustrative'),
('watercolor'),
('realisim'),
('other');