import { Link } from 'react-router-dom';
import { HomeNavbar } from '../../components/home/home_navbar';
import { HomeFooter } from '../../components/home/home_footer';
import { useLanguage } from '../../hooks/use_language';
import { cn } from '../../utils/cn';
import { Shield, Clock, Users, MapPin, Star, CheckCircle, ArrowRight } from 'lucide-react';
import bannerImage from '../../assets/img/1.png';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: t('home.features.safety.title'),
      description: t('home.features.safety.description'),
    },
    {
      icon: Clock,
      title: t('home.features.punctuality.title'),
      description: t('home.features.punctuality.description'),
    },
    {
      icon: Users,
      title: t('home.features.comfort.title'),
      description: t('home.features.comfort.description'),
    },
    {
      icon: MapPin,
      title: t('home.features.coverage.title'),
      description: t('home.features.coverage.description'),
    },
  ];

  const stats = [
    { value: t('home.stats.buses'), label: t('home.stats.busesLabel') },
    { value: t('home.stats.routes'), label: t('home.stats.routesLabel') },
    { value: t('home.stats.customers'), label: t('home.stats.customersLabel') },
    { value: t('home.stats.experience'), label: t('home.stats.experienceLabel') },
  ];

  const testimonials = [
    {
      name: t('home.testimonials.1.name'),
      text: t('home.testimonials.1.text'),
      rating: 5,
    },
    {
      name: t('home.testimonials.2.name'),
      text: t('home.testimonials.2.text'),
      rating: 5,
    },
    {
      name: t('home.testimonials.3.name'),
      text: t('home.testimonials.3.text'),
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-(--color-bg-primary) text-(--color-text-primary) flex flex-col">
      <HomeNavbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Text Content */}
              <div className="space-y-8 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  {t('hero.title')}
                </h1>
                <p className="text-lg md:text-xl text-(--color-text-secondary) max-w-2xl mx-auto lg:mx-0">
                  {t('hero.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to="/build-quote"
                    className={cn(
                      'bg-(--color-primary) hover:bg-(--color-primary-hover)',
                      'text-white font-bold py-4 px-8 rounded-lg shadow-lg',
                      'transition-all duration-200',
                      'hover:shadow-xl hover:-translate-y-1',
                      'text-center'
                    )}
                  >
                    {t('hero.bookButton')}
                  </Link>
                  <Link
                    to="/fleet"
                    className={cn(
                      'bg-(--color-bg-card) border-2 border-(--color-primary)',
                      'text-(--color-primary) font-bold py-4 px-8 rounded-lg',
                      'transition-all duration-200',
                      'hover:bg-(--color-primary) hover:text-white',
                      'text-center'
                    )}
                  >
                    {t('hero.learnMore')}
                  </Link>
                </div>
              </div>

              {/* Right: Hero Image */}
              <div className="relative">
                <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-(--color-bg-secondary) border border-(--color-border) shadow-xl">
                  <img
                    src={bannerImage}
                    alt="GrandLine Bus Transportation"
                    className="w-full h-full object-cover object-center"
                    // Hero image is above the fold, so no lazy loading needed
                  />
                  {/* Gradient overlay for better text readability if needed */}
                  <div className="absolute inset-0 bg-gradient-to-t from-(--color-bg-primary)/20 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-(--color-bg-secondary)">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-(--color-primary) mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-(--color-text-secondary)">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('home.features.title')}
              </h2>
              <p className="text-lg text-(--color-text-secondary) max-w-2xl mx-auto">
                {t('home.features.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={cn(
                      'p-6 rounded-xl bg-(--color-bg-card)',
                      'border border-(--color-border)',
                      'hover:shadow-lg transition-all duration-200',
                      'hover:border-(--color-primary)'
                    )}
                  >
                    <div className="w-12 h-12 bg-(--color-primary-light) rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-(--color-primary)" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-(--color-text-secondary) text-sm">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Services Preview Section */}
        <section className="py-20 px-4 bg-(--color-bg-secondary)">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('home.services.title')}
              </h2>
              <p className="text-lg text-(--color-text-secondary) max-w-2xl mx-auto">
                {t('home.services.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                t('home.services.charter'),
                t('home.services.shuttle'),
                t('home.services.events'),
              ].map((service, index) => (
                <div
                  key={index}
                  className={cn(
                    'p-6 rounded-xl bg-(--color-bg-card)',
                    'border border-(--color-border)',
                    'hover:shadow-lg transition-all duration-200'
                  )}
                >
                  <CheckCircle className="w-8 h-8 text-(--color-primary) mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{service}</h3>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link
                to="/services"
                className={cn(
                  'inline-flex items-center gap-2',
                  'bg-(--color-primary) hover:bg-(--color-primary-hover)',
                  'text-white font-bold py-3 px-8 rounded-lg',
                  'transition-all duration-200',
                  'hover:shadow-lg'
                )}
              >
                {t('home.services.viewAll')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('home.testimonials.title')}
              </h2>
              <p className="text-lg text-(--color-text-secondary) max-w-2xl mx-auto">
                {t('home.testimonials.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={cn(
                    'p-6 rounded-xl bg-(--color-bg-card)',
                    'border border-(--color-border)',
                    'hover:shadow-lg transition-all duration-200'
                  )}
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-(--color-primary) text-(--color-primary)" />
                    ))}
                  </div>
                  <p className="text-(--color-text-secondary) mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <p className="font-semibold">{testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-(--color-primary) text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('home.cta.title')}
            </h2>
            <p className="text-lg mb-8 opacity-90">
              {t('home.cta.subtitle')}
            </p>
            <Link
              to="/build-quote"
              className={cn(
                'inline-block',
                'bg-white text-(--color-primary) font-bold py-4 px-8 rounded-lg',
                'transition-all duration-200',
                'hover:shadow-xl hover:-translate-y-1'
              )}
            >
              {t('home.cta.button')}
            </Link>
          </div>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
};
