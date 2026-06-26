import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../lib/theme';

interface StatsProps {
  moves: number;
  matches: number;
  totalPairs: number;
}

export function Stats({ moves, matches, totalPairs }: StatsProps) {
  return (
    <View style={styles.row}>
      <Stat label="Jogadas" value={String(moves)} />
      <Stat label="Pares" value={`${matches}/${totalPairs}`} />
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: theme.space.md,
  },
  stat: {
    flex: 1,
    backgroundColor: theme.color.cardBack,
    borderRadius: theme.radius.card,
    paddingVertical: theme.space.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.color.cardBackAccent,
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.color.text,
  },
  label: {
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: theme.color.textDim,
    marginTop: 2,
  },
});
