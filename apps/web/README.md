Therra UMKM Platform (Frontend + Backend)

Ringkasan
- Dashboard UMKM dengan API terintegrasi AI (Therra) dan log bot.

Environment Variables
- Lihat file `apps/web/.env.example` dan set di Vercel.

Deploy ke Vercel
- Root: `apps/web`
- Build command: `npm run build`
- Output: Server (React Router + Hono)
- Set env: `DATABASE_URL`, `OPENROUTER_API_KEY`, `AUTH_SECRET`, `AUTH_URL`, `NEXT_PUBLIC_*`

Endpoint Penting
- `GET /api/products`
- `GET /api/orders`
- `POST /api/orders/insert`
- `POST /api/orders/update`
- `GET /api/analytics`
- `POST /api/analytics/add-expense`
- `POST /api/therra/chat`
- `POST /api/bot/save-log`, `GET /api/bot/save-log`

Verifikasi Bot Config
- Pastikan `DASHBOARD_API_URL` di bot mengarah ke domain Vercel.

