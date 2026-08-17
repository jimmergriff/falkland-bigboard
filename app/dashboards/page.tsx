'use client';

import React, { useMemo } from 'react';
import { useBigBoard } from '@/lib/store';

export default function DashboardsPage() {
  const rankings = useBigBoard((s) => s.getFilteredRankings());

  const ourGuys = useMemo(() => {
    return rankings
      .filter((r) => r.royFinalScore >= 8 && r.pineFinalScore >= 8)
      .sort((a, b) => b.consensusScore - a.consensusScore);
  }, [rankings]);

  const royOnly = useMemo(() => {
    return rankings
      .filter((r) => r.royFinalScore >= 8 && r.pineFinalScore <= 4)
      .sort((a, b) => b.royFinalScore - a.royFinalScore);
  }, [rankings]);

  const pineOnly = useMemo(() => {
    return rankings
      .filter((r) => r.pineFinalScore >= 8 && r.royFinalScore <= 4)
      .sort((a, b) => b.pineFinalScore - a.royFinalScore);
  }, [rankings]);

  const disagreements = useMemo(() => {
    return rankings
      .filter((r) => r.royFinalScore > 0 && r.pineFinalScore > 0)
      .sort((a, b) => b.disagreementScore - a.disagreementScore)
      .slice(0, 20);
  }, [rankings]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white">📊 Dashboards</h1>

        {/* Both Love */}
        <div className="bg-slate-800 rounded-lg border-2 border-green-700 p-4">
          <h2 className="text-xl font-bold text-green-400 mb-3">💚 Both Love (8+)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {ourGuys.map(r => (
              <div key={r.playerId} className="bg-slate-900 rounded p-2">
                <p className="text-white font-semibold">{r.playerName}</p>
                <p className="text-xs text-gray-400">🐑 {r.royFinalScore.toFixed(1)} • 🌲 {r.pineFinalScore.toFixed(1)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Roy Only */}
        <div className="bg-slate-800 rounded-lg border-2 border-green-700/50 p-4">
          <h2 className="text-xl font-bold text-green-400 mb-3">🐑 Roy Loves / Pine Passes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {royOnly.map(r => (
              <div key={r.playerId} className="bg-slate-900 rounded p-2">
                <p className="text-white font-semibold">{r.playerName}</p>
                <p className="text-xs text-gray-400">🐑 {r.royFinalScore.toFixed(1)} • 🌲 {r.pineFinalScore.toFixed(1)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pine Only */}
        <div className="bg-slate-800 rounded-lg border-2 border-emerald-700/50 p-4">
          <h2 className="text-xl font-bold text-emerald-400 mb-3">🌲 Pine Loves / Roy Passes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {pineOnly.map(r => (
              <div key={r.playerId} className="bg-slate-900 rounded p-2">
                <p className="text-white font-semibold">{r.playerName}</p>
                <p className="text-xs text-gray-400">🐑 {r.royFinalScore.toFixed(1)} • 🌲 {r.pineFinalScore.toFixed(1)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disagreements */}
        <div className="bg-slate-800 rounded-lg border-2 border-orange-700/50 p-4">
          <h2 className="text-xl font-bold text-orange-400 mb-3">⚔️ Biggest Disagreements</h2>
          <div className="space-y-1">
            {disagreements.map(r => (
              <div key={r.playerId} className="flex justify-between bg-slate-900 rounded p-2 text-sm">
                <span className="text-white font-semibold">{r.playerName}</span>
                <span className="text-red-400 font-bold">diff: {r.disagreementScore.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
