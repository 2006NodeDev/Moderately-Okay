import { modokayClient } from "."



export const findShopByArtistService = async (userId:number) =>{

    try{
        let response = await modokayClient.get(`/shops/artist/${userId}`)
        return response.data
    } catch(e){
        console.log(e);
        console.log(`There has been an error`);
    }
}