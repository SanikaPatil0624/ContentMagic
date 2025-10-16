# Quick Start Guide

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key (optional - app works with mock data without it)
   
```bash
OPENAI_API_KEY=sk-your-api-key-here
PORT=3001
```

3. **Run the application:**
```bash
npm run dev
```

The app will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Features Overview

### 1. Generate Content Tab
- Enter video topic, select platform and tone
- Click "Generate Content" to get AI-powered suggestions
- Copy captions, hashtags, and engagement tips
- Save posts to history

### 2. Analytics Tab
- View total views, likes, comments, and shares
- See performance trends over time
- Platform distribution pie chart
- Top performing posts ranking

### 3. Post History Tab
- View all saved posts
- Filter by platform
- Expand to see full details
- Delete posts you no longer need

## Tips

- **Without OpenAI API Key**: The app will use mock data for content generation
- **With OpenAI API Key**: Get real AI-powered content suggestions
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Data Persistence**: Posts are stored in memory (restart clears data)

## Tech Stack

- React + Vite
- TailwindCSS
- Lucide Icons
- Recharts
- Express.js
- OpenAI API

Enjoy creating amazing social media content! 🚀
