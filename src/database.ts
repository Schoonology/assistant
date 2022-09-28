import Database from "better-sqlite3";
import config from "./config";

const db = new Database(config.database.path);

process.on("exit", () => db.close());
process.on("SIGINT", () => db.close());

export default db;
