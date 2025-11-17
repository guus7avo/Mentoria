import { Cog } from "lucide-react";
import { IconBadge } from '@/src/shared/ui/IconBadge';

export function Settings() {
  return (
    <div className="h-full w-full p-8 space-y-4">

      {/* Título com ícone */}
      <div className="flex items-center gap-3">
        <IconBadge>
          <Cog/>
        </IconBadge>

        <h1 className="text-3xl font-bold text-gray-900">
          Settings
        </h1>
      </div>

      <p className="text-gray-600">
        Bem-vindo ao painel Settings
      </p>
    </div>
  );
}
