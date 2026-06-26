import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LEVELS, LEVEL_ORDER, type Level } from '../lib/levels';
import { formatTime } from '../lib/format';
import { useGame } from '../state/GameProvider';
import { theme } from '../lib/theme';

export function MenuScreen() {
  const { startGame } = useGame();

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.title}>Jogo da Memória</Text>
        <Text style={styles.subtitle}>Escolha a dificuldade</Text>
      </View>

      <View style={styles.list}>
        {LEVEL_ORDER.map((id) => (
          <LevelCard key={id} level={LEVELS[id]} onSelect={startGame} />
        ))}
      </View>
    </SafeAreaView>
  );
}

interface LevelCardProps {
  level: Level;
  onSelect: (level: Level) => void;
}

function LevelCard({ level, onSelect }: LevelCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onSelect(level)}
    >
      <View style={styles.cardMain}>
        <Text style={styles.cardLabel}>{level.label}</Text>
        <Text style={styles.cardMeta}>
          {level.grid} · {level.pairs} pares
        </Text>
      </View>
      <View style={styles.cardTime}>
        <Text style={styles.cardTimeValue}>{formatTime(level.seconds)}</Text>
        <Text style={styles.cardTimeLabel}>min</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.color.bg,
    paddingHorizontal: theme.space.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.space.xl,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: theme.color.text,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: theme.color.textDim,
    marginTop: 6,
  },
  list: {
    gap: theme.space.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.color.cardBack,
    borderColor: theme.color.cardBackAccent,
    borderWidth: 1,
    borderRadius: theme.radius.card,
    paddingVertical: theme.space.lg,
    paddingHorizontal: theme.space.lg,
  },
  cardPressed: {
    borderColor: theme.color.accent,
    backgroundColor: theme.color.cardBackAccent,
  },
  cardMain: {
    gap: 4,
  },
  cardLabel: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.color.text,
  },
  cardMeta: {
    fontSize: 13,
    color: theme.color.textDim,
    letterSpacing: 0.5,
  },
  cardTime: {
    alignItems: 'flex-end',
  },
  cardTimeValue: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.color.accentSoft,
    fontVariant: ['tabular-nums'],
  },
  cardTimeLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: theme.color.textDim,
  },
});
