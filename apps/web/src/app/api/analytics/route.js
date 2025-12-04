import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const [summary, dailyData] = await sql.transaction([
      sql`
        SELECT 
          COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
          COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense,
          COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as net_profit,
          COUNT(DISTINCT CASE WHEN type = 'income' THEN order_id END) as total_orders
        FROM sales_data
      `,
      sql`
        SELECT 
          date,
          COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
          COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense
        FROM sales_data
        WHERE date >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY date
        ORDER BY date ASC
      `,
    ]);

    return Response.json({
      summary: summary[0],
      dailyData,
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    return Response.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
