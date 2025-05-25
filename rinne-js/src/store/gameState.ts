import { create, type StateCreator } from 'zustand';
import Decimal from '../lib/Big';
import { stepCost, improveManualGain, startingGain, startingCost } from '../lib/Scaling';
import { upgrades } from '../lib/Upgrades';

type SliceCreator<T> = StateCreator<ResourceSlice & ClickSlice & StatsSlice & UpgradesSlice, [], [], T>;


interface ResourceSlice {
    satori: Decimal; // primary resource of the game
    passiveGain: Decimal; // satori per tick
    addSatori: (amount: Decimal) => void,
    setPassiveGain: (rate: Decimal) => void,
}

interface ClickSlice {
    manualGain: Decimal;
    refineCost: Decimal;
    refineGain: () => void;
}

interface UpgradesSlice {
    allUpgrades: string[],
    purchasedUpgrades: Map<string, boolean | number>,
    purchaseCost: Map<string, Decimal>,
}

interface StatsSlice {
    totalClicks: number,
    clickGains: Decimal,
    passiveGains: Decimal,
    registerClick: () => void,
    registerClickGain: (gain: Decimal) => void,
    registerTickGain: (gain: Decimal) => void
}

interface GameSlice {
    canRefine: () => boolean,
    canUpgrade: (id: string) => boolean,
    handleClick: () => void,
    handleRefine: () => void,
    handleTicks: (ticks: number) => void,
    handleUpgrade: (id: string) => void,
}

export const createStatsSlice: SliceCreator<StatsSlice> = (set) => ({
    totalClicks: 0,
    clickGains: new Decimal(0),
    passiveGains: new Decimal(0),
    registerClick: () => set((state) => ({ totalClicks: state.totalClicks + 1 })),
    registerClickGain: (gain: Decimal) => set((state) => ({ clickGains: state.clickGains.add(gain) })),
    registerTickGain: (gain: Decimal) => set((state) => ({ passiveGains: state.passiveGains.add(gain) })),
});

export const createResourceSlice: SliceCreator<ResourceSlice> = (set) => ({
    satori: new Decimal(0),
    passiveGain: new Decimal(0),
    addSatori: (amount: Decimal) => set((state) => ({ satori: state.satori.add(amount) })),
    setPassiveGain: (rate: Decimal) => set({ passiveGain: rate }),
});

export const createClickSlice: SliceCreator<ClickSlice> = (set) => ({
    manualGain: startingGain,
    refineCost: startingCost,
    refineGain: () => set((state) => ({ manualGain: improveManualGain(state.manualGain), refineCost: stepCost(state.refineCost) })),
});

export const createUpgradesSlice: SliceCreator<UpgradesSlice> = (get, set) => ({
    allUpgrades: Object.keys(upgrades),
    purchasedUpgrades: new Map<string, boolean | number>(),
    purchaseCost: new Map(Object.keys(upgrades).map((k) => [k, upgrades[k].cost])),
})

export const createGameSlice: SliceCreator<GameSlice> = (set, get) => ({
    canRefine: () => get().satori.gte(get().refineCost),
    handleClick: () => set((state) => ({ satori: state.satori.add(state.manualGain), totalClicks: state.totalClicks + 1, clickGains: state.clickGains.add(state.manualGain) })),
    handleRefine: () => set((state) => {
        if (!state.satori.gte(state.refineCost)) return {};
        return { satori: state.satori.sub(state.refineCost), refineCost: stepCost(state.refineCost), manualGain: improveManualGain(state.manualGain) }
    }),
    handleTicks: (ticks: number) => set((state) => ({ satori: state.satori.add(state.passiveGain.mul(ticks)) })),
    canUpgrade: (id: string) => {
        const cost = get().purchaseCost.get(id);
        if (cost === undefined) return false;
        if (cost.lte(0)) return false;
        return get().satori.gte(cost);
    },
    handleUpgrade: (id: string) => set((state) => {
        const cost = get().purchaseCost.get(id);
        if (cost === undefined || cost.lte(0) || get().satori.lt(cost)) return {};
        const newValue : number | boolean = upgrades[id].repeating ? ((state.purchasedUpgrades.get(id) ?? 0) as number) + 1 : true;
        const baseEffect = { satori: state.satori.sub(cost), purchasedUpgrades: state.purchasedUpgrades.set(id, newValue) }
        switch (id) {
            case 'disciple':
                return { ...baseEffect, passiveGain: state.passiveGain.add(upgrades[id].stateIncrement) };
            default:
                return baseEffect;
        }
    })
});

export const useGameStore = create<ResourceSlice & ClickSlice & StatsSlice & GameSlice & UpgradesSlice>()((...a) => ({
    ...createResourceSlice(...a),
    ...createClickSlice(...a),
    ...createStatsSlice(...a),
    ...createUpgradesSlice(...a),
    ...createGameSlice(...a)
}));
