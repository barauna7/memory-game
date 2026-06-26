/** Design tokens — single source of truth for palette & spacing. */
export const theme = {
  color: {
    bg: '#0b0f1a',
    bgGradientTop: '#141b2e',
    cardBack: '#1e2640',
    cardBackAccent: '#2a3457',
    cardFace: '#f5f7ff',
    matched: '#1c3a2e',
    matchedBorder: '#34d399',
    text: '#f5f7ff',
    textDim: '#8a96b8',
    accent: '#7c5cff',
    accentSoft: '#a78bfa',
    star: '#fbbf24',
    starEmpty: '#3a4364',
    danger: '#f87171',
  },
  radius: {
    card: 18,
    pill: 999,
  },
  space: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 36,
  },
} as const;
