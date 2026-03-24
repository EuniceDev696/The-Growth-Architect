# Growth Architect Deployment

This repo contains:

- `project/`: Vite + React frontend
- `server/`: Express + MongoDB API

Production is configured to run as one Node service:

- build the frontend into `project/dist`
- start the Express server
- serve the built frontend from Express
- keep API routes under `/api`

## Local production check

1. Copy `server/.env.example` to `server/.env` and set real values.
2. Build the frontend:

```bash
npm run build
```

3. Start the server:

```bash
npm start
```

4. Open `http://localhost:4000`

## Deploy on Render or Railway

Use the repo root as the service root.

- Build command: `npm run build`
- Start command: `npm start`

Required environment variables:

- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `APP_BASE_URL`
- `COOKIE_SECURE=true` for HTTPS deployments

Optional but recommended:

- `KEPLARS_API_KEY`
- `KEPLARS_API_BASE_URL` (optional, defaults to `https://api.keplars.com`)
- `MAIL_FROM`
- `CONTACT_EMAIL`
- `PAYSTACK_PUBLIC_KEY`
- `PAYSTACK_SECRET_KEY`

## Deployment notes

- Set `APP_BASE_URL` to your final public URL, for example `https://your-app.onrender.com`
- Because the frontend and API are served from the same origin in production, `VITE_API_BASE_URL` does not need to be set unless you split hosting later
- MongoDB must be reachable from the deployed server
- Email delivery now uses the Keplars REST API with `KEPLARS_API_KEY`, not SMTP credentials
- Client-side routes such as `/about`, `/admin/dashboard`, and `/client/dashboard` are handled by the Express SPA fallback
