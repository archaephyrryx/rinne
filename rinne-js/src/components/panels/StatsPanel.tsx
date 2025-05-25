import { useGameStore } from "../../store/gameState";

export default function StatsPanel() {
    const totalClicks = useGameStore((s) => s.totalClicks);
    const clickGains = useGameStore((s) => s.clickGains);
    const passiveGains = useGameStore((s) => s.passiveGains);

    return (<div>
        <h1>Stats</h1>
        <div>
            <p><b>Total Meditations (clicks)</b>: {totalClicks}</p><br/>
            <p><b>Satori Gained through Clicks</b>: {clickGains.toPrecision(5)}</p><br/>
            <p><b>Satori Gained through Waiting</b>: {passiveGains.toPrecision(5)}</p>
        </div>
    </div>);
}
