import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../../hooks/use_theme';
import { useLanguage } from '../../hooks/use_language';
import { LanguageSelector } from '../common/language_selector';
import { cn } from '../../utils/cn';
import logoImg from '../../assets/logo.png';

interface HomeNavbarProps {
  logo?: string;
}

export const HomeNavbar: React.FC<HomeNavbarProps> = ({ logo = logoImg }) => {
  const { setTheme, isDark } = useTheme();
  const { t } = useLanguage();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const navLinks = {
    left: [
      { label: t('nav.home'), href: '#', key: 'home' },
      { label: t('nav.fleet'), href: '#', key: 'fleet' },
      { label: t('nav.contact'), href: '#', key: 'contact' },
    ],
    right: [
      { label: t('nav.about'), href: '#', key: 'about' },
      { label: t('nav.services'), href: '#', key: 'services' },
    ],
  };

  return (
    <>
      <nav className="w-full h-20 bg-(--color-bg-primary) shadow-md flex justify-center items-center px-4 md:px-8 relative z-50">
        <div className="max-w-7xl w-full flex items-center justify-between h-full relative">
          {/* Mobile Hamburger Menu */}
          <button
            onClick={toggleDrawer}
            className={cn(
              'md:hidden w-10 h-10 flex items-center justify-center',
              'rounded-lg',
              'bg-(--color-bg-secondary) hover:bg-(--color-bg-hover)',
              'border border-(--color-border) hover:border-(--color-primary)',
              'text-(--color-text-primary) hover:text-(--color-primary)',
              'shadow-sm hover:shadow-md',
              'transition-all duration-200'
            )}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Left section: Nav Links positioned to end (close to center) - Desktop only */}
          <div className="hidden md:flex items-center justify-end gap-4 flex-1 pr-14">
          {navLinks.left.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="hover:text-(--color-primary) transition-colors text-(--color-text-primary) font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Logo - Absolutely centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-28 h-28 flex items-center justify-center z-10">
          <img src={logo} alt="GrandLine Logo" className="w-28 h-28 object-contain" />
        </div>

        {/* Right section: Nav Links + Login - Desktop only */}
        <div className="hidden md:flex items-center gap-4 flex-1 justify-start pl-14">
          {navLinks.right.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="hover:text-(--color-primary) transition-colors text-(--color-text-primary) font-medium"
            >
              {link.label}
            </a>
          ))}
          
          {/* Login Button */}
          <Link
            to="/login"
            className={cn(
              'bg-(--color-primary) hover:bg-(--color-primary-hover)',
              'text-white font-bold py-2 px-5 rounded-lg shadow-md',
              'transition-all duration-150',
              'hover:shadow-lg hover:-translate-y-0.5'
            )}
          >
            {t('nav.login')}
          </Link>
        </div>

        {/* Language + Theme Toggles - Far Right (Absolutely positioned) */}
        <div className="absolute right-4 md:right-8 flex items-center gap-4 z-10">
          {/* Language Selector - Desktop only */}
          <div className="hidden md:block">
            <LanguageSelector />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={cn(
              'w-10 h-10 flex items-center justify-center',
              'rounded-lg',
              'bg-(--color-bg-secondary) hover:bg-(--color-bg-hover)',
              'border border-(--color-border) hover:border-(--color-primary)',
              'text-(--color-text-primary) hover:text-(--color-primary)',
              'shadow-sm hover:shadow-md',
              'transition-all duration-200',
              'relative overflow-hidden group'
            )}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <div className="relative z-10 flex items-center justify-center">
              {isDark ? (
                <Sun className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
              ) : (
                <Moon className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-12" />
              )}
            </div>
          </button>
        </div>
      </div>
    </nav>

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-(--color-bg-primary) opacity-50 z-40 md:hidden"
          onClick={closeDrawer}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={cn(
          'fixed top-0 left-0 h-full w-80 bg-(--color-bg-primary)',
          'shadow-xl z-50 transform transition-transform duration-300 ease-in-out',
          'md:hidden',
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full p-6">
          {/* Drawer Header */}
          <div className="flex items-center justify-between mb-8">
            <img src={logo} alt="GrandLine Logo" className="h-10 w-auto object-contain" />
            <button
              onClick={closeDrawer}
              className={cn(
                'w-8 h-8 flex items-center justify-center rounded-lg',
                'bg-(--color-bg-secondary) hover:bg-(--color-bg-hover)',
                'text-(--color-text-primary) hover:text-(--color-primary)',
                'transition-colors'
              )}
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-4 mb-8">
            {navLinks.left.map((link) => (
              <a
                key={link.key}
                href={link.href}
                onClick={closeDrawer}
                className="text-lg font-medium text-(--color-text-primary) hover:text-(--color-primary) transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
            {navLinks.right.map((link) => (
              <a
                key={link.key}
                href={link.href}
                onClick={closeDrawer}
                className="text-lg font-medium text-(--color-text-primary) hover:text-(--color-primary) transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Login Button */}
          <Link
            to="/login"
            onClick={closeDrawer}
            className={cn(
              'w-full bg-(--color-primary) hover:bg-(--color-primary-hover)',
              'text-white font-bold py-3 px-5 rounded-lg shadow-md',
              'transition-all duration-150 mb-6',
              'hover:shadow-lg text-center block'
            )}
          >
            {t('nav.login')}
          </Link>

          {/* Language Selector */}
          <div className="mt-auto">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </>
  );
};

