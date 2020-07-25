

export class Users{
  	user_id: number // primary key
	username: string // not null, unique
	password: string // not null
	first_name: string // not null
	last_name: string // not null
	email: string // not null
	role: string// not null
	image?: string
}
