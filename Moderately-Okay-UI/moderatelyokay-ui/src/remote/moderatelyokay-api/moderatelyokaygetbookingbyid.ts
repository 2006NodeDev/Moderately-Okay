import { modokayClient } from "."



export const findBookingByIdService = async (bookingId:number) =>{

    try{
        let response = await modokayClient.get(`bookings/${bookingId}`)
        return response.data
    } catch(e){
        console.log(e);
        console.log(`There has been an error`);
    }
}