import { useState, useEffect, useRef } from 'react';
import { RefreshCw, Calendar, Users, Car, FileText, CalendarCheck, Wifi, WifiOff } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { useLanguage } from '../../hooks/use_language';
import { DashboardContent } from '../../components/dashboard/dashboard_content';
import { DriverDashboardContent } from '../../components/dashboard/driver_dashboard_content';
import { QuotesAnalyticsContent } from '../../components/dashboard/quotes_analytics_content';
import { ReservationsAnalyticsContent } from '../../components/dashboard/reservations_analytics_content';
import { Button } from '../../components/common/ui/button';
import { cn } from '../../utils/cn';
import { adminDashboardSocketService } from '../../services/socket/admin_dashboard_socket_service';
import { useAdminDashboardAnalytics } from '../../hooks/dashboard/use_admin_dashboard_analytics';
import { isSocketConnected } from '../../services/socket/socket_client';

type DashboardTab = 'users' | 'drivers' | 'quotes' | 'reservations';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<DashboardTab>('users');
  const [timeRange, setTimeRange] = useState<'all_time' | '7_days' | '30_days' | 'custom'>('all_time');
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLive, setIsLive] = useState(false);
  
  const { refetch: refetchAnalytics } = useAdminDashboardAnalytics({
    timeRange,
    startDate,
    endDate,
  });
  
  // Use ref to store refetch function to avoid dependency issues
  const refetchAnalyticsRef = useRef(refetchAnalytics);
  useEffect(() => {
    refetchAnalyticsRef.current = refetchAnalytics;
  }, [refetchAnalytics]);

  const handleTimeRangeChange = (range: 'all_time' | '7_days' | '30_days' | 'custom') => {
    setTimeRange(range);
    if (range !== 'custom') {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    if (activeTab === 'quotes' || activeTab === 'reservations') {
      refetchAnalytics();
    }
  };

  // Set up socket listeners for live updates
  useEffect(() => {
    if (activeTab !== 'quotes' && activeTab !== 'reservations') {
      setIsLive(false);
      return;
    }

    const socketConnected = isSocketConnected();
    setIsLive(socketConnected);

    // Listen for all dashboard update events
    const unsubscribe = adminDashboardSocketService.onDashboardUpdate(() => {
      // Refetch analytics when any quote/reservation event occurs
      // Use ref to avoid dependency issues
      refetchAnalyticsRef.current();
    });

    return () => {
      unsubscribe();
    };
  }, [activeTab]); // Only depend on activeTab, refetch is accessed via ref

  return (
    <div className="h-full overflow-y-auto bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <div className="w-full px-4 py-4">
        {/* Compact Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{t('admin.dashboard.title')}</h1>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              {t('admin.dashboard.welcome', { name: user?.fullName || 'Admin' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Time Range Selector - Compact */}
            <div className="flex items-center gap-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg px-3 py-1.5">
              <Calendar className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
              <div className="flex gap-1">
                {(['all_time', '7_days', '30_days'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => handleTimeRangeChange(range)}
                    className={cn(
                      'px-2.5 py-1 text-xs rounded transition-colors',
                      timeRange === range
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
                    )}
                  >
                    {range === 'all_time'
                      ? 'All'
                      : range === '7_days'
                      ? '7D'
                      : '30D'}
                  </button>
                ))}
              </div>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="text-xs">Refresh</span>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4 flex items-center gap-2 border-b border-[var(--color-border)]">
          <button
            onClick={() => setActiveTab('users')}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[1px]',
              'flex items-center gap-2',
              activeTab === 'users'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            )}
          >
            <Users className="w-4 h-4" />
            <span>User Statistics</span>
          </button>
          <button
            onClick={() => setActiveTab('drivers')}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[1px]',
              'flex items-center gap-2',
              activeTab === 'drivers'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            )}
          >
            <Car className="w-4 h-4" />
            <span>Driver Statistics</span>
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[1px]',
              'flex items-center gap-2',
              activeTab === 'quotes'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            )}
          >
            <FileText className="w-4 h-4" />
            <span>Quotes Analytics</span>
            {activeTab === 'quotes' && isLive && (
              <Wifi className="w-3 h-3 text-green-500" title="Live updates enabled" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[1px]',
              'flex items-center gap-2',
              activeTab === 'reservations'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            )}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Reservations Analytics</span>
            {activeTab === 'reservations' && isLive && (
              <Wifi className="w-3 h-3 text-green-500" title="Live updates enabled" />
            )}
          </button>
        </div>

        {/* Dashboard Content */}
        <div key={refreshKey}>
          {activeTab === 'users' ? (
            <DashboardContent
              timeRange={timeRange}
              startDate={startDate}
              endDate={endDate}
            />
          ) : activeTab === 'drivers' ? (
            <DriverDashboardContent
              timeRange={timeRange}
              startDate={startDate}
              endDate={endDate}
            />
          ) : activeTab === 'quotes' ? (
            <QuotesAnalyticsContent
              timeRange={timeRange}
              startDate={startDate}
              endDate={endDate}
            />
          ) : (
            <ReservationsAnalyticsContent
              timeRange={timeRange}
              startDate={startDate}
              endDate={endDate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

