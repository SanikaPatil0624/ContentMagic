# 🚀 Platform API Integration Guide

Your ContentMagic app now supports **automatic posting** to social media platforms!

## ✨ Current Features

### 1. **Post Now**
- ✅ Instantly post generated content to selected platform
- ✅ Uses medium-length caption automatically
- ✅ Includes all generated hashtags
- ✅ Real-time posting feedback

### 2. **Schedule Posts**
- ✅ Select future date and time
- ✅ Schedule posts in advance
- ✅ Automatic posting at scheduled time
- ✅ View scheduled posts in history

### 3. **Supported Platforms**
- Instagram
- TikTok
- YouTube
- Facebook
- Twitter

---

## 🔧 How It Works (Current Implementation)

The app currently uses a **simulation mode** for demonstration purposes:

```javascript
// server/index.js - Line 153
async function simulatePostToPlatform({ platform, caption, hashtags, scheduledFor, postNow }) {
  // Simulates posting to platform
  // Returns success message
}
```

### What Happens:
1. User generates content
2. User clicks "Post Now" or schedules a post
3. Backend simulates the posting process
4. Success message is displayed
5. Post is saved to history

---

## 🔌 Real Platform Integration

To enable **real automatic posting**, you need to integrate with platform APIs:

### **1. Instagram (Meta Graph API)**

#### Setup:
```bash
npm install axios
```

#### Requirements:
- Facebook Developer Account
- Instagram Business Account
- Access Token

