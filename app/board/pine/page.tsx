'use client';

import React, { useState } from 'react';
import { useBigBoard } from '@/lib/store';

function scoreColor(s: number) { return s >= 8 ? 'text-emerald-400' : s >= 6 ? 'text-lime-400' : s >= 4 ? 'text-yellow-400' : s >= 2 ? 'text-orange-400' : 'text-red-400'; }

export default function PineBoardPage() {
  const rankings = useBigBoard((s) => s.getPineBoard());
  const reorderPine = useBigBoard((s) => s.reorderPine);
  const selectedPosition = useBigBoard((s) => s.selectedPosition);
  const setSelectedPosition = useBigBoard((s) => s.setSelectedPosition);

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const canDrag = selectedPosition === 'All';
  const positions = ['All', 'QB', 'RB', 'WR', 'TE'];
  const filtered = selectedPosition === 'All' ? rankings : rankings.filter(r => r.position === selectedPosition);

  const handleDragStart = (id: string) => { if (canDrag) setDraggedId(id); };
  const handleDragOver = (idx: number) => { if (canDrag) setDragOverIdx(idx); };
  const handleDrop = () => {
    if (!canDrag || !draggedId) return;
    const idx = filtered.findIndex(r => r.playerId === draggedId);
    const dropIdx = dragOverIdx ?? 0;
    if (idx !== dropIdx) reorderPine(draggedId, dropIdx);
    setDraggedId(null);
    setDragOverIdx(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-emerald-400">🌲 Pine's Board</h1>
          <div className="flex gap-1 flex-wrap">
            {positions.map(pos => (
              <button key={pos} onClick={() => setSelectedPosition(pos)} className={`px-3 py-1 rounded-lg text-sm font-semibold ${selectedPosition === pos ? 'bg-emerald-600 text-white' : 'bg-slate-700'}`}>
                {pos}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900">
                <th className="p-2 text-left text-gray-400">Rank</th>
                <th className="p-2 text-left text-gray-400">Player</th>
                <th className="p-2 text-left text-gray-400">Pos</th>
                <th className="p-2 text-center text-gray-400">Score</th>
                <th className="p-2 text-center text-gray-400">Falk</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => (
                <tr key={r.playerId} draggable={canDrag} onDragStart={() => handleDragStart(r.playerId)} onDragOver={() => handleDragOver(idx)} onDrop={handleDrop} onDragEnd={() => setDraggedId(null)} className={`border-b border-slate-700 cursor-grab hover:bg-slate-700/30 ${draggedId === r.playerId ? 'opacity-50' : ''}`}>
                  <td className="p-2 font-bold text-emerald-400">{idx + 1}</td>
                  <td className="p-2 text-white">{r.playerName}</td>
                  <td className="p-2 text-gray-400">{r.position}</td>
                  <td className={`p-2 text-center font-bold ${scoreColor(r.pineFinalScore)}`}>{r.pineFinalScore.toFixed(1)}</td>
                  <td className="p-2 text-center text-gray-400">#{r.falklandRank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
