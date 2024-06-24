import config from "../../dbconfig.js";
import pkg from "pg";
export default class LocationRepository {
  constructor() {
    const { Client } = pkg;

    this.DBClient = new Client(config);
    this.DBClient.connect();
  }

  async getAllLocations(limit, offset) {
    try {
      const sql = "SELECT * FROM locations OFFSET $1 LIMIT $2;";
      const locations = await this.DBClient.query(sql, [offset, limit]);

      const sql2 = 'SELECT * FROM locations'
      const locationsTotal = (await this.DBClient.query(sql2)).rowCount

      return [locations,locationsTotal];
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    }
  }

async getLocationById(id){
    try{
        const sql = "SELECT * FROM locations WHERE id = $1"
        const location = await this.DBClient.query(sql,[id])
        
        return location
    }
    catch (error) {
        console.error("Error al buscar location por id")
    }
}
async getEventLocationByLocationId(id,userid){
  try{
    const sql = 'SELECT el.* FROM event_locations el INNER JOIN locations l on el.id_location=l.id WHERE $1 = l.id AND el.id_creator_user = $2'
    const eventLocations = await this.DBClient.query(sql,[id,userid])
    return eventLocations
  }
  catch (e){
    console.error("error al buscar event location por id de location: ", e)
  }
}






}