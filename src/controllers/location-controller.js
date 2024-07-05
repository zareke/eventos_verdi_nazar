import Express from "express";
import Location from '../service/location-service.js'
import Middleware from "../../middleware.js";
const locationController = Express.Router();
const middleware = new Middleware()
const locationService = new Location();

    

locationController.get("/", middleware.pagination, async (req,res) =>{ 
    const pageSize = req.limit
    const page = req.offset

    let [allLocations,total] = await locationService.getAllLocations(pageSize, page);
    
    res.locals.pagination.total=total

    if(Number(res.locals.pagination.page)*Number(res.locals.pagination.limit)>=total){
        res.locals.pagination.nextPage=null 
      }

    const response = {
        collection:allLocations.rows,
        pagination:res.locals.pagination
    }
    
    return res.status(200).json(response)


})

locationController.get("/:id", async (req, res) =>{ 
    const id = req.params.id;
    const location = await locationService.getLocationById(id)
    
    if (location.rowCount!==0) {
        return res.status(200).json(location.rows)
    }
    else{
        return res.status(404).json("Localidad no encontrada")
    }
})

locationController.get("/:id/event-location", middleware.userMiddleware, async (req,res) => { 
    const idUser=req.id

    const eventlocations= await locationService.getEventLocationById(req.params.id, idUser)

    if(eventlocations.rowCount < 1){
        return res.status(404).json("La ubicacion no fue encontrada. Verifique que usted es el usuario creador")
    }
    else{
        return res.status(200).json(eventlocations.rows)
    }
})

export default locationController