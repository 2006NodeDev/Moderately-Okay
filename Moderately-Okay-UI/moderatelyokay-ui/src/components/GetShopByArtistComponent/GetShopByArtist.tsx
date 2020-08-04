import React, { FunctionComponent, useState, useEffect } from 'react'
import { Shop } from '../../models/Shops'
import { findShopByArtistService } from '../../remote/moderatelyokay-api/moderatelyokaygetshopbyartist'
import {ShopDisplayComponent} from '../ShopDisplayComponent/ShopDisplayComponent'


export const GetShopByArtistComponent:FunctionComponent<any> = (props) => {

 
    let [shopByArtist, changeShopByArtist] = useState<Shop[]>([])

    useEffect(()=>{
        const getShopByArtist = async ()=>{
            let response = await findShopByArtistService(props)
            changeShopByArtist(response)
        }


        if(shopByArtist.length === 0){
            getShopByArtist()
        }
    })


    let shopByArtistDisplays = shopByArtist.map((shop)=>{
        return <ShopDisplayComponent key={'shop-key-' + shop.shopId} shop={shop}/>
    })
    return(

        <div>
            {shopByArtistDisplays}
        </div>
    )
}