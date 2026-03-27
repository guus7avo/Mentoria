import { ElementType } from "react";

export type SettingsSectionKey =
  | "profile"
  | "notifications"
  | "security"
  | "data"
  | "appearance";

export type SettingsMenuItem = {
  key: SettingsSectionKey;
  label: string;
  icon: ElementType;
};

export type SettingsSection = {
  key: SettingsSectionKey;
  title: string;
  description?: string;
};
