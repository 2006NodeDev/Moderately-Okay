import { expressEventEmitter, customExpressEvents } from ".";
import { Users } from "../models/Users";
import { userTopic } from "../messaging";


expressEventEmitter.on(customExpressEvents.NEW_USER, (newUser:Users)=>{


    setImmediate(async ()=>{
        try{
            let res = await userTopic.publishJSON(newUser)
            console.log(res);
        }catch(e){
            console.log(e)
        }
    })
})


expressEventEmitter.on(customExpressEvents.NEW_USER, (newUser:Users)=>{
   
})


expressEventEmitter.on(customExpressEvents.NEW_USER, (newUser:Users)=>{
    
})

expressEventEmitter.on(customExpressEvents.NEW_USER, (newUser:Users)=>{
    
})