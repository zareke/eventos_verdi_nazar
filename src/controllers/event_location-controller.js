import  Express  from "express";
import EventLocation from "../service/event_location-service.js";
import Middleware from "../../middleware.js";
import Event_location from "../models/event_location.js";
const eventLocationController=Express.Router()
const middleware = new Middleware()
const eventLocationService = new EventLocation()



eventLocationController.get("/",middleware.pagination,middleware.userMiddleware,  async (req,res) =>{
    const pageSize = req.limit
    const page = req.offset

    let [allEvLocations,total] = await eventLocationService.getAllEventLocations(pageSize,page,req.id)

    res.locals.pagination.total=total


    if(res.locals.pagination.offset*res.locals.pagination.limit>=total){
        res.locals.pagination.nextPage=null
    }

    const response = {
        categories:allEvLocations.rows,
        pagination:res.locals.pagination
    }

    return res.status(200).json(response)
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
    error = name.length<3 || address.length<3 || error

    const maxCapacity = Number(req.body.max_capacity)
    error = maxCapacity <=0 || error
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
eventLocationController.put("/",middleware.userMiddleware,async (req,res) =>{
    // same body as post pero con el id_event_location tambien. el usuario creator id digamos deberia ser el mismo q en el regsitro 
    
    let error = false

    const id_location = Number(req.body.id_location)

    
    const name = req.body.name
    const address = req.body.full_address
    
    const maxCapacity = Number(req.body.max_capacity)
    const latitude = Number(req.body.latitude)
    const longitude = Number(req.body.longitude)
    const idCreatorUser=req.id
    
    
    error =!(await eventLocationService.locationExists(id_location))
    error = name.length<3 || address.length<3 || error
    error = maxCapacity <=0 || error
    if (error){
        return res.status(400).json("Datos no validos")
    }
    const id_event_location = req.body.id_event_location
    if(!(eventLocationService.eventLocationExists(id_event_location)) || !(eventLocationService.isCreatorUser(idCreatorUser,id_event_location))){
        return res.status(404).json("Localidad no encontrada. Verifique que es el usuario creador y haya iniciado correctamente el ID de la localidad")
    }
    else{
        const eventlocation = new Event_location
        eventlocation.id=id_event_location
        eventlocation.id_location=id_location
        eventlocation.name=name
        eventlocation.full_address=address
        eventlocation.max_capacity=maxCapacity
        eventlocation.latitude=latitude
        eventlocation.longitude=longitude
        eventlocation.id_creator_user=idCreatorUser
        await eventLocationService.updateEventLocation(eventlocation)
        return res.status(200).json("Registro actualizado")
    }

})


export default eventLocationController