import config from "../../dbconfig.js";
import pkg from "pg";
export default class EventRepository {
  constructor() {
    const { Client } = pkg;

    this.DBClient = new Client(config);
    this.DBClient.connect();
  }

    async login(username, password) {
        try {
          
          const sql = `SELECT 
          CASE 
            WHEN EXISTS (SELECT * FROM users WHERE username = $1 AND password = $2)
            THEN (select id from users where username = $1)
            ELSE -1
          END AS user_exists`          
          const loggedin = await this.DBClient.query(sql, [username, password]);

          return loggedin.rows;

        } catch (error) {
          console.error("Error al obtener usuaior:", error);
        }
      }



}