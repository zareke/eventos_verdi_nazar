import Express from "express";
import Location from '../service/location-service.js'
import Middleware from "../../middleware.js";
const locationController = Express.Router();
const middleware = new Middleware()
const locationService = new Location();
    

locationController.get("/",async (req,res) =>{ //anda
    const pageSize = 4
    const page = req.query.page

    let allLocations = await locationService.getAllLocations(pageSize, page);
    return res.status(200).json(allLocations)

})

locationController.get("/:id", async (req, res) =>{ //anda
    const id = req.params.id;
    const location = await locationService.getLocationById(id)
    
    if (location.rowCount!==0) {
        return res.status(200).json(location.rows)
    }
    else{
        return res.status(404).json("no encontrado")
    }
})

locationController.get("/:id/event-location", middleware.userMiddleware, async (req,res) => { //anda
    const idUser=req.id

    const eventlocations= await locationService.getEventLocationById(req.params.id, idUser)

    if(eventlocations.rowCount < 1){
        return res.status(404).json("La location no fue encontrada. Verifique que usted es el usuario creador")
    }
    else{
        return res.status(200).json(eventlocations.rows)
    }
})

export default locationController