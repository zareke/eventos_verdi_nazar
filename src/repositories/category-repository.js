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
        const cats=await this.DBClient.query(sql,[offset, limit])

        const sql2 = 'SELECT * FROM event_categories'
        const catstotal = (await this.DBClient.query(sql2)).rowCount

        return [cats,catstotal]
    }
    catch(e){
        console.error("Error al traer todas las categorias: ",e)
    }
  }

  async getCategoryById(id){
    try{
      const sql = 'SELECT * FROM event_categories WHERE id=$1'
      const cat = await this.DBClient.query(sql,[id])

      return cat
    }
    catch(e){
      console.error("Error al buscar categoria por id: ", e)
    }
  }

  async newCategory(category){
    try{
      const sql = 'INSERT INTO event_categories (name,display_order) VALUES ($1,$2)'
      await this.DBClient.query(sql,[category.name,category.display_order])

    }
    catch(e){
      console.error("Error al añadir nueva categoria: ",e)
    }
  }

  async updateCategory(cat){
    try{
      const sql = 'UPDATE event_categories set name=$2,display_order=$3 WHERE id=$1'
      const result = this.DBClient.query(sql,[cat.id,cat.name,cat.display_order])
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