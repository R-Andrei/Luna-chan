import dotenv from "dotenv";


dotenv.config();

let path: string;

switch (process.env.NODE_ENV) {
  case "test":
    path = `${__dirname}/.env.test`;
  case "production":
    path = `${__dirname}/.env.production`;
  default:
    path = `${__dirname}/.env`;
}

dotenv.config({ path: path });

export const TOKEN = process.env.TOKEN;
export const DB_NAME = process.env.DB_NAME;
export const DB_PORT = process.env.DB_PORT;
export const DB_ADDRESS = process.env.DB_ADDRESS;