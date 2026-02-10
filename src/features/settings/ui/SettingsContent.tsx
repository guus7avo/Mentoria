import { ProfileSettings } from "./sections/ProfileSettings";
import { NotificationSettings } from "./sections/NotificationSettings";
import { SecuritySettings } from "./sections/SecuritySettings";
import { DataSettings } from "./sections/DataSettings";
import { AppearanceSettings } from "./sections/AppearanceSettings";
import { SettingsSectionKey } from "../types/settings.types";

// type Props = {
//   active: string;
// };

export function SettingsContent({ active }: { active: SettingsSectionKey }) {
  switch (active) {
    case "profile":
      return <ProfileSettings />;
    case "notifications":
      return <NotificationSettings />;
    case "security":
      return <SecuritySettings />;
    case "data":
      return <DataSettings />;
    case "appearance":
      return <AppearanceSettings />;
    default:
      return null;
  }
}
