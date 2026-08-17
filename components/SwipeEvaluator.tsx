'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useBigBoard } from '@/lib/store';
import { enrichedPlayers } from '@/lib/enrichedPlayers';
import { POSITIVE_TAGS, NEGATIVE_TAGS, EvaluationTag } from '@/lib/types';

const posColor = (pos: string) => {
  switch (pos) {
    case 'QB': return 'bg-red-500';
    case 'RB': return 'bg-green-500';
    case 'WR': return 'bg-blue-500';
    case 'TE': return 'bg-orange-500';
    default: return 'bg-purple-500';
  }
};

export const SwipeEvaluator: React.FC = () => {
  const currentOwnerName = useBigBoard((s) => s.currentOwnerName);
  const evaluations = useBigBoard((s) => s.evaluations);
  const addEvaluation = useBigBoard((s) => s.addEvaluation);

  // Only show unevaluated players first, then evaluated ones
  const queue = useMemo(() => {
    const evaluatedIds = new Set(
      evaluations.filter(e => e.ownerName === currentOwnerName).map(e => e.playerId)
    );
    const unrated = enrichedPlayers.filter(p => !evaluatedIds.has(p.id));
    const rated = enrichedPlayers.filter(p => evaluatedIds.has(p.id));
    return [...unrated, ...rated];
  }, [evaluations, currentOwnerName]);

  const [index, setIndex] = useState(0);
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<EvaluationTag[]>([]);
  const [notes, setNotes] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const isHorizontal = useRef<boolean | null>(null);

  const player = queue[index % queue.length];
  const total = queue.length;

  const existingEval = evaluations.find(
    e => e.playerId === player?.id && e.ownerName === currentOwnerName
  );

  React.useEffect(() => {
    if (existingEval) {
      setRating(existingEval.overallRating);
      setSelectedTags(existingEval.tags);
      setNotes(existingEval.notes);
    } else {
      setRating(5);
      setSelectedTags([]);
      setNotes('');
    }
    setShowDetails(false);
  }, [player?.id]);

  if (!player) return null;

  const likeCount = selectedTags.filter(t => (POSITIVE_TAGS as string[]).includes(t)).length;
  const dislikeCount = selectedTags.filter(t => (NEGATIVE_TAGS as string[]).includes(t)).length;
  const finalScore = rating + (likeCount - dislikeCount) * 0.5;

  const toggleTag = (tag: EvaluationTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const save = (advance = true) => {
    const evaluation = {
      id: existingEval?.id || `${player.id}-${currentOwnerName}-${Date.now()}`,
      playerId: player.id,
      ownerId: currentOwnerName,
      ownerName: currentOwnerName,
      overallRating: rating,
      potentialRating: rating,
      keepTradeAction: 'KEEP' as const,
      tags: selectedTags,
      notes,
      createdAt: existingEval?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };
    addEvaluation(evaluation);
    if (advance) goNext();
  };

  const goNext = () => setIndex((i) => (i + 1) % total);
  const goPrev = () => setIndex((i) => (i - 1 + total) % total);

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    isHorizontal.current = null;
    setDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;

    if (isHorizontal.current === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      isHorizontal.current = Math.abs(dx) > Math.abs(dy);
    }
    if (isHorizontal.current) {
      setDragX(dx);
    }
  };

  const onTouchEnd = () => {
    setDragging(false);
    if (Math.abs(dragX) > 90) {
      if (dragX > 0) {
        // swipe right = boost rating & save & next
        setRating((r) => Math.min(r + 1, 10));
        setTimeout(() => save(true), 0);
      } else {
        setRating((r) => Math.max(r - 1, 1));
        setTimeout(() => save(true), 0);
      }
    }
    setDragX(0);
    isHorizontal.current = null;
  };

  const swipeOpacity = Math.min(Math.abs(dragX) / 120, 1);

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col p-3 max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs text-gray-400">
          {currentOwnerName === 'Roy' ? '🐑 Roy' : '🌲 Pine'} evaluating
        </span>
        <span className="text-xs text-gray-400 font-semibold">
          {index + 1} / {total}
        </span>
      </div>
      <div className="w-full h-1.5 bg-slate-700 rounded-full mb-3 overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      {/* Swipeable Card */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="relative bg-slate-800 rounded-2xl border-2 border-slate-700 overflow-hidden select-none touch-pan-y"
        style={{
          transform: `translateX(${dragX}px) rotate(${dragX / 20}deg)`,
          transition: dragging ? 'none' : 'transform 0.25s ease-out',
        }}
      >
        {/* Swipe overlays */}
        {dragX > 20 && (
          <div
            className="absolute inset-0 bg-green-500/25 flex items-center justify-center z-20 pointer-events-none"
            style={{ opacity: swipeOpacity }}
          >
            <span className="text-4xl font-black text-green-300 border-4 border-green-300 rounded-2xl px-6 py-2 -rotate-12">
              +1 🔥
            </span>
          </div>
        )}
        {dragX < -20 && (
          <div
            className="absolute inset-0 bg-red-500/25 flex items-center justify-center z-20 pointer-events-none"
            style={{ opacity: swipeOpacity }}
          >
            <span className="text-4xl font-black text-red-300 border-4 border-red-300 rounded-2xl px-6 py-2 rotate-12">
              -1 👎
            </span>
          </div>
        )}

        {/* Photo header */}
        <div className={`relative h-56 ${posColor(player.position)} bg-opacity-20 flex items-center justify-center overflow-hidden`}>
          <div className={`absolute inset-0 ${posColor(player.position)} opacity-10`} />
          {player.imageUrl ? (
            <img
              src={player.imageUrl}
              alt={player.name}
              className="h-full object-contain drop-shadow-2xl"
              draggable={false}
            />
          ) : (
            <div className="text-7xl opacity-30">🏈</div>
          )}
          <div className={`absolute top-3 left-3 ${posColor(player.position)} text-white font-bold px-3 py-1 rounded-full text-sm shadow-lg`}>
            {player.position}
          </div>
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur text-white font-bold px-3 py-1 rounded-full text-sm">
            Falk #{player.falklandRank}
          </div>
          {existingEval && (
            <div className="absolute bottom-3 right-3 bg-blue-500 text-white font-bold px-3 py-1 rounded-full text-xs shadow-lg">
              ✓ Rated
            </div>
          )}
        </div>

        {/* Name & team */}
        <div className="px-4 pt-3 pb-2">
          <h2 className="text-2xl font-black text-white leading-tight">{player.name}</h2>
          <p className="text-gray-400 text-sm">{player.team} • Bye {player.byeWeek}</p>
        </div>

        {/* Quick stats grid */}
        <div className="grid grid-cols-4 gap-2 px-4 pb-3">
          <div className="bg-slate-900/60 rounded-lg py-2 text-center">
            <p className="text-[10px] text-gray-500 uppercase">Score</p>
            <p className="text-orange-400 font-bold text-sm">{Math.round(player.falklandScore)}</p>
          </div>
          <div className="bg-slate-900/60 rounded-lg py-2 text-center">
            <p className="text-[10px] text-gray-500 uppercase">Upside</p>
            <p className="text-yellow-400 font-bold text-sm">{Math.round(player.upside)}</p>
          </div>
          <div className="bg-slate-900/60 rounded-lg py-2 text-center">
            <p className="text-[10px] text-gray-500 uppercase">Bust</p>
            <p className={`font-bold text-sm ${player.bustRisk <= 2 ? 'text-green-400' : player.bustRisk === 3 ? 'text-yellow-400' : 'text-red-400'}`}>
              {player.bustRisk}/5
            </p>
          </div>
          <div className="bg-slate-900/60 rounded-lg py-2 text-center">
            <p className="text-[10px] text-gray-500 uppercase">SOS</p>
            <p className="text-purple-400 font-bold text-sm">{player.sos}/5</p>
          </div>
        </div>

        {/* Toggle full details */}
        <button
          onClick={() => setShowDetails((s) => !s)}
          className="w-full text-center text-xs text-blue-400 py-1 border-t border-slate-700/50 active:bg-slate-700/30"
        >
          {showDetails ? '▲ Hide full details' : '▼ Show full details'}
        </button>

        {showDetails && (
          <div className="px-4 py-3 border-t border-slate-700 space-y-1.5 text-sm bg-slate-900/40">
            <div className="flex justify-between"><span className="text-gray-500">Dynasty Rank</span><span className="text-cyan-400 font-semibold">#{player.dynastyRank}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Season Rank</span><span className="text-cyan-400 font-semibold">#{player.seasonRank}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">QB Starter</span><span className="text-white font-semibold">{player.projectedQBStarter}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">OL Rank (Sharp)</span><span className="text-white font-semibold">#{player.sharpOLRank}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">OL Rank (Avg)</span><span className="text-white font-semibold">#{player.olAvgRank}</span></div>
            {player.olNotes && <p className="text-gray-500 text-xs pt-1">{player.olNotes}</p>}
          </div>
        )}
      </div>

      <p className="text-center text-gray-500 text-xs mt-2">← swipe to -1 &nbsp;•&nbsp; swipe to +1 →</p>

      {/* Rating */}
      <div className="mt-4 bg-slate-800 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-bold">Rating</span>
          <span className="text-2xl font-black text-blue-400">{rating}<span className="text-sm text-gray-500">/10</span></span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Final Score</span>
          <span className="text-yellow-400 font-bold">{finalScore.toFixed(1)}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-3">
        <div className="flex flex-wrap gap-1.5">
          {POSITIVE_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                selectedTags.includes(tag)
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
          {NEGATIVE_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                selectedTags.includes(tag)
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-700 text-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)..."
        rows={2}
        className="mt-3 w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Action buttons */}
      <div className="flex gap-2 mt-3 mb-4">
        <button
          onClick={goPrev}
          className="px-4 py-4 bg-slate-700 text-white rounded-xl font-bold active:scale-95 transition-transform"
        >
          ←
        </button>
        <button
          onClick={() => save(true)}
          className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-xl text-lg active:scale-95 transition-transform"
        >
          💾 SAVE & NEXT
        </button>
        <button
          onClick={goNext}
          className="px-4 py-4 bg-slate-700 text-white rounded-xl font-bold active:scale-95 transition-transform"
        >
          →
        </button>
      </div>
    </div>
  );
};
