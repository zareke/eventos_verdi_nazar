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

    if(Number(res.locals.pagination.page)*Number(res.locals.pagination.limit)>=total){
        res.locals.pagination.nextPage=null 
      }

    const response = {
        collection:allEvLocations.rows,
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
   

   try{
       const eventlocation = new Event_location
    
    eventlocation.id_location = Number(req.body.id_location)

    if(!(await eventLocationService.locationExists(id_location)))
        throw new error ("Datos no validos")

    eventlocation.name = req.body.name
    eventlocation.full_address = req.body.full_address
    if (eventlocation.name.length<3 || eventlocation.full_address.length<3)
        throw new error ("Datos no validos")

    eventlocation.max_capacity = Number(req.body.max_capacity)
    if(eventlocation.max_capacity <=0)
        throw new error("Datos no validos")
    eventlocation.latitude = Number(req.body.latitude)
    eventlocation.longitude = Number(req.body.longitude)
    eventlocation.id_creator_user=req.id
    
        await eventLocationService.newEventLocation(eventlocation)
        return res.status(201).json("Event location creado")
   }
    catch (error){
        return res.status(400).json("Datos no validos")
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

    try{
    const eventlocation = new Event_location
        eventlocation.id=req.body.id_event_location
        eventlocation.id_location=req.body.id_location
        eventlocation.name=req.body.name
        eventlocation.full_address=req.body.address
        eventlocation.max_capacity=req.body.maxCapacity
        eventlocation.latitude=req.body.latitude
        eventlocation.longitude=req.body.longitude
        eventlocation.id_creator_user=req.body.idCreatorUser
        
        
        if (!(await eventLocationService.locationExists(id_location)))
            throw new Error("Datos no validos")
        if ( eventlocation.name.length<3 || eventlocation.address.length<3)
            throw new Error ("Datos no validos")
        if(maxCapacity <=0)
            throw new Error("Datos no validos")

        if(!(eventLocationService.eventLocationExists(id_event_location)) || !(eventLocationService.isCreatorUser(idCreatorUser,id_event_location))){
            return res.status(404).json("Localidad no encontrada. Verifique que es el usuario creador y haya iniciado correctamente el ID de la localidad")
        }
        else{
            
            await eventLocationService.updateEventLocation(eventlocation)
            return res.status(200).json("Registro actualizado")
        }
    }
    catch (error){
        return res.status(400).json("Datos no validos")
    }

})


export default eventLocationController