import { Express } from "express";
import EventLocation from "../service/event_location-service";
import Middleware from "../../middleware";
const eventLocationController=Express.Router()
const middleware = new Middleware()
const eventLocationService = new EventLocation()


eventLocationController.get("/",middleware.userMiddleware,  async (req,res) =>{
    
})


export default eventLocationController