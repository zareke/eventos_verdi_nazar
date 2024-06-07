import LocationRepository from "../repositories/location-repository.js"
import sql from 'mssql'


export default class Location {



async getAllLocations(pagesize,page){
    let returnEntity=null

    const locationrepo = new LocationRepository()   
    returnEntity = await locationrepo.getAllLocations(pagesize,page)

    return returnEntity
}

async getLocationById(id){
    let returnEntity = null
    const locationrepo = new LocationRepository()
    returnEntity=await locationrepo.getLocationById(id)
    
    return returnEntity
}

}