
import 'dotenv/config';

const config = {
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
server: process.env.DB_SERVER,
port: 5432,
database: process.env.DB_DATABASE,
host:"localhost",
hostname:process.env.DB_HOSTNAME
}

export default config