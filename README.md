# Document Signature Web Application

A full-stack, secure document signing platform that allows users to upload PDF documents, place visual signatures on them, download signed PDFs, and view audit trails of all signing activities.

---

## 🏗️ Architecture Overview

The project is structured as a decoupled Monorepo split into:
1. **Frontend (`/client`)**: Built with React, Vite, and React Router. It uses `react-pdf` for rendering PDF documents and `react-draggable` for placing signature blocks.
2. **Backend (`/server`)**: A Node.js and Express server connecting to a MongoDB database (via Mongoose), utilizing JWT for authentication, Multer for file uploads, and PDF-Lib for appending visual signatures to PDF files.

---

## 🛠️ The "Problem Fetches" (Centralized API Fix)

Previously, multiple client pages and components had hardcoded API request URLs pointing directly to `http://localhost:5000`. This caused all requests to fail in production when the frontend was deployed.

### The Solution:
We centralized all network traffic through a single custom Axios instance configured at [api.js](file:///c:/Users/panig/OneDrive/Desktop/document-signature/client/src/services/api.js):
```javascript
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

export default API;
```
All components now import this instance. For production, the API URL is dynamically determined by the `VITE_API_URL` environment variable. If it is not provided, it falls back to `http://localhost:5000` for seamless local development.

---

## 💻 Local Setup & Development

We have configured root-level utility scripts in the main [package.json](file:///c:/Users/panig/OneDrive/Desktop/document-signature/package.json) to simplify environment setup:

### 1. Install All Dependencies
Install node modules for the root directory, client, and server at once:
```bash
npm run install-all
```

### 2. Running Local Dev Servers
* **To run the Client**:
  ```bash
  npm run client-dev
  ```
* **To run the Server**:
  ```bash
  npm run server-dev
  ```

---

## 🚀 Production Deployment Guide

Deploying a decoupled monorepo requires specific configurations for the frontend and backend. Follow these steps to ensure a successful deployment.

---

### 📦 Backend Deployment (e.g., Render)

The backend runs on Node.js/Express and connects to MongoDB.

1. **Create a Web Service**: Link your GitHub repository.
2. **Configure Root Directory**: Set the **Root Directory** field to `server`.
3. **Build & Start Commands**:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. **Environment Variables**: Add the following under environment settings:
   - `MONGO_URI`: Your MongoDB connection string (e.g., `mongodb+srv://...`).
   - `JWT_SECRET`: A secure signing key for JWT tokens.
   - `PORT`: `5000` (or leave default if the hosting provider assigns it automatically).

> [!IMPORTANT]
> **MongoDB Atlas IP Whitelisting Alert:**
> The MongoDB user configured (e.g., `admin2`) will fail to connect if Atlas blocks incoming requests from your hosting provider's IPs. 
> To fix this:
> 1. Go to your MongoDB Atlas dashboard.
> 2. Navigate to **Network Access** under Security.
> 3. Click **Add IP Address**.
> 4. To allow traffic from all hosting IPs, add `0.0.0.0/0` (recommended for serverless/dynamic hosts like Render or Railway), or add the specific outbound static IPs provided by your host.

---

### 🎨 Frontend Deployment (e.g., Vercel)

The React client built with Vite needs proper SPA routing configuration to avoid `404: NOT_FOUND` errors when navigating to routes like `/dashboard` or `/login`.

1. **Create a New Project**: Import your GitHub repository.
2. **Configure Root Directory**: Set the **Root Directory** to `client`.
3. **Build settings**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**:
   - Add `VITE_API_URL` and set its value to your deployed backend URL (e.g., `https://document-signature-backend.onrender.com`). Do not include a trailing slash.
5. **SPA Routing Configuration (`vercel.json`)**:
   We have added the `vercel.json` configuration file at three strategic locations to guarantee routing functions correctly, regardless of Vercel settings:
   - **Repository Root**: [vercel.json](file:///c:/Users/panig/OneDrive/Desktop/document-signature/vercel.json) (used if the Vercel project's root directory is set to the repository root).
   - **Client Root**: [client/vercel.json](file:///c:/Users/panig/OneDrive/Desktop/document-signature/client/vercel.json) (used if the Vercel project's root directory is set to the `client` subdirectory).
   - **Client Public Assets**: [client/public/vercel.json](file:///c:/Users/panig/OneDrive/Desktop/document-signature/client/public/vercel.json) (copied directly into the built `dist` folder to ensure SPA rewrites are bundled with static assets).

   Its content routes all traffic to `index.html` so React Router can process views like `/dashboard` without returning Vercel's `404: NOT_FOUND`:
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
