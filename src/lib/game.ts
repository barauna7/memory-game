import type { Card, GameState } from '../types';

/** Emoji pool — pick the first N for N pairs. Must hold >= the largest level. */
const EMOJI_POOL = [
  '🚀', '🌟', '🎲', '🍕', '🐙', '🎸', '🦄', '🍩',
  '👾', '🎯', '🌈', '🔥', '🐳', '🍔', '⚡️', '🎨',
  '🍉', '🪐', '🎃', '🦊', '🌵', '🍄', '🎁', '🐢',
] as const;

export const DEFAULT_PAIRS = 8;

/** Fisher-Yates shuffle returning a new array (no mutation of the input). */
function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Build a shuffled deck of `pairs` matching pairs. */
export function createDeck(pairs: number = DEFAULT_PAIRS): Card[] {
  const chosen = EMOJI_POOL.slice(0, pairs);
  const deck = chosen.flatMap((emoji, index) =>
    [0, 1].map((copy) => ({
      id: `${index}-${copy}`,
      emoji,
      isFlipped: false,
      isMatched: false,
    })),
  );
  return shuffle(deck);
}

export function createInitialState(pairs: number = DEFAULT_PAIRS): GameState {
  return {
    cards: createDeck(pairs),
    flippedIds: [],
    moves: 0,
    matches: 0,
    status: 'idle',
  };
}

/** Flip a face-down card. No-op when two cards are already flipped. */
export function flipCard(state: GameState, id: string): GameState {
  if (state.flippedIds.length >= 2) return state;

  const target = state.cards.find((c) => c.id === id);
  if (!target || target.isFlipped || target.isMatched) return state;

  const cards = state.cards.map((c) =>
    c.id === id ? { ...c, isFlipped: true } : c,
  );

  return {
    ...state,
    cards,
    flippedIds: [...state.flippedIds, id],
    status: 'playing',
  };
}

/**
 * Resolve the two flipped cards: mark matched or flip them back.
 * Increments the move counter and detects a win.
 */
export function resolveTurn(state: GameState): GameState {
  if (state.flippedIds.length !== 2) return state;

  const [firstId, secondId] = state.flippedIds;
  const first = state.cards.find((c) => c.id === firstId);
  const second = state.cards.find((c) => c.id === secondId);
  const isMatch = !!first && !!second && first.emoji === second.emoji;

  const cards = state.cards.map((c) => {
    if (c.id !== firstId && c.id !== secondId) return c;
    return isMatch
      ? { ...c, isMatched: true, isFlipped: true }
      : { ...c, isFlipped: false };
  });

  const matches = state.matches + (isMatch ? 1 : 0);
  const totalPairs = state.cards.length / 2;

  return {
    ...state,
    cards,
    flippedIds: [],
    moves: state.moves + 1,
    matches,
    status: matches === totalPairs ? 'won' : 'playing',
  };
}
