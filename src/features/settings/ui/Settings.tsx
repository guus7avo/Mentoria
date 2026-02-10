"use client";

import { useState } from "react";
import { SettingsMenu } from "./SettingsMenu";
import { SettingsContent } from "./SettingsContent";
import { PageHeader } from "@/shared/ui/PageHeader";
import { Settings as SettingsIcon } from "lucide-react";
import { SettingsSectionKey } from "../types/settings.types";

export function Settings() {
  const [activeSection, setActiveSection] = useState<SettingsSectionKey>("profile");

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your preferences"
        icon={SettingsIcon}
      />

      <div className="flex gap-6">
        <SettingsMenu
          active={activeSection}
          onChange={setActiveSection}
        />

        <SettingsContent active={activeSection} />
      </div>
    </div>
  );
}
