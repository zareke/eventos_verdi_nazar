
import 'dotenv/config';

const config = {
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
server: process.env.DB_SERVER,
port: process.env.DB_PORT,
database: process.env.DB_DATABASE,
host:process.env.DB_HOST,
}

export default config