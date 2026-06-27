import { GameProvider, useGame } from './src/state/GameProvider';
import { MenuScreen } from './src/components/MenuScreen';
import { GameScreen } from './src/components/GameScreen';
import { ResultScreen } from './src/components/ResultScreen';
import { GameOverScreen } from './src/components/GameOverScreen';
import { LeaderboardScreen } from './src/components/LeaderboardScreen';

function Router() {
  const { screen, round } = useGame();

  switch (screen) {
    case 'playing':
      // `round` as key remounts the game for a fresh deck + timer on replay.
      return <GameScreen key={round} />;
    case 'result':
      return <ResultScreen />;
    case 'gameover':
      return <GameOverScreen />;
    case 'leaderboard':
      return <LeaderboardScreen />;
    case 'menu':
    default:
      return <MenuScreen />;
  }
}

export default function App() {
  return (
    <GameProvider>
      <Router />
    </GameProvider>
  );
}
