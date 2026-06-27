import { supabase } from './supabase';
import type { LevelId } from './levels';

export interface ScoreRow {
  readonly id: string;
  readonly player_name: string;
  readonly level: LevelId;
  readonly moves: number;
  readonly seconds_left: number;
  readonly seconds_total: number;
  readonly stars: number;
  readonly created_at: string;
}

export interface NewScore {
  readonly playerName: string;
  readonly level: LevelId;
  readonly moves: number;
  readonly secondsLeft: number;
  readonly secondsTotal: number;
  readonly stars: number;
}

const TABLE = 'scores';
const TOP_LIMIT = 20;

/** Registra um novo score. Lança erro com mensagem amigável em caso de falha. */
export async function submitScore(score: NewScore): Promise<void> {
  const playerName = score.playerName.trim();
  if (!playerName) {
    throw new Error('Digite um nome para salvar no placar.');
  }

  const { error } = await supabase.from(TABLE).insert({
    player_name: playerName.slice(0, 24),
    level: score.level,
    moves: score.moves,
    seconds_left: score.secondsLeft,
    seconds_total: score.secondsTotal,
    stars: score.stars,
  });

  if (error) {
    throw new Error('Não foi possível salvar o score. Tente novamente.');
  }
}

/** Busca os melhores scores de um nível (mais estrelas → mais tempo → menos jogadas). */
export async function fetchTopScores(level: LevelId): Promise<ScoreRow[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('level', level)
    .order('stars', { ascending: false })
    .order('seconds_left', { ascending: false })
    .order('moves', { ascending: true })
    .limit(TOP_LIMIT);

  if (error) {
    throw new Error('Não foi possível carregar o placar.');
  }

  return (data ?? []) as ScoreRow[];
}
