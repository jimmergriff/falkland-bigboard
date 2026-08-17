'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthChange, signOutUser } from '@/lib/auth';
import { User } from 'firebase/auth';

export default function SelectLeaguePage() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [leagues, setLeagues] = useState([
    { id: 'falkland-2024', name: 'Falkland 2024', members: 2 },
    { id: 'falkland-2025', name: 'Falkland 2025', members: 2 },
    { id: 'lan-falkland-2026-27', name: 'LAN Falkland 2026-27', members: 2 },
  ]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChange((authUser, authRole) => {
      if (!authUser || !authRole) {
        router.push('/login');
      } else {
        setUser(authUser);
        setRole(authRole);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [router]);

  const handleSelectLeague = (leagueId: string) => {
    if (user) {
      localStorage.setItem('selectedLeague', leagueId);
      localStorage.setItem('userRole', role || '');
      router.push(`/league/${leagueId}/board`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Select League</h1>
            <p className="text-gray-400 mt-1">
              {role === 'Roy' ? '🐑 Roy' : '🌲 Pine'} • {user?.email}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Leagues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leagues.map((league) => (
            <button
              key={league.id}
              onClick={() => handleSelectLeague(league.id)}
              className="bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 hover:border-blue-600 rounded-lg p-6 transition-all text-left group"
            >
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400">
                {league.name}
              </h3>
              <p className="text-gray-400 text-sm mb-4">{league.members} members</p>
              <div className="flex items-center text-blue-400 group-hover:translate-x-2 transition-transform">
                <span className="text-sm font-semibold">Enter League</span>
                <span className="ml-2">→</span>
              </div>
            </button>
          ))}
        </div>

        {/* Add League (Future) */}
        <div className="mt-6 p-6 bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-700 text-center">
          <p className="text-gray-500 text-sm">+ Create or add another league coming soon</p>
        </div>
      </div>
    </div>
  );
}
