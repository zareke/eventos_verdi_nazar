import 'dotenv/config'

export const config = {
    host: "localhost",
    port: process.env.port,
    user:process.env.DB_USER,
    password:process.env.DB_USER,
    database:process.env.DB_DATABASE
}

export default config