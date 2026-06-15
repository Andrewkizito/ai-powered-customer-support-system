import { getDashboardStats } from "../../db/sql/issues";

export async function handleDashboardStats(): Promise<Response> {
  try {
    const stats = getDashboardStats();
    return Response.json(stats);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
