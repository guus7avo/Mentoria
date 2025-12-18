'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Users,
  Briefcase,
  BarChart3,
  Cog,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react';
import { IconBadge } from '@/src/shared/ui/IconBadge';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Resume Analyzer', path: '/resume-analyzer', icon: FileText },
  { name: 'Candidates', path: '/candidates', icon: Users },
  { name: 'Job Postings', path: '/job-postings', icon: Briefcase },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Cog },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Botão mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static h-screen bg-white z-40
          transition-all duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64
        `}
      >
        {/* Header */}
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconBadge size='sm'>AI</IconBadge>
            {!isCollapsed && (
              <div>
                <h1 className="text-sm font-semibold">ATS Analyzer</h1>
                <p className="text-xs text-gray-500">AI-Powered</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-2 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <ChevronLeft
              size={20}
              className={`transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors
                  ${isCollapsed ? 'lg:justify-center' : ''}
                  ${isActive 
                    ? 'bg-purple-50 text-purple-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <Icon size={20} />
                {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
                {isCollapsed && (
                  <span className="lg:hidden text-sm font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}