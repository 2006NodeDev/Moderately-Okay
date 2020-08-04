
import { SaveTattooImage } from "../daos/CloudStorage/booking-images";
import { bucketBaseUrl } from "../daos/CloudStorage";
import { Bookings } from "../models/Bookings";
import { getAllBookings, updateExistingBooking, submitNewBooking, findBookingByBookingId, findBookingByCustomer, findBookingByArtistId, findShopByArtist } from "../daos/SQL/booking-dao";

// this call dao

export async function getAllBookingsService():Promise<Bookings[]>{
    return await getAllBookings()
}

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
            newBooking.imageTest = `${bucketBaseUrl}/users/${newBooking.customer}/tattoo.${contentType}`
        }
        let savedBooking =  await submitNewBooking(newBooking)
        await SaveTattooImage(contentType, imageBase64Data, `users/${newBooking.customer}/tattoo.${contentType}`)
        return savedBooking
    }catch (e){
        console.log(e)
        throw e 
    } 
}

export async function UpdateExistingBookingService(booking:Bookings):Promise<Bookings>{
    return await updateExistingBooking(booking)
}

export async function findBookingByBookingIdService(id: number):Promise<Bookings>{
    return await findBookingByBookingId(id)
}

export async function findBookingByArtistIdService(userId:number):Promise<Bookings>{
    return await findBookingByArtistId(userId)
}

export async function findShopByArtistService(userId:number):Promise<Bookings>{
    return await findShopByArtist(userId)
}