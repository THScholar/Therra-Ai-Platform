import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { customerName, customerMessage, botResponse, channel, intent } =
      await request.json();

    if (!customerMessage || !botResponse) {
      return Response.json(
        { error: "Customer message and bot response required" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO bot_logs (customer_name, customer_message, bot_response, channel, intent)
      VALUES (${customerName || "Anonymous"}, ${customerMessage}, ${botResponse}, ${channel || "whatsapp"}, ${intent || "general"})
      RETURNING *
    `;

    return Response.json({ log: result[0] });
  } catch (error) {
    console.error("Save bot log error:", error);
    return Response.json({ error: "Failed to save log" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const channel = searchParams.get("channel");

    let logs;
    if (channel) {
      logs = await sql`
        SELECT * FROM bot_logs 
        WHERE channel = ${channel}
        ORDER BY created_at DESC
        LIMIT 100
      `;
    } else {
      logs = await sql`
        SELECT * FROM bot_logs 
        ORDER BY created_at DESC
        LIMIT 100
      `;
    }

    return Response.json({ logs });
  } catch (error) {
    console.error("Get bot logs error:", error);
    return Response.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}
