import { useState } from 'react';
import { Twitter, Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../../hooks/use_language';
import { cn } from '../../utils/cn';
import logo from '../../assets/logo.png';
import logoNavbar from '../../assets/logo_navbar.png';

export const HomeFooter: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="w-full bg-(--color-bg-footer) text-(--color-text-primary)">
      <div className="max-w-7xl mx-auto px-4 md:px-4 py-4 md:py-6">
        {/* Top Section: Three Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-(--color-border-footer)">
          {/* About GRANDLINE Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-(--color-text-primary) mb-3">
              {t('footer.about.title')}
            </h3>
            <nav className="flex flex-col space-y-2.5">
              <a
                href="#"
                className="text-(--color-text-secondary) hover:text-(--color-primary) transition-colors duration-200 text-sm"
              >
                {t('footer.about.us')}
              </a>
              <a
                href="#"
                className="text-(--color-text-secondary) hover:text-(--color-primary) transition-colors duration-200 text-sm"
              >
                {t('footer.about.blog')}
              </a>
              <a
                href="#"
                className="text-(--color-text-secondary) hover:text-(--color-primary) transition-colors duration-200 text-sm"
              >
                {t('footer.about.operations')}
              </a>
            </nav>
          </div>

          {/* Our Fleet Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-(--color-text-primary) mb-3">
              {t('footer.fleet.title')}
            </h3>
            <nav className="flex flex-col space-y-2.5">
              <a
                href="#"
                className="text-(--color-text-secondary) hover:text-(--color-primary) transition-colors duration-200 text-sm"
              >
                {t('footer.fleet.coach')}
              </a>
              <a
                href="#"
                className="text-(--color-text-secondary) hover:text-(--color-primary) transition-colors duration-200 text-sm"
              >
                {t('footer.fleet.mini')}
              </a>
              <a
                href="#"
                className="text-(--color-text-secondary) hover:text-(--color-primary) transition-colors duration-200 text-sm"
              >
                {t('footer.fleet.school')}
              </a>
              <a
                href="#"
                className="text-(--color-text-secondary) hover:text-(--color-primary) transition-colors duration-200 text-sm"
              >
                {t('footer.fleet.sprinter')}
              </a>
            </nav>
          </div>

          {/* Site Info Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-(--color-text-primary) mb-3">
              {t('footer.site.title')}
            </h3>
            <div className="flex flex-col space-y-2.5 text-sm">
              <a
                href={`tel:${t('footer.site.phone')}`}
                className="flex items-center gap-2 text-(--color-text-secondary) hover:text-(--color-primary) transition-colors duration-200"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>{t('footer.site.phone')}</span>
              </a>
              <a
                href={`mailto:${t('footer.site.email')}`}
                className="flex items-center gap-2 text-(--color-text-secondary) hover:text-(--color-primary) transition-colors duration-200"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span>{t('footer.site.email')}</span>
              </a>
              <div className="flex items-start gap-2 text-(--color-text-secondary)">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span>{t('footer.site.addressLine1')}</span>
                  <span>{t('footer.site.addressLine2')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter and Social Media Section */}
         <div className="mb-6 pb-6 border-b border-(--color-border-footer)">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Newsletter Section */}
            <div className="flex-1 max-w-xl">
              <h3 className="font-semibold text-base mb-2">{t('footer.newsletter.title')}</h3>
              <p className="text-sm text-(--color-text-secondary) mb-3">
                {t('footer.newsletter.description')}
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.newsletter.placeholder')}
                  className={cn(
                    'flex-1 px-4 py-2 rounded-lg',
                    'bg-(--color-bg-card) border border-(--color-border)',
                    'text-(--color-text-primary) placeholder-(--color-text-muted)',
                    'focus:outline-none focus:border-(--color-primary)',
                    'transition-colors text-sm'
                  )}
                  required
                />
                <button
                  onClick={handleNewsletterSubmit}
                  className={cn(
                    'px-6 py-2 rounded-lg font-medium text-sm',
                    'border-2 border-(--color-text-primary)',
                    'text-(--color-text-primary)',
                    'hover:border-(--color-primary) hover:text-(--color-primary)',
                    'transition-colors'
                  )}
                >
                  {t('footer.newsletter.button')}
                </button>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="flex flex-col items-start md:items-end">
              <h3 className="font-semibold text-base mb-3">{t('footer.connect.title')}</h3>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      className={cn(
                        'w-9 h-9 flex items-center justify-center rounded-full',
                        'bg-(--color-bg-card) text-(--color-text-primary)',
                        'hover:bg-(--color-primary) hover:text-white',
                        'transition-all duration-200'
                      )}
                      aria-label={social.label}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Logo and Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="GrandLine Logo" className="h-10 w-auto object-contain" />
            <img
              src={logoNavbar}
              alt="GrandLine Navbar Logo"
              className="h-6 w-auto object-contain"
            />
          </div>

          {/* Copyright */}
          <p className="text-sm text-(--color-text-secondary)">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

