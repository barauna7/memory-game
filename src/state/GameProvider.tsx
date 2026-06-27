import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type { Level } from '../lib/levels';

export type Screen = 'menu' | 'playing' | 'result' | 'gameover' | 'leaderboard';

export interface GameResult {
  readonly moves: number;
  readonly secondsLeft: number;
  readonly secondsTotal: number;
  readonly stars: number;
}

interface SessionState {
  readonly screen: Screen;
  readonly level: Level | null;
  readonly result: GameResult | null;
  /** Bumped on every new round so the game screen remounts fresh. */
  readonly round: number;
}

type Action =
  | { type: 'START'; level: Level }
  | { type: 'WIN'; result: GameResult }
  | { type: 'LOSE' }
  | { type: 'REPLAY' }
  | { type: 'LEADERBOARD' }
  | { type: 'MENU' };

const initialState: SessionState = {
  screen: 'menu',
  level: null,
  result: null,
  round: 0,
};

function reducer(state: SessionState, action: Action): SessionState {
  switch (action.type) {
    case 'START':
      return {
        screen: 'playing',
        level: action.level,
        result: null,
        round: state.round + 1,
      };
    case 'WIN':
      return { ...state, screen: 'result', result: action.result };
    case 'LOSE':
      return { ...state, screen: 'gameover', result: null };
    case 'REPLAY':
      return { ...state, screen: 'playing', result: null, round: state.round + 1 };
    case 'LEADERBOARD':
      return { ...state, screen: 'leaderboard' };
    case 'MENU':
      return { ...initialState, round: state.round };
    default:
      return state;
  }
}

interface GameContextValue extends SessionState {
  startGame: (level: Level) => void;
  winGame: (result: GameResult) => void;
  loseGame: () => void;
  replay: () => void;
  goToLeaderboard: () => void;
  goToMenu: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const startGame = useCallback(
    (level: Level) => dispatch({ type: 'START', level }),
    [],
  );
  const winGame = useCallback(
    (result: GameResult) => dispatch({ type: 'WIN', result }),
    [],
  );
  const loseGame = useCallback(() => dispatch({ type: 'LOSE' }), []);
  const replay = useCallback(() => dispatch({ type: 'REPLAY' }), []);
  const goToLeaderboard = useCallback(
    () => dispatch({ type: 'LEADERBOARD' }),
    [],
  );
  const goToMenu = useCallback(() => dispatch({ type: 'MENU' }), []);

  const value = useMemo<GameContextValue>(
    () => ({
      ...state,
      startGame,
      winGame,
      loseGame,
      replay,
      goToLeaderboard,
      goToMenu,
    }),
    [state, startGame, winGame, loseGame, replay, goToLeaderboard, goToMenu],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame deve ser usado dentro de <GameProvider>');
  }
  return ctx;
}
