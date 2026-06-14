import chalk from "chalk";
import type { Database } from "bun:sqlite";

const customers = [
  { name: "Alice Johnson", email: "andrewkizito54@gmail.com" },
  { name: "Bob Smith", email: "kizitoandrew36@gmail.com" },
  { name: "Carol Williams", email: "kizitoandrew@mizaplus.com" },
  { name: "David Brown", email: "andrewkizito54@proton.me" },
];

export function seed(db: Database) {
  for (const c of customers) {
    db.run(
      "INSERT OR IGNORE INTO customers (id, name, email) VALUES (?, ?, ?)",
      [crypto.randomUUID(), c.name, c.email],
    );
  }
  console.log(chalk.grey("🌱 Seeded 4 customers"));
}
