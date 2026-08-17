'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useBigBoard } from '@/lib/store';

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const currentOwnerName = useBigBoard((s) => s.currentOwnerName);
  const setCurrentOwner = useBigBoard((s) => s.setCurrentOwner);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('playingAs');
    if (saved === 'Roy' || saved === 'Pine') {
      setCurrentOwner(saved === 'Roy' ? 'owner-a' : 'owner-b', saved);
    }
  }, []);

  const handleSwitch = (name: string) => {
    setCurrentOwner(name === 'Roy' ? 'owner-a' : 'owner-b', name);
    localStorage.setItem('playingAs', name);
  };

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
      pathname === path
        ? 'bg-white/20 text-white'
        : 'text-blue-100 hover:text-white hover:bg-white/10'
    }`;

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-full mx-auto px-3 py-2">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <Link href="/">
            <h1 className="text-lg font-bold cursor-pointer whitespace-nowrap">
              🐑 Falkland
            </h1>
          </Link>

          <div className="flex gap-1 items-center flex-wrap">
            <Link href="/" className={linkClass('/')}>Board</Link>
            <Link href="/evaluate" className={linkClass('/evaluate')}>Evaluate</Link>
            <Link href="/dashboards" className={linkClass('/dashboards')}>Dashboards</Link>
            <Link href="/board/roy" className={linkClass('/board/roy')}>Roy</Link>
            <Link href="/board/pine" className={linkClass('/board/pine')}>Pine</Link>
          </div>

          {mounted && (
            <div className="flex items-center gap-1 bg-black/20 rounded-lg p-1">
              <span className="text-xs text-blue-200 pl-2 hidden sm:inline">Playing as</span>
              <button
                onClick={() => handleSwitch('Roy')}
                className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${
                  currentOwnerName === 'Roy'
                    ? 'bg-green-500 text-white'
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                🐑 Roy
              </button>
              <button
                onClick={() => handleSwitch('Pine')}
                className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${
                  currentOwnerName === 'Pine'
                    ? 'bg-emerald-500 text-white'
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                Pine
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
