# 🧠 Jogo da Memória

Jogo da memória em **React Native + Expo (TypeScript)** com níveis de dificuldade, timer regressivo, sistema de estrelas, **placar online (Supabase)** e testes unitários. Lógica de jogo 100% pura e testável, separada da camada de UI.

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
- **Placar online** com Supabase: registre seu score ao vencer e veja o ranking por nível.
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
│   ├── theme.ts       # design tokens
│   ├── supabase.ts    # client Supabase (valida env vars)
│   └── leaderboard.ts # acesso ao placar: submitScore, fetchTopScores
├── state/
│   └── GameProvider.tsx    # Context + reducer (screen, level, result, round)
├── hooks/
│   ├── useMemoryGame.ts    # estado do jogo + timing de virar cartas
│   └── useLeaderboard.ts   # carrega o placar (loading/erro)
└── components/
    ├── MenuScreen.tsx · GameScreen.tsx · ResultScreen.tsx · GameOverScreen.tsx
    ├── LeaderboardScreen.tsx · SaveScoreForm.tsx
    ├── Board.tsx · Card.tsx · Stats.tsx · Timer.tsx · Stars.tsx · ActionButton.tsx
```

**Decisões de design:**
- Toda a lógica de jogo é **pura e imutável** — `flipCard`/`resolveTurn` recebem o estado e retornam uma cópia nova, sem mutação. Isso torna o jogo trivial de testar isoladamente.
- O replay remonta a `GameScreen` via `key={round}`, garantindo deck e timer limpos sem lógica de reset espalhada.
- Animações ficam em propriedades amigáveis ao compositor (`transform`, `opacity`).

## 🚀 Rodando

```bash
npm install
cp .env.example .env   # preencha com as credenciais do seu projeto Supabase
npm run ios            # ou: npm run android · npm run web
```

## 🗄️ Backend (Supabase)

O placar usa uma única tabela `public.scores` com Row Level Security:

- **Leitura** pública (qualquer um vê o ranking).
- **Inserção** pública, validada por _constraints_ de coluna (nome 1–24 chars, nível válido, estrelas 1–3).

A configuração vai por variáveis de ambiente (prefixo `EXPO_PUBLIC_` para chegar ao cliente). Copie `.env.example` para `.env` e preencha:

```
EXPO_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxx
```

> O `.env` está no `.gitignore` — apenas o `.env.example` é versionado.

## 🧪 Testes

```bash
npx jest
```

Cobrem a lógica pura em `src/lib/game.ts`:
- `createDeck` — tamanho correto, ids únicos, baralho embaralhado
- `flipCard` — não vira carta já combinada, não vira uma 3ª com 2 abertas, retorna novo objeto sem mutar
- `resolveTurn` — match marca as duas cartas, miss reseta, sempre retorna novo `GameState`

## 🛠️ Stack

React Native · Expo SDK 56 · TypeScript · Supabase · Jest

---

Feito por [Kaue Barauna](https://github.com/barauna7) — The Future Tech
