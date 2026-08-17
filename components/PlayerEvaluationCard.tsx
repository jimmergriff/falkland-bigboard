'use client';

import React, { useState } from 'react';
import { Player, EvaluationTag, OwnerEvaluation, POSITIVE_TAGS, NEGATIVE_TAGS } from '@/lib/types';
import { useBigBoard } from '@/lib/store';

interface PlayerEvaluationCardProps {
  player: Player;
  onSave: (evaluation: OwnerEvaluation) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const PlayerEvaluationCard: React.FC<PlayerEvaluationCardProps> = ({
  player,
  onSave,
  onNext,
  onPrevious,
}) => {
  const currentOwnerId = useBigBoard((s) => s.currentOwnerId);
  const currentOwnerName = useBigBoard((s) => s.currentOwnerName);

  const [sliderValue, setSliderValue] = useState(5);
  const [selectedTags, setSelectedTags] = useState<EvaluationTag[]>([]);
  const [notes, setNotes] = useState('');

  const positiveCount = selectedTags.filter((t) => (POSITIVE_TAGS as string[]).includes(t)).length;
  const negativeCount = selectedTags.filter((t) => (NEGATIVE_TAGS as string[]).includes(t)).length;
  const finalScore = Math.max(0.5, Math.min(12, sliderValue + (positiveCount - negativeCount) * 0.5));

  const handleTagToggle = (tag: EvaluationTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const doSave = () => {
    if (!currentOwnerId || !currentOwnerName) {
      alert('Select Roy or Pine first!');
      return;
    }
    const evaluation: OwnerEvaluation = {
      id: `${currentOwnerId}-${player.id}-${Date.now()}`,
      playerId: player.id,
      ownerId: currentOwnerId,
      ownerName: currentOwnerName,
      overallRating: sliderValue,
      potentialRating: finalScore,
      keepTradeAction: 'KEEP',
      tags: selectedTags,
      notes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    onSave(evaluation);
    setSliderValue(5);
    setSelectedTags([]);
    setNotes('');
  };

  const handleNext = () => {
    doSave();
    onNext?.();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-sm">
        {/* Player Card */}
        <div className="relative mb-6 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-slate-700 to-slate-900 border-2 border-slate-600">
          {/* Player Photo */}
          <div className="h-64 bg-gradient-to-b from-blue-500 to-purple-600 flex items-center justify-center relative">
            {player.imageUrl ? (
              <div
                className="absolute inset-0 bg-center bg-no-repeat bg-contain"
                style={{ backgroundImage: `url(${player.imageUrl})`, opacity: 0.9 }}
              />
            ) : (
              <div className="text-8xl opacity-30">🏈</div>
            )}
            <div className="absolute top-4 right-4 bg-white text-slate-900 font-bold px-4 py-2 rounded-full text-xl shadow-lg">
              {player.position}
            </div>
            <div className="absolute top-4 left-4 bg-slate-900 text-blue-400 font-bold px-3 py-1 rounded-full text-sm">
              #{player.falklandRank}
            </div>
          </div>

          <div className="p-6 text-center text-white">
            <h2 className="text-3xl font-black mb-1">{player.name}</h2>
            <p className="text-slate-300 text-lg mb-4">{player.team} &bull; Bye {player.byeWeek}</p>

            <div className="grid grid-cols-4 gap-2 bg-slate-800 rounded-xl p-3 mb-2 text-center">
              <div>
                <p className="text-slate-400 text-xs">Upside</p>
                <p className="text-lg font-bold text-purple-400">{player.upside.toFixed(0)}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Bust</p>
                <p className="text-lg font-bold text-orange-400">{player.bustRisk}/5</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">SOS</p>
                <p className="text-lg font-bold text-yellow-400">{player.sos}/5</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">OL</p>
                <p className="text-lg font-bold text-cyan-400">{player.olAvgRank}</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs">QB: {player.projectedQBStarter}</p>
          </div>
        </div>

        {/* 1-10 Falkland Slider */}
        <div className="mb-6 bg-slate-800 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-2">
            <p className="text-slate-400 text-sm font-bold">YOUR RATING</p>
            <p className="text-white text-2xl font-black">{sliderValue}<span className="text-slate-500 text-lg">/10</span></p>
          </div>
          <div className="relative">
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #22c55e ${(sliderValue - 1) / 9 * 100}%, #334155 ${(sliderValue - 1) / 9 * 100}%)`,
              }}
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
              <span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
            </div>
          </div>
          <div className="mt-3 text-center">
            <span className="text-green-400 text-sm">+{positiveCount * 0.5}</span>
            <span className="text-slate-500 text-sm"> / </span>
            <span className="text-red-400 text-sm">-{negativeCount * 0.5}</span>
            <span className="text-slate-500 text-sm"> = </span>
            <span className="text-white font-bold text-lg">Final: {finalScore.toFixed(1)}</span>
          </div>
        </div>

        {/* WHY LIKE */}
        <div className="mb-5">
          <h3 className="text-green-400 font-bold text-lg mb-3">✅ WHY LIKE? <span className="text-slate-500 text-sm">(+0.5 each)</span></h3>
          <div className="grid grid-cols-2 gap-2">
            {POSITIVE_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`py-2.5 px-3 rounded-2xl text-sm font-semibold transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-green-600 text-white scale-105 ring-2 ring-green-400'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {selectedTags.includes(tag) ? '☑ ' : '☐ '}{tag}
              </button>
            ))}
          </div>
        </div>

        {/* WHY NOT */}
        <div className="mb-5">
          <h3 className="text-red-400 font-bold text-lg mb-3">❌ WHY NOT? <span className="text-slate-500 text-sm">(-0.5 each)</span></h3>
          <div className="grid grid-cols-2 gap-2">
            {NEGATIVE_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`py-2.5 px-3 rounded-2xl text-sm font-semibold transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-red-600 text-white scale-105 ring-2 ring-red-400'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {selectedTags.includes(tag) ? '☑ ' : '☐ '}{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-5">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)..."
            className="w-full p-3 rounded-xl bg-slate-700 text-white placeholder-slate-500 border border-slate-600 focus:border-blue-500 focus:outline-none"
            rows={2}
          />
        </div>

        {/* Action Buttons: Back | Skip | NEXT (saves) */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={onPrevious}
            className="w-20 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-4 rounded-xl transition-all text-sm"
          >
            ← Back
          </button>
          <button
            onClick={onNext}
            className="w-20 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-4 rounded-xl transition-all text-sm"
          >
            Skip →
          </button>
          <button
            onClick={handleNext}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl text-lg transition-all hover:scale-105"
          >
            🐑 SAVE & NEXT →
          </button>
        </div>
      </div>
    </div>
  );
};
