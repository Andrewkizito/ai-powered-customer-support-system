import { Database } from "bun:sqlite";
import chalk from "chalk";
import { seed } from "./seed.ts";

const db = new Database("data/customer-support.db");

db.run("PRAGMA foreign_keys = ON;");

export async function initDb() {
  const initSql = await Bun.file(`${import.meta.dir}/init.sql`).text();
  db.run(initSql);
  console.log(chalk.green("✓ Database connected and initialized"));
  seed(db);
}

export default db;
