import React, { FunctionComponent, useState, useEffect } from 'react'
import { Bookings } from '../../models/Bookings'
import { findBookingByArtistService } from '../../remote/moderatelyokay-api/moderatelyokaygetbookingbyartist'
import { BookingDisplayComponent } from '../BookingDisplayComponent/BookingDisplayComponent'



export const GetBookingByArtistComponent:FunctionComponent<any> = (props) => {

 
    let [bookingByArtist, changeBookingByArtist] = useState<Bookings[]>([])

    useEffect(()=>{
        const getBookingByArtist = async ()=>{
            let response = await findBookingByArtistService(props)
            changeBookingByArtist(response)
        }


        if(bookingByArtist.length === 0){
            getBookingByArtist()
        }
    })


    let bookingByArtistDisplays = bookingByArtist.map((booking)=>{
        return <BookingDisplayComponent key={'booking-key-' + booking.bookingId} booking={booking}/>
    })
    return(

        <div>
            {bookingByArtistDisplays}
        </div>
    )
}