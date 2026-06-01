import React, { useState, useEffect } from 'react';
import { Share2, Copy, RotateCcw, Trash2, Check, AlertCircle } from 'lucide-react';
import { createShareCode, disableShareCode } from '../utils/firebaseSync';
import { useStore } from '../store/useStore';

export default function ShareSettings() {
  const { currentUser } = useStore();
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Retrieve existing share code from localStorage or generate a new one
  useEffect(() => {
    const savedCode = localStorage.getItem('shareCode');
    if (savedCode) {
      setShareCode(savedCode);
    }
  }, []);

  const handleGenerateCode = async () => {
    if (!currentUser) {
      setMessage('You must be logged in to generate a share code.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const clubName = localStorage.getItem('clubName') || 'Kukisa Finance';
      const code = await createShareCode(currentUser.id, clubName);
      localStorage.setItem('shareCode', code);
      setShareCode(code);
      setMessage('Share code generated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error generating share code:', error);
      setMessage('Failed to generate share code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (shareCode) {
      navigator.clipboard.writeText(shareCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRevokeCode = async () => {
    if (!shareCode) return;

    if (!window.confirm('Are you sure you want to revoke this share code? The secretary general will no longer be able to view the data.')) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await disableShareCode(shareCode);
      localStorage.removeItem('shareCode');
      setShareCode(null);
      setMessage('Share code revoked successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error revoking share code:', error);
      setMessage('Failed to revoke share code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-6">
        <Share2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Share Settings</h2>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Generate a share code to allow the organization's secretary general to view your financial data in read-only mode.
      </p>

      {/* Status Messages */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex gap-3 ${
          message.includes('Failed') 
            ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
            : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
        }`}>
          {message.includes('Failed') ? (
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          ) : (
            <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          )}
          <p className={`text-sm ${message.includes('Failed') ? 'text-red-800 dark:text-red-300' : 'text-green-800 dark:text-green-300'}`}>
            {message}
          </p>
        </div>
      )}

      {/* Current Share Code */}
      {shareCode ? (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Share Code:</p>
          <div className="flex items-center gap-3 mb-4">
            <code className="flex-1 text-2xl font-mono font-bold text-blue-600 dark:text-blue-400 tracking-widest">
              {shareCode}
            </code>
            <button
              onClick={handleCopyCode}
              disabled={loading}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
             Share this code with your secretary general. They can use it to view your financial data in read-only mode.
          </p>

          <div className="space-y-3">
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <p><strong>Shareable Link:</strong></p>
              <p className="font-mono bg-white dark:bg-gray-700 p-2 rounded text-xs break-all">
                {`${window.location.origin}?shareCode=${shareCode}`}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No share code generated yet.</p>
          <button
            onClick={handleGenerateCode}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            {loading ? 'Generating...' : 'Generate Share Code'}
          </button>
        </div>
      )}

      {/* Actions */}
      {shareCode && (
        <div className="flex gap-3">
          <button
            onClick={handleGenerateCode}
            disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {loading ? 'Generating...' : 'Generate New Code'}
          </button>
          <button
            onClick={handleRevokeCode}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {loading ? 'Revoking...' : 'Revoke Access'}
          </button>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <p className="text-amber-900 dark:text-amber-300 text-sm">
          <strong>ℹ️ Important:</strong> Share codes are valid for 1 year. The secretary general will have read-only access and can only view data and print reports.
        </p>
      </div>
    </div>
  );
}
