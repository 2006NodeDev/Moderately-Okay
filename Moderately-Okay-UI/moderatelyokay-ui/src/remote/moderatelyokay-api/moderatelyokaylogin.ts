import {modokayClient} from '.'
export const modokaylogin = async (username:string, password:string) => {
    let credentials = {
        username,
        password
    }
    try{
        let response = await modokayClient.post('/login', credentials)
        console.log(response);
        // for token 
        modokayClient.defaults.headers.common['Authorization'] = response.headers.authorization
        document.cookie = `token=${response.headers.authorization}` // we store token 
        return response.data //should be the user object
    }catch(e){
        console.log(e)
        //should return an error
    }
     
}