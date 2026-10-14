# Whatsender MCP — Installation Manual & Deployment Guide

Whatsender MCP is an enterprise-grade multi-device WhatsApp gateway, chatbot builder, and REST API platform built on Next.js 16, Baileys, Prisma, and Socket.IO.

## 📞 Problems in Installing?
> **WhatsApp Us at +91 7002484119**  
> We provide complete installation, server setup, and configuration at as low as **at min price**.  
> Direct Chat Link: [https://wa.me/917002484119](https://wa.me/917002484119)

---

## 📋 System Prerequisites
- **Node.js**: v18.18+ or v20.x LTS
- **Database**: MySQL 8.0+ or PostgreSQL 14+
- **Process Manager**: PM2
- **Memory**: Minimum 1GB RAM (2GB recommended)

---

## 🚀 Step-by-Step Installation

### 1. Extract and Install
```bash
unzip whats-gateway-v1.0.0.zip -d /var/www/whats-gateway
cd /var/www/whats-gateway
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

### 3. Initialize the Database and Start
Set `DATABASE_URL` in `.env` to your PostgreSQL database, then run:
```bash
npm run db:push
node scripts/setup-admin.js your-email@example.com your-strong-password
npm run dev
```
Open `http://your-domain-or-ip:3000/auth/login` and sign in with your administrator credentials.

---

## 🔐 4. Default Administrator Login Credentials

Once installation or database setup is complete, access your dashboard with:

- **Login URL**: `http://your-server-ip:3000/auth/login`
- **Default Username / Email**: `admin@example.com`
- **Default Password**: `admin123`

### Create / Reset Admin via Command Line:
You can quickly create or update the superadmin credentials via terminal at any time:
```bash
node scripts/setup-admin.js admin@example.com admin123
```

---

## ⚡ 5. Production Deployment with PM2
```bash
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 📞 Support & Verification
- Portal: https://lab.webotapp.com
- Support: support@webotapp.com
- WhatsApp VIP Support: +91 7002484119
