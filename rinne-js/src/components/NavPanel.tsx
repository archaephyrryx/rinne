import { useUIStore } from '../store/uiStore';

const panels = [
  { id: 'main', label: 'Main' },
  { id: 'upgrades', label: 'Upgrades' },
  { id: 'stats', label: 'Stats' },
  { id: 'glossary', label: 'Glossary' },
  { id: 'lore', label: 'Lore' },
  { id: 'settings', label: 'Settings' },
] as const;

export default function NavPanel() {
  const setPanel = useUIStore((state) => state.setPanel);
  const active = useUIStore((state) => state.activePanel);

  return (
    <nav className="flex gap-2 p-2 bg-gray-200 shadow-md">
      {panels.map((p) => (
        <button
          key={p.id}
          onClick={() => setPanel(p.id)}
          className={`px-3 py-1 rounded ${
            active === p.id ? 'bg-blue-500 text-white' : 'bg-white text-black'
          }`}
        >
          {p.label}
        </button>
      ))}
    </nav>
  );
}
