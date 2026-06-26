# 🧠 Jogo da Memória

Jogo da memória em **React Native + Expo (TypeScript)** com níveis de dificuldade, timer regressivo, sistema de estrelas e testes unitários. Lógica de jogo 100% pura e testável, separada da camada de UI.

<!-- Substitua pelos prints reais depois de capturar no simulador -->
<p align="center">
  <img src="screenshots/01-menu.png" width="240" alt="Menu de dificuldade" />
  <img src="screenshots/02-game.png" width="240" alt="Tabuleiro em jogo" />
  <img src="screenshots/03-result.png" width="240" alt="Tela de resultado" />
</p>

## ✨ Funcionalidades

- **Três níveis de dificuldade** com grade, número de pares e tempo próprios:
  | Nível | Grade | Pares | Tempo |
  |-------|-------|-------|-------|
  | Fácil | 4 × 4 | 8 | 3:00 |
  | Médio | 4 × 6 | 12 | 2:00 |
  | Difícil | 6 × 6 | 18 | 1:30 |
- **Timer regressivo** que avisa nos últimos 10s e leva a game over ao zerar.
- **Tela de resultado** com estrelas animadas (3 ⭐ > 70% do tempo restante, 2 ⭐ > 30%, 1 ⭐ por completar), total de jogadas e tempo gasto.
- **Cartas com animação de flip 3D** usando a API `Animated` com `useNativeDriver`.
- **Estado global** de navegação e nível via Context + reducer.

## 🏗️ Arquitetura

Arquivos pequenos e coesos, lógica pura separada da UI:

```
src/
├── lib/
│   ├── game.ts        # lógica pura: createDeck, flipCard, resolveTurn (imutável)
│   ├── game.test.ts   # testes unitários da lógica
│   ├── levels.ts      # definição dos níveis
│   ├── stars.ts       # cálculo de estrelas
│   ├── format.ts      # formatação de tempo (m:ss)
│   └── theme.ts       # design tokens
├── state/
│   └── GameProvider.tsx   # Context + reducer (screen, level, result, round)
├── hooks/
│   └── useMemoryGame.ts    # estado do jogo + timing de virar cartas
└── components/
    ├── MenuScreen.tsx · GameScreen.tsx · ResultScreen.tsx · GameOverScreen.tsx
    ├── Board.tsx · Card.tsx · Stats.tsx · Timer.tsx · Stars.tsx · ActionButton.tsx
```

**Decisões de design:**
- Toda a lógica de jogo é **pura e imutável** — `flipCard`/`resolveTurn` recebem o estado e retornam uma cópia nova, sem mutação. Isso torna o jogo trivial de testar isoladamente.
- O replay remonta a `GameScreen` via `key={round}`, garantindo deck e timer limpos sem lógica de reset espalhada.
- Animações ficam em propriedades amigáveis ao compositor (`transform`, `opacity`).

## 🚀 Rodando

```bash
npm install
npm run ios       # ou: npm run android · npm run web
```

## 🧪 Testes

```bash
npx jest
```

Cobrem a lógica pura em `src/lib/game.ts`:
- `createDeck` — tamanho correto, ids únicos, baralho embaralhado
- `flipCard` — não vira carta já combinada, não vira uma 3ª com 2 abertas, retorna novo objeto sem mutar
- `resolveTurn` — match marca as duas cartas, miss reseta, sempre retorna novo `GameState`

## 🛠️ Stack

React Native · Expo SDK 56 · TypeScript · Jest

---

Feito por [Kaue Barauna](https://github.com/barauna7) — The Future Tech
