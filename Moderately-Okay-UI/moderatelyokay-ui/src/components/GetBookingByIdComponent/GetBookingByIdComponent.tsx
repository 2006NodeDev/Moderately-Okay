import React, { FunctionComponent, useState, useEffect } from 'react'
import { Bookings } from '../../models/Bookings'
import {findBookingByIdService} from '../../remote/moderatelyokay-api/moderatelyokaygetbookingbyid'
import {BookingDisplayComponent} from '../BookingDisplayComponent/BookingDisplayComponent'


export const GetBookingByIdComponent:FunctionComponent<any> = (props) => {

 
    let [bookingById, changeBookingById] = useState<Bookings[]>([])

    useEffect(()=>{
        const getBookingByID = async ()=>{
            let response = await findBookingByIdService(props)
            changeBookingById(response)
        }


        if(bookingById.length === 0){
            getBookingByID()
        }
    })


    let bookingByIdDisplays = bookingById.map((booking)=>{
        return <BookingDisplayComponent key={'booking-key-' + booking.bookingId} booking={booking}/>
    })
    return(

        <div>
            {bookingByIdDisplays}
        </div>
    )
}