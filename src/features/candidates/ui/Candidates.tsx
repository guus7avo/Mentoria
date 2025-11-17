import { Users } from "lucide-react";
import { IconBadge } from '@/src/shared/ui/IconBadge';

export function Candidates() {
  return (
    <div className="h-full w-full p-8 space-y-4">

      {/* Título com ícone */}
      <div className="flex items-center gap-3">
        <IconBadge>
          <Users/>
        </IconBadge>

        <h1 className="text-3xl font-bold text-gray-900">
          Candidates
        </h1>
      </div>

      <p className="text-gray-600">
        Bem-vindo a Candidates
      </p>
    </div>
  );
}
