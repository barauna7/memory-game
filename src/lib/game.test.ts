import { createDeck, flipCard, resolveTurn } from './game';
import type { Card, GameState } from '../types';

function makeCard(
  id: string,
  emoji: string,
  overrides: Partial<Card> = {},
): Card {
  return { id, emoji, isFlipped: false, isMatched: false, ...overrides };
}

function makeState(
  cards: Card[],
  flippedIds: string[] = [],
  overrides: Partial<GameState> = {},
): GameState {
  return {
    cards,
    flippedIds,
    moves: 0,
    matches: 0,
    status: 'playing',
    ...overrides,
  };
}

describe('createDeck', () => {
  it('returns twice the number of pairs', () => {
    expect(createDeck(8)).toHaveLength(16);
    expect(createDeck(12)).toHaveLength(24);
    expect(createDeck(18)).toHaveLength(36);
  });

  it('gives every card a unique id', () => {
    const ids = createDeck(18).map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('produces exactly two cards per emoji', () => {
    const counts = new Map<string, number>();
    for (const card of createDeck(8)) {
      counts.set(card.emoji, (counts.get(card.emoji) ?? 0) + 1);
    }
    for (const count of counts.values()) {
      expect(count).toBe(2);
    }
  });

  it('shuffles the deck (order differs from the canonical layout)', () => {
    const pairs = 12;
    // Canonical pre-shuffle id order is `${index}-0`, `${index}-1`, ...
    const canonical = Array.from({ length: pairs }, (_, i) => [
      `${i}-0`,
      `${i}-1`,
    ]).flat();
    const deckIds = createDeck(pairs).map((c) => c.id);

    expect(deckIds).toHaveLength(canonical.length);
    expect([...deckIds].sort()).toEqual([...canonical].sort()); // same set
    expect(deckIds).not.toEqual(canonical); // but reordered
  });
});

describe('flipCard', () => {
  it('does not flip a card that is already matched', () => {
    const state = makeState([
      makeCard('a', '🚀', { isMatched: true }),
      makeCard('b', '🌟'),
    ]);

    const result = flipCard(state, 'a');

    expect(result).toBe(state);
    expect(result.cards[0].isFlipped).toBe(false);
  });

  it('does not flip a third card while two are already flipped', () => {
    const state = makeState(
      [makeCard('a', '🚀'), makeCard('b', '🌟'), makeCard('c', '🎲')],
      ['a', 'b'],
    );

    const result = flipCard(state, 'c');

    expect(result).toBe(state);
    expect(result.cards[2].isFlipped).toBe(false);
  });

  it('returns a new object without mutating the original', () => {
    const state = makeState([makeCard('a', '🚀'), makeCard('b', '🌟')]);

    const result = flipCard(state, 'a');

    expect(result).not.toBe(state);
    expect(result.cards).not.toBe(state.cards);
    expect(state.cards[0].isFlipped).toBe(false); // original untouched
    expect(state.flippedIds).toEqual([]);
    expect(result.cards[0].isFlipped).toBe(true);
    expect(result.flippedIds).toEqual(['a']);
  });
});

describe('resolveTurn', () => {
  it('marks both cards matched when the emojis match', () => {
    const state = makeState(
      [
        makeCard('a', '🚀', { isFlipped: true }),
        makeCard('b', '🚀', { isFlipped: true }),
      ],
      ['a', 'b'],
    );

    const result = resolveTurn(state);

    expect(result.cards[0].isMatched).toBe(true);
    expect(result.cards[1].isMatched).toBe(true);
    expect(result.cards[0].isFlipped).toBe(true);
    expect(result.cards[1].isFlipped).toBe(true);
    expect(result.matches).toBe(1);
    expect(result.flippedIds).toEqual([]);
    expect(result.moves).toBe(1);
  });

  it('resets isFlipped to false on a miss', () => {
    const state = makeState(
      [
        makeCard('a', '🚀', { isFlipped: true }),
        makeCard('b', '🌟', { isFlipped: true }),
      ],
      ['a', 'b'],
    );

    const result = resolveTurn(state);

    expect(result.cards[0].isFlipped).toBe(false);
    expect(result.cards[1].isFlipped).toBe(false);
    expect(result.cards[0].isMatched).toBe(false);
    expect(result.cards[1].isMatched).toBe(false);
    expect(result.matches).toBe(0);
    expect(result.flippedIds).toEqual([]);
    expect(result.moves).toBe(1);
  });

  it('returns a new GameState without mutating the original', () => {
    const state = makeState(
      [
        makeCard('a', '🚀', { isFlipped: true }),
        makeCard('b', '🚀', { isFlipped: true }),
      ],
      ['a', 'b'],
    );

    const result = resolveTurn(state);

    expect(result).not.toBe(state);
    expect(result.cards).not.toBe(state.cards);
    // original snapshot is unchanged
    expect(state.cards[0].isMatched).toBe(false);
    expect(state.cards[0].isFlipped).toBe(true);
    expect(state.matches).toBe(0);
    expect(state.moves).toBe(0);
    expect(state.flippedIds).toEqual(['a', 'b']);
  });
});
