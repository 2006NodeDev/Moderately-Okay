import React, { FunctionComponent, SyntheticEvent, useState } from 'react'
import { Button, TextField, makeStyles, Theme, createStyles} from '@material-ui/core'
import { Bookings } from '../../models/Bookings'
import { addNewBooking } from '../../remote/moderatelyokay-api/moderatelyokayaddnewbooking'


const styles = [
    {
        value: '1',
        label: 'Neo-traditional',
    },
    {
        value: '2',
        label: 'Traditional',
    },
    {
        value: '3',
        label: 'Modern',
    },
    {
        value: '4',
        label: 'Tribal',
    },
    {
        value: '5',
        label: 'New School',
    },
    {
        value: '6',
        label: 'Japanese',
    },
    {
        value: '7',
        label: 'Blackwork',
    },
    {
        value: '8',
        label: 'Illustrative',
    },
    {
        value: '9',
        label: 'Watercolor',
    },
    {
        value: '10',
        label: 'Tribal',
    },
    {
        value: '11',
        label: 'Other',
    },
];

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& .MuiTextField-root': {
                margin: theme.spacing(1),
                width: '25ch',
            },
        },
    }),
);

export const AddNewBookingComponent: FunctionComponent<any> = () => {

    const classes = useStyles;

    let [customer, changeCustomer] = useState(0)
    let [style, changeStyle] = useState(0)
    let [size, changeSize] = useState('')
    let [location, changeLocation] = useState('')
    let [imageTest, changeImageTest] = useState('')
    let [color, changeColor] = useState(false)
    let [artist, changeArtist] = useState(0)
    let [shop, changeShop] = useState(0)
    let [date, changeDate] = useState(0)


    const updateCustomer = (e: any) => {
        e.preventDefault()
        changeCustomer(e.currentTarget.value)
    }
    const updateStyle = (e: any) => {
        e.preventDefault()
        changeStyle(e.currentTarget.value)
    }
    const updateSize = (e: any) => {
        e.preventDefault()
        changeSize(e.currentTarget.value)
    }
    const updateLocation = (e: any) => {
        e.preventDefault()
        changeLocation(e.currentTarget.value)
    }
    const updateImageTest = (e: any) => {
        e.preventDefault()
        changeImageTest(e.currentTarget.value)
    }
    const updateColor = (e: any) => {
        e.preventDefault()
        changeColor(e.currentTarget.value)
    }
    const updateArtist = (e: any) => {
        e.preventDefault()
        changeArtist(e.currentTarget.value)
    }
    const updateShop = (e: any) => {
        e.preventDefault()
        changeShop(e.currentTarget.value)
    }
    const updateDate = (e: any) => {
        e.preventDefault()
        changeDate(e.currentTarget.value)
    }

    const submitBooking = async (e: SyntheticEvent) => {
        let newBooking: Bookings = {
            bookingId: 0,
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
                <TextField
                    id="outlined-select-currency-native"
                    select
                    label="Style"
                    value={style}
                    onChange={updateStyle}
                    SelectProps={{
                        native: true,
                    }}
                    helperText="Please select your style"
                    variant="outlined"
                >
                    {styles.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </TextField>
                <TextField id="standard-basic" label="Size" value={size || ''} onChange={updateSize} />
                <TextField id="standard-basic" label="Location" value={location || ''} onChange={updateLocation} />
                <TextField id="standard-basic" label="Image" value={imageTest || ''} onChange={updateImageTest} />
                <TextField id="standard-basic" label="Color" value={color || false} onChange={updateColor} />
                <TextField id="standard-basic" label="Artist" value={artist} onChange={updateArtist} />
                <TextField id="standard-basic" label="Shop" value={shop || 0} onChange={updateShop} />
                <TextField id="standard-basic" label="Date" value={date || 0} onChange={updateDate} />
                <Button variant="contained" type='submit'>Submit</Button>
            </form>
        </div>
    )
}



