
//import { SaveTattooImage } from "../daos/CloudStorage/booking-images";
//import { bucketBaseUrl } from "../daos/CloudStorage";
import { Bookings } from "../models/Bookings";
import { getAllBookings, updateExistingBooking, findBookingById, findBookingByCustomer } from "../daos/SQL/booking-dao";

// this call dao

export async function getAllBookingsService():Promise<Bookings[]>{
    return await getAllBookings()
}

//this has been fixed
export async function findBookingByCustomerService(userId:number):Promise<Bookings>{
    return await findBookingByCustomer(userId)
}

// will work on in later feel free to comment out this method if you need to 
/*export async function SubmitNewBookingService(newBooking:Bookings):Promise<Bookings>{
    
    try{
        let base64Image = newBooking.imageTest
        let [dataType, imageBase64Data] = base64Image.split(';base64,')
        let contentType = dataType.split('/').pop()
        if (newBooking.imageTest) {
            newBooking.imageTest = `${bucketBaseUrl}/users/${newBooking.customer}/profile.${contentType}`
        }
        let savedBooking =  await submitNewBooking(newBooking)
        await SaveTattooImage(contentType, imageBase64Data, `users/${newBooking.customer}/profile.${contentType}`)
        return savedBooking
    }catch (e){
        console.log(e)
        throw e 
    }
    
}*/

export async function UpdateExistingBookingService(booking:Bookings):Promise<Bookings>{
    return await updateExistingBooking(booking)
}



export async function findBookingByIdService(id: number):Promise<Bookings>{
    return await findBookingById(id)
}
