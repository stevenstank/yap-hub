# YapHub

YapHub is a full-stack messaging web app built as a learning project. It uses a monorepo setup with a React + Vite frontend and a Node.js + Express backend, plus PostgreSQL with Prisma for data storage. The app focuses on clean fundamentals: authentication, one-to-one messaging, profile management, and an AI chat assistant.

## Live Demo

- Frontend: [https://yap-hub.vercel.app](https://yap-hub.vercel.app)
- Backend: [https://yap-hub.onrender.com](https://yap-hub.onrender.com)
- GitHub: [https://github.com/stevenstank/yap-hub](https://github.com/stevenstank/yap-hub)

## Features

- User authentication with signup, login, logout, JWT, and password hashing
- User profiles with username, bio, and profile picture
- One-to-one messaging using REST APIs
- Chat UI with left/right message alignment
- Message deletion restricted to the original sender
- AI chat assistant integrated into the chat sidebar
- Gemini API support with fallback responses if the AI request fails
- Unread conversation indicator support
- Dark UI with black surfaces and yellow accents

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Custom dark theme styling
- Deployed on Vercel

### Backend

- Node.js
- Express
- Prisma ORM
- JWT with `jsonwebtoken`
- `bcrypt` for password hashing
- Gemini API via `@google/genai`
- Deployed on Render

### Database

- PostgreSQL
- Neon

## Monorepo Structure

```text
yap-hub/
├── apps/
│   ├── backend/
│   │   ├── prisma/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── lib/
│   │   │   ├── middleware/
│   │   │   └── routes/
│   │   ├── .env
│   │   ├── index.js
│   │   └── package.json
│   └── frontend/
│       ├── public/
│       ├── src/
│       │   ├── api/
│       │   ├── components/
│       │   ├── context/
│       │   ├── hooks/
│       │   ├── pages/
│       │   └── styles/
│       └── package.json
└── README.md
```

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/stevenstank/yap-hub.git
cd yap-hub
```

### 2. Install dependencies

Backend:

```bash
cd apps/backend
npm install
```

Frontend:

```bash
cd ../frontend
npm install
```

### 3. Set up environment variables

Create `apps/backend/.env`:

```env
PORT=5000
DATABASE_URL=your_neon_postgresql_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Frontend:

- The current frontend does not require a mandatory `.env` file to run locally.
- API requests are currently handled through `src/api/axios.js`.
- If you want environment-based API URLs later, you can add a Vite env variable such as `VITE_API_URL` and wire it into the Axios config.

### 4. Set up the database

From `apps/backend`:

```bash
npx prisma migrate dev
npx prisma generate
```

Optional:

```bash
npx prisma studio
```

### 5. Run the backend

From `apps/backend`:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

### 6. Run the frontend

From `apps/frontend`:

```bash
npm run dev
```

Frontend usually runs on:

```text
http://localhost:5173
```

## Environment Variables

### Backend

- `PORT`: backend port, defaults to `5000`
- `DATABASE_URL`: Neon PostgreSQL connection string
- `JWT_SECRET`: secret used to sign and verify JWT tokens
- `GEMINI_API_KEY`: Gemini API key for the AI assistant

### Frontend

- No required environment variables in the current implementation

## API Overview

Base URL:

```text
/api
```

### Auth

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`

### Users

- `GET /users`
- `GET /users/:id`
- `PUT /users/:id`

### Messages

- `POST /messages`
- `GET /messages/:userId`
- `GET /messages/conversations`
- `DELETE /messages/:id`

### AI

- `POST /ai`
- `GET /ai`

### Utility

- `GET /health`
- `GET /db-test`

## Deployment

### Frontend on Vercel

- The React app is deployed from the `apps/frontend` directory
- Build command: `npm run build`
- Output directory: `dist`

### Backend on Render

- The Express API is deployed from the `apps/backend` directory
- Start command: `npm start`
- Environment variables are managed in Render
- Database connection points to Neon PostgreSQL

## Future Improvements

- Real-time messaging with WebSockets or Socket.IO
- Typing indicators
- Read receipts
- Push or in-app notifications
- Better conversation sorting and unread tracking
- Media/file uploads
- Better frontend environment configuration
- More polished AI chat memory and context handling

## Author

Built by [stevenstank](https://github.com/stevenstank)

If you want to explore the code, start here:

- Frontend: [apps/frontend](/home/stevenstank/yap-hub/apps/frontend)
- Backend: [apps/backend](/home/stevenstank/yap-hub/apps/backend)
