'use client';

import React, { useState } from 'react';
import { signInWithGoogle } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithGoogle();
      if (result.role) {
        router.push('/select-league');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2">🐑🌲</h1>
          <h2 className="text-2xl font-bold text-white mb-2">Falkland Big Board</h2>
          <p className="text-gray-400">Fantasy Football Co-Manager Rankings</p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 mb-6">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white hover:bg-gray-100 text-slate-900 font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </>
          )}
        </button>

        <div className="mt-8 pt-8 border-t border-slate-700">
          <p className="text-gray-500 text-xs text-center mb-3">Authorized accounts:</p>
          <div className="space-y-2">
            <div className="bg-slate-700/50 rounded p-3">
              <p className="text-green-400 font-semibold text-sm">🐑 Roy</p>
              <p className="text-gray-400 text-xs">jamesgriff729@gmail.com</p>
            </div>
            <div className="bg-slate-700/50 rounded p-3">
              <p className="text-emerald-400 font-semibold text-sm">🌲 Pine</p>
              <p className="text-gray-400 text-xs">spencer.birkel@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
