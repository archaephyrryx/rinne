import { create } from 'zustand';

type Panel = 'main' | 'upgrades' | 'settings' | 'stats' | 'glossary' | 'lore';

interface UIState {
    activePanel: Panel;
    setPanel: (panel: Panel) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activePanel: 'main',
  setPanel: (panel) => set({ activePanel: panel }),
}));
