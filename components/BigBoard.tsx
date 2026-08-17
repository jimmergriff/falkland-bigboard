'use client';

import React from 'react';
import { useBigBoard } from '@/lib/store';
import Link from 'next/link';

function scoreColor(score: number): string {
  if (score >= 8) return 'text-green-400';
  if (score >= 6) return 'text-lime-400';
  if (score >= 4) return 'text-yellow-400';
  if (score >= 2) return 'text-orange-400';
  return 'text-red-400';
}

function scoreBg(score: number): string {
  if (score >= 8) return 'bg-green-900/40';
  if (score >= 6) return 'bg-lime-900/30';
  if (score >= 4) return 'bg-yellow-900/30';
  if (score >= 2) return 'bg-orange-900/30';
  return 'bg-red-900/30';
}

function rankColor(rank: number, falkRank: number): string {
  const diff = falkRank - rank;
  if (diff > 15) return 'text-green-400';
  if (diff > 5) return 'text-lime-400';
  if (diff > -5) return 'text-gray-400';
  if (diff > -15) return 'text-orange-400';
  return 'text-red-400';
}

export const BigBoard: React.FC = () => {
  const rankings = useBigBoard((s) => s.getFilteredRankings());
  const selectedPosition = useBigBoard((s) => s.selectedPosition);
  const setSelectedPosition = useBigBoard((s) => s.setSelectedPosition);
  const sortBy = useBigBoard((s) => s.sortBy);
  const setSortBy = useBigBoard((s) => s.setSortBy);

  const positions = ['All', 'QB', 'RB', 'WR', 'TE'];

  return (
    <div className="p-4 max-w-full mx-auto">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-white">🐑 Falkland Reference Board</h1>
        <p className="text-gray-400 text-sm">Read-only overview. Drag-and-drop on Roy/Pine boards.</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 items-end">
        <div>
          <h3 className="font-semibold mb-1 text-white text-xs">Position</h3>
          <div className="flex gap-1">
            {positions.map((pos) => (
              <button key={pos} onClick={() => setSelectedPosition(pos)}
                className={`px-3 py-1 rounded-lg text-xs border-2 font-semibold ${
                  selectedPosition === pos ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-blue-400 border-blue-400 hover:bg-blue-600 hover:text-white hover:border-blue-600'
                }`}>{pos}</button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-1 text-white text-xs">Sort By</h3>
          <div className="flex gap-1">
            {[
              { id: 'rank', label: 'Falkland' },
              { id: 'consensus', label: 'Avg Score' },
              { id: 'disagreement', label: 'Disagree' },
              { id: 'sleeper', label: 'Sleepers' },
            ].map((opt) => (
              <button key={opt.id} onClick={() => setSortBy(opt.id)}
                className={`px-3 py-1 rounded-lg text-xs border-2 font-semibold ${
                  sortBy === opt.id ? 'bg-green-600 text-white border-green-600' : 'bg-transparent text-green-400 border-green-400 hover:bg-green-600 hover:text-white hover:border-green-600'
                }`}>{opt.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full border-collapse text-[11px] whitespace-nowrap">
          <thead>
            <tr className="bg-slate-800 border-b-2 border-blue-500 sticky top-0 z-10">
              <th className="p-1.5 text-white text-left">Falk</th>
              <th className="p-1.5 text-white text-left">Player</th>
              <th className="p-1.5 text-white text-center">Pos</th>
              <th className="p-1.5 text-white text-center">Team</th>
              <th className="p-1.5 text-white text-right">Score</th>
              <th className="p-1.5 text-white text-center">Upside</th>
              <th className="p-1.5 text-white text-center">Dyn</th>
              <th className="p-1.5 text-white text-center">Ssn</th>
              <th className="p-1.5 text-white text-center">Bust</th>
              <th className="p-1.5 text-white text-center">SOS</th>
              <th className="p-1.5 text-white text-center">Bye</th>
              <th className="p-1.5 text-white text-center">QB</th>
              <th className="p-1.5 text-white text-center">OL#</th>
              <th className="p-1.5 text-white text-center">OLAv</th>
              <th className="p-1.5 text-center bg-green-900/20 text-green-300 border-l border-green-700">🐑Roy Rk</th>
              <th className="p-1.5 text-center bg-green-900/20 text-green-300">Roy Scr</th>
              <th className="p-1.5 text-center bg-emerald-900/20 text-emerald-300 border-l border-emerald-700">🌲Pine Rk</th>
              <th className="p-1.5 text-center bg-emerald-900/20 text-emerald-300">Pine Scr</th>
              <th className="p-1.5 text-center bg-blue-900/20 text-blue-300 border-l border-blue-700">Avg</th>
              <th className="p-1.5 text-center bg-blue-900/20 text-blue-300">Diff</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((r) => {
              const hasRoy = r.roy_Rating > 0;
              const hasPine = r.pine_Rating > 0;
              const avgScore = hasRoy && hasPine ? (r.royFinalScore + r.pineFinalScore) / 2 : (hasRoy ? r.royFinalScore : (hasPine ? r.pineFinalScore : 0));
              const diff = hasRoy && hasPine ? Math.abs(r.royFinalScore - r.pineFinalScore) : 0;
              return (
                <tr key={r.playerId} className="border-b border-slate-700/50 hover:bg-slate-700/50">
                  <td className="p-1.5 font-bold text-blue-400">{r.falklandRank}</td>
                  <td className="p-1.5 text-white font-semibold">
                    <Link href={`/player/${r.playerId}`} className="hover:text-blue-400">{r.playerName}</Link>
                  </td>
                  <td className={`p-1.5 text-center font-bold ${
                    r.position === 'QB' ? 'text-red-400' : r.position === 'RB' ? 'text-green-400' : r.position === 'WR' ? 'text-blue-400' : 'text-yellow-400'
                  }`}>{r.position}</td>
                  <td className="p-1.5 text-center text-gray-400">{r.team}</td>
                  <td className="p-1.5 text-right text-orange-400 font-semibold">{Math.round(r.falklandScore)}</td>
                  <td className="p-1.5 text-center text-yellow-300">{Math.round(r.upside)}</td>
                  <td className="p-1.5 text-center text-cyan-400">{r.dynastyRank}</td>
                  <td className="p-1.5 text-center text-cyan-400">{r.seasonRank}</td>
                  <td className={`p-1.5 text-center font-bold ${r.bustRisk <= 2 ? 'text-green-400' : r.bustRisk === 3 ? 'text-yellow-400' : 'text-red-400'}`}>{r.bustRisk}/5</td>
                  <td className="p-1.5 text-center text-purple-400">{r.sos}/5</td>
                  <td className="p-1.5 text-center text-gray-500">{r.byeWeek}</td>
                  <td className="p-1.5 text-center text-gray-400 text-[9px]">{r.projectedQBStarter}</td>
                  <td className="p-1.5 text-center text-gray-400">{r.sharpOLRank}</td>
                  <td className="p-1.5 text-center text-gray-400">{r.olAvgRank}</td>
                  {/* ROY columns */}
                  <td className={`p-1.5 text-center border-l border-green-900 ${hasRoy ? rankColor(r.royRank, r.falklandRank) : 'text-slate-700'} font-bold`}>
                    {hasRoy ? r.royRank : '--'}
                  </td>
                  <td className={`p-1.5 text-center font-bold ${hasRoy ? scoreBg(r.royFinalScore) : ''} ${hasRoy ? scoreColor(r.royFinalScore) : 'text-slate-700'}`}>
                    {hasRoy ? r.royFinalScore.toFixed(1) : '--'}
                  </td>
                  {/* PINE columns */}
                  <td className={`p-1.5 text-center border-l border-emerald-900 ${hasPine ? rankColor(r.pineRank, r.falklandRank) : 'text-slate-700'} font-bold`}>
                    {hasPine ? r.pineRank : '--'}
                  </td>
                  <td className={`p-1.5 text-center font-bold ${hasPine ? scoreBg(r.pineFinalScore) : ''} ${hasPine ? scoreColor(r.pineFinalScore) : 'text-slate-700'}`}>
                    {hasPine ? r.pineFinalScore.toFixed(1) : '--'}
                  </td>
                  {/* AVG columns */}
                  <td className={`p-1.5 text-center border-l border-blue-900 font-bold ${avgScore > 0 ? scoreBg(avgScore) : ''} ${avgScore > 0 ? scoreColor(avgScore) : 'text-slate-700'}`}>
                    {avgScore > 0 ? avgScore.toFixed(1) : '--'}
                  </td>
                  <td className={`p-1.5 text-center font-bold ${diff > 3 ? 'text-red-400 bg-red-900/30' : diff > 1.5 ? 'text-yellow-400' : diff > 0 ? 'text-green-400' : 'text-slate-700'}`}>
                    {diff > 0 ? diff.toFixed(1) : '--'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-slate-500 text-xs mt-2">{rankings.length} players</p>
    </div>
  );
};
