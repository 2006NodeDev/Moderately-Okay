import { Users } from "../models/Users";
import { UsersDTO } from "../dtos/user-dto";


export function UsersDTOtoUsersConvertor(udto:UsersDTO) : Users{
    return{
        user_id: udto.user_id,
        username: udto.username,
        password: udto.password,
        first_name: udto.first_name,
        last_name: udto.last_name,
        email: udto.email,
        role: udto.role,
        image: udto.image
    }
}

