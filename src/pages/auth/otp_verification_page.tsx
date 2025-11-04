import { OtpVerificationForm } from '../../components/auth/otp_verification_form';

export const OtpVerificationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-(--color-bg-primary) flex items-center justify-center px-4 py-12">
      <OtpVerificationForm />
    </div>
  );
};

