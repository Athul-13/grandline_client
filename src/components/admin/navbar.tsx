import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutAsync } from '../../store/slices/auth_slice';
import { ROUTES } from '../../constants/routes';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import { ChevronDown, LogOut, Bell } from 'lucide-react';
import { useLanguage } from '../../hooks/use_language';
import { SearchBar } from '../common/ui/search_bar';
import { useNotificationContext } from '../../hooks/notifications/use_notification_context';
import { NotificationDropdown } from '../common/notifications/notification_dropdown';

export const AdminNavbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);
  const { t } = useLanguage();
  const { unreadCount } = useNotificationContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    if (isDropdownOpen || isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, isNotificationOpen]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap();
      // Clear TanStack Query cache on logout
      queryClient.removeQueries({ queryKey: ['profile'] });
      toast.success('Logged out successfully');
      navigate(ROUTES.admin.login);
      setIsDropdownOpen(false);
    } catch {
      toast.error('Logout failed. Please try again.');
    }
  };

  return (
    <nav className="bg-[var(--color-bg-primary)]/80 backdrop-blur-sm z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16 gap-4">
          {/* Search Bar - Centered with fixed width */}
          <SearchBar />

          {/* Right side: Notification Icon and Admin Name with Dropdown */}
          <div className="absolute right-4 sm:right-6 lg:right-8 shrink-0 flex items-center gap-3">
            {/* Notification Icon */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-primary)] hover:text-[var(--color-primary)]"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
              {/* Notification Dropdown */}
              <NotificationDropdown
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
              />
            </div>

            {/* Admin Name with Dropdown */}
            <div ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors px-3 py-2 rounded-lg hover:bg-[var(--color-bg-hover)]"
              >
                <span className="hidden sm:inline">{user?.fullName || 'Admin'}</span>
                <span className="sm:hidden">Admin</span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform duration-300 ease-in-out',
                    isDropdownOpen && 'rotate-180'
                  )}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[var(--color-bg-card)] rounded-md shadow-lg py-1 border border-[var(--color-border)] z-50 animate-slide-in-top">
                  <div className="px-4 py-2 border-b border-[var(--color-border)]">
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">
                      {user?.fullName || 'Admin'}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] truncate">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 transition-colors duration-200 hover:translate-x-1"
                  >
                    <LogOut className="h-4 w-4 transition-transform duration-200" />
                    <span>{t('nav.logout') || 'Logout'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

