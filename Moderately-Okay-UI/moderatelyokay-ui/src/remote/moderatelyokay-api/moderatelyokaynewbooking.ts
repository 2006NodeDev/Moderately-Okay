import {modokayClient} from '.'
import {Bookings} from '../../models/Bookings'


export const modokaysignup = async (newBookings:Bookings) => {
 
    try{
        let response = await modokayClient.post('/bookings', newBookings)
        console.log(response)
    }catch(e){

    }
     
}