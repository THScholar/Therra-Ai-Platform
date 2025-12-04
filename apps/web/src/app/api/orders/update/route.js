import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return Response.json(
        { error: "Order ID and status required" },
        { status: 400 },
      );
    }

    const result = await sql`
      UPDATE orders 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${orderId}
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    return Response.json({ order: result[0] });
  } catch (error) {
    console.error("Update order error:", error);
    return Response.json({ error: "Failed to update order" }, { status: 500 });
  }
}
