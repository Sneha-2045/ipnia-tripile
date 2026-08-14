# IPNIA Payment API (Cashfree + MongoDB Atlas)

Production-ready **payment-only** backend for the IPNIA travel website.

> This service does **not** replace or modify the existing React/Vite frontend on S3 + CloudFront.  
> Flight/hotel booking APIs are intentionally **not** implemented yet — the layout is modular so they can be added later.

---

## 1. Architecture

```
React Frontend (https://ipnia.com)
        │  HTTPS REST
        ▼
Node.js + Express (https://api.ipnia.com)
        │
        ├──► Cashfree Payment Gateway
        │         │
        │         └── webhook ──► POST /api/payments/webhook
        │
        └──► MongoDB Atlas
```

| Layer | Technology |
|-------|------------|
| Frontend | Existing React/Vite on S3 + CloudFront + Route 53 |
| Backend | Node.js + Express |
| Payments | Cashfree PG API |
| Database | MongoDB Atlas + Mongoose |

---

## 2. Folder structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── cashfree.js
│   ├── controllers/
│   │   └── paymentController.js
│   ├── models/
│   │   └── Payment.js
│   ├── routes/
│   │   └── paymentRoutes.js
│   ├── services/
│   │   └── cashfreeService.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── validatePayment.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

Future modules (not included yet):

```
src/routes/flightRoutes.js
src/routes/hotelRoutes.js
src/routes/bookingRoutes.js
```

Mount them in `src/app.js` next to `/api/payments` without rewriting payments.

---

## 3. Prerequisites

- Node.js **18+**
- npm 9+
- MongoDB Atlas account
- Cashfree merchant account (Sandbox first)
- (Production) AWS EC2, domain `api.ipnia.com`, Nginx, SSL

---

## 4. Required npm packages

```bash
cd backend
npm install
```

**Dependencies**

| Package | Purpose |
|---------|---------|
| `express` | HTTP API |
| `mongoose` | MongoDB ODM |
| `dotenv` | Environment variables |
| `cors` | CORS allowlist |
| `helmet` | Security headers |
| `morgan` | Request logging |
| `express-rate-limit` | Rate limit create-order |
| `uuid` | Unique IPNIA order IDs |

**Dev**

| Package | Purpose |
|---------|---------|
| `nodemon` | Local reload (`npm run dev`) |

---

## 5. Environment variables

Copy the example file:

```bash
cp .env.example .env
```

Fill in `.env` (never commit this file):

```env
PORT=5000
NODE_ENV=development
API_PUBLIC_URL=http://localhost:5000
FRONTEND_URL=https://ipnia.com
FRONTEND_DEV_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/ipnia?retryWrites=true&w=majority
CASHFREE_CLIENT_ID=your_sandbox_client_id
CASHFREE_CLIENT_SECRET=your_sandbox_client_secret
CASHFREE_ENV=sandbox
CASHFREE_API_VERSION=2025-01-01
CASHFREE_WEBHOOK_SECRET=
```

**Security rules**

- Never put `MONGODB_URI` or `CASHFREE_CLIENT_SECRET` in `VITE_*` frontend vars.
- Never expose secrets to the browser.
- `.env` is gitignored.

---

## 6. MongoDB Atlas setup

