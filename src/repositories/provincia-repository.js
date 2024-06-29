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
  async DeleteProvincia(id){
    try{
        const sql = 'DELETE FROM provinces WHERE id=$1 '
        const res = await this.DBClient.query(sql,[id])

        return res
    }
    catch (e){
        console.error ("error al borrar provincia",e)
    }
  }

}