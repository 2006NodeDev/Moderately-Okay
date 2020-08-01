import React, { FunctionComponent, useState, useEffect } from 'react';
import { UserDisplayComponent } from '../UserDisplayComponent/UserDisplayComponent';
import { User } from '../../models/User';
import { useParams} from 'react-router-dom';
import { findUserByIdService } from '../../remote/moderatelyokay-api/moderatelyokaygetuserbyid';



export const ProfileComponent:FunctionComponent<any> =  (props)=>{
    let [userProfile, changeUserProfile] = useState<null | User>(null)
    let {userId} = useParams()
    useEffect(()=>{
        let getUser = async ()=>{
            let userInfo = await findUserByIdService(userId)
            changeUserProfile(userInfo)
        }
        if(!userProfile || userProfile.userId !== +userId){
            getUser()
        }
    })

    return (
        (userProfile)?
        <UserDisplayComponent user={userProfile} />
        :
        <div>
            <h3>User Not Found</h3>
        </div>
    )
}