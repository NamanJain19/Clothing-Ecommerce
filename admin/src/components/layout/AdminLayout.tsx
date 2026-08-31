import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  searchTerm,
  onSearchChange,
  searchPlaceholder,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-background text-on-surface min-h-screen flex">
      {/* Shared Sidebar */}
      <AdminSidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      {/* Main Content Pane */}
      <main className="w-full lg:ml-[280px] min-h-screen flex flex-col">
        <AdminHeader
          onOpenMobileMenu={() => setMobileOpen(true)}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
        />

        <div className="flex-1">{children}</div>

        {/* Footer */}
        <footer className="mt-auto flex flex-col sm:flex-row justify-between items-center py-4 px-4 sm:px-8 bg-surface-container-low border-t border-outline-variant gap-3 text-xs text-on-surface-variant">
          <div className="flex items-center gap-3">
            <span className="font-bold text-primary">MONOLITH</span>
            <span>© 2026 Monolith Luxury Operations. All rights reserved.</span>
          </div>
          <div className="flex gap-4 font-medium">
            <a className="hover:text-primary hover:underline transition-colors" href="#privacy">
              Privacy Policy
            </a>
            <a className="hover:text-primary hover:underline transition-colors" href="#terms">
              Terms of Service
            </a>
            <a className="hover:text-primary hover:underline transition-colors" href="#audit">
              Security Audit
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
};
