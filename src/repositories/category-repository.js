import config from "../../dbconfig.js";
import pkg from "pg";
export default class CategoryRepository {
  constructor() {
    const { Client } = pkg;

    this.DBClient = new Client(config);
    this.DBClient.connect();
  }

  async getAllCategories(limit, offset){
    try{
        const sql = 'SELECT * FROM event_categories OFFSET $1 LIMIT $2'
        const cats=await this.DBClient.query(sql,[offset,limit])

        return cats.rows
    }
    catch(e){
        console.error("Error al traer todas las categorias: ",e)
    }
  }

  async getCategoryById(id){
    try{
      const sql = 'SELECT * FROM event_categories WHERE id=$1'
      const cats = await this.DBClient.query(sql,[id])

      return cats
    }
    catch(e){
      console.error("Error al buscar categoria por id: ", e)
    }
  }

  async newCategory(name,dispOrder){
    try{
      const sql = 'INSERT INTO event_categories (name,display_order) VALUES ($1,$2)'
      await this.DBClient.query(sql,[name,dispOrder])

      return "👍"
    }
    catch(e){
      console.error("Error al añadir nueva categoria: ",e)
    }
  }

  async updateCategory(id,name,dispOrder){
    try{
      const sql = 'UPDATE event_categories set name=$2,display_order=$3 WHERE id=$1'
      const result = this.DBClient.query(sql,[id,name,dispOrder])
      return result
    }
    catch(e){
      console.error("Error al update categoria: ",e)
    }
  }

  async deleteCategory(id){
    try{
      const sql = 'DELETE FROM event_categories where id = $1'
      const result = this.DBClient.query(sql,[id])
      return result
    }
    catch(e){
      console.error("error al borrar categoria")
    }
  }











}