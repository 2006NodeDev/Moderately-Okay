import React, { FunctionComponent, SyntheticEvent, useState } from 'react'
import { Button, TextField } from '@material-ui/core'
import {Bookings} from '../../models/Bookings'
import { addNewBooking } from '../../remote/moderatelyokay-api/moderatelyokayaddnewbooking'

//definitely need to test this one later, I'm not sure if it works
//test after Maricruz gives the go ahead.

export const AddNewBookingComponent: FunctionComponent<any> = () => {
    let [customer, changeCustomer] = useState(0)
    let [style, changeStyle] = useState(0)
    let [size, changeSize] = useState('')
    let [location, changeLocation] = useState('')
    let [imageTest, changeImageTest] = useState('')
    let [color, changeColor] = useState(false)
    let [artist, changeArtist] = useState(0)
    let [shop, changeShop] = useState(0)
    let [date, changeDate] = useState(0)


    const updateCustomer = (e:any) => {
        e.preventDefault()
        changeCustomer(e.currentTarget.value)
    }
    const updateStyle = (e:any) => {
        e.preventDefault()
        changeStyle(e.currentTarget.value)
    }
    const updateSize = (e:any) => {
        e.preventDefault()
        changeSize(e.currentTarget.value)
    }
    const updateLocation = (e:any) => {
        e.preventDefault()
        changeLocation(e.currentTarget.value)
    }
    const updateImageTest = (e:any) => {
        e.preventDefault()
        changeImageTest(e.currentTarget.value)
    }
    const updateColor = (e:any) => {
        e.preventDefault()
        changeColor(e.currentTarget.value)
    }
    const updateArtist = (e:any) => {
        e.preventDefault()
        changeArtist(e.currentTarget.value)
    }
    const updateShop = (e:any) => {
        e.preventDefault()
        changeShop(e.currentTarget.value)
    }
    const updateDate = (e:any) => {
        e.preventDefault()
        changeDate(e.currentTarget.value)
    }

    const submitBooking = async (e: SyntheticEvent) => {
            let newBooking:Bookings = {
                bookingId:0,
                customer,
                style,
                size,
                location,
                imageTest,
                color,
                artist,
                shop,
                date
            }
    
            let res = await addNewBooking(newBooking)
        }   

//check this, I don't know if it's right
//customer, artist not null
//everything else is optional
//Customer, Style, Artist, Shop are all ID, Maybe do a drop down menu so they don't have to know the # ?
    return (
        <div>
            <form onSubmit={submitBooking}>
                <TextField id="standard-basic" label="Customer" value={customer} onChange={updateCustomer} />
                <TextField id="standard-basic" label="Style" value={style || 0} onChange={updateStyle} />
                <TextField id="standard-basic" label="Size" value={size || ''} onChange={updateSize} />
                <TextField id="standard-basic" label="Location" value={location || ''} onChange={updateLocation}/>
                <TextField id="standard-basic" label="Image" value={imageTest || ''} onChange={updateImageTest}/>
                <TextField id="standard-basic" label="Color" value={color || false} onChange={updateColor}/>
                <TextField id="standard-basic" label="Artist" value={artist} onChange={updateArtist}/>
                <TextField id="standard-basic" label="Shop" value={shop || 0} onChange={updateShop}/>
                <TextField id="standard-basic" label="Date" value={date || 0} onChange={updateDate}/>
                <Button variant="contained" type='submit'>Submit</Button>
            </form>
        </div>
    )
}