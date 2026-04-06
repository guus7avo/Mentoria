import { ProfileSettings } from "./sections/ProfileSettings";
import { NotificationSettings } from "./sections/NotificationSettings";
import { SecuritySettings } from "./sections/SecuritySettings";
import { AppearanceSettings } from "./sections/AppearanceSettings";
import { SettingsSectionKey } from "../types/settings.types";

export function SettingsContent({ active }: { active: SettingsSectionKey }) {
  switch (active) {
    case "profile":
      return <ProfileSettings />;
    case "notifications":
      return <NotificationSettings />;
    case "security":
      return <SecuritySettings />;
    case "appearance":
      return <AppearanceSettings />;
    default:
      return null;
  }
}
