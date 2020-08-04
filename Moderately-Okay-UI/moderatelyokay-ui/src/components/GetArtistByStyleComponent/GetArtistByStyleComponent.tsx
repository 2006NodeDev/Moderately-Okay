import React, { FunctionComponent, useState, useEffect } from 'react'
import { User } from '../../models/User'
import {getArtistByStyleService} from '../../remote/moderatelyokay-api/moderatelyokaygetartistbystyle'
import { UserDisplayComponent } from '../UserDisplayComponent/UserDisplayComponent'

export const GetArtistByStyleComponent:FunctionComponent<any> = (props) => {

 
    let [artistByStyle, changeArtistByStyle] = useState<User[]>([])

    useEffect(()=>{
        const findArtistByStyle = async ()=>{
            let response = await getArtistByStyleService(props)
            changeArtistByStyle(response)
        }


        if(artistByStyle.length === 0){
            findArtistByStyle()
        }
    })

//not sure if this is right
    let artistByStyleDisplays = artistByStyle.map((user)=>{
        return <UserDisplayComponent key={'user-key-' + user.userId} user={user}/>
    })
    return(

        <div>
            {artistByStyleDisplays}
        </div>
    )
}