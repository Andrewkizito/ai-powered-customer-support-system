import { Database } from "bun:sqlite";
import initSql from "./sql/init.sql";

const db = new Database("data/customer-support.db");

db.run("PRAGMA foreign_keys = ON;");

export function initDb() {
  db.run(initSql);
}

export default db;
