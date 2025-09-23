# INSY7314 – ICE Task 1 (Lab Guide up to p.33)

This repository contains my work for **ICE Task 1**, covering the lab guide **from the start up to page 33 (before Routing)**.  
It runs an **HTTPS Express** backend connected to **MongoDB Atlas**, plus evidence screenshots.

---

## Overview
- Tech: Node.js, Express, MongoDB Atlas, OpenSSL (self-signed certs)
- Endpoint: `GET /health` → `{ "status": "ok" }`
- HTTPS: `https://localhost:3000` (self-signed; proceed in browser)

---

## Prerequisites
- Node.js (18+ recommended)
- MongoDB Atlas cluster + connection string
- OpenSSL installed (to generate local certs)

---

## Setup

1) **Install dependencies**
cd lab-guide/backend
npm install

2) Create .env (in lab-guide/backend)

MONGODB_URI="mongodb+srv://<user>:<pass>@<cluster>/?retryWrites=true&w=majority"


3) Add HTTPS certs (generated with OpenSSL)
Place these files in lab-guide/backend/keys/:

privatekey.pem
certificate.pem


Note: .env, keys/, *.pem, and node_modules/ are ignored by .gitignore.

Run
# from lab-guide/backend
npm run start      # or: npm run dev (with nodemon)


Verify:

Open https://localhost:3000 → “Cannot GET /” is expected (no root route).

Open https://localhost:3000/health → should return:

{ "status": "ok" }

Evidence (ICE 1)

Screenshots are stored in:

lab-guide/Evidence/ICE1/


Terminal running the server (MongoDB connected + HTTPS started)

Browser at https://localhost:3000

Browser at https://localhost:3000/health showing { "status": "ok" }

Project Structure (relevant)
lab-guide/
  backend/
    db/conn.mjs
    keys/                # privatekey.pem, certificate.pem (ignored)
    .env                 # Mongo URI (ignored)
    .gitignore
    package.json
    server.mjs           # HTTPS Express + /health
  Evidence/
    ICE1/                # screenshots
