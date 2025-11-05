/**
 * Build A Quote Page
 * Allows users to build a new quote (dummy page for now)
 */
export const BuildQuotePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-(--color-text-primary)">Build A Quote</h1>
        <p className="mt-2 text-(--color-text-secondary)">
          Create a new quote for your shipping needs
        </p>
      </div>

      <div className="bg-(--color-bg-card) rounded-lg shadow p-6">
        <p className="text-(--color-text-secondary)">
          Build A Quote form will be implemented here.
        </p>
      </div>
    </div>
  );
};

