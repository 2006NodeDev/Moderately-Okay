import React, { FunctionComponent, useEffect, useState } from 'react'
import { findUserByIdService } from '../../remote/moderatelyokay-api/moderatelyokaygetuserbyid'
import { User } from '../../models/User'
import { UserDisplayComponent } from '../UserDisplayComponent/UserDisplayComponent'



export const GetUserByIdComponent:FunctionComponent<any> = (props) => {

 
    let [userById, changeUserById] = useState<User[]>([])

    useEffect(()=>{
        const getUserByID = async ()=>{
            let response = await findUserByIdService(props)
            changeUserById(response)
        }


        if(userById.length === 0){
            getUserByID()
        }
    })


    let userByIdDisplays = userById.map((user)=>{
        return <UserDisplayComponent key={'user-key-' + user.userId} user={user}/>
    })
    return(

        <div>
            {userByIdDisplays}
        </div>
    )
}