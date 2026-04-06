'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  BookMarked,
  SearchIcon,
  BarChart3,
  SettingsIcon,
  Menu,
  X,
  ChevronLeft,
  LibraryBig
} from 'lucide-react';
import { IconBadge } from '@/shared/ui/IconBadge';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Library', path: '/library', icon: BookMarked },
  { name: 'Search', path: '/search', icon: SearchIcon },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: SettingsIcon },
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
        className="fixed left-4 top-4 z-50 lg:hidden bg-background p-2 rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static h-screen bg-background z-40
          transition-all duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64
        `}
      >
        {/* Header */}
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconBadge size='sm'>
              <LibraryBig />
            </IconBadge>
            {!isCollapsed && (
              <div>
                <h1 className="text-sm font-semibold">BookLog</h1>
                <p className="text-xs text-foreground">Track your reading</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-2 hover:bg-background-50 rounded-xl transition-colors"
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
                    ? "bg-purple-50 text-purple-600 dark:text-purple-400 font-medium"
                    : "text-foreground/70 hover:bg-purple-50 hover:text-purple-600"
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