import { modokayClient } from "."



export const getArtistByStyleService = async (id:number) =>{

    try{
        let response = await modokayClient.get(`/artist/${id}`)
        return response.data
    } catch(e){
        console.log(e);
        console.log(`There has been an error`);
    }
}