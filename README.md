
  # Kitchen Dashboard 🍳

> A Full Stack MERN application for managing restaurant dishes with **instant real-time synchronization**.

## 🚀 Live Demo

- **Frontend (AWS S3)**: [INSERT YOUR AWS S3 URL HERE]
- **Backend (Render)**: https://kitchen-api-uivw.onrender.com

---

## ✨ The "Bonus" Feature: Real-Time Sync

This application goes beyond simple CRUD. It implements a **Real-Time Watcher** architecture to ensure the dashboard is *always* up to date, regardless of where the change originates.

### How it works:
1.  **MongoDB Change Streams**: The backend uses `Dish.watch()` to listen for *any* modification to the `dishes` collection directly at the database level.
2.  **Socket.io**: When a database change is detected (insert, update, delete), the server immediately emits a `dishesUpdated` event to all connected clients.
3.  **Instant UI Update**: The React frontend listens for this event and triggers a re-fetch, updating the UI instantly without a page reload.

**Why this matters:**
If an admin updates a dish directly in the database (e.g., via MongoDB Compass) or another API service modifies the data, the dashboard updates automatically. No manual refresh required.

---

## 📝 Note to Reviewer (Trade-offs)

To make testing this live deployment as easy as possible for you, **I have hardcoded the production API URL in the frontend code.**

Normally, this would be handled via environment variables (`.env`). However, hardcoding it ensures that you can clone this repo, run `npm install && npm run dev`, and it will immediately connect to the live deployed backend without needing to configure a local `.env` file.

---

## 🛠️ Run Locally

### Prerequisites
- Node.js installed
- MongoDB installed (or use the live backend)

### 1. Clone the Repo
```bash
git clone https://github.com/sohail-kustagi/Kitchen-Dashboard.git
cd Kitchen-Dashboard
```

### 2. Setup Backend (Optional - if you want to run your own server)
```bash
cd server
npm install
# Create a .env file with MONGO_URI=your_mongodb_connection_string
npm run dev
```

### 3. Setup Frontend
```bash
# From the root directory
npm install
npm run dev
```
The app will open at `http://localhost:3000`.
  