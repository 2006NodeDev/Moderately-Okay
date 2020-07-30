import { getAllUsers, findUserById, submitNewUser, UpdateExistingUser } from "../daos/SQL/user-dao";
import { Users } from "../models/Users";
import { SaveProfilePicture } from "../daos/CloudStorage/booking-images";
import { bucketBaseUrl } from "../daos/CloudStorage";
import { Bookings } from "../models/Bookings";
import { getAllBookings, findBookingByUser, updateExistingBooking } from "../daos/SQL/booking-dao";

// this call dao

export async function getAllBookingsService():Promise<Bookings[]>{
    return await getAllBookings()
}

export async function findBookingByUserService(userId:number):Promise<Bookings>{
    return await findBookingByUser(userId)
}

// will work on in later feel free to comment out this method if you need to 
export async function SubmitNewBookingService(newBooking:Bookings):Promise<Bookings>{
    
    try{
        let base64Image = newBooking.image
        let [dataType, imageBase64Data] = base64Image.split(';base64,')
        let contentType = dataType.split('/').pop()
        if (newBooking.image) {
            newBooking.image = `${bucketBaseUrl}/users/${newBooking.username}/profile.${contentType}`
        }
        let savedUser =  await submitNewUser(newBooking)
        await SaveProfilePicture(contentType, imageBase64Data, `users/${newBooking.username}/profile.${contentType}`)
        return savedUser
    }catch (e){
        console.log(e)
        throw e 
    }
    
}

export async function UpdateExistingBookingService(booking:Bookings):Promise<Users>{
    return await updateExistingBooking(booking)
}