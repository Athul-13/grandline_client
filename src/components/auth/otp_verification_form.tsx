import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../hooks/use_language';
import { authService } from '../../services/api/auth_service';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import { rateLimiter, resetRateLimit } from '../../utils/rate_limiter';
import { sanitizeErrorMessage, logErrorForDev } from '../../utils/error_sanitizer';
import { ROUTES } from '../../constants/routes';
import { AuthFormCard } from '../common/auth_form_card';

interface LocationState {
  email?: string;
}

export const OtpVerificationForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
  const email = (location.state as LocationState)?.email || '';
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(150); // 2:30 in seconds
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  // Format timer as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(0, 1);
    
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || '';
    }
    setOtp(newOtp);
    
    // Focus last filled input or first empty
    const lastIndex = pastedData.length - 1;
    const focusIndex = lastIndex >= 5 ? 5 : pastedData.length;
    inputRefs.current[focusIndex]?.focus();
  };

  // Verify OTP
  const handleVerify = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      toast.error(t('otp.incomplete'));
      return;
    }

    if (!email) {
      toast.error(t('otp.emailMissing'));
      return;
    }

    // Check rate limit
    const rateLimit = rateLimiter('verify-otp');
    if (!rateLimit.allowed) {
      toast.error(
        `Too many verification attempts. Please try again in ${rateLimit.retryAfter} seconds.`
      );
      return;
    }

    setIsVerifying(true);
    try {
      const result = await authService.verifyOtp({
        email,
        otp: otpString,
      });

      if (result.success) {
        // Reset rate limit on success
        resetRateLimit('verify-otp');
        toast.success(t('otp.verifySuccess'));
        navigate(ROUTES.login);
      } else {
        toast.error(result.message || t('otp.verifyError'));
      }
    } catch (error) {
      // Sanitize error message
      const sanitizedMessage = sanitizeErrorMessage(error);
      logErrorForDev(error, sanitizedMessage);
      toast.error(sanitizedMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (!email) {
      toast.error(t('otp.emailMissing'));
      return;
    }

    // Check rate limit for resend
    const rateLimit = rateLimiter('resend-otp');
    if (!rateLimit.allowed) {
      toast.error(
        `Too many resend attempts. Please try again in ${rateLimit.retryAfter} seconds.`
      );
      return;
    }

    try {
      const result = await authService.resendOtp({ email });
      if (result.success) {
        // Reset rate limit on success
        resetRateLimit('resend-otp');
        toast.success(t('otp.resendSuccess'));
        setTimeRemaining(150); // Reset timer to 2:30
        setOtp(['', '', '', '', '', '']); // Clear OTP inputs
        inputRefs.current[0]?.focus(); // Focus first input
      } else {
        toast.error(result.message || t('otp.resendError'));
      }
    } catch (error) {
      // Sanitize error message
      const sanitizedMessage = sanitizeErrorMessage(error);
      logErrorForDev(error, sanitizedMessage);
      toast.error(sanitizedMessage);
    }
  };

  // Redirect to login if no email
  useEffect(() => {
    if (!email) {
      navigate(ROUTES.login);
    }
  }, [email, navigate]);

  return (
    <AuthFormCard
      title={t('otp.title')}
      subtitle={
        <>
          <p className="mb-4">{t('otp.subtitle')}</p>
          {timeRemaining > 0 && (
            <p className="text-sm font-medium text-(--color-text-primary)">
              {t('otp.timeRemaining')}: {formatTime(timeRemaining)}
            </p>
          )}
        </>
      }
      showLogo={true}
      logoLink={false}
    >

        {/* OTP Input Fields */}
        <div className="flex justify-center gap-3 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={cn(
                'w-12 h-14 text-center text-2xl font-bold',
                'border-2 rounded-lg',
                'text-(--color-text-primary)',
                'focus:outline-none focus:ring-2 focus:ring-(--color-primary)',
                'transition-all',
                digit
                  ? 'border-(--color-primary) bg-(--color-bg-primary)'
                  : 'border-(--color-border) bg-(--color-bg-primary)'
              )}
              disabled={isVerifying}
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          type="button"
          onClick={handleVerify}
          disabled={isVerifying || otp.join('').length !== 6}
          className={cn(
            'w-full py-3 rounded-lg font-bold text-white',
            'bg-(--color-primary) hover:bg-(--color-primary-hover)',
            'shadow-md hover:shadow-lg',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            isVerifying && 'animate-pulse'
          )}
        >
          {isVerifying ? t('otp.verifying') : t('otp.verifyButton')}
        </button>

        {/* Resend Code */}
        <div className="mt-6 text-center">
          <p className="text-sm text-(--color-text-secondary)">
            {t('otp.didntReceive')}{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={isVerifying}
              className={cn(
                'font-bold text-(--color-primary) hover:text-(--color-primary-hover)',
                'transition-colors disabled:opacity-50'
              )}
            >
              {t('otp.resendCode')}
            </button>
          </p>
        </div>
    </AuthFormCard>
  );
};

