// Type for representing a number of tsubu (grains, specifically of our sand), which represents both the basic currency unit and score-keeping in the game
export type TsubuCount = {
    unit: 'TSUBU',
    tsubuCount: Kazu,
}

// Type for representing numbers of varying sizes
export type Kazu = SmallKazu | MediumKazu | LargeKazu;

// Type for representing the magnitude-range that a conceptual number occupies
export type ValueRange = 'small' | 'medium' | 'large';

// Type for representing numbers small enough to store precisely
export type SmallKazu = {
    valueRange: 'small',
    value: BigInt
};

// Type for representing numbers of considerable but still technically approachable size
export type MediumKazu = {
    valueRange: 'medium',
    mantissa: number,
    power: SmallPower,
}

// Type for representing numbers that can grow beyond reasonable comprehension or lossless representability
export type LargeKazu = {
    valueRange: 'large',
    mantissa: MediumKazu,
    power: LargePower,
}

// A ten-power scaled value
export type Power = SmallPower | LargePower;

// Small (simple) 10-exponent valued powers (N = 10^x)
export const enum SmallPower {
    ['万'] = 4,
    ['億'] = 8,
    ['兆'] = 12,
    ['京'] = 16,
    ['垓'] = 20,
    ['秭'] = 24,
    ['穰'] = 28,
    ['溝'] = 32,
    ['澗'] = 36,
    ['正'] = 40,
    ['載'] = 44,
    ['極'] = 48,
    ['恒河沙'] = 52,
    ['阿僧祇'] = 56,
    ['那由他0'] = 60,
    ['不可思議'] = 64,
    ['無量大数'] = 68,
}

export type LargePower = Rakusha | RegularLargePower;

// Stand-in for the one irregular Large-scale power at 10^5
export const enum Rakusha {
    ['洛叉'] = 5,
}

// Stand-in for Square-Rule Large Powers (N = 10 ^ (7 * 2^x))
export const enum RegularLargePower {
    ['倶胝'] = 0,
    ['阿庾多'] = 1,
    ['那由他1'] = 2,
    ['頻波羅'] = 3,
    ['矜羯羅'] = 4,
    ['阿伽羅'] = 5,
    ['最勝'] = 6,
    ['摩婆羅'] = 7,
    ['阿婆羅'] = 8,
    ['多婆羅'] = 9,
    ['界分'] = 10,
    ['普摩'] = 11,
    ['禰摩'] = 12,
    ['阿婆鈐'] = 13,
    ['弥伽婆'] = 14,
    ['毘攞伽'] = 15,
    ['毘伽婆'] = 16,
    ['僧羯邏摩'] = 17,
    ['毘薩羅'] = 18,
    ['毘贍婆'] = 19,
    ['毘盛伽'] = 20,
    ['毘素陀'] = 21,
    ['毘婆訶'] = 22,
    ['毘薄底'] = 23,
    ['毘佉擔'] = 24,
    // STUB - add the rest, but we don't have enough of an idea of the basic game loop to need to get even close to this far...
}
