import axios from 'axios'


export const modokayClient = axios.create({
    baseURL: 'http://localhost:2020',
    headers:{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '
    }
})