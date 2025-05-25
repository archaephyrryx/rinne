import Decimal from './Big';

type UpgradeInfo = {
    id: string;
    name: string;
    description: string;
    cost: Decimal;
    repeating: boolean;
    stateIncrement: Decimal,
    scale?: (level: number) => Decimal,
}

export const upgrades: Record<string, UpgradeInfo> = {
    ['disciple']: {
        id: 'disciple',
        name: 'Disciple',
        description: 'Hires a junior disciple to meditate, providing a small amount of passive gain.',
        cost: new Decimal(50),
        stateIncrement: new Decimal(1),
        repeating: false,
    },
};
