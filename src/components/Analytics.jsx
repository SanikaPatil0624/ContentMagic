import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Eye, Heart, MessageCircle, Share2 } from 'lucide-react';

const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

function Analytics({ posts }) {
  // Calculate aggregate metrics
  const totalViews = posts.reduce((sum, post) => sum + (post.metrics?.views || 0), 0);
  const totalLikes = posts.reduce((sum, post) => sum + (post.metrics?.likes || 0), 0);
  const totalComments = posts.reduce((sum, post) => sum + (post.metrics?.comments || 0), 0);
  const totalShares = posts.reduce((sum, post) => sum + (post.metrics?.shares || 0), 0);

  // Platform distribution
  const platformData = posts.reduce((acc, post) => {
    acc[post.platform] = (acc[post.platform] || 0) + 1;
    return acc;
  }, {});

  const platformChartData = Object.entries(platformData).map(([name, value]) => ({
    name,
    value,
  }));

  // Performance over time (last 10 posts)
  const performanceData = posts.slice(0, 10).reverse().map((post, index) => ({
    name: `Post ${index + 1}`,
    views: post.metrics?.views || 0,
    likes: post.metrics?.likes || 0,
    engagement: parseFloat(post.metrics?.engagement) || 0,
  }));

  // Top performing posts
  const topPosts = [...posts]
    .sort((a, b) => (b.metrics?.views || 0) - (a.metrics?.views || 0))
    .slice(0, 5);

  const statCards = [
    { label: 'Total Views', value: totalViews.toLocaleString(), icon: Eye, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Likes', value: totalLikes.toLocaleString(), icon: Heart, color: 'text-pink-600', bg: 'bg-pink-100' },
    { label: 'Total Comments', value: totalComments.toLocaleString(), icon: MessageCircle, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Total Shares', value: totalShares.toLocaleString(), icon: Share2, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  if (posts.length === 0) {
    return (
      <div className="card text-center py-12">
        <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Analytics Yet</h3>
        <p className="text-gray-400">Generate and save some posts to see analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#0ea5e9" strokeWidth={2} />
              <Line type="monotone" dataKey="likes" stroke="#ec4899" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Platform Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Platform Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={platformChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {platformChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Engagement Comparison */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="views" fill="#0ea5e9" />
            <Bar dataKey="likes" fill="#ec4899" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Performing Posts */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Top Performing Posts</h3>
        <div className="space-y-3">
          {topPosts.map((post, index) => (
            <div key={post.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-gray-500 transition-all">
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{post.topic}</p>
                  <p className="text-xs text-gray-400">
                    {post.platform} • {post.tone}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-white">{post.metrics?.views?.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Views</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-white">{post.metrics?.likes?.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Likes</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-primary-400">{post.metrics?.engagement}</p>
                  <p className="text-xs text-gray-400">Engagement</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
