import { StyleSheet, View } from 'react-native';
import type { Card as CardModel } from '../types';
import { Card } from './Card';
import { theme } from '../lib/theme';

interface BoardProps {
  cards: readonly CardModel[];
  columns: number;
  locked: boolean;
  onFlip: (id: string) => void;
}

/** Splits cards into rows of `columns` for a clean grid layout. */
export function Board({ cards, columns, locked, onFlip }: BoardProps) {
  const rows: CardModel[][] = [];
  for (let i = 0; i < cards.length; i += columns) {
    rows.push(cards.slice(i, i + columns));
  }

  return (
    <View style={styles.board}>
      {rows.map((row, index) => (
        <View key={index} style={styles.row}>
          {row.map((card) => (
            <Card
              key={card.id}
              card={card}
              onPress={onFlip}
              disabled={locked}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: '100%',
    paddingHorizontal: theme.space.sm,
  },
  row: {
    flexDirection: 'row',
  },
});
