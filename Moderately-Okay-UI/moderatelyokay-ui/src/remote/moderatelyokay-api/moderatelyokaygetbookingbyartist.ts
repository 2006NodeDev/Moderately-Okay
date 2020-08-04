import { modokayClient } from "."



export const findBookingByArtistService = async (userId:number) =>{

    try{
        let response = await modokayClient.get(`/artist/${userId}`)
        return response.data
    } catch(e){
        console.log(e);
        console.log(`There has been an error`);
    }
}