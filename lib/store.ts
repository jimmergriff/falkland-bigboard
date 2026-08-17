'use client';

import { create } from 'zustand';
import { Player, OwnerEvaluation, ConsensusRanking, POSITIVE_TAGS, NEGATIVE_TAGS } from './types';
import { enrichedPlayers } from './enrichedPlayers';

interface BigBoardStore {
  players: Player[];
  evaluations: OwnerEvaluation[];
  currentOwnerId: string;
  currentOwnerName: string;
  selectedPosition: string;
  sortBy: string;
  royOrder: string[];
  pineOrder: string[];
  initialized: boolean;

  setPlayers: (players: Player[]) => void;
  addEvaluation: (evaluation: OwnerEvaluation) => void;
  updateEvaluation: (evaluation: OwnerEvaluation) => void;
  setCurrentOwner: (id: string, name: string) => void;
  setSelectedPosition: (position: string) => void;
  setSortBy: (sortBy: string) => void;
  getFilteredRankings: () => ConsensusRanking[];
  reorderRoy: (playerId: string, newIndex: number) => void;
  reorderPine: (playerId: string, newIndex: number) => void;
  getRoyBoard: () => ConsensusRanking[];
  getPineBoard: () => ConsensusRanking[];
  initializeFirebase: () => void;
}

function calcPlayerRanking(
  player: Player,
  evaluations: OwnerEvaluation[],
  royOrder: string[],
  pineOrder: string[],
): ConsensusRanking {
  const playerEvals = evaluations.filter((e) => e.playerId === player.id);
  const royEval = playerEvals.find((e) => e.ownerName === 'Roy');
  const pineEval = playerEvals.find((e) => e.ownerName === 'Pine');

  const roy_Rating = royEval?.overallRating || 0;
  const pine_Rating = pineEval?.overallRating || 0;

  const royTags = royEval?.tags || [];
  const pineTags = pineEval?.tags || [];

  const royLikeCount = royTags.filter(t => (POSITIVE_TAGS as string[]).includes(t)).length;
  const royDislikeCount = royTags.filter(t => (NEGATIVE_TAGS as string[]).includes(t)).length;
  const pineLikeCount = pineTags.filter(t => (POSITIVE_TAGS as string[]).includes(t)).length;
  const pineDislikeCount = pineTags.filter(t => (NEGATIVE_TAGS as string[]).includes(t)).length;

  const royFinalScore = roy_Rating > 0 ? roy_Rating + (royLikeCount - royDislikeCount) * 0.5 : 0;
  const pineFinalScore = pine_Rating > 0 ? pine_Rating + (pineLikeCount - pineDislikeCount) * 0.5 : 0;

  const bothRated = roy_Rating > 0 && pine_Rating > 0;
  const eitherRated = roy_Rating > 0 || pine_Rating > 0;
  const averageRating = bothRated ? (royFinalScore + pineFinalScore) / 2 : (eitherRated ? (royFinalScore || pineFinalScore) : 0);
  const consensusScore = averageRating;
  const agreementScore = bothRated ? 100 - Math.abs(royFinalScore - pineFinalScore) * 10 : 0;
  const disagreementScore = bothRated ? Math.abs(royFinalScore - pineFinalScore) : 0;

  const royRankIdx = royOrder.indexOf(player.id);
  const pineRankIdx = pineOrder.indexOf(player.id);
  const royRank = royRankIdx >= 0 ? royRankIdx + 1 : 0;
  const pineRank = pineRankIdx >= 0 ? pineRankIdx + 1 : 0;

  const totalLikes = royLikeCount + pineLikeCount;
  const totalDislikes = royDislikeCount + pineDislikeCount;
  const rankBonus = Math.max(0, (173 - player.falklandRank) / 17.3);
  const sleeperScore = averageRating + (totalLikes - totalDislikes) + rankBonus;

  return {
    playerId: player.id,
    playerName: player.name,
    position: player.position,
    team: player.team,
    imageUrl: player.imageUrl,
    roy_Rating,
    pine_Rating,
    royTags,
    pineTags,
    royLikeCount,
    royDislikeCount,
    pineLikeCount,
    pineDislikeCount,
    royFinalScore,
    pineFinalScore,
    royRank,
    pineRank,
    averageRating,
    consensusScore,
    agreementScore,
    disagreementScore,
    ourRank: player.falklandRank,
    falklandRank: player.falklandRank,
    rankDifference: 0,
    upside: player.upside,
    safetyScore: 100 - (player.bustRisk / 5) * 50,
    bustRisk: player.bustRisk,
    sos: player.sos,
    byeWeek: player.byeWeek,
    projectedQBStarter: player.projectedQBStarter,
    sharpOLRank: player.sharpOLRank,
    olAvgRank: player.olAvgRank,
    falklandScore: player.falklandScore,
    dynastyRank: player.dynastyRank,
    seasonRank: player.seasonRank,
    sleeperScore,
  };
}

