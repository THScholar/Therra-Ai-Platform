import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const products = await sql`
      SELECT * FROM products 
      ORDER BY created_at DESC
    `;

    return Response.json({ products });
  } catch (error) {
    console.error("Get products error:", error);
    return Response.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { name, description, price, stock, category, imageUrl } =
      await request.json();

    if (!name || !price || stock === undefined) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO products (name, description, price, stock, category, image_url)
      VALUES (${name}, ${description || ""}, ${price}, ${stock}, ${category || ""}, ${imageUrl || ""})
      RETURNING *
    `;

    return Response.json({ product: result[0] });
  } catch (error) {
    console.error("Create product error:", error);
    return Response.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
