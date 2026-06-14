import { Database } from "bun:sqlite";
import chalk from "chalk";

const db = new Database("data/customer-support.db");

db.run("PRAGMA foreign_keys = ON;");

export async function initDb() {
  const initSql = await Bun.file(
    import.meta.dir + "/sql/init.sql",
  ).text();
  db.run(initSql);
  console.log(chalk.green("✓ Database connected and initialized"));
}

export default db;
