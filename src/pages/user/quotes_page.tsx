/**
 * Quotes Page
 * Displays user quotes (dummy page for now)
 */
export const QuotesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-(--color-text-primary)">Quotes</h1>
        <p className="mt-2 text-(--color-text-secondary)">
          View and manage your quotes
        </p>
      </div>

      <div className="bg-(--color-bg-card) rounded-lg shadow p-6">
        <p className="text-(--color-text-secondary)">
          Quotes page content will be implemented here.
        </p>
      </div>
    </div>
  );
};

