import React, { FunctionComponent, useEffect, useState } from 'react'
import { User } from '../../models/User'
import {UserDisplayComponent} from '../UserDisplayComponent/UserDisplayComponent'
import { getAllArtistsService } from '../../remote/moderatelyokay-api/moderatelyokaygetallartists'


export const AllArtistsComponent:FunctionComponent<any> = (props) => {

    let [allArtists, changeAllArtists] = useState<User[]>([])
    useEffect(()=>{
        const getArtists = async ()=>{
            let response = await getAllArtistsService()
            changeAllArtists(response)
        }

        if(allArtists.length === 0){
            getArtists()
        }
    })


    let userDisplays = allArtists.map((user)=>{
        return <UserDisplayComponent key={'user-key-' + user.userId} user={user}/>
    })

    return(
        <div>
            {userDisplays}
        </div>
    )
}