'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { onAuthChange, signOutUser } from '@/lib/auth';
import { User } from 'firebase/auth';
import Link from 'next/link';

export default function LeagueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const unsubscribe = onAuthChange((authUser, authRole) => {
      if (!authUser || !authRole) {
        console.log('Not authenticated, redirecting to login');
        router.push('/login');
      } else {
        setUser(authUser);
        setRole(authRole);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Authenticating...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div>
      <nav className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg">
        <div className="max-w-full mx-auto px-4 py-3">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <Link href={`/league/${params.leagueId}/board`}>
              <h1 className="text-xl font-bold cursor-pointer hover:text-blue-200 transition-colors">
                🐑 Falkland Big Board
              </h1>
            </Link>
            <div className="flex gap-4 items-center flex-wrap">
              <Link href={`/league/${params.leagueId}/board`} className="hover:text-blue-200 transition-colors text-sm">
                Board
              </Link>
              <Link href={`/league/${params.leagueId}/evaluate`} className="hover:text-blue-200 transition-colors text-sm">
                Evaluate
              </Link>
              <Link href={`/league/${params.leagueId}/dashboards`} className="hover:text-blue-200 transition-colors text-sm">
                Dashboards
              </Link>
              <Link href={`/league/${params.leagueId}/board/roy`} className="hover:text-blue-200 transition-colors text-sm font-semibold">
                Roy Board
              </Link>
              <Link href={`/league/${params.leagueId}/board/pine`} className="hover:text-blue-200 transition-colors text-sm font-semibold">
                Pine Board
              </Link>
              <div className="border-l border-blue-400 pl-3 flex items-center gap-2">
                <span className="text-blue-200 text-xs">
                  {role === 'Roy' ? '🐑 Roy' : '🌲 Pine'}
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm font-semibold transition-all"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
