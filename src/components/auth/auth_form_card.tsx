import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { ROUTES } from '../../constants/routes';

interface AuthFormCardProps {
  title: string;
  subtitle?: string | ReactNode;
  showLogo?: boolean;
  logoLink?: string | boolean;
  children: ReactNode;
  className?: string;
}

/**
 * AuthFormCard Component
 * Reusable card wrapper for authentication forms with logo, header, and consistent styling
 * 
 * @example
 * <AuthFormCard 
 *   title="Welcome Back"
 *   subtitle="Sign in to continue"
 *   logoLink={ROUTES.home}
 * >
 *   <form>...</form>
 * </AuthFormCard>
 */
export const AuthFormCard: React.FC<AuthFormCardProps> = ({
  title,
  subtitle,
  showLogo = true,
  logoLink = true,
  children,
  className,
}) => {
  const logoUrl = typeof logoLink === 'string' ? logoLink : logoLink === true ? ROUTES.home : undefined;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className={`bg-(--color-bg-card) rounded-2xl shadow-xl p-6 md:p-8 ${className || ''}`}>
        {/* Logo */}
        {showLogo && (
          <div className="flex justify-center mb-6">
            {logoUrl ? (
              <Link to={logoUrl}>
                <img
                  src={logo}
                  alt="GrandLine Logo"
                  className="h-16 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
                />
              </Link>
            ) : (
              <img
                src={logo}
                alt="GrandLine Logo"
                className="h-16 w-auto object-contain"
              />
            )}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-(--color-text-primary) mb-2">
            {title}
          </h1>
          {subtitle && (
            <div className="text-sm md:text-base text-(--color-text-secondary)">
              {typeof subtitle === 'string' ? (
                <p>{subtitle}</p>
              ) : (
                subtitle
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
};

