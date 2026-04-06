'use client'

import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption
} from '@headlessui/react'

import { ChevronDown, Check } from 'lucide-react'
import { SETTINGS_MENU } from "../types/settings.constants";
import { SettingsSectionKey } from "../types/settings.types";

type Props = {
  active: SettingsSectionKey;
  onChange: (key: SettingsSectionKey) => void;
};

export function SettingsMobile({ active, onChange }: Props) {
  const selected = SETTINGS_MENU.find(item => item.key === active)!

  return (
    <div className="relative lg:hidden">
      <Listbox value={selected} onChange={(item) => onChange(item.key)}>
        <div className="relative">

          <ListboxButton
            className="
              w-full flex items-center justify-between
              rounded-xl border border-border
              bg-background
              px-4 py-3
              text-sm text-foreground
              hover:border-purple-400
              focus:outline-none focus:ring-2 focus:ring-purple-500
              transition
            "
          >
            <span className="flex items-center gap-2">
              <selected.icon size={18} />
              {selected.label}
            </span>

            <ChevronDown size={18} className="text-foreground/60" />
          </ListboxButton>

          <ListboxOptions
            className="
              absolute z-20 mt-2 w-full
              rounded-xl border border-border
              bg-background
              shadow-lg
              py-1
              text-sm
            "
          >
            {SETTINGS_MENU.map((item) => (
              <ListboxOption
                key={item.key}
                value={item}
                className={({ active }) =>
                  `
                    cursor-pointer select-none
                    px-4 py-2
                    flex items-center justify-between
                    ${
                      active
                        ? 'bg-purple-50 text-purple-600 dark:text-purple-400'
                        : 'text-foreground'
                    }
                  `
                }
              >
                {({ selected }) => (
                  <>
                    <span className="flex items-center gap-2">
                      <item.icon size={18} />
                      {item.label}
                    </span>

                    {selected && (
                      <Check size={16} className="text-purple-500" />
                    )}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>

        </div>
      </Listbox>
    </div>
  )
}
