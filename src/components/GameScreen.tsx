import { useEffect, useRef } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Board } from './Board';
import { Stats } from './Stats';
import { Timer } from './Timer';
import { useMemoryGame } from '../hooks/useMemoryGame';
import { computeStars } from '../lib/stars';
import { useGame } from '../state/GameProvider';
import { theme } from '../lib/theme';

export function GameScreen() {
  const { level, winGame, loseGame, goToMenu } = useGame();

  if (!level) return null;

  return (
    <ActiveGame
      pairs={level.pairs}
      columns={level.columns}
      seconds={level.seconds}
      label={level.label}
      onWin={winGame}
      onLose={loseGame}
      onQuit={goToMenu}
    />
  );
}

interface ActiveGameProps {
  pairs: number;
  columns: number;
  seconds: number;
  label: string;
  onWin: (result: {
    moves: number;
    secondsLeft: number;
    secondsTotal: number;
    stars: number;
  }) => void;
  onLose: () => void;
  onQuit: () => void;
}

function ActiveGame({
  pairs,
  columns,
  seconds,
  label,
  onWin,
  onLose,
  onQuit,
}: ActiveGameProps) {
  const { state, flip } = useMemoryGame(pairs);
  const secondsLeftRef = useRef(seconds);
  const totalPairs = state.cards.length / 2;
  const locked = state.flippedIds.length >= 2;
  const won = state.status === 'won';

  useEffect(() => {
    if (!won) return;
    const left = secondsLeftRef.current;
    onWin({
      moves: state.moves,
      secondsLeft: left,
      secondsTotal: seconds,
      stars: computeStars(left, seconds),
    });
  }, [won]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />

      <View style={styles.topBar}>
        <Pressable onPress={onQuit} hitSlop={12}>
          <Text style={styles.quit}>‹ Menu</Text>
        </Pressable>
        <Text style={styles.level}>{label}</Text>
        <View style={styles.quitSpacer} />
      </View>

      <Timer
        seconds={seconds}
        running={!won}
        onExpire={onLose}
        onTick={(remaining) => {
          secondsLeftRef.current = remaining;
        }}
      />

      <Stats moves={state.moves} matches={state.matches} totalPairs={totalPairs} />

      <View style={styles.boardArea}>
        <Board
          cards={state.cards}
          columns={columns}
          locked={locked}
          onFlip={flip}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.color.bg,
    paddingHorizontal: theme.space.md,
    paddingBottom: theme.space.lg,
    gap: theme.space.md,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: theme.space.sm,
  },
  quit: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.color.accentSoft,
  },
  quitSpacer: {
    width: 52,
  },
  level: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.color.text,
  },
  boardArea: {
    flex: 1,
    justifyContent: 'center',
  },
});
