import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const licenses = await sql`
      SELECT 
        id, 
        license_code, 
        business_name, 
        is_active, 
        expires_at, 
        device_id,
        max_devices,
        created_by,
        created_at
      FROM users 
      WHERE role = 'umkm'
      ORDER BY created_at DESC
    `;

    const stats = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_active = true AND (expires_at IS NULL OR expires_at > NOW())) as active,
        COUNT(*) FILTER (WHERE is_active = false OR (expires_at IS NOT NULL AND expires_at <= NOW())) as inactive
      FROM users 
      WHERE role = 'umkm'
    `;

    return Response.json({
      licenses,
      stats: stats[0],
    });
  } catch (error) {
    console.error("Get licenses error:", error);
    return Response.json(
      { error: "Failed to fetch licenses" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { businessName, expiresAt, maxDevices } = await request.json();

    if (!businessName) {
      return Response.json(
        { error: "Business name required" },
        { status: 400 },
      );
    }

    const licenseCode = `UMKM-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const result = await sql`
      INSERT INTO users (
        license_code, 
        business_name, 
        role, 
        is_active, 
        expires_at,
        max_devices,
        created_by
      )
      VALUES (
        ${licenseCode}, 
        ${businessName}, 
        'umkm', 
        true,
        ${expiresAt || null},
        ${maxDevices || 1},
        'admin'
      )
      RETURNING *
    `;

    return Response.json({ license: result[0] });
  } catch (error) {
    console.error("Create license error:", error);
    return Response.json(
      { error: "Failed to create license" },
      { status: 500 },
    );
  }
}
