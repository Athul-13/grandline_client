import { HomeNavbar } from '../../components/home/home_navbar';
import { HomeFooter } from '../../components/home/home_footer';
import { useLanguage } from '../../hooks/use_language';
import { cn } from '../../utils/cn';
import { Target, Users, Award, Heart, CheckCircle } from 'lucide-react';
import companyStoryImage from '../../assets/img/8.png';
import ceoImage from '../../assets/img/9.png';
import operationsDirectorImage from '../../assets/img/10.png';
import customerServiceManagerImage from '../../assets/img/11.png';

export const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: Target,
      title: t('about.values.mission.title'),
      description: t('about.values.mission.description'),
    },
    {
      icon: Users,
      title: t('about.values.vision.title'),
      description: t('about.values.vision.description'),
    },
    {
      icon: Heart,
      title: t('about.values.values.title'),
      description: t('about.values.values.description'),
    },
    {
      icon: Award,
      title: t('about.values.commitment.title'),
      description: t('about.values.commitment.description'),
    },
  ];

  const milestones = [
    { year: t('about.timeline.1.year'), event: t('about.timeline.1.event') },
    { year: t('about.timeline.2.year'), event: t('about.timeline.2.event') },
    { year: t('about.timeline.3.year'), event: t('about.timeline.3.event') },
    { year: t('about.timeline.4.year'), event: t('about.timeline.4.event') },
  ];

  const team = [
    { name: t('about.team.1.name'), role: t('about.team.1.role'), image: ceoImage, alt: 'CEO & Founder' },
    { name: t('about.team.2.name'), role: t('about.team.2.role'), image: operationsDirectorImage, alt: 'Operations Director' },
    { name: t('about.team.3.name'), role: t('about.team.3.role'), image: customerServiceManagerImage, alt: 'Customer Service Manager' },
  ];

  return (
    <div className="min-h-screen bg-(--color-bg-primary) text-(--color-text-primary) flex flex-col">
      <HomeNavbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 px-4 bg-(--color-bg-secondary)">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {t('about.hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-(--color-text-secondary) max-w-3xl mx-auto">
              {t('about.hero.subtitle')}
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {t('about.story.title')}
                </h2>
                <p className="text-lg text-(--color-text-secondary) mb-4">
                  {t('about.story.paragraph1')}
                </p>
                <p className="text-lg text-(--color-text-secondary) mb-4">
                  {t('about.story.paragraph2')}
                </p>
                <p className="text-lg text-(--color-text-secondary)">
                  {t('about.story.paragraph3')}
                </p>
              </div>
              <div className="relative w-full h-96 rounded-2xl overflow-hidden bg-(--color-bg-secondary) border border-(--color-border) shadow-lg">
                <img
                  src={companyStoryImage}
                  alt="GrandLine team working together"
                  loading="lazy"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 bg-(--color-bg-secondary)">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('about.values.title')}
              </h2>
              <p className="text-lg text-(--color-text-secondary) max-w-2xl mx-auto">
                {t('about.values.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
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
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-sm text-(--color-text-secondary)">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('about.timeline.title')}
              </h2>
              <p className="text-lg text-(--color-text-secondary) max-w-2xl mx-auto">
                {t('about.timeline.subtitle')}
              </p>
            </div>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-(--color-primary-light) hidden md:block"></div>
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={cn(
                      'relative flex items-center',
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    )}
                  >
                    <div className="w-full md:w-1/2 p-6">
                      <div
                        className={cn(
                          'p-6 rounded-xl bg-(--color-bg-card)',
                          'border border-(--color-border)',
                          'hover:shadow-lg transition-all duration-200',
                          index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                        )}
                      >
                        <div className="text-2xl font-bold text-(--color-primary) mb-2">
                          {milestone.year}
                        </div>
                        <p className="text-(--color-text-secondary)">{milestone.event}</p>
                      </div>
                    </div>
                    <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-(--color-primary) rounded-full border-4 border-(--color-bg-primary)"></div>
                    <div className="w-full md:w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4 bg-(--color-bg-secondary)">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('about.team.title')}
              </h2>
              <p className="text-lg text-(--color-text-secondary) max-w-2xl mx-auto">
                {t('about.team.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className={cn(
                    'p-6 rounded-xl bg-(--color-bg-card)',
                    'border border-(--color-border)',
                    'hover:shadow-lg transition-all duration-200',
                    'text-center'
                  )}
                >
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-(--color-primary-light) mx-auto mb-4 shadow-lg">
                    <img
                      src={member.image}
                      alt={member.alt}
                      loading="lazy"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-sm text-(--color-text-secondary)">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('about.whyChoose.title')}
              </h2>
              <p className="text-lg text-(--color-text-secondary) max-w-2xl mx-auto">
                {t('about.whyChoose.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                t('about.whyChoose.points.1'),
                t('about.whyChoose.points.2'),
                t('about.whyChoose.points.3'),
                t('about.whyChoose.points.4'),
                t('about.whyChoose.points.5'),
                t('about.whyChoose.points.6'),
              ].map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg bg-(--color-bg-card) border border-(--color-border)"
                >
                  <CheckCircle className="w-6 h-6 text-(--color-primary) shrink-0 mt-1" />
                  <p className="text-(--color-text-secondary)">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
};
