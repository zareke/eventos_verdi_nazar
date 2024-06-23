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

      const sql2 = 'SELECT * FROM events'
      const eventstotal = (await this.DBClient.query(sql2)).rowCount


      return [eventos,eventstotal];
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

  async postEvent(eventoObj) {
    try {
      const columns = [
        'name', 'description', 'id_event_category', 'id_event_location', 'start_date',
        'duration_in_minutes', 'price', 'enabled_for_enrollment', 'max_assistance', 'id_creator_user'
      ];
  
      // Convertir el timestamp para que no joda el postgre
      const startDate = new Date(eventoObj.start_date);
      
      const values = [
        eventoObj.name, eventoObj.description, eventoObj.id_event_category, eventoObj.id_event_location,
        startDate, 
        eventoObj.duration_in_minutes, eventoObj.price, eventoObj.enabled_for_enrollment,
        eventoObj.max_assistance, eventoObj.id_creator_user
      ];
  
      // eso de (_,index) significa que no se utiliza el valor sino el indice de los elementos del array. Luego lo que hace es que hace que los indices empiecen desde 1 y les agrega el $ y los une con una coma, para poder usarlo en la query
      const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
  
      // Construir la consulta SQL
      const sql = `
        INSERT INTO events (${columns.join(', ')})
        VALUES (${placeholders})
        RETURNING *;
      `;
  
      console.log(eventoObj);
      const result = await this.DBClient.query(sql, values);
      return result.rows;
    } catch (error) {
      console.error("Error al insertar evento:", error);
    }
  }
  async patchEvent(id, eventoObj) {
    try {
      const fields = [];
      const values = [];
      let index = 1;

      for (const key in eventoObj) {
        if (eventoObj.hasOwnProperty(key)) {
          let value = eventoObj[key];
          if (key === 'start_date') {
            const fecha = new Date(value);
            if (!isNaN(fecha.getTime())) {
              value = fecha.toISOString();
            } else {
              throw new Error(`Fecha inválida para el campo ${key}`);
            }
          } else if (['id_event_category', 'id_event_location', 'price', 'enabled_for_enrollment', 'max_assistance', 'duration_in_minutes', 'id_creator_user'].includes(key)) {
            value = Number(value);
            if (isNaN(value)) {
              throw new Error(`Valor numérico inválido para el campo ${key}`);
            }
          }
          fields.push(`${key} = $${index}`);
          values.push(value);
          index++;
        }
      }

      const sql = `UPDATE events SET ${fields.join(', ')} WHERE id = $${index}`;
      values.push(id);

      const result = await this.DBClient.query(sql, values);
      return result.rows;
    } catch (error) {
      console.error("Error al actualizar evento:", error);
      throw error; // Propaga el error para que pueda ser manejado por el llamador
    }
  }

  async anyEnrolled(eventid){
    try{
      let values = [eventid]
    
    const sql ="select * from event_enrollments where id_event = $1"
    let any = await this.DBClient.query(sql,values)
    if(any.rowCount > 0){
      return true
    }
    else return false
    }
    catch (error){
      console.error("error al checkear si esta alguien enrolled?")
    }
  }
  async setupCascadeDelete() {
    try {
      const sql = `
        ALTER TABLE event_details
        ADD CONSTRAINT event_details_event_id_fkey
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;
      `;//agrega el on delete caSCADE
      await this.DBClient.query(sql);
      console.log("restriccion se agrego exitosamente"); 
    } catch (error) {
      if (error.code === '42710') { // codigo de error unico: ya existe la constraint
        console.log("restriccion ya existe");
      } else {
        console.error("Error agregando la restriccion: ", error);
        throw error;  // relanzar el error después de registrarlo
      }
    }
  }
  async deleteEvent(id){
      try {let values=[id]


      const sql = "delete from events where id=$1"
      const deleted=await this.DBClient.query(sql,values)
      return deleted}
      catch(error){
        console.error("error al borrar evento: ",error)
      }
  }
  async getMaxCapacity(idlocation){
    try {
       
      const values = [idlocation] 
    const sql = "SELECT max_capacity from event_locations where event_locations.id = $1";
    const eventos = await this.DBClient.query(sql, values);
    return eventos.rows;
  } catch (error) {
    console.error("Error al obtener eventos:", error);
  }
  }
}
