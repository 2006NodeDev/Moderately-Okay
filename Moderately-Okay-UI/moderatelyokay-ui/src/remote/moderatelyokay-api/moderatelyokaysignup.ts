import {modokayClient} from '.'
import {User} from '../../models/User'
export const modokaysignup = async (newUser:User) => {
 
    try{
        let response = await modokayClient.post('/signup', newUser)
        console.log(response)
    }catch(e){

    }
     
}