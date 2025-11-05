import { Outlet } from 'react-router-dom';
import { ProfileSidebar } from '../user/profile/profile_sidebar';

/**
 * Profile Layout Component
 * Provides floating sidebar and outlet for profile pages
 * Content area is scrollable, not the whole page
 */
export const ProfileLayout: React.FC = () => {
  return (
    <div className="h-full p-3 sm:p-4 md:p-6 lg:p-8 overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6 max-w-7xl mx-auto items-start h-full">
        {/* Floating Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <ProfileSidebar />
        </div>

        {/* Floating Content Area - Scrollable */}
        <div className="flex-1 min-w-0 w-full h-full lg:h-auto">
          <div className="bg-[var(--color-bg-card)] rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 w-full max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-8rem)] overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

