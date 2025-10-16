import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    trim: true,
  },
  platform: {
    type: String,
    required: true,
    enum: ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'Twitter', 'WhatsApp'],
  },
  tone: {
    type: String,
    required: true,
    enum: ['Professional', 'Casual', 'Humorous', 'Inspirational', 'Educational'],
  },
  captions: {
    short: { type: String, required: true },
    medium: { type: String, required: true },
    long: { type: String, required: true },
  },
  hashtags: [{
    type: String,
    trim: true,
  }],
  engagementTips: [{
    type: String,
    trim: true,
  }],
  metrics: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    engagement: { type: String, default: '0%' },
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

// Index for faster queries
postSchema.index({ platform: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });

const Post = mongoose.model('Post', postSchema);

export default Post;
