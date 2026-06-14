import db from "../../db/index.ts";

export function handleGetCustomers(): Response {
  const customers = db.query(
    "SELECT id, name, email, profilePicture FROM customers ORDER BY name ASC",
  ).all();
  return Response.json(customers);
}
