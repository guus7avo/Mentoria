import { SETTINGS_MENU } from "../types/settings.constants";
import { SettingsSectionKey } from "../types/settings.types";

type Props = {
  active: SettingsSectionKey;
  onChange: (key: SettingsSectionKey) => void;
};

export function SettingsMenu({ active, onChange }: Props) {
  return (
    <div className="w-56 bg-background rounded-xl p-2 space-y-1">
      {SETTINGS_MENU.map(({ key, label, icon: Icon }) => {
        const isActive = active === key;

        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm
              transition-colors
              ${
                isActive
                  ? "bg-purple-50 text-purple-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }
            `}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
