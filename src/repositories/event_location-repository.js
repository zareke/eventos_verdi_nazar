import config from "../../dbconfig.js";
import pkg from "pg";
export default class EventLocationRepository {
  constructor() {
    const { Client } = pkg;

    this.DBClient = new Client(config);
    this.DBClient.connect();
  }















}