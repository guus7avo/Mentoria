"use client";

import { useState } from "react";
import { SettingsMenu } from "./SettingsMenu";
import { SettingsContent } from "./SettingsContent";
import { PageHeader } from "@/shared/ui/PageHeader";
import { Settings as SettingsIcon } from "lucide-react";
import { SettingsSectionKey } from "../types/settings.types";
import { SettingsMobile } from "./SettingsMobile";

export function Settings() {
  const [activeSection, setActiveSection] = useState<SettingsSectionKey>("profile");

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your preferences"
        icon={SettingsIcon}
      />

      <div className="lg:hidden">
        <SettingsMobile
          active={activeSection}
          onChange={setActiveSection}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="hidden lg:block">
          <SettingsMenu
            active={activeSection}
            onChange={setActiveSection}
          />
        </div>
        <SettingsContent active={activeSection} />
      </div>
    </div>
  );
}
