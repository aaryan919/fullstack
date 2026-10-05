# Project Verdant / VPN Management System

A comprehensive, full-stack VPN management and provisioning system built with a React frontend, Node.js/Express API, and automated VLESS/Reality protocol provisioning via 3x-ui panels.

## 🏗️ Architecture

This repository operates as a monorepo containing both the frontend application and the backend API service.

- **`apps/web`**: The frontend React application built with Vite.
- **`apps/api`**: The backend Express REST API.
- **`docker-compose.dev.yml`**: Local infrastructure orchestration (PostgreSQL, pgAdmin, and a local 3x-ui test instance).

---

## 💻 Tech Stack & Technical Details

### Frontend (`apps/web`)
The frontend is a modern, responsive Single Page Application (SPA) utilizing cutting-edge web technologies:
- **Core:** React 18, React Router v7, Vite.
- **Styling & UI:** Tailwind CSS, Radix UI primitives, `class-variance-authority`, Framer Motion for micro-animations, and custom GLSL shader backgrounds (`ogl`).
- **Data Visualization:** Recharts for network usage and server statistics.
- **State & Forms:** `react-hook-form` integrated with `zod` for robust schema validation.
- **Theme:** `next-themes` for seamless dark/light mode toggling.

### Backend (`apps/api`)
The backend is a robust RESTful API designed for high availability and secure operations:
- **Core:** Node.js, Express.js.
- **Database:** PostgreSQL (raw `pg` queries mapping to a relational schema), with migration managed via `setup_db.sql`.
- **Authentication:** Stateless JWT (JSON Web Tokens) with `bcryptjs` for secure password hashing.
- **Payment Processing:** Integrated with Razorpay for subscription lifecycle management.
- **VPN Provisioning Service (`vpn_service.js`):** Interacts programmatically with remote `3x-ui` Xray panels to automate the creation, suspension, and data monitoring of VLESS + XTLS-Reality inbound clients.
- **Background Jobs:** Uses `node-cron` to continuously sync usage statistics from remote servers to the local PostgreSQL database.
- **Security:** `helmet` for HTTP header protection, `express-rate-limit` to prevent brute force attacks, and comprehensive CORS configuration.

### Infrastructure & Database Setup
The data layer utilizes PostgreSQL 16. Key tables include:
- `users`: Standard user data and roles (admin vs. customer).
- `servers`: Remote VPN server credentials, endpoints, and health status.
- `plans`: Pricing tiers and bandwidth allocations.
- `subscriptions`: Active user subscriptions linked to Razorpay payments.
- `vpn_accounts`: The individual generated Xray clients (UUIDs) tied to users and servers.

---

## 🚀 Getting Started

### Prerequisites
1. **Node.js** (v18 or higher recommended)
2. **Docker Desktop** (for running PostgreSQL and local testing instances)
3. **Git**

### 1. Environment Configuration

Copy the example environment files and fill in your actual credentials.

**Backend (`apps/api/.env`):**
```env
PORT=5000
DATABASE_URL=postgres://verdant:changeme@localhost:5433/verdant
JWT_SECRET=your_super_secret_jwt_key
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

**Frontend (`apps/web/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

**Root Docker Configuration (`.env`):**
```env
POSTGRES_USER=verdant
POSTGRES_PASSWORD=changeme
POSTGRES_DB=verdant
PGADMIN_DEFAULT_EMAIL=admin@local.dev
PGADMIN_DEFAULT_PASSWORD=admin
```

### 2. Infrastructure Setup (Docker)

Spin up the required background services (PostgreSQL, pgAdmin, and a local 3x-ui instance):
```bash
docker compose -f docker-compose.dev.yml up -d
```
*Note: Postgres is mapped to port 5433 locally to avoid conflicts with existing port 5432 installations.*

### 3. Database Initialization

Once the database container is running, seed the database with the initial schema:
```bash
cd apps/api
npm run seed
```
This script executes `schema.sql` to generate the required tables and initial setup data.

### 4. Running the Development Servers

Install dependencies and start the backend:
```bash
cd apps/api
npm install
npm run dev
```

In a new terminal window, install dependencies and start the frontend:
```bash
cd apps/web
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

---

## 🔐 Security & Secrets Management
Do **not** commit any `.env`, `.pem`, or `credentials.json` files. The `.gitignore` is pre-configured to strictly ignore common secret patterns to prevent accidental leakage of Xray Panel API credentials, Razorpay secrets, or database passwords.

## 🤝 Contribution Guidelines
When making UI modifications, prioritize using the existing Radix UI primitives and Tailwind configuration rather than writing ad-hoc CSS. Ensure `npm run lint` passes before submitting pull requests.
