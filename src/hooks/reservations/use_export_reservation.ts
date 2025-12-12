import { useState } from 'react';
import { adminReservationService } from '../../services/api/admin_reservation_service';
import toast from 'react-hot-toast';

interface UseExportReservationReturn {
  exportPDF: (id: string) => Promise<void>;
  exportCSV: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useExportReservation = (): UseExportReservationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const exportPDF = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const blob = await adminReservationService.exportPDF(id);
      downloadBlob(blob, `reservation-${id}.pdf`);
      toast.success('Reservation exported to PDF successfully');
    } catch (err) {
      console.error('Failed to export PDF:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to export PDF';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const exportCSV = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const blob = await adminReservationService.exportCSV(id);
      downloadBlob(blob, `reservation-${id}.csv`);
      toast.success('Reservation exported to CSV successfully');
    } catch (err) {
      console.error('Failed to export CSV:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to export CSV';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    exportPDF,
    exportCSV,
    isLoading,
    error,
  };
};

