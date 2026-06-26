import { useCallback, useEffect, useState } from 'react';
import type { GameState } from '../types';
import {
  createInitialState,
  flipCard,
  resolveTurn,
  DEFAULT_PAIRS,
} from '../lib/game';

const RESOLVE_DELAY_MS = 800;

export function useMemoryGame(pairs: number = DEFAULT_PAIRS) {
  const [state, setState] = useState<GameState>(() =>
    createInitialState(pairs),
  );

  const flip = useCallback((id: string) => {
    setState((prev) => flipCard(prev, id));
  }, []);

  const reset = useCallback(() => {
    setState(createInitialState(pairs));
  }, [pairs]);

  // When two cards are flipped, resolve the turn after a short delay
  // so the player can see the second card.
  useEffect(() => {
    if (state.flippedIds.length !== 2) return;
    const timer = setTimeout(() => {
      setState((prev) => resolveTurn(prev));
    }, RESOLVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [state.flippedIds]);

  return { state, flip, reset };
}
