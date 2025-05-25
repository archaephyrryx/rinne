import { useGameStore } from '../../store/gameState';
import { improveManualGain } from '../../lib/Scaling';

const Clicker = () => {
    const satori = useGameStore((s) => s.satori);
    const manualGain = useGameStore((s) => s.manualGain);
    const upgradeCost = useGameStore((s) => s.refineCost);
    const canUpgrade = useGameStore((s) => s.canRefine);

    // Combined event handlers
    const handleClick = useGameStore((s) => s.handleClick);
    const handleUpgrade = useGameStore((s) => s.handleRefine);

    return (
        <div className="space-y-4">
            <p className="text-xl">Satori: {satori.toPrecision(5)}</p>
            <button onClick={handleClick} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Meditate (+{manualGain.toPrecision(3)})
            </button>
            <br />
            <button disabled={!canUpgrade} onClick={handleUpgrade} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                Upgrade Satori Gain ({manualGain.toPrecision(3)} &rarr; {improveManualGain(manualGain).toPrecision(3)})
            </button>
            <p>(Upgrade Cost: {upgradeCost.toPrecision(3)})</p>
        </div>
    );
};

export default function MainPanel() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center p-4">
            <h1 className="text-4xl font-bold mb-4">Rinne</h1>
            <Clicker />
        </main>
    );
};