1. Create a cluster in [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user (username + strong password).
3. **Network Access**
   - Local: allow your IP.
   - EC2: allow the EC2 public IP (or Atlas VPC peering later).
4. Create / use database name e.g. `ipnia`.
5. Copy the connection string into `MONGODB_URI`.
6. Indexes created by Mongoose on first write:
   - unique `ipniaOrderId`
   - `cashfreeOrderId`, `cashfreePaymentId`, `customer.email`

---

## 7. Cashfree Sandbox setup

1. Sign up / log in to Cashfree.
2. Open **Payment Gateway → Developers / API Keys**.
3. Copy **App ID** → `CASHFREE_CLIENT_ID`
4. Copy **Secret Key** → `CASHFREE_CLIENT_SECRET`
5. Set `CASHFREE_ENV=sandbox`
6. Sandbox API base: `https://sandbox.cashfree.com/pg`
7. Production API base: `https://api.cashfree.com/pg` (used when `CASHFREE_ENV=production`)

Webhook URL (after deploy):

```text
https://api.ipnia.com/api/payments/webhook
```

For local webhook testing use a tunnel (ngrok / Cloudflare Tunnel) and set:

```env
API_PUBLIC_URL=https://YOUR_TUNNEL_URL
```

Then register that notify URL in Cashfree / use the `notify_url` sent on order create.

---

## 8. Run locally

```bash
cd backend
cp .env.example .env
# edit .env
npm install
npm run dev
# or: npm start
```

---

## 9. API endpoints

### `GET /health`

```json
{
  "status": "ok",
  "service": "IPNIA Payment API"
}
```

### `POST /api/payments/create-order`

Request:

```json
{
  "amount": 1000,
  "currency": "INR",
  "customer": {
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210"
  }
}
```

Response `201`:

```json
{
  "success": true,
  "orderId": "IPNIA_...",
  "paymentSessionId": "...",
  "amount": 1000,
  "currency": "INR",
  "paymentStatus": "PENDING"
}
```

### `POST /api/payments/webhook`

- Verifies `x-webhook-signature` + `x-webhook-timestamp`
- Idempotent via `processedWebhookIds`
- Updates MongoDB payment status
- Returns HTTP 200

### `GET /api/payments/:orderId/status`

Returns safe payment fields only (no secrets).  
If status is still `PENDING`, backend refreshes from Cashfree.

---

## 10. Local testing steps

### Health

```bash
curl -s http://localhost:5000/health
```

### Create order

```bash
curl -s -X POST http://localhost:5000/api/payments/create-order \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{
    "amount": 1000,
    "currency": "INR",
    "customer": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "9876543210"
    }
  }'
```

Save `orderId` and `paymentSessionId` from the response.

### Status

```bash
curl -s http://localhost:5000/api/payments/IPNIA_YOUR_ORDER_ID/status
```

### Checkout (browser)

Use Cashfree JS SDK with `paymentSessionId` (see Frontend integration below).  
Complete a Sandbox payment, then re-check status and/or inspect webhook logs.

### Webhook

1. Expose local server: `ngrok http 5000`
2. Set `API_PUBLIC_URL` to the ngrok HTTPS URL and restart
3. Create a new order (so `notify_url` uses the tunnel)
4. Complete payment in Sandbox
5. Confirm MongoDB document updates (`paymentStatus`, `webhookReceived: true`)

**Never mark SUCCESS only because the user landed on a frontend success page.**

---

## 11. Frontend integration (existing React app — no UI rewrite here)

Your frontend should call the **backend**, never Cashfree secrets.

### Step A — create order

```ts
const res = await fetch("https://api.ipnia.com/api/payments/create-order", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    amount: 1000, // later: omit and send bookingId once bookings exist
    currency: "INR",
    customer: {
      name: "Test User",
      email: "test@example.com",
      phone: "9876543210",
    },
  }),
});

const data = await res.json();
// data.orderId, data.paymentSessionId
```

Local:

```text
http://localhost:5000/api/payments/create-order
```

### Step B — open Cashfree Checkout

Load Cashfree checkout.js (Sandbox or Production script per Cashfree docs), then:

```js
const cashfree = new Cashfree({
  mode: "sandbox", // or "production"
});

cashfree.checkout({
  paymentSessionId: data.paymentSessionId,
  redirectTarget: "_self",
});
```

### Step C — confirm status from backend

After return / callback:

```ts
const statusRes = await fetch(
  `https://api.ipnia.com/api/payments/${orderId}/status`
);
const statusJson = await statusRes.json();
// Trust statusJson.payment.paymentStatus from backend only
```

---

## 12. Payment statuses

| Status | Meaning |
|--------|---------|
| `PENDING` | Order created / payment not completed |
| `SUCCESS` | Paid (webhook and/or Cashfree verify) |
| `FAILED` | Payment failed |
| `USER_DROPPED` | User abandoned / expired |
| `UNKNOWN` | Unmapped Cashfree state |

---

## 13. AWS EC2 deployment (`api.ipnia.com`)

### 13.1 Create EC2

1. Launch Ubuntu 22.04 LTS (t3.small or better).
2. Security group inbound:
   - `22` SSH (your IP)
   - `80` HTTP
   - `443` HTTPS
3. Note public IP / Elastic IP.

### 13.2 Install Node.js

```bash
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx
node -v
```

### 13.3 Deploy backend

```bash
# example
cd /var/www
sudo mkdir -p ipnia-api
sudo chown $USER:$USER ipnia-api
# upload backend/ via git clone or scp
cd /var/www/ipnia-api
npm install --omit=dev
cp .env.example .env
nano .env   # set production values
```

Production `.env` highlights:

```env
NODE_ENV=production
PORT=5000
API_PUBLIC_URL=https://api.ipnia.com
FRONTEND_URL=https://ipnia.com
MONGODB_URI=mongodb+srv://...
CASHFREE_ENV=sandbox   # switch to production later
CASHFREE_CLIENT_ID=...
CASHFREE_CLIENT_SECRET=...
```

### 13.4 MongoDB Atlas network access

Add the EC2 Elastic IP to Atlas **Network Access**.

### 13.5 PM2

```bash
sudo npm install -g pm2
pm2 start src/server.js --name ipnia-payment-api
pm2 save
pm2 startup
```

### 13.6 Nginx reverse proxy

`/etc/nginx/sites-available/api.ipnia.com`:

```nginx
server {
    listen 80;
    server_name api.ipnia.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/api.ipnia.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 13.7 DNS (Route 53)

Create an **A** record:

```text
api.ipnia.com → EC2 Elastic IP
```

(Or ALIAS to load balancer if you add one later.)

### 13.8 HTTPS (Let’s Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.ipnia.com
```

### 13.9 Cashfree webhook

In Cashfree dashboard set webhook / notify URL:

```text
https://api.ipnia.com/api/payments/webhook
```

Must be publicly reachable over HTTPS.

### 13.10 Frontend CORS

Backend already allows `https://ipnia.com`.  
Ensure CloudFront/S3 site calls `https://api.ipnia.com` (not localhost).

---

## 14. Sandbox → Production switch

1. Generate **production** Cashfree keys.
2. Update EC2 `.env`:
   - `CASHFREE_ENV=production`
   - production `CASHFREE_CLIENT_ID` / `CASHFREE_CLIENT_SECRET`
3. Point frontend Cashfree SDK `mode: "production"`.
4. Confirm webhook URL still `https://api.ipnia.com/api/payments/webhook`.
5. `pm2 restart ipnia-payment-api`
6. Run a small live test carefully.

---

## 15. Security checklist

- [x] Secrets only in backend env
- [x] CORS allowlist (no `*`)
- [x] Input validation on create-order
- [x] Webhook signature verification
- [x] Idempotent webhook handling
- [x] Status never trusted from frontend alone
- [x] Rate limiting on create-order
- [x] Helmet + centralized errors
- [x] No card/UPI PAN storage

---

## 16. Amount trust (important)

Today the frontend sends `amount` (validated).  

When booking APIs exist:

1. Create booking in MongoDB with server-calculated `payableAmount`
2. Call create-order with `bookingId`
3. Backend loads booking and uses **that** amount (`sourceAmountFromBooking: true`)

A `bookingId` stub is already reserved in the Payment model / controller.

---

## 17. Support

- Health: `GET /health`
- Payments: `/api/payments/*`
- Company: Ipnia Services Pvt Ltd
- Site: https://ipnia.com
