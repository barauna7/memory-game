export type CardId = string;

export interface Card {
  readonly id: CardId;
  readonly emoji: string;
  readonly isFlipped: boolean;
  readonly isMatched: boolean;
}

export type GameStatus = 'idle' | 'playing' | 'won';

export interface GameState {
  readonly cards: readonly Card[];
  readonly flippedIds: readonly CardId[];
  readonly moves: number;
  readonly matches: number;
  readonly status: GameStatus;
}
