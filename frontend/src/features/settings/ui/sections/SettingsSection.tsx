import { ReactNode } from "react";

type Props = {
  title?: string;
  children?: ReactNode;
};

export function SettingsSection({ title, children }: Props) {
  return (
    <div className="flex-1 bg-background rounded-xl p-6">
      <h2 className="text-sm font-semibold">
        {title}
      </h2>

      {children}
    </div>
  );
}
