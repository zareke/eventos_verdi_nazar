import "dotenv/config";

const config = {
  host: "localhost",
  hostname: "localhost",
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 5432,
  server:process.env.DB_SERVER,
  
};

export default config;
