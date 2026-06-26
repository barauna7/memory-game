import { memo, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import type { Card as CardModel } from '../types';
import { theme } from '../lib/theme';

interface CardProps {
  card: CardModel;
  onPress: (id: string) => void;
  disabled: boolean;
}

function CardComponent({ card, onPress, disabled }: CardProps) {
  const faceUp = card.isFlipped || card.isMatched;
  const flip = useRef(new Animated.Value(faceUp ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(flip, {
      toValue: faceUp ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 90,
    }).start();
  }, [faceUp, flip]);

  const frontRotate = flip.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });
  const backRotate = flip.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Pressable
      style={styles.wrapper}
      disabled={disabled || faceUp}
      onPress={() => onPress(card.id)}
    >
      <Animated.View
        style={[
          styles.face,
          styles.back,
          { transform: [{ perspective: 1000 }, { rotateY: backRotate }] },
        ]}
      >
        <Text style={styles.backGlyph}>?</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.face,
          styles.front,
          card.isMatched && styles.matched,
          {
            transform: [{ perspective: 1000 }, { rotateY: frontRotate }],
          },
        ]}
      >
        <Text style={styles.emoji}>{card.emoji}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    aspectRatio: 1,
    flex: 1,
    margin: theme.space.xs,
  },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: theme.radius.card,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  back: {
    backgroundColor: theme.color.cardBack,
    borderWidth: 1,
    borderColor: theme.color.cardBackAccent,
  },
  backGlyph: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.color.accentSoft,
  },
  front: {
    backgroundColor: theme.color.cardFace,
  },
  matched: {
    backgroundColor: theme.color.matched,
    borderWidth: 2,
    borderColor: theme.color.matchedBorder,
  },
  emoji: {
    fontSize: 34,
  },
});

export const Card = memo(CardComponent);
