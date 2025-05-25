import { useGameStore } from "../../store/gameState";
import { upgrades } from '../../lib/Upgrades';
import Decimal from '../../lib/Big';

export default function UpgradesPanel() {
    const satori = useGameStore((s) => s.satori);
    const handleUpgrade = useGameStore((s) => s.handleUpgrade);

    return (<div>
        <h1>Upgrades</h1>
        {
            Object.keys(upgrades).map((id) => upgrades[id]).map((upgrade) => {
                const canAfford = satori.gte(upgrade.cost);
                return (
                    <div key={upgrade.id}>
                        <h2>{upgrade.name}</h2>
                        <p>{upgrade.description}</p>
                        <p>Cost: {upgrade.cost.toPrecision(3)}</p>
                        <button disabled={!canAfford} onClick={() => useGameStore.getState().handleUpgrade(upgrade.id)}>
                            {canAfford ? `Upgrade (Cost ${upgrade.cost.toPrecision(3)})` : `Cost: ${upgrade.cost.toPrecision(3)}`}
                            </button>
                    </div>
                );
            })
        }
    </div>);
}
