export type Position = 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DST';

export interface Player {
  id: string;
  name: string;
  position: Position;
  team: string;
  imageUrl?: string;
  falklandRank: number;
  falklandScore: number;
  upside: number;
  dynastyRank: number;
  seasonRank: number;
  bustRisk: number;
  sos: number;
  byeWeek: number;
  projectedQBStarter: string;
  sharpOLRank: number;
  olAvgRank: number;
  olNotes: string;
}

export type EvaluationTag =
  | 'Elite Talent' | 'High Floor' | 'Huge Upside' | 'Potential' | 'Opportunity'
  | 'Volume' | 'Supporting Cast' | 'SOS' | 'Strong QB' | 'Strong OLine'
  | 'TD Potential' | 'Big Play Ability' | 'Age/Longevity' | 'Bust Risk'
  | 'Injury Concern' | 'Unproven' | 'Volume Risk' | 'Bad QB' | 'Weak OLine';

export type KeepTradeAction = 'KEEP' | 'TRADE' | 'CUT';

export interface OwnerEvaluation {
  id: string;
  playerId: string;
  ownerId: string;
  ownerName: string;
  overallRating: number;
  potentialRating: number;
  keepTradeAction: KeepTradeAction;
  tags: EvaluationTag[];
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface ConsensusRanking {
  playerId: string;
  playerName: string;
  position: Position;
  team: string;
  imageUrl?: string;
  roy_Rating: number;
  pine_Rating: number;
  royTags: EvaluationTag[];
  pineTags: EvaluationTag[];
  royLikeCount: number;
  royDislikeCount: number;
  pineLikeCount: number;
  pineDislikeCount: number;
  royFinalScore: number;
  pineFinalScore: number;
  royRank: number;
  pineRank: number;
  averageRating: number;
  consensusScore: number;
  agreementScore: number;
  disagreementScore: number;
  ourRank: number;
  falklandRank: number;
  rankDifference: number;
  upside: number;
  safetyScore: number;
  bustRisk: number;
  sos: number;
  byeWeek: number;
  projectedQBStarter: string;
  sharpOLRank: number;
  olAvgRank: number;
  falklandScore: number;
  dynastyRank: number;
  seasonRank: number;
  sleeperScore: number;
}

export const POSITIVE_TAGS: EvaluationTag[] = [
  'Elite Talent', 'High Floor', 'Huge Upside', 'Potential', 'Opportunity',
  'Volume', 'Supporting Cast', 'Strong QB', 'Strong OLine', 'TD Potential', 'Big Play Ability'
];

export const NEGATIVE_TAGS: EvaluationTag[] = [
  'Bust Risk', 'Age/Longevity', 'Injury Concern', 'Unproven',
  'Volume Risk', 'Bad QB', 'Weak OLine', 'SOS'
];
