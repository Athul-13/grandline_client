import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { AdminReservationDetailsHeader } from './admin_reservation_details_header';
import { ReservationStatusBadge } from '../reservation_status_badge';
import { formatDate, formatPrice, getTripTypeLabel } from '../../../utils/quote_formatters';
import { TripDetailsSection } from './details/trip_details_section';
import { PassengersSection } from './details/passengers_section';
import { ItinerarySection } from './details/itinerary_section';
import { VehiclesSection } from './details/vehicles_section';
import { AmenitiesSection } from './details/amenities_section';
import { DriverSection } from './details/driver_section';
import { AddPassengersModal } from './modals/add_passengers_modal';
import { ChangeDriverModal } from './modals/change_driver_modal';
import { AdjustVehiclesModal } from './modals/adjust_vehicles_modal';
import { ProcessRefundModal } from './modals/process_refund_modal';
import { CancelReservationModal } from './modals/cancel_reservation_modal';
import { AddChargeModal } from './modals/add_charge_modal';
import { useAddPassengers } from '../../../hooks/reservations/use_add_passengers';
import { useChangeDriver } from '../../../hooks/reservations/use_change_driver';
import { useAdjustVehicles } from '../../../hooks/reservations/use_adjust_vehicles';
import { useProcessRefund } from '../../../hooks/reservations/use_process_refund';
import { useCancelReservation } from '../../../hooks/reservations/use_cancel_reservation';
import { useAddCharge } from '../../../hooks/reservations/use_add_charge';
import toast from 'react-hot-toast';
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

  // Modal states
  const [showAddPassengersModal, setShowAddPassengersModal] = useState(false);
  const [showChangeDriverModal, setShowChangeDriverModal] = useState(false);
  const [showAdjustVehiclesModal, setShowAdjustVehiclesModal] = useState(false);
  const [showProcessRefundModal, setShowProcessRefundModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAddChargeModal, setShowAddChargeModal] = useState(false);

  // Hooks for actions
  const { addPassengers, isLoading: isAddingPassengers } = useAddPassengers();
  const { changeDriver, isLoading: isChangingDriver } = useChangeDriver();
  const { adjustVehicles, isLoading: isAdjustingVehicles } = useAdjustVehicles();
  const { processRefund, isLoading: isProcessingRefund } = useProcessRefund();
  const { cancelReservation, isLoading: isCancelling } = useCancelReservation();
  const { addCharge, isLoading: isAddingCharge } = useAddCharge();

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

  // Action handlers
  const handleAddPassengers = async (passengers: Array<{ fullName: string; phoneNumber: string; age: number }>) => {
    const result = await addPassengers(reservationDetails.reservationId, { passengers });
    if (result) {
      toast.success('Passengers added successfully');
      setShowAddPassengersModal(false);
      if (onRefetch) {
        await onRefetch();
      }
    } else {
      toast.error('Failed to add passengers');
    }
  };

  const handleChangeDriver = async (driverId: string, reason?: string) => {
    const result = await changeDriver(reservationDetails.reservationId, { driverId, reason });
    if (result) {
      toast.success('Driver changed successfully');
      setShowChangeDriverModal(false);
      if (onRefetch) {
        await onRefetch();
      }
    } else {
      toast.error('Failed to change driver');
    }
  };

  const handleAdjustVehicles = async (vehicles: Array<{ vehicleId: string; quantity: number }>) => {
    const result = await adjustVehicles(reservationDetails.reservationId, { vehicles });
    if (result) {
      toast.success('Vehicles adjusted successfully');
      setShowAdjustVehiclesModal(false);
      if (onRefetch) {
        await onRefetch();
      }
    } else {
      toast.error('Failed to adjust vehicles');
    }
  };

  const handleProcessRefund = async (amount: number, reason?: string) => {
    const result = await processRefund(reservationDetails.reservationId, { amount, reason });
    if (result) {
      toast.success(`Refund of ${amount} processed successfully`);
      setShowProcessRefundModal(false);
      if (onRefetch) {
        await onRefetch();
      }
    } else {
      toast.error('Failed to process refund');
    }
  };

  const handleCancel = async (reason: string) => {
    const result = await cancelReservation(reservationDetails.reservationId, { reason });
    if (result) {
      toast.success('Reservation cancelled successfully');
      setShowCancelModal(false);
      if (onRefetch) {
        await onRefetch();
      }
    } else {
      toast.error('Failed to cancel reservation');
    }
  };

  const handleAddCharge = async (chargeType: string, description: string, amount: number, currency?: string) => {
    const result = await addCharge(reservationDetails.reservationId, {
      chargeType: chargeType as 'additional_passenger' | 'vehicle_upgrade' | 'amenity_add' | 'late_fee' | 'other',
      description,
      amount,
      currency,
    });
    if (result) {
      toast.success('Charge added successfully');
      setShowAddChargeModal(false);
      if (onRefetch) {
        await onRefetch();
      }
    } else {
      toast.error('Failed to add charge');
    }
  };

  // Calculate max refund amount
  const maxRefundAmount = reservationDetails.originalPricing?.total || 0;
  const currency = reservationDetails.originalPricing?.currency || 'INR';

  return (
    <div className="flex flex-col h-full min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] overflow-hidden">
      {/* Header */}
      <AdminReservationDetailsHeader
        reservationDetails={reservationDetails}
        isUpdatingStatus={isUpdatingStatus}
        onBack={onBack}
        onStatusChange={onStatusChange}
        availableStatuses={availableStatuses}
        onAddPassengers={() => setShowAddPassengersModal(true)}
        onChangeDriver={() => setShowChangeDriverModal(true)}
        onAdjustVehicles={() => setShowAdjustVehiclesModal(true)}
        onProcessRefund={() => setShowProcessRefundModal(true)}
        onCancel={() => setShowCancelModal(true)}
        onAddCharge={() => setShowAddChargeModal(true)}
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

        {/* Trip Details Section */}
        <div className="border border-[var(--color-border)] rounded-lg">
          <TripDetailsSection
            reservationDetails={reservationDetails}
            isExpanded={expandedSections.tripDetails}
            onToggle={() => toggleSection('tripDetails')}
          />
        </div>

        {/* Passengers Section */}
        <div className="border border-[var(--color-border)] rounded-lg">
          <PassengersSection
            reservationDetails={reservationDetails}
            isExpanded={expandedSections.passengers}
            onToggle={() => toggleSection('passengers')}
          />
        </div>

        {/* Itinerary Section */}
        <div className="border border-[var(--color-border)] rounded-lg">
          <ItinerarySection
            reservationDetails={reservationDetails}
            isExpanded={expandedSections.itinerary}
            onToggle={() => toggleSection('itinerary')}
          />
        </div>

        {/* Vehicles Section */}
        <div className="border border-[var(--color-border)] rounded-lg">
          <VehiclesSection
            reservationDetails={reservationDetails}
            isExpanded={expandedSections.vehicles}
            onToggle={() => toggleSection('vehicles')}
          />
        </div>

        {/* Amenities Section */}
        <div className="border border-[var(--color-border)] rounded-lg">
          <AmenitiesSection
            reservationDetails={reservationDetails}
            isExpanded={expandedSections.amenities}
            onToggle={() => toggleSection('amenities')}
          />
        </div>

        {/* Driver Section */}
        <div className="border border-[var(--color-border)] rounded-lg">
          <DriverSection
            reservationDetails={reservationDetails}
            isExpanded={expandedSections.driver}
            onToggle={() => toggleSection('driver')}
            onChangeDriverClick={() => setShowChangeDriverModal(true)}
          />
        </div>
      </div>

      {/* Modals */}
      <AddPassengersModal
        isOpen={showAddPassengersModal}
        onClose={() => setShowAddPassengersModal(false)}
        onAdd={handleAddPassengers}
        isLoading={isAddingPassengers}
      />

      <ChangeDriverModal
        isOpen={showChangeDriverModal}
        onClose={() => setShowChangeDriverModal(false)}
        onChange={handleChangeDriver}
        isLoading={isChangingDriver}
        currentDriverId={reservationDetails.assignedDriverId}
      />

      <AdjustVehiclesModal
        isOpen={showAdjustVehiclesModal}
        onClose={() => setShowAdjustVehiclesModal(false)}
        onAdjust={handleAdjustVehicles}
        isLoading={isAdjustingVehicles}
        currentVehicles={reservationDetails.selectedVehicles}
      />

      <ProcessRefundModal
        isOpen={showProcessRefundModal}
        onClose={() => setShowProcessRefundModal(false)}
        onRefund={handleProcessRefund}
        isLoading={isProcessingRefund}
        maxRefundAmount={maxRefundAmount}
        currency={currency}
      />

      <CancelReservationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onCancel={handleCancel}
        isLoading={isCancelling}
      />

      <AddChargeModal
        isOpen={showAddChargeModal}
        onClose={() => setShowAddChargeModal(false)}
        onAdd={handleAddCharge}
        isLoading={isAddingCharge}
      />
    </div>
  );
};

