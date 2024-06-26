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

      const sql2 = "SELECT * FROM events";
      const eventstotal = (await this.DBClient.query(sql2)).rowCount;

      return [eventos, eventstotal];
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    }
  }

  async getAllEventosFiltrado(size, offset, eventFilters) { // NO FUNCIOMNA
    try {
      const values = [
        offset,
        size,
        eventFilters.nombre,
        eventFilters.categoria,
        eventFilters.fechaDeInicio,
        eventFilters.tag
      ];

      console.log(values)
      const sql = "SELECT * FROM events ev INNER JOIN event_categories evca ON ev.id_event_category = evca.id INNER JOIN event_tags evtg ON id_event = ev.id INNER JOIN tags tg ON evtg.id_tag = tg.id WHERE (COALESCE($1, '') = '' OR ev.name = $1) AND (COALESCE($4, '') = '' OR tg.name = $4) AND (COALESCE($2, '') = '' OR evca.name = $2) AND (COALESCE($3, 0) = 0 OR evca.id = $3) LIMIT $1 OFFSET $2 ";
      
      const eventos = await this.DBClient.query(sql, values);
      
      const sql2 = "SELECT * FROM events ev INNER JOIN event_categories evca ON ev.id_event_category = evca.id INNER JOIN event_tags evtg ON id_event = ev.id INNER JOIN tags tg ON evtg.id_tag = tg.id WHERE (COALESCE($1, '') = '' OR ev.name = $1) AND (COALESCE($4, '{}') = '{}' OR tg.name = ANY($6::text[])) AND (COALESCE($4, '') = '' OR evca.name = $4) AND (COALESCE($5, 0) = 0 OR evca.id = $5)";
      const total = (await this.DBClient.query(sql2,[eventFilters.nombre,eventFilters.categoria,eventFilters.fechaDeInicio,eventFilters.tag])).rowCount

      return [eventos,total];
    } catch (error) {
      console.error("error al filtrar los eventos: ", error);
    }
  }

  async getEventById(id) {
    try {
      const values = [id]; 
      //query que hizo claudio que une todas las tablas
      const sql = `SELECT 
        e.id, e.name, e.description, e.id_event_category, e.id_event_location, 
        e.start_date, e.duration_in_minutes, e.price, e.enabled_for_enrollment, 
        e.max_assistance, e.id_creator_user,
        JSON_BUILD_OBJECT(
            'id', el.id,
            'id_location', el.id_location,
            'name', el.name,
            'full_address', el.full_address,
            'max_capacity', el.max_capacity,
            'latitude', el.latitude,
            'longitude', el.longitude,
            'id_creator_user', el.id_creator_user,
            'location', JSON_BUILD_OBJECT(
                'id', l.id,
                'name', l.name,
                'id_province', l.id_province,
                'latitude', l.latitude,
                'longitude', l.longitude,
                'province', JSON_BUILD_OBJECT(
                    'id', p.id,
                    'name', p.name,
                    'full_name', p.full_name,
                    'latitude', p.latitude,
                    'longitude', p.longitude,
                    'display_order', p.display_order
                )
            ),
            'creator_user', JSON_BUILD_OBJECT(
                'id', u1.id,
                'first_name', u1.first_name,
                'last_name', u1.last_name,
                'username', u1.username,
                'password', '******'
            )
        ) AS event_location,
        (
            SELECT JSON_AGG(JSON_BUILD_OBJECT(
                'id', t.id,
                'name', t.name
            ))
            FROM event_tags et
            JOIN tags t ON et.id_tag = t.id
            WHERE et.id_event = e.id
        ) AS tags,
        JSON_BUILD_OBJECT(
            'id', u2.id,
            'first_name', u2.first_name,
            'last_name', u2.last_name,
            'username', u2.username,
            'password', '******'
        ) AS creator_user,
        JSON_BUILD_OBJECT(
            'id', ec.id,
            'name', ec.name,
            'display_order', ec.display_order
        ) AS event_category
    FROM 
        events e
        JOIN event_locations el ON e.id_event_location = el.id
        JOIN locations l ON el.id_location = l.id
        JOIN provinces p ON l.id_province = p.id
        JOIN users u1 ON el.id_creator_user = u1.id
        JOIN users u2 ON e.id_creator_user = u2.id
        JOIN event_categories ec ON e.id_event_category = ec.id
    WHERE 
        e.id = $1;`;
      const eventos = await this.DBClient.query(sql, values);
      return eventos.rows;
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    }
  }

  async postEvent(evento) {
    try {
      const values = [
        evento.name,
        evento.description,
        evento.id_event_category,
        evento.id_event_location,
        evento.start_date,
        evento.duration_in_minutes,
        evento.price,
        evento.enabled_for_enrollment,
        evento.max_assistance,
        evento.id_creator_user,
      ];

      const sql =
        "INSERT INTO events (name,description,id_event_category,id_event_location,start_date,duration_in_minutes,price,enabled_for_enrollment,max_assistance,id_creator_user) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)";
      await this.DBClient.query(sql, values);
    } catch (error) {
      console.error("Error al insertar evento:", error);
    }
  }
  async patchEvent(evento) {
    try {
      const values = [
        evento.name,
        evento.description,
        evento.id_event_category,
        evento.id_event_location,
        evento.start_date,
        evento.duration_in_minutes,
        evento.price,
        evento.enabled_for_enrollment,
        evento.max_assistance,
        evento.id_creator_user,
        evento.id,
      ];

      const sql =
        "UPDATE events SET name = $1, description = $2, id_event_category = $3, id_event_location = $4, start_date = $5, duration_in_minutes = $6, price = $7, enabled_for_enrollment = $8, max_assistance = $9, id_creator_user = $10 WHERE id = $11;";
      await this.DBClient.query(sql, values);
    } catch (error) {
      console.error("Error al actualizar evento:", error);
    }
  }

  async anyEnrolled(eventid) {
    try {
      let values = [eventid];

      const sql = "select * from event_enrollments where id_event = $1";
      let any = await this.DBClient.query(sql, values);
      if (any.rowCount > 0) {
        return true;
      } else return false;
    } catch (error) {
      console.error("error al checkear si esta alguien enrolled?");
    }
  }
  async finishDeleteEventCascade(id){
    try {
      let values = [id];

      const sql = "delete from event_tags where id_event=$1";
      await this.DBClient.query(sql, values);
    } catch (error) {
      console.error("error al borrar evento: ", error);
    }
  }
  async deleteEvent(id) {
    try {
      let values = [id];
      await this.finishDeleteEventCascade(id)
      const sql = "delete from events where id=$1";
      const deleted = await this.DBClient.query(sql, values);
      
      return deleted;
    } catch (error) {
      console.error("error al borrar evento: ", error);
    }
  }
 
  async getMaxCapacity(idlocation) {
    try {
      const values = [idlocation];
      const sql =
        "SELECT max_capacity from event_locations where event_locations.id = $1";
      const eventos = await this.DBClient.query(sql, values);
      return eventos.rows[0].max_capacity;
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    }
  }

  //las siguientes cuatro funciones fueron hechas por claudio
  async maxAssistanceReached(idEvent) {
    const result = await this.DBClient.query(
      `
      SELECT COUNT(*) >= e.max_assistance AS reached
      FROM event_enrollments ee
      JOIN events e ON ee.id_event = e.id
      WHERE e.id = $1
      GROUP BY e.id, e.max_assistance
    `,
      [idEvent]
    );
    return result.rows[0]?.reached || false;
  }

  async isPastEvent(idEvent) {
    const result = await this.DBClient.query(
      `
      SELECT start_date < CURRENT_DATE AS past_event
      FROM events
      WHERE id = $1
    `,
      [idEvent]
    );
    return result.rows[0]?.past_event || false;
  }

  async isEnrollmentDisabled(idEvent) {
    const result = await this.DBClient.query(
      `
      SELECT NOT enabled_for_enrollment AS disabled
      FROM events
      WHERE id = $1
    `,
      [idEvent]
    );
    return result.rows[0]?.disabled || false;
  }

  async isUserRegistered(idEvent, idUser) {
    const result = await this.DBClient.query(
      `
      SELECT EXISTS (
        SELECT 1
        FROM event_enrollments
        WHERE id_event = $1 AND id_user = $2
      ) AS registered
    `,
      [idEvent, idUser]
    );
    return result.rows[0]?.registered || false;
  }

  async eventExists(idevent) {
    const sql = "SELECT * FROM events WHERE id=$1 limit 1";
    const result = await this.DBClient.query(sql, [idevent]);
    return result.rowCount > 0;
  }

  async newEnrollment(enrlmnt) {
    const sql =
      "INSERT INTO event_enrollments (id_event,id_user,description,registration_date_time,attended,observations,rating) values ($1,$2,$3,$4,$5,$6,$7)";
    await this.DBClient.query(sql, [
      enrlmnt.id_event,
      enrlmnt.id_user,
      enrlmnt.description,
      enrlmnt.registration_date_time,
      enrlmnt.attended,
      enrlmnt.observations,
      enrlmnt.rating,
    ]);
  }

  async DeleteEnrollment(iu, ie) {
    const sql =
      "DELETE FROM event_enrollments WHERE id_event=$1 and id_user=$2";
    await this.DBClient.query(sql, [ie, iu]);
  }

  async PatchEventEnrollment(evEnrollment) {
    const sql =
      "UPDATE event_enrollments SET attended=$1,observations=$2,rating=$3 WHERE id_event=$4 AND id_user=$5";
    await this.DBClient.query(sql, [
      evEnrollment.attended,
      evEnrollment.observations,
      evEnrollment.rating,
      evEnrollment.id_event,
      evEnrollment.id_user,
    ]);
  }
}
