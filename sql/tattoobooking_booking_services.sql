create schema tattoobooking_booking_service; 
set schema 'tattoobooking_booking_service';



create table shops(
	shop_id serial primary key,
	shop_name text not null,
	street_address text not null,
	city text not null,
	state text not null,
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
	artist int not null,
	primary key (shop, artist)
);

create table artist_styles(
	artist int not null,
	"style" int references styles ("style_id"),
	primary key (artist, "style")
);



create table bookings(
	booking_id serial primary key,
	customer int not null,
	"style" int references styles ("style_id"),
	"size" text,
	"location" text,
	image text,
	color BOOLEAN,
	artist int not null,
	shop int references shops ("shop_id"),
	"date" timestamp
);

insert into shops ("shop_name", "street_address", "city", "state", "phone_number", "email", "open_at", "close_at")
values ('Inklahoma Tattoo Studios', '520 North East St', 'Guymon', 'OK', '910-659-2032', 'tattoo@inklahoma.com', '10:00 AM', '8:00 PM'),
('Geek Ink Tattoo', '2225 W Washington St', 'Broken Arrow', 'OK', '574-162-1250', 'tatoo@geekink.com', '1:00 PM', '9:00 PM'),
('Nite Owl Tattoo Studio', '7121 W US Hwy 90 #230', 'San Antonio', 'TX', '957-227-8404', 'tattoo@niteowl.com', '12:00 PM', '7:00 PM'),
('Toxic Monkey Tattoo', '4735 S Memorial Dr Suite #D', 'Tulsa', 'OK', '780-499-5591', 'tattoo@toxicmonkey.com', '12:00 PM', '8:00 PM'),
('Anchor & Rose Tattoo Co.', '3204 E 11th St', 'Tulsa', 'OK', '685-780-4108', 'tattoo@anchorrose.com', '12:00 PM', '9:00 PM');


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

insert into shop_artists values
(1, 4),
(2, 3),
(3, 5),
(4, 6),
(5, 6);

insert into artist_styles values
(3, 1),
(3, 2),
(3, 5),
(3, 7),
(3, 9),
(4, 1),
(4, 6),
(4, 7),
(4, 9),
(5, 1),
(5, 3),
(5, 7),
(6, 8),
(6, 4),
(6, 9);

truncate tattoobooking_booking_service.bookings 

insert into tattoobooking_booking_service.bookings ("customer", "style", "color", "artist", "shop", "date")
values (2, 8, 'y', 6, 5, '9/26/2020 2:00 PM');

insert into tattoobooking_booking_service.bookings ("customer", "style", "size", "location", "color", "artist", "shop", "date")
values (9, 1, '5 by 5', 'arm', 'y', 5, 3, '10/5/2020 3:00 PM');

insert into tattoobooking_booking_service.bookings("customer", "style", "artist", "shop", "date")
values (7, 7, 3, 2, '11/17/2020 1:00 PM');
