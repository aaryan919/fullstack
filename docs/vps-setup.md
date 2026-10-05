# Verdant VPN — VPS Setup Guide

> **This is your single reference for the entire server provisioning process.**
> Follow sections in order. Each section assumes the previous one is complete.

---

## 0. Prerequisites

- A domain name pointed at your VPS IP (e.g. `yourdomain.com`)
- An `A` record for `api.yourdomain.com` → droplet IP
- Your Razorpay Key ID + Key Secret (test mode first)
- SSH access to a fresh Ubuntu 24.04 VPS

---

## 1. Create the VPS

**DigitalOcean (recommended):**
- Region: **BLR1** (Bangalore)
- Image: Ubuntu 24.04 LTS
- Size: **CPU-Optimized 2 vCPU / 4 GB** (~$42/mo) or General Purpose 2 vCPU / 4 GB ($24/mo)
  - _Do not use the cheapest shared CPU tier — jitter on gaming traffic will be noticeable_
- SSH key: add your public key during creation
- Enable: Monitoring, Backups (optional but recommended)

**GCP Compute Engine alternative:**
- Region: `asia-south1-b` (Mumbai)
- Machine: `c2-standard-2` (compute-optimized) or `e2-medium` (budget, less stable)
- OS: Ubuntu 24.04 LTS
- Static external IP: assign one

---

## 2. Initial Server Setup

```bash
# SSH in
ssh root@YOUR_DROPLET_IP

# Update packages
apt update && apt upgrade -y

# Create a non-root user (optional but good practice)
adduser verdant
usermod -aG sudo verdant

# Switch to user
su - verdant
```

---

## 3. Firewall (UFW)

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing

# SSH
sudo ufw allow OpenSSH

# Xray (VLESS+REALITY) — port 443 MUST be dedicated to Xray
sudo ufw allow 443/tcp

# Backend API (behind Nginx + SSL)
sudo ufw allow 8443/tcp

# 3X-UI panel — RESTRICT to YOUR OWN IP ONLY (never open to public)
# Replace YOUR_HOME_IP with your actual IP (check: curl ifconfig.me)
sudo ufw allow from YOUR_HOME_IP to any port 2087

sudo ufw enable
sudo ufw status verbose
```

> **Critical:** Postgres must NEVER be in the UFW allow list. It stays bound to localhost only.

---

## 4. Install Node.js 22 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version   # should output v22.x.x
npm --version
```

---

## 5. Install PostgreSQL 16

```bash
sudo apt install -y postgresql postgresql-contrib

# Start + enable
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Create DB + user
sudo -u postgres psql <<EOF
CREATE USER verdant WITH PASSWORD 'STRONG_PASSWORD_HERE';
CREATE DATABASE verdant OWNER verdant;
GRANT ALL PRIVILEGES ON DATABASE verdant TO verdant;
EOF

# Verify postgres is ONLY on localhost (never exposed externally)
sudo netstat -tlnp | grep 5432
# Should show: 127.0.0.1:5432 — if you see 0.0.0.0:5432, fix it:
# Edit /etc/postgresql/16/main/postgresql.conf
# listen_addresses = 'localhost'
# Then: sudo systemctl restart postgresql
```

---

## 6. Install 3X-UI Panel

```bash
# Install 3X-UI (official script)
bash <(curl -Ls https://raw.githubusercontent.com/MHSanaei/3x-ui/master/install.sh)

# During installation, set:
#   Panel port: 2087  (not the default)
#   Username: choose something non-obvious
#   Password: strong password (save this — goes in .env)

# After install, verify it's running
x-ui status
```

### 6.1 Configure VLESS + REALITY inbound in 3X-UI panel

1. Open: `http://YOUR_DROPLET_IP:2087` (from your home IP only)
2. Login with credentials you set above
3. **Inbounds → Add Inbound:**
   - Protocol: `vless`
   - Port: `443`
   - Transmission: `tcp`
   - Security: `reality`
   - Dest (SNI): `www.microsoft.com:443`  ← real popular HTTPS site
   - Server names: `www.microsoft.com`
   - uTLS fingerprint: `chrome`
4. Click **Generate** to create Reality keypair — **copy and save:**
   - Public key → `reality_public_key` (goes in DB seed + client config)
   - Short ID → `reality_short_id`
5. **Save the inbound**
6. Note the **Inbound ID** (visible in the inbound list) → goes in `.env` as `PANEL_INBOUND_ID`

### 6.2 Test manually (before deploying backend)

In 3X-UI: Inbounds → your inbound → Add client:
- email: `test_manual`
- Total GB: 1
- Expire days: 1

Copy the generated `vless://` link → import into v2rayNG on your phone → connect → run:
```bash
curl ifconfig.me   # should show your droplet IP, not your home IP
```
If that works, 3X-UI + Xray + REALITY is correctly configured. Delete the test client.

---

## 7. Install Nginx + Certbot

```bash
sudo apt install -y nginx certbot python3-certbot-nginx

# Create Nginx config for the API subdomain
sudo nano /etc/nginx/sites-available/verdant-api
```

Paste this (replace `api.yourdomain.com`):

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:8443;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/verdant-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d api.yourdomain.com
# Follow prompts — certbot auto-patches the Nginx config for HTTPS

