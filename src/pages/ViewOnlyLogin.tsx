import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Lock, ArrowRight } from 'lucide-react';
import { verifyShareCode, getSharedData } from '../utils/firebaseSync';
import { useStore } from '../store/useStore';

export default function ViewOnlyLogin() {
  const [shareCode, setShareCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setViewOnlyMode, setSharedData, setShareCode: storeShareCode } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const code = shareCode.toUpperCase().trim();

      // Verify the code exists and is active
      const isValid = await verifyShareCode(code);
      if (!isValid) {
        setError('Invalid or expired share code. Please check and try again.');
        setLoading(false);
        return;
      }

      // Get the shared data
      const data = await getSharedData(code);
      if (!data) {
        setError('No data found for this share code.');
        setLoading(false);
        return;
      }

      // Set view-only mode and store the data
      storeShareCode(code);
      setViewOnlyMode(true, data);

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Error validating share code:', err);
      setError('Failed to validate share code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full">
                <Lock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              View Report
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter the share code to access the financial data
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="shareCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Share Code
              </label>
              <input
                id="shareCode"
                type="text"
                value={shareCode}
                onChange={(e) => setShareCode(e.target.value.toUpperCase())}
                placeholder="e.g., ABC123"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-center text-lg tracking-widest uppercase"
                disabled={loading}
              />
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                6-character code provided by the organization
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || shareCode.length !== 6}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Verifying...
                </>
              ) : (
                <>
                  Access Data
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-blue-900 dark:text-blue-300 text-sm">
               <strong>Tip:</strong> This is a read-only view. You can view data and print reports, but cannot make changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
