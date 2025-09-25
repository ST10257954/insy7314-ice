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


# INSY7314 – ICE Task 2 (Routing + Auth)

This part adds **routing** and **JWT-based authentication** to the backend from ICE 1.



## Project Structure (relevant)
lab-guide/
backend/
db/conn.mjs # Mongo connection & getDb()
middleware/auth.mjs # JWT verification (requireAuth)
routes/
user.mjs # /api/users (signup, login)
post.mjs # /api/posts (CRUD; protected where needed)
server.mjs # Express app + HTTPS + route mounting
keys/ # certificate.pem, privatekey.pem (self-signed)
.env # local secrets (gitignored)
package.json

yaml
Copy code

---

## Environment (.env)
Create `lab-guide/backend/.env` with your values:

MONGODB_URI="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/?retryWrites=true&w=majority&appName=<yourApp>"
DB_NAME="insy7314_ice"
JWT_SECRET="fe189d9140f60009c10309e1de8a0b...anything-long-and-random"

yaml
Copy code

> `JWT_SECRET` can be any long random string. Keep it private.

---

## Run
From `lab-guide/backend`:

npm install
npm run start
You should see:

pgsql
Copy code
Connected to MongoDB
HTTPS server on https://localhost:3000
The server uses HTTPS with a self-signed cert. Use -k in curl (or accept the cert in the browser).

Quick Tests (Windows CMD)
1) Health
cmd
Copy code
curl -k https://localhost:3000/health
2) Sign up (gets a token)
cmd
Copy code
curl -k -X POST https://localhost:3000/api/users/signup ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test1@example.com\",\"password\":\"Passw0rd!\"}"
Response:

json
Copy code
{"token":"<JWT_TOKEN_HERE>"}
3) (Optional) Login again to get a fresh token
cmd
Copy code
curl -k -X POST https://localhost:3000/api/users/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test1@example.com\",\"password\":\"Passw0rd!\"}"
4) Use the token for protected routes
Save token in CMD:

cmd
Copy code
set TOKEN=<paste the JWT from signup/login>
Create a post (protected)
cmd
Copy code
curl -k -X POST https://localhost:3000/api/posts ^
  -H "Authorization: Bearer %TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Hello\",\"content\":\"First post\"}"
List posts (public)
cmd
Copy code
curl -k https://localhost:3000/api/posts
Get single post
cmd
Copy code
curl -k https://localhost:3000/api/posts/<POST_ID>
Update a post (protected)
cmd
Copy code
curl -k -X PUT https://localhost:3000/api/posts/<POST_ID> ^
  -H "Authorization: Bearer %TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Updated\",\"content\":\"Updated content\"}"
Delete a post (protected)
cmd
Copy code
curl -k -X DELETE https://localhost:3000/api/posts/<POST_ID> ^
  -H "Authorization: Bearer %TOKEN%"

