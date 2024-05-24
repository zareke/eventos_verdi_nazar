import config from "../../dbconfig.js";
import pkg from "pg";
export default class EventRepository {
  constructor() {
    const { Client } = pkg;

    this.DBClient = new Client(config);
    this.DBClient.connect();
  }
  async getAllEvents(limit, offset) {
    try {
      const sql = "SELECT * FROM events OFFSET $1 LIMIT $2;";
      const eventos = await this.DBClient.query(sql, [offset, limit]);

      return eventos.rows;
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    }
  }

  async getAllEventsFiltrado (size,page,eventFilters){
    try{
      const values = [size,page,eventFilters]
      console.log("eventfilter", eventFilters)
      //pipi estrada es mi amigoo
      //pipi estrada es mi hermanooo
      const sql = "SELECT * FROM events ev INNER JOIN event_categories evca ON ev.id_event_category = evca.name INNER JOIN event_tags evtg ON id_event = ev.id INNER JOIN tags tg ON evtgs.id_tag = tg.id WHERE (COALESCE($3, '') = '' OR ev.name = $3) AND (COALESCE($6, '{}') = '{}' OR tg.name = ANY($6::text[])) OFFSET $1 LIMIT $2 "
      const eventos = await this.DBClient.query(sql, [page, size, eventFilters.nombre, eventFilters.categoria, eventFilters.fechaDeInicio,eventFilters.tag])
    }
    catch(error){
    console.error("error al filtrar los eventos: ", error)}
  }

  async getEventById(id) { 
    try {
        //hacer toda la vaina o baina
        const values = [id] 
      const sql = "SELECT events.*,event_locations.* FROM events  INNER JOIN event_locations on events.id_event_location = event_locations.id  WHERE events.id = $1";
      const eventos = await this.DBClient.query(sql, values);
        
      return eventos.rows;
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    }
  }
}
