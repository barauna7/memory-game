import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stars } from './Stars';
import { ActionButton } from './ActionButton';
import { formatTime } from '../lib/format';
import { useGame } from '../state/GameProvider';
import { theme } from '../lib/theme';

export function ResultScreen() {
  const { result, replay, goToMenu } = useGame();

  if (!result) return null;

  const elapsed = result.secondsTotal - result.secondsLeft;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />

      <View style={styles.content}>
        <Text style={styles.heading}>Você venceu! 🎉</Text>

        <Stars filled={result.stars} />

        <View style={styles.statsRow}>
          <Metric label="Jogadas" value={String(result.moves)} />
          <Metric label="Tempo" value={formatTime(elapsed)} />
        </View>
      </View>

      <View style={styles.actions}>
        <ActionButton label="Jogar de novo" onPress={replay} />
        <ActionButton label="Menu" variant="ghost" onPress={goToMenu} />
      </View>
    </SafeAreaView>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.color.bg,
    paddingHorizontal: theme.space.lg,
    paddingBottom: theme.space.lg,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.space.xl,
  },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    color: theme.color.text,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.space.md,
    width: '100%',
  },
  metric: {
    flex: 1,
    backgroundColor: theme.color.cardBack,
    borderColor: theme.color.cardBackAccent,
    borderWidth: 1,
    borderRadius: theme.radius.card,
    paddingVertical: theme.space.lg,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.color.text,
    fontVariant: ['tabular-nums'],
  },
  metricLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: theme.color.textDim,
    marginTop: 4,
  },
  actions: {
    gap: theme.space.sm,
  },
});
