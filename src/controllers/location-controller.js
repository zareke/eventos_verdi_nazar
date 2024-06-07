import Express from "express";
import Location from '../service/location-service.js'
const locationController = Express.Router();

const locationService = new Location();


locationController.get("/",async (req,res) =>{
    const pageSize = 4
    const page = req.query.page

    let allLocations = await locationService.getAllLocations(pageSize, page);
    return res.status(200).json(allLocations)

})

locationController.get("/:id", async (req, res) =>{
    const id = req.params.id;
    const location = await locationService.getLocationById(id)
    
    if (location.rowCount!==0) {
        return res.status(200).json(location.rows)
    }
    else{
        return res.status(404).json("no encontrado")
    }
})

export default locationController