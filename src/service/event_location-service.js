import eventLocationController from "../controllers/event_location-controller.js";
import EventLocationRepository from "../repositories/event_location-repository.js";

export default class EventLocation{



    async getAllEventLocations(pageSize,page,creatorId){
        let evlocrepo=new EventLocationRepository()
        let [returnEntity,total]=await evlocrepo.getAllEventLocations(pageSize,page,creatorId)
        return [returnEntity,total]
    }

    async getEventLocationById(idUser,idEventLocation){
        let evlocrepo=new EventLocationRepository()
        let returnEntity = await evlocrepo.getEventLocationById(idUser,idEventLocation)
        return returnEntity
    }

    async eventLocationExists(id){
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

    async locationExists(id){
        let evlocrepo = new EventLocationRepository()
        let exists = await evlocrepo.locationExists(id)
        if(exists.rowCount<1){
            return false
        }
        else return true
    }

    async isCreatorUser(idUser,idEventLocation){
        let evlocrepo = new EventLocationRepository()
        return  await evlocrepo.isCreatorUser(idUser,idEventLocation)

    }

    async updateEventLocation(eventLocation){
        let evlocrepo = new EventLocationRepository()
        eventLocation.max_capacity === NaN ? eventLocation.max_capacity=null : eventLocation.max_capacity=eventLocation.max_capacity
        eventLocation.latitude === NaN ? eventLocation.latitude=null : eventLocation.latitude = eventLocation.latitude
        eventLocation.longitude === NaN ? eventLocaiton.longitude=null : eventLocation.longitude = eventLocation.longitude
        return await evlocrepo.updateEventLocation(eventLocation)
    }
}