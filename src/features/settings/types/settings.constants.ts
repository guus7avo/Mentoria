import {
  User,
  Bell,
  Shield,
  Palette,
} from "lucide-react";

import {
  SettingsMenuItem,
  SettingsSection,
} from "./settings.types";

export const SETTINGS_MENU: SettingsMenuItem[] = [
  {
    key: "profile",
    label: "Profile",
    icon: User,
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    key: "security",
    label: "Privacy & Security",
    icon: Shield,
  },
  {
    key: "data",
    label: "Data Management",
    icon: Shield,
  },
  {
    key: "appearance",
    label: "Appearance",
    icon: Palette,
  },
];

export const SETTINGS_SECTIONS: Record<
  SettingsSection["key"],
  SettingsSection
> = {
  profile: {
    key: "profile",
    title: "Profile",
    description: "Manage your personal information",
  },
  notifications: {
    key: "notifications",
    title: "Notifications",
    description: "Control how you receive updates",
  },
  security: {
    key: "security",
    title: "Privacy & Security",
    description: "Update your password and security settings",
  },
  data: {
    key: "data",
    title: "Data Management",
    description: "Manage your data settings",
  },
  appearance: {
    key: "appearance",
    title: "Appearance",
    description: "Customize the look and feel of the app",
  },
};
