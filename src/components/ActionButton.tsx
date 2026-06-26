import { Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '../lib/theme';

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'solid' | 'ghost';
}

export function ActionButton({
  label,
  onPress,
  variant = 'solid',
}: ActionButtonProps) {
  const isGhost = variant === 'ghost';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isGhost ? styles.ghost : styles.solid,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, isGhost && styles.ghostLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radius.pill,
    paddingVertical: theme.space.md,
    alignItems: 'center',
  },
  solid: {
    backgroundColor: theme.color.accent,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.color.cardBackAccent,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    color: theme.color.text,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  ghostLabel: {
    color: theme.color.textDim,
  },
});
