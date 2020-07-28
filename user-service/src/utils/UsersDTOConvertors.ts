import { Users } from "../models/Users";
import { UsersDTO } from "../dtos/user-dto";

//updated for proj2
export function UsersDTOtoUsersConvertor(udto:UsersDTO) : Users{
    return{
        user_id: udto.user_id,
        username: udto.username,
        password: udto.password,
        first_name: udto.first_name,
        last_name: udto.last_name,
        birthday: udto.birthday,
        phone_number: udto.phone_number,
        email: udto.email,
        role: udto.role,

    }
}

