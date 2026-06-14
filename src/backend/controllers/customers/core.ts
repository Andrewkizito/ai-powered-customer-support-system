import { getAllCustomers } from "../../db/sql/customers.ts";

export function handleGetCustomers(): Response {
  return Response.json(getAllCustomers());
}
