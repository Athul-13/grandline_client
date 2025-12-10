import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AdminReservationDetailsHeader } from './admin_reservation_details_header';
import { cn } from '../../../utils/cn';
import { formatDate, formatPrice, getTripTypeLabel } from '../../../utils/quote_formatters';
import { ReservationStatusBadge } from '../reservation_status_badge';
import type { AdminReservationDetailsResponse } from '../../../types/reservations/admin_reservation';
import { ReservationStatus } from '../../../types/reservations/reservation';

interface AdminReservationDetailsViewProps {
  reservationDetails: AdminReservationDetailsResponse;
  isUpdatingStatus: boolean;
  onBack: () => void;
  onStatusChange: (newStatus: string) => Promise<void>;
  onRefetch?: () => Promise<void>;
}

/**
 * Admin Reservation Details View Component
 * Main container for displaying reservation details with accordion sections
 */
export const AdminReservationDetailsView: React.FC<AdminReservationDetailsViewProps> = ({
  reservationDetails,
  isUpdatingStatus,
  onBack,
  onStatusChange,
  onRefetch,
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basicInfo: true,
    userInfo: false,
    tripDetails: false,
    passengers: false,
    itinerary: false,
    vehicles: false,
    amenities: false,
    driver: false,
    payment: false,
    modifications: false,
    charges: false,
  });

  // Toggle accordion section
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Get available status options based on current status
  const getAvailableStatuses = (): Array<{ value: string; label: string }> => {
    const currentStatus = reservationDetails.status;
    const statuses: Array<{ value: string; label: string }> = [];

    // Can change to different statuses based on current status
    if (currentStatus === ReservationStatus.CONFIRMED) {
      statuses.push({ value: ReservationStatus.MODIFIED, label: 'Modified' });
      statuses.push({ value: ReservationStatus.CANCELLED, label: 'Cancelled' });
    } else if (currentStatus === ReservationStatus.MODIFIED) {
      statuses.push({ value: ReservationStatus.CONFIRMED, label: 'Confirmed' });
      statuses.push({ value: ReservationStatus.CANCELLED, label: 'Cancelled' });
    }

    return statuses;
  };

  const availableStatuses = getAvailableStatuses();

  return (
    <div className="flex flex-col h-full min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] overflow-hidden">
      {/* Header */}
      <AdminReservationDetailsHeader
        reservationDetails={reservationDetails}
        isUpdatingStatus={isUpdatingStatus}
        onBack={onBack}
        onStatusChange={onStatusChange}
        availableStatuses={availableStatuses}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Basic Info Section */}
        <div className="border border-[var(--color-border)] rounded-lg">
          <button
            onClick={() => toggleSection('basicInfo')}
            className="w-full flex items-center justify-between p-4 hover:bg-[var(--color-bg-secondary)] transition-colors"
          >
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Basic Information</h3>
            {expandedSections.basicInfo ? (
              <ChevronUp className="w-5 h-5 text-[var(--color-text-secondary)]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[var(--color-text-secondary)]" />
            )}
          </button>
          {expandedSections.basicInfo && (
            <div className="p-4 pt-0 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-1">Reservation ID</p>
                  <p className="text-sm font-mono text-[var(--color-text-primary)]">{reservationDetails.reservationId}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-1">Status</p>
                  <ReservationStatusBadge status={reservationDetails.status} />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-1">Trip Type</p>
                  <p className="text-sm text-[var(--color-text-primary)]">{getTripTypeLabel(reservationDetails.tripType)}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-1">Reservation Date</p>
                  <p className="text-sm text-[var(--color-text-primary)]">{formatDate(reservationDetails.reservationDate)}</p>
                </div>
                {reservationDetails.tripName && (
                  <div className="col-span-2">
                    <p className="text-sm text-[var(--color-text-secondary)] mb-1">Trip Name</p>
                    <p className="text-sm text-[var(--color-text-primary)]">{reservationDetails.tripName}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Info Section */}
        <div className="border border-[var(--color-border)] rounded-lg">
          <button
            onClick={() => toggleSection('userInfo')}
            className="w-full flex items-center justify-between p-4 hover:bg-[var(--color-bg-secondary)] transition-colors"
          >
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">User Information</h3>
            {expandedSections.userInfo ? (
              <ChevronUp className="w-5 h-5 text-[var(--color-text-secondary)]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[var(--color-text-secondary)]" />
            )}
          </button>
          {expandedSections.userInfo && reservationDetails.user && (
            <div className="p-4 pt-0 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-1">Name</p>
                  <p className="text-sm text-[var(--color-text-primary)]">{reservationDetails.user.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-1">Email</p>
                  <p className="text-sm text-[var(--color-text-primary)]">{reservationDetails.user.email}</p>
                </div>
                {reservationDetails.user.phoneNumber && (
                  <div>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-1">Phone</p>
                    <p className="text-sm text-[var(--color-text-primary)]">{reservationDetails.user.phoneNumber}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Payment Info Section */}
        <div className="border border-[var(--color-border)] rounded-lg">
          <button
            onClick={() => toggleSection('payment')}
            className="w-full flex items-center justify-between p-4 hover:bg-[var(--color-bg-secondary)] transition-colors"
          >
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Payment Information</h3>
            {expandedSections.payment ? (
              <ChevronUp className="w-5 h-5 text-[var(--color-text-secondary)]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[var(--color-text-secondary)]" />
            )}
          </button>
          {expandedSections.payment && (
            <div className="p-4 pt-0 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                {reservationDetails.originalPricing && (
                  <>
                    <div>
                      <p className="text-sm text-[var(--color-text-secondary)] mb-1">Original Amount</p>
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">
                        {formatPrice(reservationDetails.originalPricing.total)}
                      </p>
                    </div>
                    {reservationDetails.originalPricing.paidAt && (
                      <div>
                        <p className="text-sm text-[var(--color-text-secondary)] mb-1">Paid At</p>
                        <p className="text-sm text-[var(--color-text-primary)]">
                          {formatDate(reservationDetails.originalPricing.paidAt)}
                        </p>
                      </div>
                    )}
                  </>
                )}
                {reservationDetails.refundStatus && reservationDetails.refundStatus !== 'none' && (
                  <>
                    <div>
                      <p className="text-sm text-[var(--color-text-secondary)] mb-1">Refund Status</p>
                      <p className="text-sm text-[var(--color-text-primary)] capitalize">{reservationDetails.refundStatus}</p>
                    </div>
                    {reservationDetails.refundedAmount && (
                      <div>
                        <p className="text-sm text-[var(--color-text-secondary)] mb-1">Refunded Amount</p>
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">
                          {formatPrice(reservationDetails.refundedAmount)}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Additional Charges Section */}
        {reservationDetails.charges && reservationDetails.charges.length > 0 && (
          <div className="border border-[var(--color-border)] rounded-lg">
            <button
              onClick={() => toggleSection('charges')}
              className="w-full flex items-center justify-between p-4 hover:bg-[var(--color-bg-secondary)] transition-colors"
            >
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Additional Charges ({reservationDetails.charges.length})
              </h3>
              {expandedSections.charges ? (
                <ChevronUp className="w-5 h-5 text-[var(--color-text-secondary)]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[var(--color-text-secondary)]" />
              )}
            </button>
            {expandedSections.charges && (
              <div className="p-4 pt-0 space-y-3">
                <div className="space-y-2">
                  {reservationDetails.charges.map((charge) => (
                    <div key={charge.chargeId} className="p-3 bg-[var(--color-bg-secondary)] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[var(--color-text-primary)]">{charge.description}</span>
                        <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                          {formatPrice(charge.amount)} {charge.currency}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                        <span className="capitalize">{charge.chargeType.replace('_', ' ')}</span>
                        <span>{charge.isPaid ? 'Paid' : 'Unpaid'}</span>
                        {charge.paidAt && <span>{formatDate(charge.paidAt)}</span>}
                      </div>
                    </div>
                  ))}
                </div>
                {reservationDetails.totalCharges !== undefined && (
                  <div className="pt-2 border-t border-[var(--color-border)]">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[var(--color-text-primary)]">Total Charges</span>
                      <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                        {formatPrice(reservationDetails.totalCharges)}
                      </span>
                    </div>
                    {reservationDetails.unpaidCharges !== undefined && reservationDetails.unpaidCharges > 0 && (
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-[var(--color-text-secondary)]">Unpaid</span>
                        <span className="text-sm text-[var(--color-text-secondary)]">
                          {formatPrice(reservationDetails.unpaidCharges)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Modification History Section */}
        {reservationDetails.modifications && reservationDetails.modifications.length > 0 && (
          <div className="border border-[var(--color-border)] rounded-lg">
            <button
              onClick={() => toggleSection('modifications')}
              className="w-full flex items-center justify-between p-4 hover:bg-[var(--color-bg-secondary)] transition-colors"
            >
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Modification History ({reservationDetails.modifications.length})
              </h3>
              {expandedSections.modifications ? (
                <ChevronUp className="w-5 h-5 text-[var(--color-text-secondary)]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[var(--color-text-secondary)]" />
              )}
            </button>
            {expandedSections.modifications && (
              <div className="p-4 pt-0 space-y-3">
                <div className="space-y-2">
                  {reservationDetails.modifications.map((mod) => (
                    <div key={mod.modificationId} className="p-3 bg-[var(--color-bg-secondary)] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[var(--color-text-primary)] capitalize">
                          {mod.modificationType.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-[var(--color-text-secondary)]">
                          {formatDate(mod.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--color-text-primary)] mb-1">{mod.description}</p>
                      {mod.previousValue && mod.newValue && (
                        <div className="text-xs text-[var(--color-text-secondary)]">
                          <span className="line-through">{mod.previousValue}</span>
                          {' → '}
                          <span>{mod.newValue}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Placeholder sections for other details */}
        <div className="text-sm text-[var(--color-text-secondary)] text-center py-8">
          More sections (Trip Details, Passengers, Itinerary, Vehicles, Amenities, Driver) will be added in the next iteration.
        </div>
      </div>
    </div>
  );
};

