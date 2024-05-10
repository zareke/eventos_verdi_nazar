import 'dotenv/config'

export const config = {
    host: "localhost",
    port: 4587,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE
}

export default config