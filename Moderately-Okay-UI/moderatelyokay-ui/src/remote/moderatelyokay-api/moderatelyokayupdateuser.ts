import { modokayClient} from ".";
import { User } from "../../models/User"



export const modOkayUpdateUser = async (updatedUser:User) =>{
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