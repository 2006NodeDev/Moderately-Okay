import {modokayClient} from '.'
export const modokaylogin = async (username:string, password:string) => {
    let credentials = {
        username,
        password
    }
    try{
        let response = await modokayClient.post('/login', credentials)
        console.log(response)
        return response.data //should be the user object
    }catch(e){
        console.log(e)
        //should return an error
    }
     
}