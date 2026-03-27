import { SettingsSection } from "./SettingsSection";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";

export function AppearanceSettings() {
  return (
    <SettingsSection>
      <div className="flex items-center justify-between rounded-lg border bg-background p-4">
        <div>
          <p className="font-medium">Theme</p>
          <p className="text-sm text-foreground">
            Switch between light and dark mode
          </p>
        </div>

        <ThemeToggle />
      </div>
    </SettingsSection>
  );
}
