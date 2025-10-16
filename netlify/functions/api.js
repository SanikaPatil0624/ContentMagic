import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Initialize OpenAI
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// In-memory storage for posts (Note: This will reset on each function invocation)
let posts = [];
let postIdCounter = 1;

// Generate AI content
app.post('/api/generate', async (req, res) => {
  try {
    const { topic, platform, tone } = req.body;

    if (!topic || !platform || !tone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // If no OpenAI API key, return mock data
    if (!openai) {
      const mockData = generateMockContent(topic, platform, tone);
      return res.json(mockData);
    }

    // Generate content using OpenAI
    const prompt = `Create social media content for a video about "${topic}" for ${platform} with a ${tone} tone.

Please provide:
1. 3 engaging captions (short, medium, and long versions)
2. 10-15 relevant hashtags
3. 5 engagement tips to maximize reach

Format the response as JSON with this structure:
{
  "captions": {
    "short": "...",
    "medium": "...",
    "long": "..."
  },
  "hashtags": ["...", "..."],
  "engagementTips": ["...", "..."]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a social media marketing expert specializing in video content optimization. Provide engaging, platform-specific content that drives engagement.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    });

    const content = JSON.parse(completion.choices[0].message.content);
    res.json(content);
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content', details: error.message });
  }
});

// Get all posts
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// Save a new post
app.post('/api/posts', (req, res) => {
  try {
    const { topic, platform, tone, captions, hashtags, engagementTips } = req.body;

    const newPost = {
      id: postIdCounter++,
      topic,
      platform,
      tone,
      captions,
      hashtags,
      engagementTips,
      createdAt: new Date().toISOString(),
      metrics: generateMockMetrics(),
    };

    posts.unshift(newPost);
    res.json(newPost);
  } catch (error) {
    console.error('Error saving post:', error);
    res.status(500).json({ error: 'Failed to save post' });
  }
});

// Delete a post
app.delete('/api/posts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  posts = posts.filter(post => post.id !== id);
  res.json({ success: true });
});

// Auto-post to social media
app.post('/api/auto-post', async (req, res) => {
  try {
    const { topic, platform, tone, captions, hashtags, scheduledFor, postNow } = req.body;

    const postResult = await simulatePostToPlatform({
      platform,
      caption: captions.medium,
      hashtags,
      scheduledFor,
      postNow,
    });

    const message = postNow 
      ? `✅ Successfully posted to ${platform}!`
      : `📅 Post scheduled for ${new Date(scheduledFor).toLocaleString()} on ${platform}`;

    res.json({
      success: true,
      message,
      postId: postResult.id,
      platform,
      scheduledFor,
    });
  } catch (error) {
    console.error('Error auto-posting:', error);
    res.status(500).json({ error: 'Failed to post to platform', details: error.message });
  }
});

// Helper functions
async function simulatePostToPlatform({ platform, caption, hashtags, scheduledFor, postNow }) {
  console.log(`📤 ${postNow ? 'Posting' : 'Scheduling'} to ${platform}...`);
  
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    id: `${platform.toLowerCase()}_${Date.now()}`,
    status: postNow ? 'published' : 'scheduled',
    platform,
    postedAt: postNow ? new Date().toISOString() : null,
    scheduledFor: !postNow ? scheduledFor : null,
  };
}

function generateMockContent(topic, platform, tone) {
  const platformEmojis = {
    Instagram: '📸',
    TikTok: '🎵',
    YouTube: '🎬',
    Facebook: '👍',
    Twitter: '🐦',
    WhatsApp: '💬',
  };

  const emoji = platformEmojis[platform] || '✨';

  const platformTips = {
    WhatsApp: [
      'Send messages during business hours (9 AM - 6 PM) for better response rates',
      'Keep messages concise and use emojis to make them more engaging',
      'Include a clear call-to-action like "Reply YES to learn more"',
      'Use WhatsApp Status for time-sensitive updates (24-hour visibility)',
      'Personalize messages and avoid spamming - respect user privacy',
    ],
    Instagram: [
      'Post during peak hours (9-11 AM or 7-9 PM) for maximum reach',
      'Use the first 3 seconds to hook viewers with compelling visuals',
      'Include a clear call-to-action in your caption',
      'Respond to comments within the first hour to boost engagement',
      'Use Instagram Stories and Reels for additional exposure',
    ],
    TikTok: [
      'Post when your audience is most active (6-10 PM)',
      'Hook viewers in the first 2 seconds with trending sounds or effects',
      'Use trending hashtags and participate in challenges',
      'Engage with comments to boost the algorithm',
      'Post consistently (1-3 times per day) for best results',
    ],
    YouTube: [
      'Upload during peak hours (2-4 PM on weekdays)',
      'Create compelling thumbnails and titles for higher click-through rates',
      'Include timestamps and chapters for better viewer retention',
      'Engage with comments and create a community',
      'Promote your video across other social platforms',
    ],
    Facebook: [
      'Post during lunch hours (12-1 PM) or evenings (7-9 PM)',
      'Use eye-catching visuals or videos for better engagement',
      'Ask questions to encourage comments and discussions',
      'Respond to comments quickly to boost post visibility',
      'Share to relevant groups for wider reach',
    ],
    Twitter: [
      'Tweet during peak hours (9 AM, 12 PM, or 5 PM)',
      'Keep tweets concise and use trending hashtags',
      'Include images or GIFs to increase engagement by 150%',
      'Engage with replies and retweets within the first hour',
      'Use Twitter threads for longer content',
    ],
  };

  return {
    captions: {
      short: `${emoji} ${topic} - Check it out!`,
      medium: `Excited to share this ${tone} video about ${topic}! ${emoji} Perfect for ${platform}. Don't miss out!`,
      long: `Hey everyone! ${emoji} I'm thrilled to share my latest video about ${topic}. This ${tone} content is specially crafted for ${platform} and I think you're going to love it. Make sure to watch till the end for some amazing insights! Drop a comment and let me know what you think. Your support means everything! 💙`,
    },
    hashtags: [
      `#${topic.replace(/\s+/g, '')}`,
      `#${platform}`,
      '#ContentCreator',
      '#VideoMarketing',
      '#SocialMedia',
      '#DigitalMarketing',
      '#ContentStrategy',
      '#Engagement',
      '#Viral',
      '#Trending',
      '#CreativeContent',
      '#MarketingTips',
    ],
    engagementTips: platformTips[platform] || platformTips.Instagram,
  };
}

function generateMockMetrics() {
  return {
    views: Math.floor(Math.random() * 50000) + 1000,
    likes: Math.floor(Math.random() * 5000) + 100,
    comments: Math.floor(Math.random() * 500) + 10,
    shares: Math.floor(Math.random() * 1000) + 50,
    engagement: (Math.random() * 10 + 2).toFixed(2) + '%',
  };
}

export const handler = serverless(app);
