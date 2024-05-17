import config from '../../dbconfig.js'
import pkg from "pg"
export default class EventRepository{
constructor(){
const {Client} = pkg

this.DBClient = new Client(config)
this.DBClient.connect();
}
async getAllEvents(limit, offset) {
    try {
    const sql = "SELECT * FROM events OFFSET $1 LIMIT $2;";
    const eventos = await this.DBClient.query(sql, [ offset,limit ]);
    
    return eventos.rows;
    } catch (error) {
    console.error("Error al obtener eventos:", error);
    }
    }
}


