import { Link } from 'react-router-dom';
import { HomeNavbar } from '../../components/home/home_navbar';
import { HomeFooter } from '../../components/home/home_footer';
import { useLanguage } from '../../hooks/use_language';
import { cn } from '../../utils/cn';
import {
  Bus,
  Users,
  Calendar,
  MapPin,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import charterBusServiceImage from '../../assets/img/12.png';
import shuttleServiceImage from '../../assets/img/13.png';
import eventTransportationImage from '../../assets/img/14.png';
import tourServiceImage from '../../assets/img/15.png';

export const ServicesPage: React.FC = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: Bus,
      title: t('services.charter.title'),
      description: t('services.charter.description'),
      features: [
        t('services.charter.features.1'),
        t('services.charter.features.2'),
        t('services.charter.features.3'),
        t('services.charter.features.4'),
      ],
      image: charterBusServiceImage,
      alt: 'Group traveling on charter bus',
    },
    {
      icon: Users,
      title: t('services.shuttle.title'),
      description: t('services.shuttle.description'),
      features: [
        t('services.shuttle.features.1'),
        t('services.shuttle.features.2'),
        t('services.shuttle.features.3'),
        t('services.shuttle.features.4'),
      ],
      image: shuttleServiceImage,
      alt: 'Airport shuttle bus service',
    },
    {
      icon: Calendar,
      title: t('services.events.title'),
      description: t('services.events.description'),
      features: [
        t('services.events.features.1'),
        t('services.events.features.2'),
        t('services.events.features.3'),
        t('services.events.features.4'),
      ],
      image: eventTransportationImage,
      alt: 'Buses at event venue',
    },
    {
      icon: MapPin,
      title: t('services.tours.title'),
      description: t('services.tours.description'),
      features: [
        t('services.tours.features.1'),
        t('services.tours.features.2'),
        t('services.tours.features.3'),
        t('services.tours.features.4'),
      ],
      image: tourServiceImage,
      alt: 'Scenic tour bus on mountain road',
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: t('services.benefits.safety.title'),
      description: t('services.benefits.safety.description'),
    },
    {
      icon: Clock,
      title: t('services.benefits.reliability.title'),
      description: t('services.benefits.reliability.description'),
    },
    {
      icon: Users,
      title: t('services.benefits.comfort.title'),
      description: t('services.benefits.comfort.description'),
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
              {t('services.hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-(--color-text-secondary) max-w-3xl mx-auto">
              {t('services.hero.subtitle')}
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('services.ourServices.title')}
              </h2>
              <p className="text-lg text-(--color-text-secondary) max-w-2xl mx-auto">
                {t('services.ourServices.subtitle')}
              </p>
            </div>
            <div className="space-y-16">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div
                    key={index}
                    className={cn(
                      'grid grid-cols-1 lg:grid-cols-2 gap-8 items-center',
                      index % 2 === 1 && 'lg:grid-flow-dense'
                    )}
                  >
                    <div
                      className={cn(
                        index % 2 === 1 && 'lg:col-start-2',
                        'relative w-full h-80 rounded-2xl overflow-hidden',
                        'bg-(--color-bg-secondary) border border-(--color-border)',
                        'shadow-lg hover:shadow-xl transition-shadow duration-300'
                      )}
                    >
                      <img
                        src={service.image}
                        alt={service.alt}
                        loading="lazy"
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                    </div>
                    <div className={cn(index % 2 === 1 && 'lg:col-start-1 lg:row-start-1')}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-(--color-primary-light) rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-(--color-primary)" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold">{service.title}</h3>
                      </div>
                      <p className="text-lg text-(--color-text-secondary) mb-6">
                        {service.description}
                      </p>
                      <ul className="space-y-3 mb-6">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-(--color-primary) shrink-0 mt-0.5" />
                            <span className="text-(--color-text-secondary)">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 bg-(--color-bg-secondary)">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('services.benefits.title')}
              </h2>
              <p className="text-lg text-(--color-text-secondary) max-w-2xl mx-auto">
                {t('services.benefits.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={index}
                    className={cn(
                      'p-6 rounded-xl bg-(--color-bg-card)',
                      'border border-(--color-border)',
                      'hover:shadow-lg transition-all duration-200'
                    )}
                  >
                    <div className="w-12 h-12 bg-(--color-primary-light) rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-(--color-primary)" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                    <p className="text-sm text-(--color-text-secondary)">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('services.process.title')}
              </h2>
              <p className="text-lg text-(--color-text-secondary) max-w-2xl mx-auto">
                {t('services.process.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: t('services.process.steps.1.number'),
                  title: t('services.process.steps.1.title'),
                  description: t('services.process.steps.1.description'),
                },
                {
                  step: t('services.process.steps.2.number'),
                  title: t('services.process.steps.2.title'),
                  description: t('services.process.steps.2.description'),
                },
                {
                  step: t('services.process.steps.3.number'),
                  title: t('services.process.steps.3.title'),
                  description: t('services.process.steps.3.description'),
                },
                {
                  step: t('services.process.steps.4.number'),
                  title: t('services.process.steps.4.title'),
                  description: t('services.process.steps.4.description'),
                },
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-(--color-primary) rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-(--color-text-secondary)">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-(--color-primary) text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('services.cta.title')}
            </h2>
            <p className="text-lg mb-8 opacity-90">
              {t('services.cta.subtitle')}
            </p>
            <Link
              to="/build-quote"
              className={cn(
                'inline-flex items-center gap-2',
                'bg-white text-(--color-primary) font-bold py-4 px-8 rounded-lg',
                'transition-all duration-200',
                'hover:shadow-xl hover:-translate-y-1'
              )}
            >
              {t('services.cta.button')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
};
