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
      
      //creo q funciona?  
      const sql = "SELECT * FROM events ev INNER JOIN event_categories evca ON ev.id_event_category = evca.id INNER JOIN event_tags evtg ON id_event = ev.id INNER JOIN tags tg ON evtg.id_tag = tg.id WHERE (COALESCE($3, '') = '' OR ev.name = $3) AND (COALESCE($6, '{}') = '{}' OR tg.name = ANY($6::text[])) AND (COALESCE($4, '') = '' OR evca.name = $4) AND (COALESCE($5, 0) = 0 OR evca.id = $5) OFFSET $1 LIMIT $2 "
      const eventos = await this.DBClient.query(sql, [page, size, eventFilters.nombre, eventFilters.categoria, eventFilters.fechaDeInicio,eventFilters.tag])
      
      return eventos.rows
    }
    catch(error){
    console.error("error al filtrar los eventos: ", error)}
  }

  async getEventById(id) { 
    try {
       
        const values = [id] 
      const sql = "SELECT *, events.id as id, events.name as name ,tags.name as tag_name, provinces.name as province_name  FROM events  INNER JOIN event_locations on events.id_event_location = event_locations.id inner join users on event_locations.id_creator_user = users.id inner join event_tags on event_tags.id_event = events.id inner join tags on event_tags.id_tag = tags.id inner join locations on event_locations.id_location = locations.id inner join provinces on locations.id_province = provinces.id WHERE events.id = $1";
      const eventos = await this.DBClient.query(sql, values);
      return eventos.rows;
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    }
  }

  async postEvent(eventoObj){
    try {
       
      const values = [eventoObj] 
    const sql = "insert into events (name,description,id_event_category,id_event_location,start_date,duration_in_minutes,price,enabled_for_enrollment,max_assistance,id_creator_user) values ?";
    const eventos = await this.DBClient.query(sql, values);
    return eventos.rows;
  } catch (error) {
    console.error("Error al obtener eventos:", error);
  }
  }
}
