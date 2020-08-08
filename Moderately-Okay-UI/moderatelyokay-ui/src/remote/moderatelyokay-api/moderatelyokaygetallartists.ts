import { modokayClient } from ".";


export const getAllArtistsService = async () =>{
    try{
        let response = await modokayClient.get('/bookings/artists')
        return response.data
    }catch(e){
        console.log(e);
        console.log('We should probably handle this');

    }
}