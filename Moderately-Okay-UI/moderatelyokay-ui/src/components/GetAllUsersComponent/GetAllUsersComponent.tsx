import React, { FunctionComponent, useEffect, useState } from 'react'
import { User } from '../../models/User'
import { getAllUsers } from '../../remote/moderatelyokay-api/moderatelyokaygetallusers'
import {UserDisplayComponent} from '../UserDisplayComponent/UserDisplayComponent'


export const AllUsersComponent:FunctionComponent<any> = (props) => {

    let [allUsers, changeAllUsers] = useState<User[]>([])
    useEffect(()=>{
        const getUsers = async ()=>{
            let response = await getAllUsers()
            changeAllUsers(response)
        }

        if(allUsers.length === 0){
            getUsers()
        }
    })


    let userDisplays = allUsers.map((user)=>{
        return <UserDisplayComponent key={'user-key-' + user.userId} user={user}/>
    })

    return(
        <div>
            {userDisplays}
        </div>
    )
}