import React, { useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import Clicker from './components/Clicker';

const App = () => {
    const addPoints = useGameStore((s) => s.addPoints);
    const tickRate = useGameStore((s) => s.tickRate);

    useEffect(() => {
        const interval = setInterval(addPoints, tickRate);
        return () => clearInterval(interval);
    }, [tickRate, addPoints]);

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
            <h1 className="text-4xl font-bold mb-4">Rinne</h1>
            <Clicker />
        </main>
    );
};

export default App;
