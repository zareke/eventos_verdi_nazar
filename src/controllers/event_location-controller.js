import  Express  from "express";
import EventLocation from "../service/event_location-service.js";
import Middleware from "../../middleware.js";
import Event_location from "../models/event_location.js";
const eventLocationController=Express.Router()
const middleware = new Middleware()
const eventLocationService = new EventLocation()


eventLocationController.get("/",middleware.userMiddleware,  async (req,res) =>{
    const pageSize=4
    const page=0

    if (req.query.page !== null && req.query.page !== undefined) {
        page = parseInt(req.query.page) - 1;
    }

    let allEvLocations=await eventLocationService.getAllEventLocations(pageSize,page)
    return res.status(200).json(allEvLocations)
})

eventLocationController.get("/:id",middleware.userMiddleware,async (req,res)=>{
    let idEventLocation = req.params.id
    let idUser=req.id

    let eventlocation=await eventLocationService.getEventLocationById(idUser,idEventLocation)
    if (eventlocation.rowCount<1){
        return res.status(404).json("Event location no encontrada")
    }
    else{
        return res.status(200).json(eventlocation.rows)
    }
})

eventLocationController.post("/",middleware.userMiddleware,async (req,res) =>{
    /*body should look asi:
        "id_location": 1,
        "name": "River",
        "full_address": "Av. Pres. Figueroa Alcorta 7597",
        "max_capacity" : "84567",
        "latitude": "-34.5453",
        "longitude" : "-58.4498"
    */
    let error = false
    
    const id_location = Number(req.body.id_location)

    error = !(await eventLocationService.locationExists(id_location))

    const name = req.body.name
    const address = req.body.full_address
    error = name.length<3 || address.length<3

    const maxCapacity = Number(req.body.max_capacity)
    const latitude = Number(req.body.latitude)
    const longitude = Number(req.body.longitude)
    const idCreatorUser=req.id
    

    if (error){
        return res.status(400).json("Datos no validos")
    }
    else{
        const eventlocation = new Event_location
        eventlocation.id_location=id_location
        eventlocation.name=name
        eventlocation.full_address=address
        eventlocation.max_capacity=maxCapacity
        eventlocation.latitude=latitude
        eventlocation.longitude=longitude
        eventlocation.id_creator_user=idCreatorUser

        await eventLocationService.newEventLocation(eventlocation)
        return res.status(201).json("Event location creado")
    }



})
eventLocationController.delete("/:id",middleware.userMiddleware,async (req, res) => {
    const idEvLoc = req.params.id
    const idUser = req.id

    let result = await eventLocationService.deleteEventLocation(idEvLoc,idUser)
    if(result.rowCount<1){
        return res.status(404).json("Event location no encontrado")
    }
    else{
        return res.status(200).json("Event location eliminado correctamente")
    }
})


export default eventLocationController