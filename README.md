## gg.play

Launch your metaverse/game in no time. This repo contains a production-ready React + Express application that lets creators upload assets, preview them in 3D, persist them via Prisma/SQLite, and trigger a simulated build pipeline.

### Tech Stack
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui primitives, Zustand, react-hook-form + zod, @react-three/fiber + drei, react-dropzone, lucide-react, sonner.
- **Backend:** Node.js 20, Express, Prisma (SQLite), Multer, Helmet, CORS, express-rate-limit.

### Features
- Dark landing page with gradient hero, animated orbs, and CTA to the builder.
- Builder dashboard with segmented 2D/3D control (3D active, 2D coming soon tooltip).
- Drag-and-drop uploads with validation, friendly toasts, and progress indicators.
- Character (.glb) and model (.glb/.gltf) previews using @react-three/fiber with resettable camera, lighting, and animation selector.
- Optional world map upload with live thumbnail preview.
- Sticky “Build Game” footer button that validates asset selection, saves the default project, triggers `/api/build`, and polls build status to completion.
- Express API with secured routes, SQLite persistence, static asset serving, and simulated build jobs.

### Prerequisites
- Node.js **20+**
- npm 9+

### Getting Started
```bash
# 1. Clone repository and move into it
git clone <repo-url> && cd gg.play

# 2. Backend setup
cd server
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init

# 3. Frontend setup
cd ../client
npm install

# 4. Launch dev servers (runs client + server concurrently from the repo root)
cd ..
npm run dev
```

Open the UI at `http://localhost:5173`. The Express API runs on `http://localhost:5000`.

### Development Scripts
- `npm run dev` – concurrently starts `server` (ts-node-dev) and `client` (Vite).
- `npm run prisma:dev` – runs `server` Prisma migrate + generate helpers from the root.
- `npm --prefix server run build` – compile the API to `server/dist`.
- `npm --prefix client run build` – build the frontend production bundle.

### Environment Variables
`server/.env` (copy from `.env.example`):
```
DATABASE_URL="file:./dev.db"
PORT=5000
CLIENT_URL="http://localhost:5173"
UPLOAD_DIR="./uploads"
```

### API Overview
- `POST /api/upload/:type` — Upload an asset (`character`, `model`, `worldMap`). Returns `{ asset }`.
- `GET /api/assets/:id` — Fetch asset metadata.
- `POST /api/project` — Upsert the default project with selected asset IDs.
- `POST /api/build` — Create a build job, schedule simulated work, returns `{ jobId }`.
- `GET /api/build/:jobId` — Poll build job status (`QUEUED | PROCESSING | DONE | ERROR`).
- Static files served at `/uploads/<filename>`.

### Notes
- Upload size capped at 100MB per file; invalid formats surface friendly error messages.
- Build status transitions: `QUEUED → PROCESSING (3s) → DONE (~10s)`, with logs persisted in SQLite.
- The storage layer is abstracted so it can be replaced with S3 or another provider later.

