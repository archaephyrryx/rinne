import { useThemeStore } from '../../store/themeStore';

export default function SettingsPanel() {
  const { darkMode, toggleTheme } = useThemeStore();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
      >
        Toggle Dark Mode: ({darkMode ? 'On' : 'Off'})
      </button>
    </div>
  );
}
