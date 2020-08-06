import {modokayClient} from '.'
import {User} from '../../models/User'

export const modokaysignup = async (newUser:User) => {
 
    try{
        let response = await modokayClient.post('/users', newUser)
        console.log(response);
        return response.data
    }catch(e){
        console.log(e);
        console.log('There has been an error');
    }
     
}