import chalk from "chalk";
import type { Database } from "bun:sqlite";

const customers = [
  { name: "Alice Johnson", email: "andrewkizito54@gmail.com", profilePicture: "https://randomuser.me/api/portraits/men/83.jpg" },
  { name: "Bob Smith", email: "kizitoandrew36@gmail.com", profilePicture: "https://randomuser.me/api/portraits/men/55.jpg" },
  { name: "Carol Williams", email: "kizitoandrew@mizaplus.com", profilePicture: "https://randomuser.me/api/portraits/men/53.jpg" },
  { name: "David Brown", email: "andrewkizito54@proton.me", profilePicture: "https://randomuser.me/api/portraits/men/25.jpg" },
];

export function seed(db: Database) {
  for (const c of customers) {
    db.run(
      "INSERT OR IGNORE INTO customers (id, name, email, profilePicture) VALUES (?, ?, ?, ?)",
      [crypto.randomUUID(), c.name, c.email, c.profilePicture],
    );
  }
  console.log(chalk.grey("🌱 Seeded 4 customers"));
}
