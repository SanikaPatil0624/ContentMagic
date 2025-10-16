import { useState, useEffect } from 'react';
import { Sparkles, History, Video } from 'lucide-react';
import ContentGenerator from './components/ContentGenerator';
import PostHistory from './components/PostHistory';

function App() {
  const [activeTab, setActiveTab] = useState('generate');
  const [posts, setPosts] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, [refreshTrigger]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts', {
        credentials: 'include'
      });
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handlePostSaved = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handlePostDeleted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const tabs = [
    { id: 'generate', label: 'Generate Content', icon: Sparkles },
    { id: 'history', label: 'Post History', icon: History },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Header */}
      <header className="relative bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 shadow-2xl border-b border-primary-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 animate-slideIn">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl blur opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-primary-500 via-purple-600 to-pink-600 p-3 rounded-xl shadow-2xl">
                  <Video className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ContentMagic
                </h1>
                <p className="text-sm text-gray-400 font-medium">AI-Powered Content Creation</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-3 animate-fadeIn">
              <div className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 border border-green-500/30">
                ✨ {posts.length} Posts Created
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="relative bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-6 border-b-3 font-semibold text-sm transition-all duration-300 rounded-t-xl ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-white bg-gradient-to-t from-primary-500/20 to-transparent shadow-lg transform scale-105'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                  }`}
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-fadeIn">
          {activeTab === 'generate' && <ContentGenerator onPostSaved={handlePostSaved} />}
          {activeTab === 'history' && <PostHistory posts={posts} onPostDeleted={handlePostDeleted} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border-t border-primary-500/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <p className="text-center text-sm font-medium bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text text-transparent">
                ContentMagic © 2025 - AI-Powered Content Creation
              </p>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            </div>
            <p className="text-xs text-gray-500">Made with ❤️ for Content Creators</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
