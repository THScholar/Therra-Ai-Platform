import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const {
      customerName,
      customerPhone,
      productId,
      quantity,
      totalAmount,
      channel,
    } = await request.json();

    if (!customerName || !productId || !quantity || !totalAmount) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const [order, product, salesRecord] = await sql.transaction([
      sql`
        INSERT INTO orders (customer_name, customer_phone, product_id, quantity, total_amount, channel, status)
        VALUES (${customerName}, ${customerPhone || ""}, ${productId}, ${quantity}, ${totalAmount}, ${channel || "web"}, 'pending')
        RETURNING *
      `,
      sql`
        UPDATE products 
        SET stock = stock - ${quantity}, updated_at = NOW()
        WHERE id = ${productId}
        RETURNING *
      `,
      sql`
        INSERT INTO sales_data (order_id, amount, type, description)
        SELECT id, ${totalAmount}, 'income', 'Order from ' || ${customerName}
        FROM orders
        WHERE customer_name = ${customerName}
        ORDER BY created_at DESC
        LIMIT 1
        RETURNING *
      `,
    ]);

    return Response.json({
      order: order[0],
      product: product[0],
      salesRecord: salesRecord[0],
    });
  } catch (error) {
    console.error("Create order error:", error);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}
