# Track-A-Bull

## Local setup
1) Copy `.env.example` to `.env` and fill in values.
2) Install deps: `npm install`
3) Run the app: `npm run ios` or `npm run android` or `npm run web`

## Supabase
- Client uses only:
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Edge Function uses:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`

## Notes
- `app.config.ts` loads `.env` via `dotenv/config` and only exposes `EXPO_PUBLIC_*` vars.
- The app logs a Supabase health check on startup.
