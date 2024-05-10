import pg from "pg"
import config from "../../dbconfig.js"

const client = new pg.Client(config)

client.connect()


export class EventsRepository{
async getEvents(id,pageSize){
console.log("los huebos")    
var query = $`select * from events limit ${pageSize}`

const values = client.query(query)

return values
}}