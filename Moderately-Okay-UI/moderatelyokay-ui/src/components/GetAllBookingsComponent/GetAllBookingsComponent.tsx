import React, { FunctionComponent, useState, useEffect } from 'react'
import { Bookings } from '../../models/Bookings'
import { getAllBookings } from '../../remote/moderatelyokay-api/moderatelyokaygetallbookings'
import { BookingDisplayComponent } from '../BookingDisplayComponent/BookingDisplayComponent'


export const AllBookingsComponent:FunctionComponent<any> = (props) => {

    let [allBookings, changeAllBookings] = useState<Bookings[]>([])
    useEffect(()=>{
        const getBookings = async ()=>{
            let response = await getAllBookings()
            changeAllBookings(response)
        }

        if(allBookings.length === 0){
            getBookings()
        }
    })

    let bookingDisplays = allBookings.map((booking)=>{
        return <BookingDisplayComponent key={'booking-key-' + booking.bookingId} booking={booking}/>
    })

    return(
        <div>
            {bookingDisplays}
        </div>
    )
}