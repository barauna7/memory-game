import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatTime } from '../lib/format';
import { theme } from '../lib/theme';

interface TimerProps {
  seconds: number;
  running: boolean;
  onExpire: () => void;
  onTick?: (remaining: number) => void;
}

/** Below this many seconds the timer turns red as a warning. */
const DANGER_THRESHOLD = 10;

export function Timer({ seconds, running, onExpire, onTick }: TimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep callbacks in refs so the interval effect doesn't restart each render.
  const onExpireRef = useRef(onExpire);
  const onTickRef = useRef(onTick);
  onExpireRef.current = onExpire;
  onTickRef.current = onTick;

  // Reset whenever the configured time changes (e.g. new level).
  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  // The countdown interval — stored in a ref and cleared on unmount/pause.
  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [running]);

  // React to each tick: report it, and fire expiry exactly at zero.
  useEffect(() => {
    onTickRef.current?.(remaining);
    if (remaining === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      onExpireRef.current();
    }
  }, [remaining]);

  const danger = remaining <= DANGER_THRESHOLD;

  return (
    <View style={[styles.pill, danger && styles.pillDanger]}>
      <Text style={styles.icon}>⏳</Text>
      <Text style={[styles.time, danger && styles.timeDanger]}>
        {formatTime(remaining)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: theme.space.xs,
    backgroundColor: theme.color.cardBack,
    borderColor: theme.color.cardBackAccent,
    borderWidth: 1,
    borderRadius: theme.radius.pill,
    paddingVertical: theme.space.xs,
    paddingHorizontal: theme.space.md,
  },
  pillDanger: {
    borderColor: '#f87171',
    backgroundColor: '#3a1c22',
  },
  icon: {
    fontSize: 16,
  },
  time: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.color.text,
    fontVariant: ['tabular-nums'],
  },
  timeDanger: {
    color: '#fca5a5',
  },
});
