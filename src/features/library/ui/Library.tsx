import { BookMarked } from "lucide-react";
import { IconBadge } from '@/shared/ui/IconBadge';

export function Library() {
  return (
    <div className="h-full w-full p-8 space-y-4">

      {/* Título com ícone */}
      <div className="flex items-center gap-3">
        <IconBadge>
          <BookMarked/>
        </IconBadge>

        <h1 className="text-3xl font-bold text-gray-900">
          Library
        </h1>
      </div>

      <p className="text-gray-600">
        Bem-vindo a Library
      </p>
    </div>
  );
}
