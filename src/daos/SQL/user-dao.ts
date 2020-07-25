import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { UsersDTOtoUsersConvertor } from "../../utils/UsersDTOConvertors";
import { UserNotFound } from "../../errors/UserNotFoundError";
import { Users } from "../../models/Users";
import { AuthFailureError } from "../../errors/AuthFailureError";
import { UserMissingInputError } from "../../errors/UserMissingInputError";



//Promise is representation of a future value of an error
export async function getAllUsers():Promise<Users[]>{
    let client: PoolClient;
    try {
        client = await connectionPool.connect()
        let getAllUsers:QueryResult = await client.query(`select u.user_id, 
        u.username,  
        u."password", u.first_name, 
        u.last_name, u.email, u.image,
        r."role" , r.role_id
        from employee_data.users u  left join employee_data.roles r on u."role" = r.role_id;`)
        return getAllUsers.rows.map(UsersDTOtoUsersConvertor)
    } catch (error) {
        console.error();
        throw new Error('un implemented error')
    }finally{
        //  && guard operator we are making sure that client is exist then we release
        client && client.release()
    }
}



export async function findUserById(id:number):Promise<Users>{
    let client: PoolClient;
    try {
        client = await connectionPool.connect()
        let getUserById:QueryResult = await client.query(`select u.username,  
        u."password", u.first_name, 
        u.last_name, u.email, u.image,
        r."role" , r.role_id
        from employee_data.users u  left join employee_data.roles r on u."role" = r.role_id 
        where u.user_id = $1;`, [id])
        if(getUserById.rowCount === 0){
            throw new Error('User not found')
        }else{
            // because there will be one object
            return UsersDTOtoUsersConvertor(getUserById.rows[0])
        }
    } catch (error) {
        if(error.message === 'User not found'){
            throw new UserNotFound();
        }
        console.error();
        throw new Error('un implemented error')
    }finally{
        //  && guard operator we are making sure that client is exist then we release
        client && client.release()
    }
}

export async function getUserByusernameAndPassword(username, password):Promise<Users>{
    let client: PoolClient;
    try {
        client = await connectionPool.connect()
        let getUserById:QueryResult = await client.query(`select u.user_id, u.username,  
        u."password", u.first_name, 
        u.last_name, u.email, u.image,
        r."role" , r.role_id
        from employee_data.users u  left join employee_data.roles r on u."role" = r.role_id 
        where u.username = $1 and u.password = $2;`, [username, password])
        if(getUserById.rowCount === 0){
            throw new Error('User not found')
        }else{
            // because there will be one object
            return UsersDTOtoUsersConvertor(getUserById.rows[0])
        }
    } catch (error) {
        if(error.message === 'User not found'){
            throw new AuthFailureError()
        }
        console.error();
        throw new Error('un implemented error')
    }finally{
        //  && guard operator we are making sure that client is exist then we release
        client && client.release()
    }
}


export async function UpdateOnExistingUser(updatedUser:Users):Promise<Users>{
    let client : PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')
        if(updatedUser.username){
            await client.query('update employee_data.users set username = $1 where user_id = $2;', [updatedUser.username, updatedUser.user_id])
        }
        if(updatedUser.password){
            await client.query('update employee_data.users set password = $1 where user_id = $2;', [updatedUser.password, updatedUser.user_id])
        }
        if(updatedUser.first_name){
            await client.query('update employee_data.users set first_name = $1 where user_id = $2;', [updatedUser.first_name, updatedUser.user_id])
        }
        if(updatedUser.last_name){
            await client.query('update employee_data.users set last_name= $1 where user_id = $2;', [updatedUser.last_name, updatedUser.user_id])
        }
        if(updatedUser.email){
            await client.query('update employee_data.users set email = $1 where user_id = $2;', [updatedUser.email , updatedUser.user_id])
        }
        if(updatedUser.email){
            await client.query('update employee_data.users set image = $1 where user_id = $2;', [updatedUser.image , updatedUser.user_id])
        }
        if(updatedUser.role ){
          let role_id =   await client.query('select r.role_id from employee_data.roles r  where r.role = $1;', [updatedUser.role])
          if(role_id.rowCount === 0){
              throw new Error ('Role not found')
          }
          role_id = role_id.rows[0].role_id
          await client.query('update employee_data.users set "role"= $1 where user_id = $2;', [role_id, updatedUser.user_id])
        }
        await client.query('COMMIT;') 
        return findUserById(updatedUser.user_id)

    } catch (error) {
        client && client.query('ROLLBACK;') // if any error occurs send it back
        if(error.message === 'Role not found'){
            throw new Error('Role not found')
        }
        console.log(error);
        throw new Error ('Unhandled Error')
    }finally{
        client && client.release();
    }
}

export async function submitNewUser(newUser: Users):Promise<Users>{
    let client: PoolClient 
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')

        let role_id = await client.query(`select r.role_id from employee_data.roles r where r."role" = $1;`, [newUser.role])
            if(role_id.rowCount === 0){
                throw new Error('Role not found')
            } 

            role_id = role_id.rows[0].role_id
            
        let newuserinfo = await client.query(`insert into employee_data.users("username", 
            "password",
            "first_name",
            "last_name",
            "email", "image", "role") values ($1, $2, $3, $4, $5, $6, $7) returning "user_id" `, 
            [newUser.username, newUser.password, newUser.first_name, newUser.last_name, newUser.email, newUser.image, role_id])
            newUser.user_id = (await newuserinfo).rows[0].user_id
            await client.query('COMMIT;')
            return newUser

    } catch (error) {
        client && client.query('ROLLBACK;')
        if(error.message === 'Role not found') {
            throw new UserMissingInputError
        }
        console.log(error)
        throw new Error('un implemented error handling')
    }finally {
        client && client.release();
    }
}


            
