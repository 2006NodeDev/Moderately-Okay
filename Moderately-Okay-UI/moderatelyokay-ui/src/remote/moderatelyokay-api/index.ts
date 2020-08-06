import axios from 'axios'


export const modokayClient = axios.create({
    baseURL: 'http://localhost:2006',
    headers:{
        'Content-Type': 'application/json',
    }
})