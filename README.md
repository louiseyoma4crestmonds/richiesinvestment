# QUANTUM PLUS — Production Deployment Guide for Ubuntu with Nginx & PM2

This guide provides end-to-end instructions for deploying and running **QUANTUM PLUS Industrial Partnership** on an **Ubuntu Linux Server (20.04 / 22.04 / 24.04 LTS)** using **PM2** as the Node process manager and **Nginx** as the reverse proxy with free automated SSL/TLS certificates via **Let's Encrypt (Certbot)**.

---

## 1. Architecture Overview

- **Frontend**: React 19 + TypeScript + Tailwind CSS v4, compiled into optimized static assets in `/dist`.
- **Backend**: Node.js + Express API (`server.ts`), serving:
  - Dynamic API endpoints under `/api/*` (authentication, user balances, crypto deposit addresses, investments, internal transfers, notifications, admin management).
  - Production static assets from `/dist` with single-page application (SPA) client routing fallback in production, or Vite dev middleware in development.
- **Port**: Default port is `3000` (configurable via `PORT` in `.env`).

---

## 2. Local Machine Quickstart (Windows, Mac, Linux)

Follow these steps to run QUANTUM PLUS locally on your computer:

### Step 1: Install Node.js
Ensure you have **Node.js (v18, v20, or v22 LTS)** installed on your machine:
- Download from [nodejs.org](https://nodejs.org/)
- Verify in your terminal/command prompt:
  ```bash
  node -v
  npm -v
  ```

### Step 2: Download / Extract the Project
Open your terminal (Terminal on macOS/Linux, or PowerShell / Command Prompt / Git Bash on Windows) and navigate to the project folder:
```bash
cd /path/to/quantum-plus
```

### Step 3: Create your Local `.env` File
Copy the example environment file:
```bash
# On Mac/Linux:
cp .env.example .env

# On Windows (PowerShell):
Copy-Item .env.example .env

# On Windows (CMD):
copy .env.example .env
```
Inside `.env`, verify or customize your settings:
```env
PORT=3000
NODE_ENV=development
ADMIN_EMAIL=admin@quantumindustrialpartnership.net
ADMIN_USERNAME=admin
ADMIN_PASSWORD=QuantumAdmin2026!
```

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Start the Development Server
```bash
npm run dev
```
You will see:
```text
QUANTUM PLUS Industrial Partnership server running on http://0.0.0.0:3000
```

### Step 6: Open the App in Your Browser
Open your browser and visit:
👉 **`http://localhost:3000`**

### Step 7: How to Log In
- **Admin Access**:
  - Click **Login** (top right) or navigate to `http://localhost:3000/signin`.
  - Enter username: `admin`
  - Enter password: `QuantumAdmin2026!` (or whatever you configured in `.env`).
  - You will be redirected directly into the **QUANTUM PLUS Admin Console**.
- **Investor Demo Account**:
  - Click **Login** $\rightarrow$ select the quick test button or enter username `ouimas` / password `Quantum2026!`.

---

## 3. Production Ubuntu Server Deployment (Nginx + PM2)

---

## 2. Server Requirements & Prerequisites

- An Ubuntu 20.04, 22.04, or 24.04 LTS server (minimum 1 GB RAM, 1 vCPU; 2 GB RAM recommended).
- A domain name (e.g., `quantumplus.example.com` or `yourdomain.com`) with DNS **A record** pointing to your Ubuntu server's public IP address.
- SSH access to your server with `root` or a user with `sudo` privileges.

---

## 3. Step-by-Step Server Setup

### Step 3.1: Update System Packages

SSH into your server and run:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git build-essential ufw software-properties-common
```

---

### Step 3.2: Install Node.js LTS (v20 or v22)

Use the official NodeSource repository to install Node.js:

```bash
# Download and setup NodeSource repository for Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

# Install Node.js and npm
sudo apt install -y nodejs

# Verify installation
node -v   # Should output v22.x.x
npm -v    # Should output 10.x.x
```

---

### Step 3.3: Install PM2 Globally

PM2 is a production process manager that keeps your application alive forever, restarts it after reboots, and enables zero-downtime reloads.

```bash
sudo npm install -g pm2
```

---

### Step 3.4: Configure the Firewall (UFW)

Secure your server by allowing SSH, HTTP, and HTTPS:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
sudo ufw status
```

---

## 4. Deploying the Application

### Step 4.1: Clone or Copy Your Codebase

Create an application directory (e.g., `/var/www/quantum-plus`):

```bash
sudo mkdir -p /var/www/quantum-plus
sudo chown -R $USER:$USER /var/www/quantum-plus
cd /var/www/quantum-plus

# If using Git:
# git clone <your-repository-url> .
```

*Note: If transferring files directly from your computer via SCP/RSYNC:*
```bash
# Example from your local machine:
# rsync -avz --exclude 'node_modules' --exclude '.git' ./ user@SERVER_IP:/var/www/quantum-plus/
```

---

### Step 4.2: Configure Production Environment Variables

Create your production `.env` file from the provided `.env.example`:

```bash
cd /var/www/quantum-plus
cp .env.example .env
nano .env
```

Set your configuration values:

```env
# Application Environment
NODE_ENV=production
PORT=3000

# Canonical domain URL (replace with your actual domain)
APP_URL=https://quantumplus.example.com

# Default Administrator Credentials
# (These create and guard the ROOT admin account during database initialization)
ADMIN_EMAIL=admin@quantumindustrialpartnership.net
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourStrongAdminPassword2026!

# Optional Gemini API key if AI assistance modules are enabled
# GEMINI_API_KEY=your_gemini_api_key_here
```

Press `Ctrl + O` then `Enter` to save, and `Ctrl + X` to exit `nano`.

---

### Step 4.3: Install Dependencies & Build Frontend

```bash
cd /var/www/quantum-plus

# Install all dependencies
npm install

# Compile the React frontend into production static assets (/dist)
npm run build

# Create log directory for PM2
mkdir -p logs
```

Verify that the `dist/` directory was generated:
```bash
ls -la dist/
```

---

## 5. Running the Application with PM2

### Option A: Using the Included Ecosystem File (Recommended)

The repository includes a pre-configured `ecosystem.config.cjs`:

```bash
cd /var/www/quantum-plus
pm2 start ecosystem.config.cjs
```

### Option B: Running Directly via PM2 Command

Alternatively, start the server directly:

```bash
cd /var/www/quantum-plus
pm2 start "npx tsx server.ts" --name "quantum-plus" --time
```

### Enable Automatic Restart on System Boot

Run the following command so PM2 automatically restarts the application if the server reboots:

```bash
pm2 startup
```

PM2 will output a command specific to your system (e.g., `sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u youruser --hp /home/youruser`). **Copy and run that command in your terminal**, then save the PM2 process list:

```bash
pm2 save
```

### Verify Application Status

```bash
pm2 status
pm2 logs quantum-plus --lines 20
curl http://127.0.0.1:3000
```
You should see `QUANTUM PLUS Industrial Partnership server running on http://0.0.0.0:3000` in the logs and an HTTP 200 response from curl.

---

## 6. Configuring Nginx Reverse Proxy

### Step 6.1: Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

### Step 6.2: Create Nginx Server Block

Create a configuration file for **QUANTUM PLUS**:

```bash
sudo nano /etc/nginx/sites-available/quantumplus
```

Paste the following configuration (replace `quantumplus.example.com` and `www.quantumplus.example.com` with your actual domain):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name quantumplus.example.com www.quantumplus.example.com;

    # Maximum upload size for document/receipt uploads
    client_max_body_size 25M;

    # Gzip Compression for high-performance asset delivery
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript application/json;
    gzip_disable "MSIE [1-6]\.";

    # Cache static build assets
    location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|eot|ttf|svg|webp)$ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
    }

    # Pass all other traffic and APIs to Node.js backend
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        
        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Press `Ctrl + O` then `Enter` to save, and `Ctrl + X` to exit.

