import express from 'express';
import { connectedAccounts } from './config.js';

const router = express.Router();

// Get connected accounts
router.get('/accounts', (req, res) => {
  res.json(connectedAccounts);
});

// Simulate OAuth login (for demonstration)
router.get('/:platform', (req, res) => {
  const { platform } = req.params;
  
  // In production, this would redirect to actual OAuth provider
  // For now, we'll simulate the connection
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Connect ${platform}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .container {
          text-align: center;
          background: rgba(255, 255, 255, 0.1);
          padding: 40px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }
        button {
          background: white;
          color: #667eea;
          border: none;
          padding: 15px 30px;
          font-size: 16px;
          border-radius: 10px;
          cursor: pointer;
          margin: 10px;
          font-weight: bold;
        }
        button:hover {
          transform: scale(1.05);
        }
        .info {
          margin: 20px 0;
          font-size: 14px;
          opacity: 0.9;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🔐 Connect to ${platform}</h1>
        <div class="info">
          <p>Click "Authorize" to connect your ${platform} account</p>
          <p><small>This is a simulation. In production, you'll be redirected to ${platform}'s OAuth page.</small></p>
        </div>
        <button onclick="authorize()">✅ Authorize</button>
        <button onclick="window.close()">❌ Cancel</button>
      </div>
      
      <script>
        function authorize() {
          // Simulate successful OAuth
          fetch('/api/auth/${platform}/callback?code=demo_auth_code_${Date.now()}')
            .then(() => {
              alert('✅ Successfully connected to ${platform}!');
              window.close();
            });
        }
      </script>
    </body>
    </html>
  `);
});

// OAuth callback (simulated)
router.get('/:platform/callback', (req, res) => {
  const { platform } = req.params;
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).send('Authorization failed');
  }
  
  // Simulate storing the access token
  connectedAccounts[platform.toLowerCase()] = {
    platform,
    username: `demo_user_${platform}`,
    accessToken: `demo_token_${code}`,
    connectedAt: new Date().toISOString(),
  };
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Success!</title>
      <script>
        window.opener.postMessage('auth_success', '*');
        window.close();
      </script>
    </head>
    <body>
      <p>Authorization successful! You can close this window.</p>
    </body>
    </html>
  `);
});

// Disconnect account
router.post('/disconnect/:platform', (req, res) => {
  const { platform } = req.params;
  delete connectedAccounts[platform.toLowerCase()];
  res.json({ success: true });
});

export default router;
