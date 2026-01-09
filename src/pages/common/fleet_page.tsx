import { HomeNavbar } from '../../components/home/home_navbar';
import { HomeFooter } from '../../components/home/home_footer';
import { useLanguage } from '../../hooks/use_language';
import { cn } from '../../utils/cn';
import { Users, Wifi, Snowflake, Utensils, Monitor, Car } from 'lucide-react';
import coachBusImage from '../../assets/img/2.png';
import miniBusImage from '../../assets/img/3.png';
import schoolBusImage from '../../assets/img/4.png';
import sprinterVanImage from '../../assets/img/5.png';
import maintenanceImage from '../../assets/img/6.png';

export const FleetPage: React.FC = () => {
  const { t } = useLanguage();

  const busTypes = [
    {
      name: t('fleet.types.coach.name'),
      capacity: t('fleet.types.coach.capacity'),
      features: [
        t('fleet.types.coach.features.1'),
        t('fleet.types.coach.features.2'),
        t('fleet.types.coach.features.3'),
        t('fleet.types.coach.features.4'),
      ],
      image: coachBusImage,
      alt: 'Modern luxury coach bus exterior',
    },
    {
      name: t('fleet.types.mini.name'),
      capacity: t('fleet.types.mini.capacity'),
      features: [
        t('fleet.types.mini.features.1'),
        t('fleet.types.mini.features.2'),
        t('fleet.types.mini.features.3'),
        t('fleet.types.mini.features.4'),
      ],
      image: miniBusImage,
      alt: 'Compact mini bus for smaller groups',
    },
    {
      name: t('fleet.types.school.name'),
      capacity: t('fleet.types.school.capacity'),
      features: [
        t('fleet.types.school.features.1'),
        t('fleet.types.school.features.2'),
        t('fleet.types.school.features.3'),
        t('fleet.types.school.features.4'),
      ],
      image: schoolBusImage,
      alt: 'Safe and reliable school bus',
    },
    {
      name: t('fleet.types.sprinter.name'),
      capacity: t('fleet.types.sprinter.capacity'),
      features: [
        t('fleet.types.sprinter.features.1'),
        t('fleet.types.sprinter.features.2'),
        t('fleet.types.sprinter.features.3'),
        t('fleet.types.sprinter.features.4'),
      ],
      image: sprinterVanImage,
      alt: 'Comfortable sprinter van interior',
    },
  ];

  const amenities = [
    { icon: Wifi, name: t('fleet.amenities.wifi') },
    { icon: Snowflake, name: t('fleet.amenities.ac') },
    { icon: Monitor, name: t('fleet.amenities.entertainment') },
    { icon: Utensils, name: t('fleet.amenities.snacks') },
    { icon: Car, name: t('fleet.amenities.luggage') },
    { icon: Users, name: t('fleet.amenities.comfort') },
  ];

  return (
    <div className="min-h-screen bg-(--color-bg-primary) text-(--color-text-primary) flex flex-col">
      <HomeNavbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 px-4 bg-(--color-bg-secondary)">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {t('fleet.hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-(--color-text-secondary) max-w-3xl mx-auto">
              {t('fleet.hero.subtitle')}
            </p>
          </div>
        </section>

        {/* Fleet Overview Stats */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: t('fleet.stats.totalBuses'), label: t('fleet.stats.totalBusesLabel') },
                { value: t('fleet.stats.routes'), label: t('fleet.stats.routesLabel') },
                { value: t('fleet.stats.cities'), label: t('fleet.stats.citiesLabel') },
                { value: t('fleet.stats.satisfaction'), label: t('fleet.stats.satisfactionLabel') },
              ].map((stat, index) => (
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

        {/* Bus Types Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('fleet.types.title')}
              </h2>
              <p className="text-lg text-(--color-text-secondary) max-w-2xl mx-auto">
                {t('fleet.types.subtitle')}
              </p>
            </div>
            <div className="space-y-16">
              {busTypes.map((bus, index) => (
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
                      src={bus.image}
                      alt={bus.alt}
                      loading="lazy"
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                  </div>
                  <div className={cn(index % 2 === 1 && 'lg:col-start-1 lg:row-start-1')}>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">{bus.name}</h3>
                    <p className="text-lg text-(--color-primary) font-semibold mb-6">
                      {bus.capacity}
                    </p>
                    <ul className="space-y-3">
                      {bus.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <span className="text-(--color-primary) mt-1">✓</span>
                          <span className="text-(--color-text-secondary)">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Amenities Section */}
        <section className="py-20 px-4 bg-(--color-bg-secondary)">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('fleet.amenities.title')}
              </h2>
              <p className="text-lg text-(--color-text-secondary) max-w-2xl mx-auto">
                {t('fleet.amenities.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {amenities.map((amenity, index) => {
                const Icon = amenity.icon;
                return (
                  <div
                    key={index}
                    className={cn(
                      'p-6 rounded-xl bg-(--color-bg-card)',
                      'border border-(--color-border)',
                      'hover:shadow-lg transition-all duration-200',
                      'text-center'
                    )}
                  >
                    <div className="w-16 h-16 bg-(--color-primary-light) rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-(--color-primary)" />
                    </div>
                    <p className="text-sm font-medium">{amenity.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Maintenance & Safety Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {t('fleet.maintenance.title')}
                </h2>
                <p className="text-lg text-(--color-text-secondary) mb-6">
                  {t('fleet.maintenance.description')}
                </p>
                <ul className="space-y-4">
                  {[
                    t('fleet.maintenance.points.1'),
                    t('fleet.maintenance.points.2'),
                    t('fleet.maintenance.points.3'),
                    t('fleet.maintenance.points.4'),
                  ].map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-(--color-primary) mt-1">✓</span>
                      <span className="text-(--color-text-secondary)">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative w-full h-96 rounded-2xl overflow-hidden bg-(--color-bg-secondary) border border-(--color-border) shadow-lg">
                <img
                  src={maintenanceImage}
                  alt="Bus maintenance and safety inspection"
                  loading="lazy"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
};
