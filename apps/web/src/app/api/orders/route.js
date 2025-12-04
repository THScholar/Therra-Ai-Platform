import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const orders = await sql`
      SELECT o.*, p.name as product_name 
      FROM orders o
      LEFT JOIN products p ON o.product_id = p.id
      ORDER BY o.created_at DESC
    `;

    return Response.json({ orders });
  } catch (error) {
    console.error("Get orders error:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
