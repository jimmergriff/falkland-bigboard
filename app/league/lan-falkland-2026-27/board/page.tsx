'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { onAuthChange } from '@/lib/auth';
import { User } from 'firebase/auth';
import { BigBoard } from '@/components/BigBoard';
import { useBigBoard } from '@/lib/store';
import { enrichedPlayers } from '@/lib/enrichedPlayers';

export default function LeagueBoard() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const setPlayers = useBigBoard((s) => s.setPlayers);

  useEffect(() => {
    const unsubscribe = onAuthChange((authUser, authRole) => {
      if (!authUser) {
        router.push('/login');
      } else {
        setUser(authUser);
        setRole(authRole);
        setPlayers(enrichedPlayers);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [router, setPlayers]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading board...</p>
        </div>
      </div>
    );
  }

  return <BigBoard />;
}
