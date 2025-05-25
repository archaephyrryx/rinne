import { create } from 'zustand';

interface TimeState {
    lastTickTime: number,
    tickDelay: number, // delay between consecutive ticks, in milliseconds
    tickCount: number,
    incrementTick: (by?: number) => void,
    updateLastTickTime: (time: number) => void,
}

export const useTimeStore = create<TimeState>((set) => ({
    lastTickTime: performance.now(),
    tickDelay: 100, // default: 1 tick per 0.1 seconds
    tickCount: 0,
    incrementTick: (by = 1) => set((s) => ({ tickCount: s.tickCount + by })),
    updateLastTickTime: (time) => set({ lastTickTime: time }),
}));
