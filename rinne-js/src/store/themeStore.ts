import { create } from 'zustand';

interface ThemeStore {
  darkMode: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  darkMode: false,
  toggleTheme: () => {
    const newMode = !get().darkMode;
    document.documentElement.classList.toggle('dark', newMode);
    set({ darkMode: newMode });
  },
}));
