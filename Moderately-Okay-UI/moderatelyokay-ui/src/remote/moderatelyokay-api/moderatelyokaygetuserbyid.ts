import { modokayClient } from "."



export const findUserByIdService = async (userId:number) =>{

    try{
        let response = await modokayClient.get(`users/${userId}`)
        return response.data
    } catch(e){
        console.log(e);
        console.log(`There has been an error`);
    }
}