# Verify auto-renewal
sudo systemctl status certbot.timer
```

> **Note:** Xray owns port 443 directly (not via Nginx). Nginx only handles `api.yourdomain.com` on port 80/443 for the **API subdomain** — the two don't conflict because they're on different (sub)domains. Xray listens on the IP's port 443; Nginx listens on port 80 (and Certbot-redirected 443 only for the API subdomain's SNI).

---

## 8. Deploy the Backend API

```bash
# Clone your repo
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git /home/verdant/app
cd /home/verdant/app/apps/api

# Install dependencies
npm install --production

# Set up environment variables
cp .env.example .env
nano .env
# Fill in:
#   DATABASE_URL=postgresql://verdant:STRONG_PASSWORD_HERE@localhost:5432/verdant
#   JWT_SECRET=<generate: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
#   JWT_REFRESH_SECRET=<generate another>
#   RAZORPAY_KEY_ID=rzp_live_...
#   RAZORPAY_KEY_SECRET=...
#   PANEL_BASE_URL=http://localhost:2087
#   PANEL_USERNAME=your_panel_username
#   PANEL_PASSWORD=your_panel_password
#   PANEL_INBOUND_ID=1   (or whatever 3X-UI shows)
#   FRONTEND_URL=https://yourdomain.com
#   NODE_ENV=production
#   PORT=8443
#   ADMIN_SECRET=<another strong random string for /api/vpn/revoke>

# Run the DB schema
psql $DATABASE_URL -f src/schema.sql

# Seed plans + server row
node src/seed.js
# IMPORTANT: after seeding, UPDATE the servers table with your real VPS details:
psql $DATABASE_URL -c "
  UPDATE servers SET
    ip_address = 'YOUR_DROPLET_IP',
    panel_url = 'http://localhost:2087',
    inbound_id = 1,
    reality_public_key = 'YOUR_REALITY_PUBLIC_KEY',
    reality_short_id = 'YOUR_SHORT_ID',
    reality_sni = 'www.microsoft.com'
  WHERE id = 1;
"
```

### 8.1 Start with PM2

```bash
sudo npm install -g pm2

pm2 start src/index.js --name verdant-api
pm2 save
pm2 startup   # follow the command it outputs to enable auto-start on reboot

# Check it's running
pm2 logs verdant-api --lines 20
curl http://localhost:8443/health
# Should return: {"status":"ok","ts":"..."}
```

### 8.2 Test via HTTPS

```bash
curl https://api.yourdomain.com/health
curl https://api.yourdomain.com/api/plans
```

---

## 9. Deploy the Frontend

```bash
# In your local repo:
cd apps/web
cp .env.example .env
# Set:
#   VITE_API_URL=https://api.yourdomain.com

# Build + push to Vercel (or Netlify):
# Option A: Connect GitHub repo to Vercel — it auto-deploys on push
# Option B: vercel deploy --prod

# In Vercel dashboard → Settings → Environment Variables:
#   VITE_API_URL = https://api.yourdomain.com
#   VITE_RAZORPAY_KEY_ID = rzp_live_...
```

---

## 10. Final Firewall Check

```bash
sudo ufw status numbered
# Should show ONLY:
#   OpenSSH (22)
#   443/tcp   (Xray)
#   8443/tcp  (Nginx→API — this can optionally be removed if Nginx is on 443)
#   2087 from YOUR_HOME_IP only

# Verify Postgres is local-only
ss -tlnp | grep 5432
# Must show 127.0.0.1:5432 only
```

---

## 11. End-to-End Test Checklist

Run through this yourself before sharing with friends:

- [ ] `curl https://api.yourdomain.com/health` returns `{"status":"ok"}`
- [ ] Sign up via frontend → token issued → redirected to dashboard
- [ ] Buy Leaf plan (₹69) with Razorpay test card `4111111111111111` → payment verified
- [ ] Dashboard shows QR code and subscription URL
- [ ] Import config into v2rayNG (Android) or v2rayN (Windows) → connect
- [ ] `curl ifconfig.me` from device shows **droplet IP**, not your home IP
- [ ] Launch Valorant → check ping (target: ≤30ms)
- [ ] In 3X-UI panel: lower the test client's `totalGB` to 0.001 → client auto-disabled
- [ ] Dashboard status updates to "data exceeded" within 15 minutes (usage sync job)
- [ ] Renew from Account page → payment → client re-enabled → QR updated

---

## 12. Upgrade VPS Size (if needed)

If ping degrades under concurrent gaming load from multiple friends:
- DigitalOcean: Droplet → Resize (takes ~2 min, downtime included)
- No data migration needed — everything lives on the same disk

When to split into 2 droplets: see PRD §3.2.

---

## 13. Useful Commands

```bash
# Restart API
pm2 restart verdant-api

# View logs
pm2 logs verdant-api

# Restart 3X-UI
x-ui restart

# Reload Nginx after config change
sudo nginx -t && sudo systemctl reload nginx

# Check Xray is on 443
ss -tlnp | grep 443

# Manual usage sync (triggers the cron job immediately)
curl -X POST http://localhost:8443/api/internal/sync  # or restart pm2

# Check DB
psql $DATABASE_URL -c "SELECT * FROM users;"
psql $DATABASE_URL -c "SELECT id, email_tag, status, data_used_bytes FROM vpn_clients;"
```
