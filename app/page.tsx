'use client';

import { BigBoard } from '@/components/BigBoard';
import { useBigBoard } from '@/lib/store';
import { useEffect } from 'react';
import { enrichedPlayers } from '@/lib/enrichedPlayers';

export default function Home() {
  const setPlayers = useBigBoard((s) => s.setPlayers);

  useEffect(() => {
    setPlayers(enrichedPlayers);
  }, [setPlayers]);

  return <BigBoard />;
}
