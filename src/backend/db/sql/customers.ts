import db from "../index.ts";

export function getAllCustomers() {
  return db.query(
    "SELECT id, name, email, profilePicture FROM customers ORDER BY name ASC",
  ).all();
}

export function getCustomer(id: string) {
  const row = db.query(
    "SELECT id, name, email, profilePicture FROM customers WHERE id = ?",
  ).get(id) as Record<string, unknown> | undefined;

  return row ?? null;
}
