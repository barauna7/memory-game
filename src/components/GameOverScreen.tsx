import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ActionButton } from './ActionButton';
import { useGame } from '../state/GameProvider';
import { theme } from '../lib/theme';

export function GameOverScreen() {
  const { replay, goToMenu } = useGame();

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />

      <View style={styles.content}>
        <Text style={styles.emoji}>⏰</Text>
        <Text style={styles.heading}>Tempo esgotado!</Text>
        <Text style={styles.subtitle}>
          Você não encontrou todos os pares a tempo.
        </Text>
      </View>

      <View style={styles.actions}>
        <ActionButton label="Tentar de novo" onPress={replay} />
        <ActionButton label="Menu" variant="ghost" onPress={goToMenu} />
      </View>
    </SafeAreaView>
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
    gap: theme.space.md,
  },
  emoji: {
    fontSize: 64,
  },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    color: theme.color.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: theme.color.textDim,
    textAlign: 'center',
    paddingHorizontal: theme.space.lg,
  },
  actions: {
    gap: theme.space.sm,
  },
});
