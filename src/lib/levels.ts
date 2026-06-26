export type LevelId = 'easy' | 'medium' | 'hard';

export interface Level {
  readonly id: LevelId;
  readonly label: string;
  readonly grid: string;
  readonly pairs: number;
  readonly columns: number;
  readonly seconds: number;
}

export const LEVELS: Record<LevelId, Level> = {
  easy: {
    id: 'easy',
    label: 'Fácil',
    grid: '4 × 4',
    pairs: 8,
    columns: 4,
    seconds: 180,
  },
  medium: {
    id: 'medium',
    label: 'Médio',
    grid: '4 × 6',
    pairs: 12,
    columns: 4,
    seconds: 120,
  },
  hard: {
    id: 'hard',
    label: 'Difícil',
    grid: '6 × 6',
    pairs: 18,
    columns: 6,
    seconds: 90,
  },
};

export const LEVEL_ORDER: readonly LevelId[] = ['easy', 'medium', 'hard'];
