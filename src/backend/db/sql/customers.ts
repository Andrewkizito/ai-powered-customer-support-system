import db from "./index.ts";
import type { Customer } from "../../controllers/issues/types.ts";

export function getAllCustomers(): Customer[] {
  return db
    .query(
      "SELECT id, name, email, profilePicture FROM customers ORDER BY name ASC",
    )
    .all() as Customer[];
}

export function getCustomer(id: string): Customer | null {
  const row = db
    .query("SELECT id, name, email, profilePicture FROM customers WHERE id = ?")
    .get(id) as Customer | undefined;

  return row ?? null;
}
