import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const message = body.message;

    if (!message) {
      return Response.json({ error: "Message required" }, { status: 400 });
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;

    if (!openRouterApiKey) {
      const fallbackMsg =
        "Maaf, sistem AI sedang dalam pemeliharaan. Silakan coba lagi nanti.";
      await sql`
        INSERT INTO therra_logs (user_message, ai_response)
        VALUES (${message}, ${fallbackMsg})
      `;
      return Response.json({ response: fallbackMsg });
    }

    const aiResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openRouterApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Therra AI membantu UMKM dengan ramah, profesional, dan sopan. Jawab dalam bahasa Indonesia.",
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      },
    );

    if (!aiResponse.ok) {
      throw new Error("OpenRouter API error");
    }

    const data = await aiResponse.json();
    const botReply =
      data.choices[0]?.message?.content ||
      "Maaf, saya tidak dapat memahami pertanyaan Anda.";

    await sql`
      INSERT INTO therra_logs (user_message, ai_response)
      VALUES (${message}, ${botReply})
    `;

    return Response.json({ response: botReply });
  } catch (error) {
    console.error("Therra chat error:", error);

    const fallbackResponse = "Maaf, terjadi kesalahan. Silakan coba lagi.";
    const body = await request.json();

    try {
      await sql`
        INSERT INTO therra_logs (user_message, ai_response)
        VALUES (${body.message}, ${fallbackResponse})
      `;
    } catch (logError) {
      console.error("Failed to log fallback:", logError);
    }

    return Response.json({ response: fallbackResponse });
  }
}
