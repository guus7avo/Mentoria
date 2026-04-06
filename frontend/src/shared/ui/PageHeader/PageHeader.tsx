import { ElementType } from "react";
import { IconBadge } from "@/shared/ui/IconBadge";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  icon?: ElementType;
};

export function PageHeader({ title, subtitle, icon: Icon }: PageHeaderProps) {
  return (
    <div className="flex items-start gap-4">
      {Icon && (
        <IconBadge size="md">
          <Icon/>
        </IconBadge>
      )}

      <div>
        <h1 className="text-2xl font-bold text-foreground-900">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-1 text-sm text-foreground-600">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
