import { useUIStore } from './store/uiStore';
import NavPanel from './components/NavPanel';
import { AnimatePresence, motion } from 'framer-motion';
import { useTickEngine } from './useTickEngine';

import MainPanel from './components/panels/MainPanel';
import UpgradesPanel from './components/panels/UpgradesPanel';
import StatsPanel from './components/panels/StatsPanel';
import GlossaryPanel from './components/panels/GlossaryPanel';
import LorePanel from './components/panels/LorePanel';
import SettingsPanel from './components/panels/SettingsPanel';
import { usePassiveGain } from './usePassiveGain';

function App() {
  const active = useUIStore((state) => state.activePanel);

  const panels = {
    main: <MainPanel />,
    upgrades: <UpgradesPanel />,
    stats: <StatsPanel />,
    glossary: <GlossaryPanel />,
    lore: <LorePanel />,
    settings: <SettingsPanel />,
  };

  useTickEngine();
  usePassiveGain();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-900 dark:text-white transition-colors">
        <NavPanel />
        <div className="flex-1 p-4 overflow-hidden relative">
            <AnimatePresence mode="wait">
                <motion.div
                    key={active}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                >
                    <div className="h-full flex items-center justify-center">
                        {panels[active]}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    </div>
  );
}

export default App;
