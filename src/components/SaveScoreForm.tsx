import { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ActionButton } from './ActionButton';
import { submitScore } from '../lib/leaderboard';
import type { LevelId } from '../lib/levels';
import { theme } from '../lib/theme';

interface SaveScoreFormProps {
  level: LevelId;
  moves: number;
  secondsLeft: number;
  secondsTotal: number;
  stars: number;
  onSaved: () => void;
}

type Status = 'idle' | 'saving' | 'saved' | 'error';

export function SaveScoreForm({
  level,
  moves,
  secondsLeft,
  secondsTotal,
  stars,
  onSaved,
}: SaveScoreFormProps) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSave() {
    setStatus('saving');
    setErrorMsg(null);
    try {
      await submitScore({
        playerName: name,
        level,
        moves,
        secondsLeft,
        secondsTotal,
        stars,
      });
      setStatus('saved');
      onSaved();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao salvar.');
      setStatus('error');
    }
  }

  if (status === 'saved') {
    return <Text style={styles.saved}>Salvo no placar! ✓</Text>;
  }

  const isSaving = status === 'saving';

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Seu nome"
        placeholderTextColor={theme.color.textDim}
        value={name}
        onChangeText={setName}
        maxLength={24}
        autoCapitalize="words"
        editable={!isSaving}
        returnKeyType="done"
        onSubmitEditing={handleSave}
      />
      {isSaving ? (
        <ActivityIndicator color={theme.color.accentSoft} />
      ) : (
        <ActionButton label="Salvar no placar" onPress={handleSave} />
      )}
      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: theme.space.sm,
  },
  input: {
    backgroundColor: theme.color.cardBack,
    borderWidth: 1,
    borderColor: theme.color.cardBackAccent,
    borderRadius: theme.radius.card,
    paddingVertical: theme.space.md,
    paddingHorizontal: theme.space.md,
    fontSize: 16,
    color: theme.color.text,
    textAlign: 'center',
  },
  saved: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.color.matchedBorder,
    textAlign: 'center',
    paddingVertical: theme.space.sm,
  },
  error: {
    fontSize: 13,
    color: theme.color.danger,
    textAlign: 'center',
  },
});
