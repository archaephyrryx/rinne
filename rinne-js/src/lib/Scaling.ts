import Decimal from './Big';

// TODO: move to lib
export function improveManualGain(gain: Decimal): Decimal {
    return gain.mul(2);
}

// TODO: move to lib
export function stepCost(cost: Decimal): Decimal {
    return cost.mul(10);
}

export const startingGain: Decimal = new Decimal(1);
export const startingCost: Decimal = new Decimal(10);
