import { useCallback, useEffect, useState } from 'react';
import { fetchTopScores, type ScoreRow } from '../lib/leaderboard';
import type { LevelId } from '../lib/levels';

interface LeaderboardState {
  scores: ScoreRow[];
  isLoading: boolean;
  error: string | null;
  reload: () => void;
}

export function useLeaderboard(level: LevelId): LeaderboardState {
  const [scores, setScores] = useState<ScoreRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rows = await fetchTopScores(level);
      setScores(rows);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar o placar.');
    } finally {
      setIsLoading(false);
    }
  }, [level]);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);
    fetchTopScores(level)
      .then((rows) => active && setScores(rows))
      .catch(
        (err: unknown) =>
          active &&
          setError(
            err instanceof Error ? err.message : 'Erro ao carregar o placar.',
          ),
      )
      .finally(() => active && setIsLoading(false));
    return () => {
      active = false;
    };
  }, [level]);

  return { scores, isLoading, error, reload: load };
}
