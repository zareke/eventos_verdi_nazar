import pg from "pg"
import { config } from "../../dbconfig.js"

const client = new pg.Client(config)

client.connect()


export class EventsRepository{
async getEvents(id,pageSize){
var query = "select * from events limit ${pageSize}"
console.log("aun no hubo un error3")
const values = client.query(query)
console.log("aun no hubo un error4")
return values
}}