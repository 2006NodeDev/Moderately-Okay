import { modokayClient} from ".";
import { Users } from "../../models/Users"



export const modOkayUpdateUser = async (updatedUser:Users) =>{
    try{
        console.log(updatedUser);
        let response = await modokayClient.patch('/users', updatedUser)
        console.log(response);
        return response.data
    }catch(e){
        console.log(e);
        console.log('There has been an error');
    }
}