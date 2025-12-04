import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { amount, description } = await request.json();

    if (!amount || !description) {
      return Response.json(
        { error: "Amount and description required" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO sales_data (amount, type, description)
      VALUES (${amount}, 'expense', ${description})
      RETURNING *
    `;

    return Response.json({ expense: result[0] });
  } catch (error) {
    console.error("Add expense error:", error);
    return Response.json({ error: "Failed to add expense" }, { status: 500 });
  }
}
