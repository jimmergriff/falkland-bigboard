'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useBigBoard } from '@/lib/store';
import { enrichedPlayers } from '@/lib/enrichedPlayers';
import { POSITIVE_TAGS, NEGATIVE_TAGS } from '@/lib/types';
import Link from 'next/link';

interface MobileEvaluatorProps {
  ownerName: string;
}

export const MobileEvaluator: React.FC<MobileEvaluatorProps> = ({ ownerName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [swipeOpacity, setSwipeOpacity] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const addEvaluation = useBigBoard((s) => s.addEvaluation);

  const currentPlayer = enrichedPlayers[currentIndex];
  const allTags = [...POSITIVE_TAGS, ...NEGATIVE_TAGS];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchCurrentX = e.touches[0].clientX;
    const diffX = touchCurrentX - touchStartX.current;
    const diffY = Math.abs(e.touches[0].clientY - touchStartY.current);

    // Only swipe if horizontal movement is greater than vertical
    if (Math.abs(diffX) > diffY) {
      const opacity = Math.min(Math.abs(diffX) / 100, 1);
      setSwipeOpacity(opacity);
      setSwipeDirection(diffX > 0 ? 'right' : 'left');
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartX.current;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swiped right = like = higher rating
        handleLike();
      } else {
        // Swiped left = dislike = lower rating
        handleDislike();
      }
    }

    setSwipeOpacity(0);
    setSwipeDirection(null);
  };

  const handleLike = () => {
    setRating(Math.min(rating + 2, 10));
    nextPlayer();
  };

  const handleDislike = () => {
    setRating(Math.max(rating - 2, 1));
    nextPlayer();
  };

  const handleSaveAndNext = () => {
    const likeCount = selectedTags.filter(t => (POSITIVE_TAGS as string[]).includes(t)).length;
    const dislikeCount = selectedTags.filter(t => (NEGATIVE_TAGS as string[]).includes(t)).length;
    const finalScore = rating + (likeCount - dislikeCount) * 0.5;

    const evaluation = {
      id: `${currentPlayer.id}-${ownerName}-${Date.now()}`,
      playerId: currentPlayer.id,
      ownerId: ownerName,
      ownerName,
      overallRating: rating,
      potentialRating: rating,
      keepTradeAction: 'KEEP' as const,
      tags: selectedTags as any,
      notes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    addEvaluation(evaluation);
    resetAndNext();
  };

  const resetAndNext = () => {
    setRating(5);
    setSelectedTags([]);
    setNotes('');
    nextPlayer();
  };

  const nextPlayer = () => {
    setCurrentIndex((prev) => (prev + 1) % enrichedPlayers.length);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const likeCount = selectedTags.filter(t => (POSITIVE_TAGS as string[]).includes(t)).length;
  const dislikeCount = selectedTags.filter(t => (NEGATIVE_TAGS as string[]).includes(t)).length;
  const finalScore = rating + (likeCount - dislikeCount) * 0.5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <Link href="/" className="text-white font-bold">
          ← Back
        </Link>
        <h1 className="text-white font-bold text-lg">
          {ownerName === 'Roy' ? '🐑' : '🌲'} Rate Player
        </h1>
        <span className="text-gray-400 text-sm">
          {currentIndex + 1}/{enrichedPlayers.length}
        </span>
      </div>

      {/* Player Card - Swipeable */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="flex-1 bg-slate-800 rounded-2xl border-2 border-slate-700 p-6 mb-4 flex flex-col items-center justify-center relative overflow-hidden cursor-grab active:cursor-grabbing"
        style={{
          opacity: 1 - swipeOpacity * 0.3,
          transform: `translateX(${swipeDirection === 'right' ? swipeOpacity * 50 : swipeDirection === 'left' ? -swipeOpacity * 50 : 0}px)`,
          transition: swipeOpacity === 0 ? 'transform 0.2s ease-out' : 'none',
        }}
      >
        {/* Swipe Indicators */}
        {swipeDirection === 'right' && (
          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
            <span className="text-4xl font-bold text-green-400">👍 LIKE</span>
          </div>
        )}
        {swipeDirection === 'left' && (
          <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
            <span className="text-4xl font-bold text-red-400">👎 PASS</span>
          </div>
        )}

        {/* Player Info */}
        <div className="text-center z-10">
          {currentPlayer.imageUrl && (
            <div
              className="w-40 h-40 rounded-full mx-auto mb-4 bg-center bg-contain bg-no-repeat"
              style={{ backgroundImage: `url(${currentPlayer.imageUrl})` }}
            />
          )}
          <h2 className="text-3xl font-bold text-white mb-2">{currentPlayer.name}</h2>
          <p className="text-lg text-gray-400 mb-4">
            {currentPlayer.position} • {currentPlayer.team}
          </p>

          {/* Rating Display */}
          <div className="bg-slate-900 rounded-lg p-4 mb-4 w-full">
            <div className="text-5xl font-bold text-blue-400 mb-2">{rating}/10</div>
            <div className="text-sm text-gray-400">
              Final: <span className="text-yellow-400 font-bold">{finalScore.toFixed(1)}</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex gap-2 w-full mb-4">
            <button
              onClick={handleDislike}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg text-lg active:scale-95 transition-transform"
            >
              👎 Pass
            </button>
            <button
              onClick={handleLike}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg text-lg active:scale-95 transition-transform"
            >
              👍 Like
            </button>
          </div>

          <p className="text-gray-400 text-sm">← Swipe left or right →</p>
        </div>
      </div>

      {/* Rating Slider */}
      <div className="mb-4">
        <label className="text-white font-bold mb-2 block">Rating</label>
        <input
          type="range"
          min="1"
          max="10"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      {/* Tags Section */}
      <div className="mb-4 max-h-32 overflow-y-auto">
        <label className="text-white font-bold mb-2 block">Tags</label>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition-all active:scale-95 ${
                selectedTags.includes(tag)
                  ? (POSITIVE_TAGS as string[]).includes(tag)
                    ? 'bg-green-600 text-white'
                    : 'bg-red-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mb-4">
        <label className="text-white font-bold mb-2 block">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about this player..."
          className="w-full bg-slate-700 text-white rounded-lg p-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
        />
      </div>

      {/* Save & Next Button */}
      <button
        onClick={handleSaveAndNext}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-lg active:scale-95 transition-transform"
      >
        💾 SAVE & NEXT
      </button>
    </div>
  );
};
