import React, { FunctionComponent, useState, useEffect } from 'react'
import { Shop } from '../../models/Shops'
import {ShopDisplayComponent} from '../ShopDisplayComponent/ShopDisplayComponent'
import { getAllShops } from '../../remote/moderatelyokay-api/moderatelyokaygetallshops'


export const GetAllShopsComponent:FunctionComponent<any> = (props) => {

 
    let [allShops, changeAllShops] = useState<Shop[]>([])
    useEffect(()=>{
        const getShops = async ()=>{
            let response = await getAllShops()
            changeAllShops(response)
        }

        if(allShops.length === 0){
            getShops()
        }
    })

    let getAllShopsDisplay = allShops.map((shop)=>{
        return <ShopDisplayComponent key={'shop-key-' + shop.shopId} shop={shop}/>
    })
    return(

        <div>
            {getAllShopsDisplay}
        </div>
    )
}

//let distance = require('google-distance-matrix');

//var origins