import { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, MessageSquare, FileText, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../common/ui/button';
import { useCreateTicket } from '../../hooks/support/use_create_ticket';
import { useQuotesDropdown } from '../../hooks/quotes/use_quotes_dropdown';
import { useReservationsDropdown } from '../../hooks/reservations/use_reservations_dropdown';
import { LinkedEntityType, ActorType, TicketPriority, type LinkedEntityTypeType, type TicketPriorityType } from '../../types/support/ticket';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { sanitizeErrorMessage } from '../../utils/error_sanitizer';
import { useAppSelector } from '../../store/hooks';
import { cn } from '../../utils/cn';
import { StatusBadge } from '../quotes/quote_status_badge';
import { ReservationStatusBadge } from '../reservations/reservation_status_badge';

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: LinkedEntityTypeType | 'general';
  initialEntityId?: string;
}

// Simplified to 2 steps
type ModalStep = 'category' | 'details';

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  initialCategory,
  initialEntityId,
}) => {
  const location = useLocation();
  const [step, setStep] = useState<ModalStep>('category');
  const [category, setCategory] = useState<LinkedEntityTypeType | 'general' | null>(initialCategory || null);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(initialEntityId || null);
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<TicketPriorityType>(TicketPriority.MEDIUM);

  const [showEntityDropdown, setShowEntityDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const entityDropdownRef = useRef<HTMLDivElement>(null);
  const priorityDropdownRef = useRef<HTMLDivElement>(null);

  const { createTicket, isLoading } = useCreateTicket();
  const { user } = useAppSelector((state) => state.auth);

  // Fetching data - only if category is quote/res and we are on details step
  const isQuote = category === LinkedEntityType.QUOTE;
  const isRes = category === LinkedEntityType.RESERVATION;
  
  const { data: quotes = [], isLoading: isLoadingQuotes } = useQuotesDropdown(isQuote && step === 'details');
  const { data: reservations = [], isLoading: isLoadingReservations } = useReservationsDropdown(isRes && step === 'details');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (entityDropdownRef.current && !entityDropdownRef.current.contains(event.target as Node)) {
        setShowEntityDropdown(false);
      }
      if (priorityDropdownRef.current && !priorityDropdownRef.current.contains(event.target as Node)) {
        setShowPriorityDropdown(false);
      }
    };
  
    if (showEntityDropdown || showPriorityDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEntityDropdown, showPriorityDropdown]);

  useEffect(() => {
    if (isOpen && !initialCategory) {
      const path = location.pathname;
      const searchParams = new URLSearchParams(location.search);
      
      // Check for quoteId in query params (quotes page uses ?quoteId=...)
      const quoteIdFromQuery = searchParams.get('quoteId');
      if (quoteIdFromQuery) {
        setCategory(LinkedEntityType.QUOTE);
        setSelectedEntityId(quoteIdFromQuery);
        setStep('details');
        return;
      }

      // Check for reservatoinId in query params (reservations page uses ?reservationId=...)
      const reservationIdFromQuery = searchParams.get('reservationId');
      if (reservationIdFromQuery) {
        setCategory(LinkedEntityType.RESERVATION);
        setSelectedEntityId(reservationIdFromQuery);
        setStep('details');
        return;
      }
      
      // Check for quoteId in path (e.g., /quotes/:id)
      if (path.includes('/quotes/') && path.split('/quotes/')[1]) {
        const quoteId = path.split('/quotes/')[1].split('/')[0];
        if (quoteId && !quoteId.includes('?')) {
          setCategory(LinkedEntityType.QUOTE);
          setSelectedEntityId(quoteId);
          setStep('details');
          return;
        }
      }
      
      // Check for reservationId in path (e.g., /reservations/:id)
      if (path.includes('/reservations/') && path.split('/reservations/')[1]) {
        const reservationId = path.split('/reservations/')[1].split('/')[0];
        if (reservationId && !reservationId.includes('?')) {
          setCategory(LinkedEntityType.RESERVATION);
          setSelectedEntityId(reservationId);
          setStep('details');
          return;
        }
      }
    }
  }, [isOpen, location.pathname, location.search, initialCategory]);

  const handleCategorySelect = (selectedCategory: LinkedEntityTypeType | 'general') => {
    setCategory(selectedCategory);
    setStep('details');
  };

  const handleSubmit = async () => {
    if (!message.trim()) return toast.error('Please enter a message');
    // Allow submission even without selecting a specific entity (category-only tickets are allowed)

    try {
      const subject = getSubjectPreview();
      await createTicket({
        actorType: ActorType.USER,
        actorId: user?.userId || '',
        subject,
        content: message.trim(),
        linkedEntityType: category !== 'general' ? category : null,
        linkedEntityId: selectedEntityId || null,
        priority,
      });
      toast.success('Support ticket created successfully!');
      onClose();
    } catch (error) {
      toast.error(sanitizeErrorMessage(error));
    }
  };

  const getSubjectPreview = () => {
    if (isQuote && selectedEntityId) {
      const q = quotes.find(i => i.quoteId === selectedEntityId);
      return `Support for Quote: ${q?.tripName || selectedEntityId}`;
    }
    if (isRes && selectedEntityId) {
      const r = reservations.find(i => i.reservationId === selectedEntityId);
      return `Support for Reservation: ${r?.tripName || selectedEntityId}`;
    }
    // Category selected but no specific entity
    if (category === LinkedEntityType.QUOTE) {
      return 'Support for Quote';
    }
    if (category === LinkedEntityType.RESERVATION) {
      return 'Support for Reservation';
    }
    return 'General Support Request';
  };

  const getSelectedEntityLabel = () => {
    if (!selectedEntityId) return 'Select an option...';
    
    if (category === LinkedEntityType.QUOTE) {
      const quote = quotes.find(q => q.quoteId === selectedEntityId);
      if (!quote) return 'Select an option...';
      return (
        <div className="flex items-center gap-2">
          <span className="truncate">{quote.tripName}</span>
          <StatusBadge status={quote.status} />
        </div>
      );
    } else if (category === LinkedEntityType.RESERVATION) {
      const reservation = reservations.find(r => r.reservationId === selectedEntityId);
      if (!reservation) return 'Select an option...';
      return (
        <div className="flex items-center gap-2">
          <span className="truncate">{reservation.tripName}</span>
          <ReservationStatusBadge status={reservation.status} />
        </div>
      );
    }
    
    return 'Select an option...';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-[var(--color-bg-card)] rounded-lg shadow-xl w-full max-w-2xl flex flex-col border border-[var(--color-border)] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            {step === 'details' && !initialCategory && (
              <button onClick={() => setStep('category')} className="p-2 hover:bg-[var(--color-bg-hover)] rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-[var(--color-text-secondary)]" />
              </button>
            )}
            <h2 className="text-lg font-bold">Contact Support</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[var(--color-bg-hover)] rounded-full"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 'category' ? (
            /* STEP 1: CATEGORY SELECTION */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CategoryCard icon={<HelpCircle/>} title="General" desc="General questions" onClick={() => handleCategorySelect('general')} />
              <CategoryCard icon={<FileText/>} title="Quote" desc="Questions about a quote" onClick={() => handleCategorySelect(LinkedEntityType.QUOTE)} />
              <CategoryCard icon={<MessageSquare/>} title="Reservation" desc="Questions about a reservation" onClick={() => handleCategorySelect(LinkedEntityType.RESERVATION)} />
            </div>
          ) : (
            /* STEP 2: DETAILS (DROPDOWN + MESSAGE) */
            <div className="space-y-6">
              {category !== 'general' && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select {category === LinkedEntityType.QUOTE ? 'Quote' : 'Reservation'}
                  </label>
                  <div className="relative" ref={entityDropdownRef}>
                    <button
                      onClick={() => setShowEntityDropdown(!showEntityDropdown)}
                      disabled={isLoadingQuotes || isLoadingReservations}
                      className={cn(
                        'flex items-center justify-between w-full px-3 py-1.5 text-sm rounded-lg border transition-colors',
                        'bg-[var(--color-bg-secondary)] border-[var(--color-border)] text-[var(--color-text-primary)]',
                        'hover:bg-[var(--color-bg-hover)]',
                        (isLoadingQuotes || isLoadingReservations) && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <span className="truncate">
                        {isLoadingQuotes || isLoadingReservations ? 'Loading options...' : getSelectedEntityLabel()}
                      </span>
                      {showEntityDropdown ? (
                        <ChevronUp className="w-4 h-4 flex-shrink-0 ml-2" />
                      ) : (
                        <ChevronDown className="w-4 h-4 flex-shrink-0 ml-2" />
                      )}
                    </button>

                    {/* Entity Dropdown */}
                    {showEntityDropdown && !isLoadingQuotes && !isLoadingReservations && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 p-2 max-h-64 overflow-y-auto">
                        <div className="space-y-1">
                          {category === LinkedEntityType.QUOTE ? (
                            quotes.length === 0 ? (
                              <div className="px-2 py-1.5 text-sm text-[var(--color-text-secondary)] text-center">
                                No quotes found
                              </div>
                            ) : (
                              quotes.map((quote) => (
                                <button
                                  key={quote.quoteId}
                                  onClick={() => {
                                    setSelectedEntityId(quote.quoteId);
                                    setShowEntityDropdown(false);
                                  }}
                                  className={cn(
                                    'w-full text-left px-2 py-1.5 rounded text-sm transition-colors',
                                    selectedEntityId === quote.quoteId
                                      ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium'
                                      : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]'
                                  )}
                                >
                                  {quote.tripName} <StatusBadge status={quote.status} />
                                </button>
                              ))
                            )
                          ) : (
                            reservations.length === 0 ? (
                              <div className="px-2 py-1.5 text-sm text-[var(--color-text-secondary)] text-center">
                                No reservations found
                              </div>
                            ) : (
                              reservations.map((reservation) => (
                                <button
                                  key={reservation.reservationId}
                                  onClick={() => {
                                    setSelectedEntityId(reservation.reservationId);
                                    setShowEntityDropdown(false);
                                  }}
                                   className={cn(
                                     'w-full text-left px-2 py-1.5 rounded text-sm transition-colors',
                                     selectedEntityId === reservation.reservationId
                                       ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium'
                                       : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]'
                                   )}
                                >
                                  {reservation.tripName} <ReservationStatusBadge status={reservation.status} />
                                </button>
                              ))
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <div className="relative" ref={priorityDropdownRef}>
                    <button
                      onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                      className={cn(
                        'flex items-center justify-between w-full px-3 py-1.5 text-sm rounded-lg border transition-colors',
                        'bg-[var(--color-bg-secondary)] border-[var(--color-border)] text-[var(--color-text-primary)]',
                        'hover:bg-[var(--color-bg-hover)]'
                      )}
                    >
                      <span className="capitalize">{priority}</span>
                      {showPriorityDropdown ? (
                        <ChevronUp className="w-4 h-4 shrink-0 ml-2" />
                      ) : (
                        <ChevronDown className="w-4 h-4 shrink-0 ml-2" />
                      )}
                    </button>

                    {/* Priority Dropdown */}
                    {showPriorityDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 p-2">
                        <div className="space-y-1">
                          {Object.values(TicketPriority).map((p) => (
                            <button
                              key={p}
                              onClick={() => {
                                setPriority(p);
                                setShowPriorityDropdown(false);
                              }}
                              className={cn(
                                'w-full text-left px-2 py-1.5 rounded text-sm transition-colors capitalize',
                                priority === p
                                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium'
                                  : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]'
                              )}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col justify-end">
                    <p className="text-sm text-[var(--color-text-secondary)]">Category: <span className="font-semibold text-[var(--color-text-primary)] capitalize">{category}</span></p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message <span className="text-red-500">*</span></label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you today?"
                  rows={6}
                  className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--color-border)] flex justify-end gap-3 bg-[var(--color-bg-hover)]/30">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          {step === 'details' && (
            <Button variant="primary" onClick={handleSubmit} loading={isLoading}>
              Submit Ticket
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper sub-component for the category buttons
const CategoryCard = ({ icon, title, desc, onClick }: CategoryCardProps) => (
  <button
    onClick={onClick}
    className="p-6 rounded-xl border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all text-left group"
  >
    <div className="text-[var(--color-primary)] mb-3 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="font-bold text-base">{title}</h3>
    <p className="text-sm text-[var(--color-text-secondary)]">{desc}</p>
  </button>
);