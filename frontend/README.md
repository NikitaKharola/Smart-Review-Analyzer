# Smart Review Analyzer

## Project Overview

Smart Review Analyzer is a full-stack web application that helps users analyze customer reviews using AI.

Users can:
- Sign up and log in securely using Supabase Authentication.
- Submit product or service reviews.
- Get AI-generated sentiment analysis.
- View detected themes and confidence score.
- See positive and negative points.
- Get an AI-generated suggested reply.
- Store all reviews permanently in a PostgreSQL database.

---

# Tech Stack

### Frontend
- React
- Vite
- Axios

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL (Supabase)

### ORM
- Prisma

### Authentication
- Supabase Auth

### AI
- Google Gemini API

---

# Why PostgreSQL?

We chose PostgreSQL because our data has a fixed structure.

Each review contains:
- Username
- Review text
- Rating
- Sentiment
- Theme
- Confidence score

Each review also belongs to a user, so a relational database is the best choice.

---

# Database Schema

The project contains two main entities.

## 1. auth.users

This table is managed automatically by Supabase Authentication.

It stores:
- User ID
- Email
- Login information

We do not modify this table directly.

---

## 2. reviews

This table stores all review information.

Fields:
- id
- username
- review_text
- rating
- sentiment
- theme
- confidence
- positive_points
- negative_points
- suggested_reply
- user_id
- created_at

Each review is connected to one user using the **user_id** field.

One user can have many reviews.

---

## Schema Diagram

![Database Schema](W5_SchemaDiagram.png)



---

# Database Setup

### Step 1

Create a free project on Supabase.

https://supabase.com

---

### Step 2

Open the SQL Editor and create the reviews table.

```sql
CREATE TABLE reviews (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username TEXT NOT NULL,
    review_text TEXT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    sentiment TEXT,
    theme TEXT,
    confidence DECIMAL(5,2),
    positive_points TEXT,
    negative_points TEXT,
    suggested_reply TEXT,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Step 3

Copy the PostgreSQL connection string.

Go to:

Project Settings → Database → Connection String

---

### Step 4

Add it to **backend/.env**

```env
DATABASE_URL="your_database_url"
```

---

### Step 5

Install dependencies.

```bash
cd backend
npm install
npx prisma generate
```

---

### Step 6

Start the backend.

```bash
npm start
```

---

# CRUD Operations

The application supports complete CRUD operations.

✅ Create a review

✅ Read reviews

✅ Update a review

✅ Delete a review

All data is stored in PostgreSQL, so it remains available even after restarting the server.

---

# Environment Variables

## Backend

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
PORT=5000
```

## Frontend

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

# Project Structure

```
smart-review-analyzer/

│

├── backend/

│ ├── controllers/

│ ├── middleware/

│ ├── prisma/

│ ├── routes/

│ ├── utils/

│ └── server.js

│

├── frontend/

│ ├── src/

│ ├── components/

│ ├── pages/

│ └── App.jsx

│

└── README.md
```

---

# Features

- User Registration
- User Login
- AI Review Analysis
- Sentiment Detection
- Theme Detection
- Confidence Score
- Suggested Reply
- PostgreSQL Database Storage
- Update Reviews
- Delete Reviews
- Generate PDF Report

---

# Conclusion

This project uses PostgreSQL with Prisma ORM to store review data permanently.

Supabase Authentication manages user login, while Prisma handles database operations.

The application supports full CRUD functionality with persistent data storage.