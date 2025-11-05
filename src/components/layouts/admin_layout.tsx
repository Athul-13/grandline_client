import type { ReactNode } from 'react';
import { AdminNavbar } from '../admin/navbar';
import { AdminSidebar } from '../admin/sidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * Admin Layout Component
 * Wraps admin pages with navbar, sidebar, and consistent layout
 */
export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen bg-[var(--color-bg-primary)] overflow-hidden flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

