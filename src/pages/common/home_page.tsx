import { HomeNavbar } from '../../components/home/home_navbar';
import { HomeFooter } from '../../components/home/home_footer';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-(--color-bg-primary) text-(--color-text-primary) flex flex-col">
      <HomeNavbar />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Welcome to GrandLine
          </h1>
          <p className="text-center text-(--color-text-secondary) mb-12">
            Book your bus tickets with ease
          </p>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
};

