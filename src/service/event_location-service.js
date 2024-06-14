import eventLocationController from "../controllers/event_location-controller.js";
import EventLocationRepository from "../repositories/event_location-repository.js";

export default class EventLocation{



    async getAllEventLocations(pageSize,page){
        let evlocrepo=new EventLocationRepository()
        let returnEntity=await evlocrepo.getAllEventLocations(pageSize,page)
        return returnEntity
    }

    async getEventLocationById(idUser,idEventLocation){
        let evlocrepo=new EventLocationRepository()
        let returnEntity = await evlocrepo.getEventLocationById(idUser,idEventLocation)
        return returnEntity
    }

    async locationExists(id){
        let evlocrepo = new EventLocationRepository()
        let exists = await evlocrepo.eventLocationExists(id)
        if (exists.rowCount<1){
            return false
        }
        else return true
    }
    async newEventLocation(evl){
        let evlocrepo = new EventLocationRepository()
        await evlocrepo.crearEventLocation(evl)

        
    }
    
async deleteEventLocation(id,idUser){
    const evlocrepo = new EventLocationRepository()
    return await evlocrepo.deleteEventLocation(id,idUser)
}
}