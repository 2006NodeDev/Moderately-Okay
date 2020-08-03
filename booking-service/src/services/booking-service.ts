
import { SaveTattooImage } from "../daos/CloudStorage/booking-images";
import { bucketBaseUrl } from "../daos/CloudStorage";
import { Bookings } from "../models/Bookings";
import { getAllBookings, findBookingById, findBookingByCustomer } from "../daos/SQL/booking-dao";

// this call dao

export async function getAllBookingsService():Promise<Bookings[]>{
    return await getAllBookings()
}

//this has been fixed
export async function findBookingByCustomerService(userId:number):Promise<Bookings>{
    return await findBookingByCustomer(userId)
}

// will work on in later feel free to comment out this method if you need to 
export async function SubmitNewBookingService(newBooking:Bookings):Promise<Bookings>{
    
    try{
        let base64Image = newBooking.imageTest
        let [dataType, imageBase64Data] = base64Image.split(';base64,')
        let contentType = dataType.split('/').pop()
        if (newBooking.imageTest) {
            newBooking.imageTest = `${bucketBaseUrl}/bookings/${newBooking.bookingId}/profile.${contentType}` //this might still need some changes, but I think it should work
        }
        let savedBooking =  await SubmitNewBookingService(newBooking)
        await SaveTattooImage(contentType, imageBase64Data, `bookings/${newBooking.bookingId}/profile.${contentType}`) //this might still need some changes, but I think it should work
        return savedBooking
    }catch (e){
        console.log(e)
        throw e 
    }
    
}

export async function UpdateExistingBookingService(updatedBooking:Bookings):Promise<Bookings>{
    try{
        let base64Image = updatedBooking.imageTest
        let [dataType, imageBase64Data] = base64Image.split(';base64,')
        let contentType = dataType.split('/').pop()
        if (updatedBooking.imageTest) {
            updatedBooking.imageTest = `${bucketBaseUrl}/bookings/${updatedBooking.bookingId}/profile.${contentType}` //this might still need some changes, but I think it should work
        }
        let savedBooking =  await UpdateExistingBookingService(updatedBooking)
        await SaveTattooImage(contentType, imageBase64Data, `bookings/${updatedBooking.bookingId}/profile.${contentType}`) //this might still need some changes, but I think it should work
        return savedBooking
    }catch (e){
        console.log(e)
        throw e 
    }
}



export async function findBookingByIdService(id: number):Promise<Bookings>{
    return await findBookingById(id)
}
