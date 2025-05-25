import React from 'react';
import { useGameStore } from '../store/useGameStore';

const Clicker = () => {
    const points = useGameStore((s) => s.points);
    const gain = useGameStore((s) => s.gain);
    const addPoints = useGameStore((s) => s.addPoints);
    const upgradeGain = useGameStore((s) => s.upgradeGain);

    return (
        <div className="space-y-4">
            <p className="text-xl">Points: {points.toPrecision(5)}</p>
            <button onClick={addPoints} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Meditate (+{gain.toPrecision(3)})
            </button>
            <br />
            <button onClick={upgradeGain} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                Upgrade Insight (x2 Gain)
            </button>
        </div>
    );
};

export default Clicker;