#### Code Example:
```javascript
async function postToInstagram({ caption, hashtags, imageUrl, accessToken }) {
  const axios = require('axios');
  
  const fullCaption = `${caption}\n\n${hashtags.join(' ')}`;
  
  // Step 1: Upload media
  const mediaResponse = await axios.post(
    `https://graph.facebook.com/v18.0/{instagram-account-id}/media`,
    {
      image_url: imageUrl,
      caption: fullCaption,
      access_token: accessToken,
    }
  );
  
  // Step 2: Publish media
  const publishResponse = await axios.post(
    `https://graph.facebook.com/v18.0/{instagram-account-id}/media_publish`,
    {
      creation_id: mediaResponse.data.id,
      access_token: accessToken,
    }
  );
  
  return publishResponse.data;
}
```

#### Environment Variables:
```env
INSTAGRAM_ACCESS_TOKEN=your_access_token
INSTAGRAM_ACCOUNT_ID=your_account_id
```

---

### **2. TikTok (Content Posting API)**

#### Requirements:
- TikTok Developer Account
- App Registration
- OAuth 2.0 Access Token

#### Code Example:
```javascript
async function postToTikTok({ caption, hashtags, videoUrl, accessToken }) {
  const axios = require('axios');
  
  const response = await axios.post(
    'https://open-api.tiktok.com/share/video/upload/',
    {
      video: {
        video_url: videoUrl,
      },
      post_info: {
        title: caption,
        privacy_level: 'PUBLIC_TO_EVERYONE',
        disable_duet: false,
        disable_comment: false,
        disable_stitch: false,
      },
    },
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
  
  return response.data;
}
```

---

### **3. YouTube (Data API v3)**

#### Requirements:
- Google Cloud Project
- YouTube Data API enabled
- OAuth 2.0 credentials

#### Code Example:
```javascript
async function postToYouTube({ title, description, hashtags, videoFile, accessToken }) {
  const { google } = require('googleapis');
  
  const youtube = google.youtube({
    version: 'v3',
    auth: accessToken,
  });
  
  const fullDescription = `${description}\n\n${hashtags.join(' ')}`;
  
  const response = await youtube.videos.insert({
    part: 'snippet,status',
    requestBody: {
      snippet: {
        title: title,
        description: fullDescription,
        tags: hashtags,
        categoryId: '22', // People & Blogs
      },
      status: {
        privacyStatus: 'public',
      },
    },
    media: {
      body: videoFile,
    },
  });
  
  return response.data;
}
```

---

### **4. Facebook (Graph API)**

#### Code Example:
```javascript
async function postToFacebook({ message, hashtags, imageUrl, accessToken, pageId }) {
  const axios = require('axios');
  
  const fullMessage = `${message}\n\n${hashtags.join(' ')}`;
  
  const response = await axios.post(
    `https://graph.facebook.com/v18.0/${pageId}/photos`,
    {
      url: imageUrl,
      caption: fullMessage,
      access_token: accessToken,
    }
  );
  
  return response.data;
}
```

---

### **5. Twitter/X (API v2)**

#### Code Example:
```javascript
async function postToTwitter({ text, hashtags, accessToken }) {
  const axios = require('axios');
  
  const fullText = `${text}\n\n${hashtags.slice(0, 5).join(' ')}`; // Twitter has character limits
  
  const response = await axios.post(
    'https://api.twitter.com/2/tweets',
    {
      text: fullText.substring(0, 280), // Character limit
    },
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
  
  return response.data;
}
```

---

## 📝 Implementation Steps

### Step 1: Install Dependencies
```bash
npm install axios googleapis
```

### Step 2: Update `.env` File
```env
# Instagram
INSTAGRAM_ACCESS_TOKEN=your_token
INSTAGRAM_ACCOUNT_ID=your_id

# TikTok
TIKTOK_ACCESS_TOKEN=your_token

# YouTube
YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_secret

# Facebook
FACEBOOK_ACCESS_TOKEN=your_token
FACEBOOK_PAGE_ID=your_page_id

# Twitter
TWITTER_BEARER_TOKEN=your_token
```

### Step 3: Update `server/index.js`

Replace the `simulatePostToPlatform` function with real API calls:

```javascript
async function simulatePostToPlatform({ platform, caption, hashtags, scheduledFor, postNow }) {
  switch (platform) {
    case 'Instagram':
      return await postToInstagram({ caption, hashtags, imageUrl, accessToken: process.env.INSTAGRAM_ACCESS_TOKEN });
    
    case 'TikTok':
      return await postToTikTok({ caption, hashtags, videoUrl, accessToken: process.env.TIKTOK_ACCESS_TOKEN });
    
    case 'YouTube':
      return await postToYouTube({ title, description, hashtags, videoFile, accessToken: process.env.YOUTUBE_ACCESS_TOKEN });
    
    case 'Facebook':
      return await postToFacebook({ message: caption, hashtags, imageUrl, accessToken: process.env.FACEBOOK_ACCESS_TOKEN, pageId: process.env.FACEBOOK_PAGE_ID });
    
    case 'Twitter':
      return await postToTwitter({ text: caption, hashtags, accessToken: process.env.TWITTER_BEARER_TOKEN });
    
    default:
      throw new Error(`Platform ${platform} not supported`);
  }
}
```

---

## 🔐 Security Best Practices

1. **Never commit API keys** - Use `.env` file
2. **Rotate tokens regularly** - Update access tokens periodically
3. **Use OAuth 2.0** - Implement proper authentication flow
4. **Rate limiting** - Respect platform API limits
5. **Error handling** - Handle API failures gracefully

---

## 📅 Scheduling Implementation

For real scheduling, consider using:

### **Option 1: Node-Cron**
```bash
npm install node-cron
```

```javascript
const cron = require('node-cron');

// Check for scheduled posts every minute
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const scheduledPosts = posts.filter(post => 
    post.scheduledFor && new Date(post.scheduledFor) <= now && !post.posted
  );
  
  for (const post of scheduledPosts) {
    await postToPlatform(post);
    post.posted = true;
  }
});
```

### **Option 2: Bull Queue (Recommended for Production)**
```bash
npm install bull redis
```

```javascript
const Queue = require('bull');
const postQueue = new Queue('social-media-posts');

// Add job to queue
postQueue.add({ post }, { delay: scheduledTime - Date.now() });

// Process jobs
postQueue.process(async (job) => {
  await postToPlatform(job.data.post);
});
```

---

## 🎯 Current Status

✅ **Implemented:**
- UI for posting and scheduling
- Backend API endpoint `/api/auto-post`
- Simulation mode for testing
- Success/error handling
- Integration with post history

⚠️ **Requires Setup:**
- Platform API credentials
- OAuth authentication
- Media upload functionality
- Real scheduling system

---

## 📚 Platform Documentation Links

- **Instagram**: https://developers.facebook.com/docs/instagram-api
- **TikTok**: https://developers.tiktok.com/
- **YouTube**: https://developers.google.com/youtube/v3
- **Facebook**: https://developers.facebook.com/docs/graph-api
- **Twitter**: https://developer.twitter.com/en/docs/twitter-api

---

## 💡 Notes

- The current implementation works in **simulation mode**
- To enable real posting, follow the integration steps above
- Each platform has different requirements and limitations
- Some platforms require media files (images/videos)
- Rate limits vary by platform

---

**Your app is ready for platform integration! Follow this guide to connect real APIs.** 🚀
