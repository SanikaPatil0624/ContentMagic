import { useState } from 'react';
import { Trash2, Eye, Calendar, Hash, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function PostHistory({ posts, onPostDeleted }) {
  const [expandedPost, setExpandedPost] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.platform === filter);

  const platforms = ['all', ...new Set(posts.map(post => post.platform))];

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to delete post');

      onPostDeleted();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  const toggleExpand = (id) => {
    setExpandedPost(expandedPost === id ? null : id);
  };

  // Helper to get post ID (works with both _id from MongoDB and id from in-memory)
  const getPostId = (post) => post._id || post.id;

  if (posts.length === 0) {
    return (
      <div className="card text-center py-12">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Posts Yet</h3>
        <p className="text-gray-400">Your saved posts will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Post History ({filteredPosts.length})
          </h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="select-field w-auto"
          >
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform === 'all' ? 'All Platforms' : platform}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const postId = getPostId(post);
          const isExpanded = expandedPost === postId;
          
          return (
            <div key={postId} className="card hover:shadow-lg transition-shadow">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{post.topic}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                    <span className="px-3 py-1 bg-primary-600/20 text-primary-300 rounded-full font-medium border border-primary-500/30">
                      {post.platform}
                    </span>
                    <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full font-medium border border-purple-500/30">
                      {post.tone}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(postId)}
                  className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete post"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Expand/Collapse Button */}
              <button
                onClick={() => toggleExpand(postId)}
                className="w-full flex items-center justify-center space-x-2 text-primary-400 hover:text-primary-300 py-2 border-t border-gray-700"
              >
                <span className="text-sm font-medium">
                  {isExpanded ? 'Hide Details' : 'View Details'}
                </span>
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
                  {/* Captions */}
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3">Captions</h4>
                    <div className="space-y-3">
                      {Object.entries(post.captions).map(([type, caption]) => (
                        <div key={type} className="p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                          <p className="text-xs font-medium text-gray-400 mb-1 capitalize">{type}</p>
                          <p className="text-sm text-gray-200">{caption}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hashtags */}
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
                      <Hash className="w-4 h-4 mr-1" />
                      Hashtags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {post.hashtags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-600/20 text-primary-300 rounded text-xs border border-primary-500/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Engagement Tips */}
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Engagement Tips
                    </h4>
                    <ul className="space-y-2">
                      {post.engagementTips.map((tip, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-300">
                          <span className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5 shadow-lg">
                            {index + 1}
                          </span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PostHistory;
