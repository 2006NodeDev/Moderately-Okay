import {modokayClient} from '.'
import {Users} from '../../models/Users'
export const modokaysignup = async (newUser:Users) => {
 
    try{
        let response = await modokayClient.post('/signup', newUser)
        console.log(response)
    }catch(e){

    }
     
}