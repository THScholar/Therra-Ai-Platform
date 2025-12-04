import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { licenseId, isActive, expiresAt, maxDevices, businessName } =
      await request.json();

    if (!licenseId) {
      return Response.json({ error: "License ID required" }, { status: 400 });
    }

    let updateQuery = "UPDATE users SET updated_at = NOW()";
    const params = [licenseId];
    let paramIndex = 2;

    if (isActive !== undefined) {
      updateQuery += `, is_active = $${paramIndex}`;
      params.push(isActive);
      paramIndex++;
    }

    if (expiresAt !== undefined) {
      updateQuery += `, expires_at = $${paramIndex}`;
      params.push(expiresAt);
      paramIndex++;
    }

    if (maxDevices !== undefined) {
      updateQuery += `, max_devices = $${paramIndex}`;
      params.push(maxDevices);
      paramIndex++;
    }

    if (businessName !== undefined) {
      updateQuery += `, business_name = $${paramIndex}`;
      params.push(businessName);
      paramIndex++;
    }

    updateQuery += " WHERE id = $1 RETURNING *";

    const result = await sql(updateQuery, params);

    if (result.length === 0) {
      return Response.json({ error: "License not found" }, { status: 404 });
    }

    return Response.json({ license: result[0] });
  } catch (error) {
    console.error("Update license error:", error);
    return Response.json(
      { error: "Failed to update license" },
      { status: 500 },
    );
  }
}
