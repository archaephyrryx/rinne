import { create, type StoreApi, type UseBoundStore }  from 'zustand';
import Decimal from '../lib/Big';

export type GameState = {
    points: Decimal;
    gain: Decimal;
    tickRate: number;
    addPoints: () => void;
    upgradeGain: () => void;
}


export const useGameStore: UseBoundStore<StoreApi<GameState>> = create((set) => ({
    points: new Decimal(0),
    gain: new Decimal(1),
    tickRate: 1000, // ms
    addPoints: () => set((state) => ({ points: state.points.add(state.gain) })),
    upgradeGain: () => set((state) => ({ gain: state.gain.mul(2) })),
}));
