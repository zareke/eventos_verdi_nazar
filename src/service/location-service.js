import LocationRepository from "../repositories/location-repository.js"
import sql from 'mssql'


export default class Location {



async getAllLocations(pagesize,page){


    const locationrepo = new LocationRepository()   
    let [returnEntity,total] = await locationrepo.getAllLocations(pagesize,page)

    return [returnEntity,total]
}

async getLocationById(id){
    let returnEntity = null
    const locationrepo = new LocationRepository()
    returnEntity=await locationrepo.getLocationById(id)
    
    return returnEntity
}

async getEventLocationById(id, uid){
    let returnEntity=null
    const locationrepo = new LocationRepository()
    returnEntity=await locationrepo.getEventLocationByLocationId(id,uid)
    return returnEntity
}


}