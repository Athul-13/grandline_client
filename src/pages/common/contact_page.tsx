import { useState } from 'react';
import { HomeNavbar } from '../../components/home/home_navbar';
import { HomeFooter } from '../../components/home/home_footer';
import { useLanguage } from '../../hooks/use_language';
import { cn } from '../../utils/cn';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import officeMapImage from '../../assets/img/7.png';

export const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    toast.success(t('contact.form.success'));
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: t('contact.info.phone.title'),
      content: t('contact.info.phone.content'),
      link: `tel:${t('contact.info.phone.content')}`,
    },
    {
      icon: Mail,
      title: t('contact.info.email.title'),
      content: t('contact.info.email.content'),
      link: `mailto:${t('contact.info.email.content')}`,
    },
    {
      icon: MapPin,
      title: t('contact.info.address.title'),
      content: t('contact.info.address.content'),
      link: '#',
    },
    {
      icon: Clock,
      title: t('contact.info.hours.title'),
      content: t('contact.info.hours.content'),
      link: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-(--color-bg-primary) text-(--color-text-primary) flex flex-col">
      <HomeNavbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 px-4 bg-(--color-bg-secondary)">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {t('contact.hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-(--color-text-secondary) max-w-3xl mx-auto">
              {t('contact.hero.subtitle')}
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16 px-4 -mt-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <a
                    key={index}
                    href={info.link}
                    className={cn(
                      'p-6 rounded-xl bg-(--color-bg-card)',
                      'border border-(--color-border)',
                      'hover:shadow-lg transition-all duration-200',
                      'hover:border-(--color-primary)',
                      'text-center'
                    )}
                  >
                    <div className="w-12 h-12 bg-(--color-primary-light) rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-(--color-primary)" />
                    </div>
                    <h3 className="font-semibold mb-2">{info.title}</h3>
                    <p className="text-sm text-(--color-text-secondary)">{info.content}</p>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Form & Map Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold mb-6">{t('contact.form.title')}</h2>
                <p className="text-(--color-text-secondary) mb-8">
                  {t('contact.form.subtitle')}
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      {t('contact.form.name')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={cn(
                        'w-full px-4 py-3 rounded-lg',
                        'bg-(--color-bg-card) border border-(--color-border)',
                        'text-(--color-text-primary)',
                        'focus:outline-none focus:border-(--color-primary)',
                        'transition-colors'
                      )}
                      placeholder={t('contact.form.namePlaceholder')}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      {t('contact.form.email')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={cn(
                        'w-full px-4 py-3 rounded-lg',
                        'bg-(--color-bg-card) border border-(--color-border)',
                        'text-(--color-text-primary)',
                        'focus:outline-none focus:border-(--color-primary)',
                        'transition-colors'
                      )}
                      placeholder={t('contact.form.emailPlaceholder')}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      {t('contact.form.phone')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={cn(
                        'w-full px-4 py-3 rounded-lg',
                        'bg-(--color-bg-card) border border-(--color-border)',
                        'text-(--color-text-primary)',
                        'focus:outline-none focus:border-(--color-primary)',
                        'transition-colors'
                      )}
                      placeholder={t('contact.form.phonePlaceholder')}
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      {t('contact.form.subject')}
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className={cn(
                        'w-full px-4 py-3 rounded-lg',
                        'bg-(--color-bg-card) border border-(--color-border)',
                        'text-(--color-text-primary)',
                        'focus:outline-none focus:border-(--color-primary)',
                        'transition-colors'
                      )}
                    >
                      <option value="">{t('contact.form.subjectPlaceholder')}</option>
                      <option value="booking">{t('contact.form.options.booking')}</option>
                      <option value="support">{t('contact.form.options.support')}</option>
                      <option value="feedback">{t('contact.form.options.feedback')}</option>
                      <option value="other">{t('contact.form.options.other')}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      {t('contact.form.message')}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className={cn(
                        'w-full px-4 py-3 rounded-lg',
                        'bg-(--color-bg-card) border border-(--color-border)',
                        'text-(--color-text-primary)',
                        'focus:outline-none focus:border-(--color-primary)',
                        'transition-colors resize-none'
                      )}
                      placeholder={t('contact.form.messagePlaceholder')}
                    />
                  </div>
                  <button
                    type="submit"
                    className={cn(
                      'w-full bg-(--color-primary) hover:bg-(--color-primary-hover)',
                      'text-white font-bold py-4 px-8 rounded-lg',
                      'transition-all duration-200',
                      'hover:shadow-lg flex items-center justify-center gap-2'
                    )}
                  >
                    <Send className="w-5 h-5" />
                    {t('contact.form.submit')}
                  </button>
                </form>
              </div>

              {/* Map/Image Section */}
              <div>
                <h2 className="text-3xl font-bold mb-6">{t('contact.map.title')}</h2>
                <p className="text-(--color-text-secondary) mb-8">
                  {t('contact.map.subtitle')}
                </p>
                <div className="relative w-full h-96 rounded-2xl overflow-hidden bg-(--color-bg-secondary) border border-(--color-border) shadow-lg">
                  <img
                    src={officeMapImage}
                    alt="GrandLine office location map"
                    loading="lazy"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                </div>
                <div className="mt-6 p-6 rounded-xl bg-(--color-bg-card) border border-(--color-border)">
                  <div className="flex items-start gap-4">
                    <MessageSquare className="w-6 h-6 text-(--color-primary) shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">{t('contact.map.info.title')}</h3>
                      <p className="text-sm text-(--color-text-secondary)">
                        {t('contact.map.info.description')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
};
