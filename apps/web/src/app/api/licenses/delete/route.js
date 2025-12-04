import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { licenseId } = await request.json();

    if (!licenseId) {
      return Response.json({ error: "License ID required" }, { status: 400 });
    }

    const result = await sql`
      DELETE FROM users 
      WHERE id = ${licenseId} AND role = 'umkm'
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json({ error: "License not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete license error:", error);
    return Response.json(
      { error: "Failed to delete license" },
      { status: 500 },
    );
  }
}
