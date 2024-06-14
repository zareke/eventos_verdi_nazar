import config from "../../dbconfig.js";
import pkg from "pg";
export default class EventLocationRepository {
  constructor() {
    const { Client } = pkg;

    this.DBClient = new Client(config);
    this.DBClient.connect();
  }



  async getAllEventLocations(limit,offset) {
    try{
        const sql = 'SELECT * FROM event_locations offset $2 limit $1'
        const evloc = await this.DBClient.query(sql,[limit, offset])
        return evloc.rows 
    }
    catch(e){
        console.error("Error al obtener event locations: ",e)
    }
  }


async getEventLocationById(idUser,idEventLocation){
    try{
        const sql = 'SELECT * FROM event_locations WHERE id=$1 AND id_creator_user = $2'
        const evloc = await this.DBClient.query(sql,[idEventLocation,idUser])
        return evloc
    }
    catch(e){
        console.error("Error al obtener un event location: ",e)
    }
}

async eventLocationExists(id){
    try{
        const sql = 'SELECT * FROm event_locations WHERE id=$1'
        const evloc = await this.DBClient.query(sql,[id])
        return evloc
    }
    catch (e){
        console.error("error al verificar si existe un evento??????")
    }
}
/*
como hago
-ah no ni idea ahora busco dame un sec
*/ 
async crearEventLocation(evl){
    try{
        const sql = 'insert into event_locations (id_location,name,full_address,max_capacity,latitude,longitude,id_creator_user ) values ($1,$2,$3,$4,$5,$6,$7)'
        await this.DBClient.query(sql,[evl.id_location,evl.name,evl.full_address,evl.max_capacity,evl.latitude,evl.longitude,evl.id_creator_user])
    }
    catch(error){
        console.error ("error al insertar event location: ",error)
    }
}


async deleteEventLocation(id,idUser){
    try{
        const sql = 'delete from event_locations where id=$1 and id_creator_user = $2'
        const result = await this.DBClient.query(sql,[id,idUser])
        return result
    }
    catch (e)
    {    console.error("error al eliminar event location: ",e)}
}





}