import React, { FunctionComponent, useState, useEffect } from 'react'
import { Bookings } from '../../models/Bookings'
import { findBookingByUserId } from '../../remote/moderatelyokay-api/moderatelyokaygetbookingbyuser'
import { BookingDisplayComponent } from '../BookingDisplayComponent/BookingDisplayComponent'

//double check me on this one for sure
export const GetBookingByUserComponent:FunctionComponent<any> = (props) => {

    let [bookingByUser, changeBookingByUser] = useState<Bookings[]>([])

    useEffect(()=>{
        const getBookingByUser = async ()=>{
            let response = await findBookingByUserId(props)
            changeBookingByUser(response)
        }


        if(bookingByUser.length === 0){
            getBookingByUser()
        }
    })


    let bookingByUserDisplays = bookingByUser.map((booking)=>{
        return <BookingDisplayComponent key={'booking-key-' + booking.bookingId} booking={booking}/>
    })
    return(

        <div>
            {bookingByUserDisplays}
        </div>
    )
}