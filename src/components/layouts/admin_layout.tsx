import type { ReactNode } from 'react';
import { AdminNavbar } from '../admin/navbar';
import { AdminSidebar } from '../admin/sidebar';
import { SearchProvider } from '../../contexts/search_provider';

interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * Admin Layout Component
 * Wraps admin pages with navbar, sidebar, and consistent layout
 * Includes SearchProvider for global search functionality
 */
export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <SearchProvider>
      <div className="h-screen bg-[var(--color-bg-primary)] overflow-hidden flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminNavbar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SearchProvider>
  );
};

