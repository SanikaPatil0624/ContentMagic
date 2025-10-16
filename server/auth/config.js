import { config } from 'dotenv';
config();

export const authConfig = {
  instagram: {
    clientID: process.env.INSTAGRAM_CLIENT_ID || '',
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || '',
    callbackURL: process.env.INSTAGRAM_CALLBACK_URL || 'http://localhost:3001/api/auth/instagram/callback',
  },
  facebook: {
    clientID: process.env.FACEBOOK_APP_ID || '',
    clientSecret: process.env.FACEBOOK_APP_SECRET || '',
    callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3001/api/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'email'],
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback',
  },
  twitter: {
    consumerKey: process.env.TWITTER_API_KEY || '',
    consumerSecret: process.env.TWITTER_API_SECRET || '',
    callbackURL: process.env.TWITTER_CALLBACK_URL || 'http://localhost:3001/api/auth/twitter/callback',
  },
};

// In-memory storage for connected accounts (use database in production)
export const connectedAccounts = {};
