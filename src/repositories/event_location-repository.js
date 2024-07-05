import config from "../../dbconfig.js";
import pkg from "pg";
export default class EventLocationRepository {
  constructor() {
    const { Client } = pkg;

    this.DBClient = new Client(config);
    this.DBClient.connect();
  }



  async getAllEventLocations(limit,offset,creatorId) {
    try{
        const sql = 'SELECT * FROM event_locations WHERE id_creator_user=$3 offset $2 limit $1'
        const evloc = await this.DBClient.query(sql,[limit, offset,creatorId])

        const sql2 = 'SELECT * FROM event_locations'
        const evloctotal = (await this.DBClient.query(sql2)).rowCount

        return [evloc,evloctotal]
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
        console.error("error al verificar si una event location existe: ", e)
    }
}
async locationExists(id){
    try{
        const sql = 'SELECT * from locations WHERE id=$1'
        const evloc = await this.DBClient.query(sql,[id])
        return evloc
    }
    catch (e){
        console.error("error al verificar si una localidad existe: ", e)
    }
}
async crearEventLocation(evl){
    try{
        const sql = 'insert into event_locations (id_location,name,full_address,max_capacity,latitude,longitude,id_creator_user ) values ($1,$2,$3,$4,$5,$6,$7)'
        await this.DBClient.query(sql,[evl.id_location,evl.name,evl.full_address,evl.max_capacity,evl.latitude,evl.longitude,evl.id_creator_user])
    }
    catch(error){
        console.error ("error al insertar event location: ",error)
    }
}


async   deleteEventLocation(id,idUser){
    try{
        const sql = 'delete from event_locations where id=$1 and id_creator_user = $2'
        const result = await this.DBClient.query(sql,[id,idUser])
        return result
    }
    catch (e)
    {    console.error("error al eliminar event location: ",e)}
}

async isCreatorUser(idUser,idEventLocation){
    try{
        const sql ="SELECT * from event_locations WHERE id=$1 and id_creator_user=$2"
        const result = await this.DBClient.query(sql,[idEventLocation,idUser])
        return !result.rowCount<1
    }
    catch (e){
        console.error("error al verificar si es usuario creador: ",e)
    }
}

async updateEventLocation(eventLocation){
    try{
        //si algun valor es null no se cambia eso hace coalesce
        const sql=`UPDATE event_locations 
        SET 
            id_location = COALESCE($1, id_location),
            name = COALESCE($2, name),
            full_address = COALESCE($3, full_address),
            max_capacity = COALESCE($4, max_capacity),
            latitude = COALESCE($5, latitude),
            longitude = COALESCE($6, longitude),
            id_creator_user = COALESCE($7, id_creator_user)
        WHERE id = $8`
        await this.DBClient.query(sql,[eventLocation.id_location, eventLocation.name, eventLocation.full_address, eventLocation.max_capacity, eventLocation.latitude, eventLocation.longitude, eventLocation.id_creator_user, eventLocation.id])
    } 
    catch(e){
        console.error("error al updatear event locations: ",e)
    }
}



}