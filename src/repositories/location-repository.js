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
      const eventos = await this.DBClient.query(sql, [offset, limit]);

      return eventos.rows;
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






}