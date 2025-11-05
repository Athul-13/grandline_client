import type { ReactNode } from 'react';
import { Navbar } from '../user/navbar';

interface UserLayoutProps {
  children: ReactNode;
}

/**
 * User Layout Component
 * Wraps user pages with navbar and consistent layout
 */
export const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen bg-[var(--color-bg-primary)] overflow-hidden flex flex-col">
      <Navbar />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

