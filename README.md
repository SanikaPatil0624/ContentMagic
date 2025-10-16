# Social Media Ad Automation Platform

AI-powered platform to create, schedule, and optimize video content for social media platforms.

## Features

- **AI Content Generation**: Generate captions, hashtags, and engagement suggestions
- **Auto-Post to Platforms**: Post immediately or schedule posts for later
- **Multi-Platform Support**: Optimize content for Instagram, TikTok, YouTube, Facebook, Twitter, WhatsApp
- **Analytics Dashboard**: Track performance metrics and engagement
- **Post History**: Save and review previous posts
- **Modern Dark Theme**: Clean, responsive dashboard with beautiful dark mode
- **Post Scheduling**: Schedule posts for future dates and times

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the root directory:
```
OPENAI_API_KEY=your_openai_api_key_here
```

3. Run the application:
```bash
npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Tech Stack

- **Frontend**: React, TailwindCSS, Lucide Icons, Recharts
- **Backend**: Node.js, Express
- **AI**: OpenAI GPT-4
- **Build Tool**: Vite

## Usage

1. Enter your video topic, select platform, and choose tone
2. Click "Generate Content" to get AI-powered suggestions
3. Review captions, hashtags, and engagement tips
4. **Auto-Post**: Choose to post now or schedule for later
5. Save posts to track history and analytics
6. Monitor performance in the Analytics dashboard

## API Endpoints

- `POST /api/generate` - Generate AI content
- `POST /api/auto-post` - Post or schedule content to platforms
- `GET /api/posts` - Get all saved posts
- `POST /api/posts` - Save a new post
- `DELETE /api/posts/:id` - Delete a post

## Notes

- Requires OpenAI API key for AI content generation (optional - works with mock data)
- Posts are stored in memory (data clears on restart)
- Analytics data is simulated for demonstration
- **Auto-posting currently in simulation mode** - See `PLATFORM_API_GUIDE.md` for real API integration
- Platform API credentials required for actual posting
