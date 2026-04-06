import { SETTINGS_MENU } from "../types/settings.constants";
import { SettingsSectionKey } from "../types/settings.types";

type Props = {
  active: SettingsSectionKey;
  onChange: (key: SettingsSectionKey) => void;
};

export function SettingsMenu({ active, onChange }: Props) {
  return (
    <div className="bg-background rounded-xl p-2 flex lg:flex-col gap-2 overflow-x-auto lg:w-56">
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
                  ? "bg-purple-50 text-purple-600 dark:text-purple-400 font-medium"
                  : "text-foreground/70 hover:bg-purple-50 hover:text-purple-600 dark:hover:text-purple-400"
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
