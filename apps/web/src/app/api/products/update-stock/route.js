import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { productId, stock } = await request.json();

    if (!productId || stock === undefined) {
      return Response.json(
        { error: "Product ID and stock required" },
        { status: 400 },
      );
    }

    const result = await sql`
      UPDATE products 
      SET stock = ${stock}, updated_at = NOW()
      WHERE id = ${productId}
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json({ product: result[0] });
  } catch (error) {
    console.error("Update stock error:", error);
    return Response.json({ error: "Failed to update stock" }, { status: 500 });
  }
}