const defaultOrder = enrichedPlayers.map(p => p.id);

export const useBigBoard = create<BigBoardStore>((set, get) => ({
  players: enrichedPlayers,
  evaluations: [],
  currentOwnerId: 'owner-a',
  currentOwnerName: 'Roy',
  selectedPosition: 'All',
  sortBy: 'rank',
  royOrder: [...defaultOrder],
  pineOrder: [...defaultOrder],
  initialized: false,

  setPlayers: (players: Player[]) => set({ players }),

  addEvaluation: (evaluation: OwnerEvaluation) => {
    set((state) => ({ evaluations: [...state.evaluations, evaluation] }));
  },

  updateEvaluation: (evaluation: OwnerEvaluation) => {
    set((state) => ({
      evaluations: state.evaluations.map((e) => e.id === evaluation.id ? evaluation : e),
    }));
  },

  setCurrentOwner: (id: string, name: string) => set({ currentOwnerId: id, currentOwnerName: name }),
  setSelectedPosition: (position: string) => set({ selectedPosition: position }),
  setSortBy: (sortBy: string) => set({ sortBy }),

  getFilteredRankings: () => {
    const { players, evaluations, selectedPosition, sortBy, royOrder, pineOrder } = get();
    const rankings = players.map(p => calcPlayerRanking(p, evaluations, royOrder, pineOrder));

    const filtered = rankings.filter(r => selectedPosition === 'All' ? true : r.position === selectedPosition);

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'consensus': return b.consensusScore - a.consensusScore;
        case 'disagreement': return b.disagreementScore - a.disagreementScore;
        case 'difference': return Math.abs(b.rankDifference) - Math.abs(a.rankDifference);
        case 'sleeper': return b.sleeperScore - a.sleeperScore;
        case 'rank':
        default: return a.falklandRank - b.falklandRank;
      }
    });

    return sorted;
  },

  reorderRoy: (playerId: string, newIndex: number) => {
    const order = [...get().royOrder];
    const oldIdx = order.indexOf(playerId);
    if (oldIdx === -1) return;
    order.splice(oldIdx, 1);
    order.splice(newIndex, 0, playerId);
    set({ royOrder: order });
  },

  reorderPine: (playerId: string, newIndex: number) => {
    const order = [...get().pineOrder];
    const oldIdx = order.indexOf(playerId);
    if (oldIdx === -1) return;
    order.splice(oldIdx, 1);
    order.splice(newIndex, 0, playerId);
    set({ pineOrder: order });
  },

  getRoyBoard: () => {
    const { players, evaluations, royOrder, pineOrder, selectedPosition } = get();
    const rankings = players.map(p => calcPlayerRanking(p, evaluations, royOrder, pineOrder));
    
    const sorted = [...rankings].sort((a, b) => {
      const aIdx = royOrder.indexOf(a.playerId);
      const bIdx = royOrder.indexOf(b.playerId);
      return aIdx - bIdx;
    });
    
    sorted.forEach((r, i) => { 
      r.ourRank = i + 1; 
      r.rankDifference = r.falklandRank - r.ourRank; 
    });
    
    return sorted.filter(r => selectedPosition === 'All' ? true : r.position === selectedPosition);
  },

  getPineBoard: () => {
    const { players, evaluations, royOrder, pineOrder, selectedPosition } = get();
    const rankings = players.map(p => calcPlayerRanking(p, evaluations, royOrder, pineOrder));
    
    const sorted = [...rankings].sort((a, b) => {
      const aIdx = pineOrder.indexOf(a.playerId);
      const bIdx = pineOrder.indexOf(b.playerId);
      return aIdx - bIdx;
    });
    
    sorted.forEach((r, i) => { 
      r.ourRank = i + 1; 
      r.rankDifference = r.falklandRank - r.ourRank; 
    });
    
    return sorted.filter(r => selectedPosition === 'All' ? true : r.position === selectedPosition);
  },

  initializeFirebase: () => {
    set({ initialized: true });
  },
}));