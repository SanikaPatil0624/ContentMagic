import { useState, useEffect } from 'react';
import { LogIn, LogOut, CheckCircle, Instagram, Facebook, Youtube, Twitter, MessageCircle } from 'lucide-react';

function SocialLogin() {
  const [connectedAccounts, setConnectedAccounts] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConnectedAccounts();
  }, []);

  const fetchConnectedAccounts = async () => {
    try {
      const response = await fetch('/api/auth/accounts', {
        credentials: 'include'
      });
      const data = await response.json();
      setConnectedAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleConnect = (platform) => {
    setLoading(true);
    // Open OAuth popup
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      `/api/auth/${platform.toLowerCase()}`,
      'OAuth Login',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Listen for OAuth callback
    const checkPopup = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopup);
        setLoading(false);
        fetchConnectedAccounts();
      }
    }, 500);
  };

  const handleDisconnect = async (platform) => {
    try {
      await fetch(`/api/auth/disconnect/${platform.toLowerCase()}`, {
        method: 'POST',
        credentials: 'include'
      });
      fetchConnectedAccounts();
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  };

  const platforms = [
    { 
      name: 'Instagram', 
      icon: Instagram, 
      color: 'from-pink-600 to-purple-600',
      bgColor: 'bg-pink-600/20',
      borderColor: 'border-pink-500/30'
    },
    { 
      name: 'Facebook', 
      icon: Facebook, 
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-600/20',
      borderColor: 'border-blue-500/30'
    },
    { 
      name: 'YouTube', 
      icon: Youtube, 
      color: 'from-red-600 to-red-700',
      bgColor: 'bg-red-600/20',
      borderColor: 'border-red-500/30'
    },
    { 
      name: 'Twitter', 
      icon: Twitter, 
      color: 'from-sky-500 to-blue-600',
      bgColor: 'bg-sky-600/20',
      borderColor: 'border-sky-500/30'
    },
    { 
      name: 'WhatsApp', 
      icon: MessageCircle, 
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-600/20',
      borderColor: 'border-green-500/30'
    },
  ];

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <LogIn className="w-6 h-6 mr-2 text-primary-400" />
        Connect Your Social Media Accounts
      </h2>
      <p className="text-gray-400 text-sm mb-6">
        Connect your accounts to enable automatic posting
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const isConnected = connectedAccounts[platform.name.toLowerCase()];

          return (
            <div
              key={platform.name}
              className={`p-4 rounded-lg border ${platform.borderColor} ${platform.bgColor} transition-all hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`bg-gradient-to-r ${platform.color} p-2 rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{platform.name}</h3>
                    {isConnected && (
                      <p className="text-xs text-gray-400">@{isConnected.username}</p>
                    )}
                  </div>
                </div>
                {isConnected && (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
              </div>

              {isConnected ? (
                <button
                  onClick={() => handleDisconnect(platform.name)}
                  className="w-full btn-secondary text-sm py-2 flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Disconnect</span>
                </button>
              ) : (
                <button
                  onClick={() => handleConnect(platform.name)}
                  disabled={loading}
                  className="w-full btn-primary text-sm py-2 flex items-center justify-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Connect</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {Object.keys(connectedAccounts).length > 0 && (
        <div className="mt-6 p-4 bg-green-600/20 border border-green-500/30 rounded-lg">
          <p className="text-green-400 text-sm flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            {Object.keys(connectedAccounts).length} account(s) connected. You can now post automatically!
          </p>
        </div>
      )}
    </div>
  );
}

export default SocialLogin;
