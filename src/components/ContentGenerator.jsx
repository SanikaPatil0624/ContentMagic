import { useState } from 'react';
import { Sparkles, Copy, Check, Save, Loader2 } from 'lucide-react';

const platforms = ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'Twitter', 'WhatsApp'];
const tones = ['Professional', 'Casual', 'Humorous', 'Inspirational', 'Educational'];

function ContentGenerator({ onPostSaved }) {
  const [formData, setFormData] = useState({
    topic: '',
    platform: 'Instagram',
    tone: 'Professional',
  });
  const [generatedContent, setGeneratedContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      alert('Please enter a video topic');
      return;
    }

    setLoading(true);
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to generate content');

      const data = await response.json();
      setGeneratedContent(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSave = async () => {
    if (!generatedContent) return;

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ...generatedContent,
        }),
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to save post');

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      onPostSaved();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save post. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <div className="card animate-slideIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center">
            <Sparkles className="w-7 h-7 mr-3 text-primary-400 animate-pulse" />
            Generate AI Content
          </h2>
          <div className="px-3 py-1 bg-primary-500/20 border border-primary-500/30 rounded-lg text-primary-300 text-xs font-semibold">
            ✨ AI Powered
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Video Topic *
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., How to grow your Instagram following"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Platform *
              </label>
              <select
                className="select-field"
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              >
                {platforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tone *
              </label>
              <select
                className="select-field"
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
              >
                {tones.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Content</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Content */}
      {generatedContent && (
        <div className="space-y-6">
          {/* Captions */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">AI-Generated Captions</h3>
              {saveSuccess && (
                <div className="flex items-center text-green-400 text-sm">
                  <Check className="w-4 h-4 mr-1" />
                  Saved!
                </div>
              )}
            </div>

            <div className="space-y-4">
              {Object.entries(generatedContent.captions).map(([type, caption]) => (
                <div key={type} className="border border-gray-600 rounded-lg p-4 bg-gray-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300 capitalize">
                      {type} Caption
                    </span>
                    <button
                      onClick={() => handleCopy(caption, `caption-${type}`)}
                      className="text-primary-400 hover:text-primary-300 flex items-center text-sm"
                    >
                      {copiedField === `caption-${type}` ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-gray-200">{caption}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hashtags */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recommended Hashtags</h3>
              <button
                onClick={() => handleCopy(generatedContent.hashtags.join(' '), 'hashtags')}
                className="text-primary-400 hover:text-primary-300 flex items-center text-sm"
              >
                {copiedField === 'hashtags' ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy All
                  </>
                )}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {generatedContent.hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-600/20 text-primary-300 rounded-full text-sm font-medium border border-primary-500/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Engagement Tips */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Engagement Tips</h3>
            <ul className="space-y-3">
              {generatedContent.engagementTips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5 shadow-lg">
                    {index + 1}
                  </span>
                  <span className="text-gray-300">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Save to History</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ContentGenerator;