---

### Step 6.3: Enable the Site & Test Nginx

```bash
# Link to sites-enabled
sudo ln -s /etc/nginx/sites-available/quantumplus /etc/nginx/sites-enabled/

# Remove default Nginx welcome page if present
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration syntax
sudo nginx -t
```
You should see:
`nginx: configuration file /etc/nginx/nginx.conf test is successful`

Reload Nginx:
```bash
sudo systemctl reload nginx
```

---

## 7. Securing with Free SSL (Let's Encrypt / Certbot)

Install Certbot and obtain an SSL certificate:

```bash
sudo apt install -y certbot python3-certbot-nginx

# Obtain and install certificate (replace with your real domain and email)
sudo certbot --nginx -d quantumplus.example.com -d www.quantumplus.example.com
```

- When prompted, provide your email for renewal notifications and agree to terms.
- Certbot will automatically configure HTTPS redirection on your Nginx server block.

Test auto-renewal:
```bash
sudo certbot renew --dry-run
```

---

## 8. Admin Portal Access & Management

### Logging In as Administrator:
1. Open your browser and navigate to `https://quantumplus.example.com`.
2. Click **Login** or navigate to `https://quantumplus.example.com/signin`.
3. Enter your admin credentials (configured in `.env`):
   - **Username / Email**: Value of `ADMIN_USERNAME` (default `admin`) or `ADMIN_EMAIL`
   - **Password**: Value of `ADMIN_PASSWORD` (default `QuantumAdmin2026!`)
4. Upon successful login, you will enter the **QUANTUM PLUS Admin Console**.

### Admin Features Available:
- **Financial Balance Management**: Edit any user's active balance, earned profits, and referral bonuses in real-time.
- **Deposit Crypto Gateway**: Add, update, and manage receiving wallet addresses for BTC, ETH, USDT (TRC-20 & ERC-20).
- **Internal Transfers**: Approve, monitor, and manage peer-to-peer transfers between users.
- **Investment Contract Oversight**: View and adjust all active plans, durations, and maturity statuses.

---

## 9. Day-to-Day Maintenance & Zero-Downtime Updates

When you push new updates or make changes to the application:

```bash
cd /var/www/quantum-plus

# 1. Pull the latest code
git pull

# 2. Install any new dependencies
npm install

# 3. Rebuild frontend production assets
npm run build

# 4. Zero-downtime reload with PM2
pm2 reload quantum-plus
```

### Useful Management Commands

| Task | Command |
|---|---|
| View application status | `pm2 status` |
| View real-time logs | `pm2 logs quantum-plus` |
| Restart server process | `pm2 restart quantum-plus` |
| Stop server process | `pm2 stop quantum-plus` |
| Monitor CPU & Memory | `pm2 monit` |
| Test Nginx config | `sudo nginx -t` |
| Reload Nginx | `sudo systemctl reload nginx` |
| View Nginx error log | `sudo tail -f /var/log/nginx/error.log` |
| Renew SSL certificate | `sudo certbot renew` |

---

## 10. Troubleshooting

- **502 Bad Gateway**: Verify that the Node app is running on port 3000 (`pm2 status` and `curl http://127.0.0.1:3000`). If stopped, inspect error logs (`pm2 logs quantum-plus --err`).
- **Permission Denied**: Ensure `/var/www/quantum-plus` has appropriate permissions (`sudo chown -R $USER:$USER /var/www/quantum-plus`).
- **Nginx Config Test Failure**: Check syntax with `sudo nginx -t` and verify that the domain name is spelled correctly and not duplicated.
