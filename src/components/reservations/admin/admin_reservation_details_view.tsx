import React, { useState } from 'react';
import { AdminReservationDetailsHeader } from './admin_reservation_details_header';
import { BasicInfoSection } from './details/basic_info_section';
import { UserInfoSection } from './details/user_info_section';
import { TripDetailsSection } from './details/trip_details_section';
import { PassengersSection } from './details/passengers_section';
import { ItinerarySection } from './details/itinerary_section';
import { VehiclesSection } from './details/vehicles_section';
import { AmenitiesSection } from './details/amenities_section';
import { DriverSection } from './details/driver_section';
import { PaymentSection } from './details/payment_section';
import { ChargesSection } from './details/charges_section';
import { ModificationsSection } from './details/modifications_section';
import { AddPassengersModal } from './modals/add_passengers_modal';
import { ChangeDriverModal } from './modals/change_driver_modal';
import { AdjustVehiclesModal } from './modals/adjust_vehicles_modal';
import { UpdateItineraryModal } from './modals/update_itinerary_modal';
import { ProcessRefundModal } from './modals/process_refund_modal';
import { CancelReservationModal } from './modals/cancel_reservation_modal';
import { AddChargeModal } from './modals/add_charge_modal';
import { useAddPassengers } from '../../../hooks/reservations/use_add_passengers';
import { useChangeDriver } from '../../../hooks/reservations/use_change_driver';
import { useAdjustVehicles } from '../../../hooks/reservations/use_adjust_vehicles';
import { useUpdateItinerary } from '../../../hooks/reservations/use_update_itinerary';
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
    basicInfo: false,
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
  const [showUpdateItineraryModal, setShowUpdateItineraryModal] = useState(false);
  const [showProcessRefundModal, setShowProcessRefundModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAddChargeModal, setShowAddChargeModal] = useState(false);

  // Hooks for actions
  const { addPassengers, isLoading: isAddingPassengers } = useAddPassengers();
  const { changeDriver, isLoading: isChangingDriver } = useChangeDriver();
  const { adjustVehicles, isLoading: isAdjustingVehicles } = useAdjustVehicles();
  const { updateItinerary, isLoading: isUpdatingItinerary } = useUpdateItinerary();
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

  const handleUpdateItinerary = async (data: import('../../../types/reservations/admin_reservation').UpdateReservationItineraryRequest) => {
    const result = await updateItinerary(reservationDetails.reservationId, data);
    if (result) {
      toast.success('Itinerary updated successfully');
      setShowUpdateItineraryModal(false);
      if (onRefetch) {
        await onRefetch();
      }
    } else {
      toast.error('Failed to update itinerary');
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
    <React.Fragment>
      <div className="flex flex-col h-full min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
        {/* Header with Back Button and Status Control */}
        <AdminReservationDetailsHeader
        reservationDetails={reservationDetails}
        isUpdatingStatus={isUpdatingStatus}
        onBack={onBack}
        onStatusChange={onStatusChange}
        availableStatuses={availableStatuses}
        onAddPassengers={() => setShowAddPassengersModal(true)}
        onChangeDriver={() => setShowChangeDriverModal(true)}
        onAdjustVehicles={() => setShowAdjustVehiclesModal(true)}
        onUpdateItinerary={() => setShowUpdateItineraryModal(true)}
        onProcessRefund={() => setShowProcessRefundModal(true)}
        onCancel={() => setShowCancelModal(true)}
        onAddCharge={() => setShowAddChargeModal(true)}
      />

      {/* Scrollable Content Area with Accordions */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-6">
        <BasicInfoSection
          reservationDetails={reservationDetails}
          isExpanded={expandedSections.basicInfo}
          onToggle={() => toggleSection('basicInfo')}
        />

        <UserInfoSection
          reservationDetails={reservationDetails}
          isExpanded={expandedSections.userInfo}
          onToggle={() => toggleSection('userInfo')}
        />

        <TripDetailsSection
          reservationDetails={reservationDetails}
          isExpanded={expandedSections.tripDetails}
          onToggle={() => toggleSection('tripDetails')}
        />

        <PassengersSection
          reservationDetails={reservationDetails}
          isExpanded={expandedSections.passengers}
          onToggle={() => toggleSection('passengers')}
        />

        <ItinerarySection
          reservationDetails={reservationDetails}
          isExpanded={expandedSections.itinerary}
          onToggle={() => toggleSection('itinerary')}
        />

        <VehiclesSection
          reservationDetails={reservationDetails}
          isExpanded={expandedSections.vehicles}
          onToggle={() => toggleSection('vehicles')}
        />

        <AmenitiesSection
          reservationDetails={reservationDetails}
          isExpanded={expandedSections.amenities}
          onToggle={() => toggleSection('amenities')}
        />

        <DriverSection
          reservationDetails={reservationDetails}
          isExpanded={expandedSections.driver}
          onToggle={() => toggleSection('driver')}
          onChangeDriverClick={() => setShowChangeDriverModal(true)}
        />

        <PaymentSection
          reservationDetails={reservationDetails}
          isExpanded={expandedSections.payment}
          onToggle={() => toggleSection('payment')}
        />

        <ChargesSection
          reservationDetails={reservationDetails}
          isExpanded={expandedSections.charges}
          onToggle={() => toggleSection('charges')}
          onRefetch={onRefetch}
        />

        <ModificationsSection
          reservationDetails={reservationDetails}
          isExpanded={expandedSections.modifications}
          onToggle={() => toggleSection('modifications')}
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

      <UpdateItineraryModal
        isOpen={showUpdateItineraryModal}
        onClose={() => setShowUpdateItineraryModal(false)}
        onUpdate={handleUpdateItinerary}
        isLoading={isUpdatingItinerary}
        reservationDetails={reservationDetails}
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
    </React.Fragment>
  );
};

