import { getAllUsers, findUserById, submitNewUser, UpdateExistingUser } from "../daos/SQL/user-dao";
import { Users } from "../models/Users";

// this call dao

export async function getAllUsersService():Promise<Users[]>{
    return await getAllUsers()
}

export async function findUserByIdService(id:number):Promise<Users>{
    return await findUserById(id)
}

export async function SubmitNewUserService(newUser:Users):Promise<Users>{
    return await submitNewUser(newUser)
    
}

export async function UpdateExistingUserService(user:Users):Promise<Users>{
    return await UpdateExistingUser(user)
}