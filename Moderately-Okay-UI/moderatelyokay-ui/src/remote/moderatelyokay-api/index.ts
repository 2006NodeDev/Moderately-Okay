import axios from 'axios'


export const modokayClient = axios.create({
    baseURL: 'http://localhost:2006' || 'http://localhost:2013',
    headers:{
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer '
    }
})