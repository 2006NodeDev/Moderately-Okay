import { Role } from "./Roles"

//updated to reflect proj2
export class Users{
  	user_id: number 
	username: string //not null unique
	password: string //not null
	first_name: string //not null
	last_name: string //not null
	birthday: Date //not null
	phone_number: string
	email: string //not null
	role: Role
}
