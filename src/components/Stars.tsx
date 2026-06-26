import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { theme } from '../lib/theme';

interface StarsProps {
  filled: number;
  size?: number;
}

const TOTAL_STARS = 3;
const STAGGER_MS = 220;

export function Stars({ filled, size = 52 }: StarsProps) {
  const anims = useRef(
    Array.from({ length: TOTAL_STARS }, () => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    const pops = anims.map((value, index) =>
      Animated.spring(value, {
        toValue: index < filled ? 1 : 0.85,
        useNativeDriver: true,
        friction: 4,
        tension: 80,
      }),
    );
    Animated.stagger(STAGGER_MS, pops).start();
  }, [anims, filled]);

  return (
    <View style={styles.row}>
      {anims.map((value, index) => {
        const isFilled = index < filled;
        return (
          <Animated.Text
            key={index}
            style={[
              styles.star,
              {
                fontSize: size,
                color: isFilled ? theme.color.star : theme.color.starEmpty,
                transform: [{ scale: value }],
              },
            ]}
          >
            ★
          </Animated.Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.space.sm,
  },
  star: {
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
});
