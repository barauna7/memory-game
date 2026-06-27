import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ActionButton } from './ActionButton';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { LEVELS, LEVEL_ORDER, type LevelId } from '../lib/levels';
import { formatTime } from '../lib/format';
import type { ScoreRow } from '../lib/leaderboard';
import { useGame } from '../state/GameProvider';
import { theme } from '../lib/theme';

export function LeaderboardScreen() {
  const { goToMenu } = useGame();
  const [level, setLevel] = useState<LevelId>('easy');
  const { scores, isLoading, error, reload } = useLeaderboard(level);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />

      <Text style={styles.title}>🏆 Placar</Text>

      <View style={styles.tabs}>
        {LEVEL_ORDER.map((id) => {
          const active = id === level;
          return (
            <Pressable
              key={id}
              onPress={() => setLevel(id)}
              style={[styles.tab, active && styles.tabActive]}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {LEVELS[id].label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.body}>
        {isLoading ? (
          <ActivityIndicator color={theme.color.accentSoft} size="large" />
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.message}>{error}</Text>
            <ActionButton label="Tentar de novo" variant="ghost" onPress={reload} />
          </View>
        ) : scores.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.message}>
              Nenhum score ainda. Seja o primeiro! 🎯
            </Text>
          </View>
        ) : (
          <FlatList
            data={scores}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item, index }) => (
              <ScoreItem rank={index + 1} score={item} />
            )}
          />
        )}
      </View>

      <ActionButton label="Menu" onPress={goToMenu} />
    </SafeAreaView>
  );
}

function ScoreItem({ rank, score }: { rank: number; score: ScoreRow }) {
  const elapsed = score.seconds_total - score.seconds_left;
  return (
    <View style={styles.row}>
      <Text style={styles.rank}>{rank}</Text>
      <View style={styles.rowMain}>
        <Text style={styles.name} numberOfLines={1}>
          {score.player_name}
        </Text>
        <Text style={styles.detail}>
          {score.moves} jogadas · {formatTime(elapsed)}
        </Text>
      </View>
      <Text style={styles.stars}>{'★'.repeat(score.stars)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.color.bg,
    paddingHorizontal: theme.space.lg,
    paddingBottom: theme.space.lg,
    gap: theme.space.md,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: theme.color.text,
    textAlign: 'center',
    paddingTop: theme.space.md,
  },
  tabs: {
    flexDirection: 'row',
    gap: theme.space.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.space.sm,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.color.cardBack,
    borderWidth: 1,
    borderColor: theme.color.cardBackAccent,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: theme.color.accent,
    borderColor: theme.color.accent,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.color.textDim,
  },
  tabTextActive: {
    color: theme.color.text,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    gap: theme.space.md,
  },
  message: {
    color: theme.color.textDim,
    fontSize: 15,
    textAlign: 'center',
  },
  list: {
    gap: theme.space.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.md,
    backgroundColor: theme.color.cardBack,
    borderWidth: 1,
    borderColor: theme.color.cardBackAccent,
    borderRadius: theme.radius.card,
    paddingVertical: theme.space.sm,
    paddingHorizontal: theme.space.md,
  },
  rank: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.color.accentSoft,
    width: 28,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  rowMain: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.color.text,
  },
  detail: {
    fontSize: 12,
    color: theme.color.textDim,
    marginTop: 2,
  },
  stars: {
    fontSize: 14,
    color: theme.color.star,
  },
});
