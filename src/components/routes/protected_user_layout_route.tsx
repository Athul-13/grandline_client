import type { ReactNode } from 'react';
import { ProtectedRoute } from './protected_route';
import { UserLayout } from '../layouts/user_layout';

interface ProtectedUserLayoutRouteProps {
  children: ReactNode;
}

/**
 * Combined Protected Route + User Layout Wrapper
 * Reduces redundancy by combining protection and layout in one component
 */
export const ProtectedUserLayoutRoute: React.FC<ProtectedUserLayoutRouteProps> = ({
  children,
}) => {
  return (
    <ProtectedRoute>
      <UserLayout>{children}</UserLayout>
    </ProtectedRoute>
  );
};

