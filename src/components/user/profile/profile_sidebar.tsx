import { NavLink } from 'react-router-dom';
import { cn } from '../../../utils/cn';
import { ROUTES } from '../../../constants/routes';
import { User, Shield, Bell, Settings } from 'lucide-react';

interface SidebarItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarItems: SidebarItem[] = [
  { path: ROUTES.profile.myProfile, label: 'My Profile', icon: User },
  { path: ROUTES.profile.security, label: 'Security', icon: Shield },
  { path: ROUTES.profile.notifications, label: 'Notifications', icon: Bell },
  { path: ROUTES.profile.settings, label: 'Account Settings', icon: Settings },
];

/**
 * Profile Sidebar Component
 */
export const ProfileSidebar: React.FC = () => {
  return (
    <nav className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 h-fit lg:sticky lg:top-4">
      <div className="flex flex-row lg:flex-col gap-2 sm:gap-2 overflow-x-auto lg:overflow-x-visible lg:space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 whitespace-nowrap',
                  'hover:bg-gray-50 lg:hover:translate-x-1',
                  isActive
                    ? 'bg-(--color-primary)/10 text-(--color-primary) font-medium'
                    : 'text-gray-700 hover:text-(--color-primary)'
                )
              }
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
              <span className="text-xs sm:text-sm">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

