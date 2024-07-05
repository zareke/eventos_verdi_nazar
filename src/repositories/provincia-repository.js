import config from "../../dbconfig.js";
import pkg from "pg";
export default class ProvinciaRepository {
  constructor() {
    const { Client } = pkg;

    this.DBClient = new Client(config);
    this.DBClient.connect();
  }

  async getAllProvincias(limit, offset){
    try{
        const sql = 'SELECT * FROM provinces limit $1 offset $2'
        const provs=await this.DBClient.query(sql,[limit, offset])

        const sql2 = 'SELECT  * FROM provinces'
        const pTotal = (await this.DBClient.query(sql2)).rowCount

        return [provs,pTotal]
    }
    catch(e){
        console.error("Error al traer todas las provincias: ",e)
    }
  }

  async getProvinciaById(id){
    try{
        const sql = 'SELECT * FROM provinces WHERE id=$1'
        const prov = await this.DBClient.query(sql,[id])
  
        return prov
      }
      catch(e){
        console.error("Error al buscar provincia por id: ", e)
      }
  }

  async newProvincia(prov){
    try{
        const sql = 'INSERT INTO provinces (name,full_name,latitude,longitude,display_order) values ($1,$2,$3,$4,$5)'
        await this.DBClient.query(sql,[prov.name,prov.full_name,prov.latitude,prov.longitude,prov.display_order])
    }
    catch(e){
        console.error("error al ingresar nueva provincia: ",e)
    }
  }

  async UpdateProvincia(prov){
    try{
        const sql = 'UPDATE provinces SET name=$1,full_name=$2,latitude=$3,longitude=$4,display_order=$5 WHERE id=$6'
        const s= await this.DBClient.query(sql,[prov.name,prov.full_name,prov.latitude,prov.longitude,prov.display_order,prov.id])

        return s
    }
    catch (e){
        console.error("error al actualizar provincia: ",e)
    }
  }

  async getAllLocationsProvince(limit,offset,id){
    try{
        const sql = 'SELECT * FROM locations WHERE id_province=$1 limit $2 offset $3'
        const provs = await this.DBClient.query(sql,[id,limit,offset])

        const sql2 = 'SELECT * FROM locations WHERE id_province=$1'
        const total= (await this.DBClient.query(sql2,[id])).rowCount

        return [provs,total]
    }
    catch(e) {
        console.error("error al buscar localidades por provincia: ",e)
    }
  }
  async DeleteProvincia(id) {
    try {
      await this.finishDeleteProvinciaCascade(id);
  
      const sql = 'DELETE FROM provinces WHERE id=$1';
      const res = await this.DBClient.query(sql, [id]);
  
      return res;
    } catch (e) {
      console.error("Error al borrar provincia:", e);
      
    }
  }
  async finishDeleteProvinciaCascade(id) {
    try {
      await this.DBClient.query('BEGIN'); //esto hace uqe lo siguiente o se ejecute o no haga nada si hay algun error
  
      const deleteEnrollmentsSql = `
        DELETE FROM event_enrollments
        WHERE id_event IN (
          SELECT e.id
          FROM events e
          JOIN event_locations el ON e.id_event_location = el.id
          JOIN locations l ON el.id_location = l.id
          WHERE l.id_province = $1
        )`;
      await this.DBClient.query(deleteEnrollmentsSql, [id]);
  
      const deleteEventTagsSql = `
        DELETE FROM event_tags
        WHERE id_event IN (
          SELECT e.id
          FROM events e
          JOIN event_locations el ON e.id_event_location = el.id
          JOIN locations l ON el.id_location = l.id
          WHERE l.id_province = $1
        )`;
      await this.DBClient.query(deleteEventTagsSql, [id]);
  
      const deleteEventsSql = `
        DELETE FROM events
        WHERE id_event_location IN (
          SELECT el.id
          FROM event_locations el
          JOIN locations l ON el.id_location = l.id
          WHERE l.id_province = $1
        )`;
      await this.DBClient.query(deleteEventsSql, [id]);
  
      const deleteEventLocationsSql = `
        DELETE FROM event_locations
        WHERE id_location IN (
          SELECT id FROM locations WHERE id_province = $1
        )`;
      await this.DBClient.query(deleteEventLocationsSql, [id]);
  
      const deleteLocationsSql = "DELETE FROM locations WHERE id_province = $1";
      await this.DBClient.query(deleteLocationsSql, [id]);
  
      
      await this.DBClient.query('COMMIT'); //final del bloque
  
    } catch (error) {
      await this.DBClient.query('ROLLBACK'); //esto esta re bueno no sabia que se podia hacer rollback
      console.error("Error al borrar cascada de provincia:", error);
      
    }
  }

}