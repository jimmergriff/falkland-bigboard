'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { onAuthChange } from '@/lib/auth';
import { User } from 'firebase/auth';
import dynamic from 'next/dynamic';

const RoyBoard = dynamic(() => import('@/components/RoyBoard').then(mod => mod.RoyBoard), {
  ssr: false,
  loading: () => <div className="text-white p-4">Loading Roy Board...</div>
});

export default function RoyBoardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChange((authUser, authRole) => {
      if (!authUser) {
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
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return <RoyBoard />;
}
