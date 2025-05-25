import { useEffect, useRef } from 'react';
import { useTimeStore } from './store/timeSlice';
import { useGameStore } from './store/gameState';

export function usePassiveGain() {
    const tickCount = useTimeStore((s) => s.tickCount);
    const handleTicks = useGameStore((s) => s.handleTicks);

    const lastTickRef = useRef(tickCount);

    useEffect(() => {
        const newTicks = tickCount - lastTickRef.current;
        if (newTicks > 0) {
            handleTicks(newTicks);
            lastTickRef.current = tickCount;
        }
    }, [tickCount, handleTicks]);
}
