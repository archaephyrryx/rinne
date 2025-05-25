import { useEffect, useRef } from 'react';
import { useTimeStore } from './store/timeSlice';

export function useTickEngine() {
    const tickDelay = useTimeStore((s) => s.tickDelay);
    const lastTickTime = useTimeStore((s) => s.lastTickTime);
    const incrementTick = useTimeStore((s) => s.incrementTick);
    const updateLastTickTime = useTimeStore((s) => s.updateLastTickTime);

    const rafRef = useRef<number | null>(null);
    useEffect(() => {
        const loop = (now: number) => {
            const elapsed = now - lastTickTime;

            if (elapsed >= tickDelay) {
                const ticksToProcess = Math.floor(elapsed / tickDelay);
                incrementTick(ticksToProcess);
                updateLastTickTime(lastTickTime + ticksToProcess * tickDelay);
            }

            rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [tickDelay, lastTickTime, incrementTick, updateLastTickTime]);
}
