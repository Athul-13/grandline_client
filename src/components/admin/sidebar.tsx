import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { ROUTES } from '../../constants/routes';
import { 
  LayoutDashboard, 
  Route, 
  FileText, 
  Truck, 
  Users, 
  UserCircle, 
  HelpCircle,
  Settings
} from 'lucide-react';
import { useLanguage } from '../../hooks/use_language';
import logo from '../../assets/logo.png';
import logoNavbar from '../../assets/logo_navbar.png';

interface SidebarItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * Admin Sidebar Component
 * Collapsible sidebar with navigation links
 */
export const AdminSidebar: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarItems: SidebarItem[] = [
    { 
      path: ROUTES.admin.dashboard, 
      label: t('admin.sidebar.dashboardOverview') || 'Dashboard Overview', 
      icon: LayoutDashboard 
    },
    { 
      path: ROUTES.admin.tripManagement, 
      label: t('admin.sidebar.tripManagement') || 'Trip Management', 
      icon: Route 
    },
    { 
      path: ROUTES.admin.quotesReservations, 
      label: t('admin.sidebar.quotesReservations') || 'Quotes & Reservations', 
      icon: FileText 
    },
    { 
      path: ROUTES.admin.fleetManagement, 
      label: t('admin.sidebar.fleetManagement') || 'Fleet Management', 
      icon: Truck 
    },
    { 
      path: ROUTES.admin.userManagement, 
      label: t('admin.sidebar.userManagement') || 'User Management', 
      icon: Users 
    },
    { 
      path: ROUTES.admin.driverManagement, 
      label: t('admin.sidebar.driverManagement') || 'Driver Management', 
      icon: UserCircle 
    },
    { 
      path: ROUTES.admin.supportConcerns, 
      label: t('admin.sidebar.supportConcerns') || 'Support & Concerns', 
      icon: HelpCircle 
    },
    { 
      path: ROUTES.admin.settings, 
      label: t('admin.sidebar.settings') || 'Settings', 
      icon: Settings 
    },
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={cn(
        'h-screen bg-[var(--color-bg-card)] border-r border-[var(--color-border)] transition-all duration-300 flex flex-col',
        isCollapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Logo Section */}
      <div className={cn(
        'border-b border-[var(--color-border)]',
        isCollapsed ? 'p-2' : 'p-4'
      )}>
        {isCollapsed ? (
          <button
            onClick={toggleCollapse}
            className="w-full flex justify-center items-center"
            aria-label="Expand sidebar"
          >
            <img 
              src={logo} 
              alt="Logo" 
              className="h-auto w-auto cursor-pointer" 
            />
          </button>
        ) : (
          <button
            onClick={toggleCollapse}
            className="w-full flex items-center space-x-2"
            aria-label="Collapse sidebar"
          >
            <img 
              src={logo} 
              alt="Logo" 
              className="h-12 w-auto cursor-pointer" 
            />
            <img 
              src={logoNavbar} 
              alt="Navbar Logo" 
              className="h-8 w-auto cursor-pointer" 
            />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className={cn('space-y-1', isCollapsed ? 'px-2' : 'px-2')}>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive: navIsActive }) =>
                  cn(
                    'flex items-center rounded-lg transition-all duration-200',
                    isCollapsed 
                      ? 'justify-center px-2 py-2.5' 
                      : 'space-x-3 px-3 py-2.5',
                    'hover:bg-[var(--color-bg-hover)]',
                    navIsActive || isActive
                      ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium'
                      : 'text-[var(--color-text-primary)] hover:text-[var(--color-primary)]'
                  )
                }
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-6 w-6 shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm truncate">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

