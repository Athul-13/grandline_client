import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutAsync } from '../../store/slices/auth_slice';
import { ROUTES } from '../../constants/routes';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import { ChevronDown, LogOut, User, Menu, X, Bell } from 'lucide-react';
import logo from '../../assets/logo.png';
import logoNavbar from '../../assets/logo_navbar.png';
import { useLanguage } from '../../hooks/use_language';
import { useNotificationContext } from '../../hooks/notifications/use_notification_context';
import { NotificationDropdown } from '../common/notifications/notification_dropdown';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);
  const { t } = useLanguage();
  const { unreadCount } = useNotificationContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen && !isClosing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, isClosing]);

  // Handle drawer close with animation
  const handleCloseDrawer = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  // Handle drawer open - ensure it starts off-screen then animates in
  const handleOpenDrawer = () => {
    setIsOpening(true);
    setIsMobileMenuOpen(true);
    // Use requestAnimationFrame to ensure the element is rendered off-screen first
    requestAnimationFrame(() => {
      // Then trigger the slide-in animation
      requestAnimationFrame(() => {
        setIsOpening(false);
      });
    });
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap();
      // Clear TanStack Query cache on logout
      queryClient.removeQueries({ queryKey: ['profile'] });
      toast.success('Logged out successfully');
      navigate(ROUTES.login);
      setIsDropdownOpen(false);
    } catch {
      toast.error('Logout failed. Please try again.');
    }
  };

  const handleProfile = () => {
    navigate(ROUTES.profile.myProfile);
    setIsDropdownOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSupportClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const navLinks: Array<
    | { path: string; label: string; isButton?: false }
    | { path: string; label: string; isButton: true; onClick: (e: React.MouseEvent) => void }
  > = [
    { path: ROUTES.quotes, label: t('nav.quotes') },
    { path: ROUTES.reservations, label: t('nav.reservations') },
    { path: '#', label: t('nav.support'), isButton: true, onClick: handleSupportClick },
    { path: ROUTES.buildQuote, label: t('nav.buildQuote') },
  ];

  return (
    <nav className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border)] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side: Logo */}
          <Link 
            to={ROUTES.dashboard} 
            className="flex items-center transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            <img src={logo} alt="Logo" className="h-12 w-auto transition-transform duration-300" />
            <img src={logoNavbar} alt="Navbar Logo" className="h-8 w-auto transition-transform duration-300" />
          </Link>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) =>
              link.isButton ? (
                <button
                  key={link.path}
                  onClick={link.onClick}
                  className="text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95',
                    isActive(link.path)
                      ? 'text-[var(--color-primary)]'
                      : 'text-[var(--color-text-primary)] hover:text-[var(--color-primary)]'
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Right side: Desktop - Notification Icon and User Dropdown */}
          <div className="hidden md:flex items-center gap-3">
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

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors"
              >
                <span>{user?.fullName || t('nav.user')}</span>
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
                  <button
                    onClick={handleProfile}
                    className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] flex items-center space-x-2 transition-colors duration-200 hover:translate-x-1"
                  >
                    <User className="h-4 w-4 transition-transform duration-200" />
                    <span>{t('nav.profile')}</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 transition-colors duration-200 hover:translate-x-1"
                  >
                    <LogOut className="h-4 w-4 transition-transform duration-200" />
                    <span>{t('nav.logout')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile - Hamburger Button */}
          <button
            onClick={() => {
              if (isMobileMenuOpen) {
                handleCloseDrawer();
              } else {
                handleOpenDrawer();
              }
            }}
            className="md:hidden p-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <X
                className={cn(
                  'absolute inset-0 h-6 w-6 transition-all duration-300',
                  isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'
                )}
              />
              <Menu
                className={cn(
                  'absolute inset-0 h-6 w-6 transition-all duration-300',
                  isMobileMenuOpen ? 'opacity-0 -rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                )}
              />
            </div>
          </button>
        </div>

        {/* Mobile Drawer */}
        {(isMobileMenuOpen || isClosing) && (
          <>
            {/* Backdrop */}
            <div
              className={cn(
                'fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300',
                isClosing ? 'opacity-0' : 'opacity-100'
              )}
              onClick={handleCloseDrawer}
            />
            
            {/* Drawer */}
            <div
              className="fixed inset-y-0 right-0 w-80 bg-[var(--color-bg-card)] shadow-xl z-50 md:hidden transition-transform duration-300 ease-out"
              style={{
                transform: isClosing || isOpening 
                  ? 'translateX(100%)' 
                  : 'translateX(0)',
              }}
            >
              <div className="flex flex-col h-full">
                {/* User Name at Top with Notification Icon */}
                <div className="px-6 py-6 border-b border-[var(--color-border)]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                      {user?.fullName || t('nav.user')}
                    </h3>
                    <div className="flex items-center gap-2">
                      {/* Notification Icon for Mobile */}
                      <button
                        onClick={() => {
                          setIsNotificationOpen(!isNotificationOpen);
                        }}
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
                      <button
                        onClick={handleCloseDrawer}
                        className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {user?.email}
                  </p>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                  <nav className="space-y-2">
                    {navLinks.map((link, index) =>
                      link.isButton ? (
                        <button
                          key={link.path}
                          onClick={(e) => {
                            link.onClick(e);
                            handleCloseDrawer();
                          }}
                          className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-hover)] transition-all duration-200 hover:translate-x-2 hover:scale-[1.02] animate-fade-in"
                          style={{
                            animationDelay: `${index * 50}ms`,
                            animationFillMode: 'both',
                          }}
                        >
                          {link.label}
                        </button>
                      ) : (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={handleCloseDrawer}
                          className={cn(
                            'block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:translate-x-2 hover:scale-[1.02] animate-fade-in',
                            isActive(link.path)
                              ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10'
                              : 'text-[var(--color-text-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-hover)]'
                          )}
                          style={{
                            animationDelay: `${index * 50}ms`,
                            animationFillMode: 'both',
                          }}
                        >
                          {link.label}
                        </Link>
                      )
                    )}
                  </nav>
                </div>

                {/* Profile and Logout at Bottom */}
                <div className="border-t border-[var(--color-border)] px-4 py-4 space-y-2 animate-slide-in-bottom" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                  <button
                    onClick={() => {
                      handleProfile();
                      handleCloseDrawer();
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-all duration-200 hover:translate-x-2 hover:scale-[1.02] active:scale-95"
                  >
                    <User className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                    <span>{t('nav.profile')}</span>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      handleCloseDrawer();
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 hover:translate-x-2 hover:scale-[1.02] active:scale-95"
                  >
                    <LogOut className="h-5 w-5 transition-transform duration-200" />
                    <span>{t('nav.logout')}</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

