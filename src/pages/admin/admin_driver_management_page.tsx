import { useState } from 'react';
import { useLanguage } from '../../hooks/use_language';
import { Button } from '../../components/common/ui/button';
import { CreateDriverFormModal } from '../../components/drivers/forms/create_driver_form_modal';
import { Plus } from 'lucide-react';

export const AdminDriverManagementPage: React.FC = () => {
  const { t } = useLanguage();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="h-full overflow-y-auto bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {t('admin.sidebar.driverManagement') || 'Driver Management'}
          </h1>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Driver
          </Button>
        </div>
        
        <div className="bg-[var(--color-bg-card)] rounded-lg shadow-md p-6">
          <p className="text-[var(--color-text-secondary)]">
            {t('admin.dashboard.comingSoon') || 'Driver management features coming soon...'}
          </p>
        </div>
      </div>

      <CreateDriverFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          // TODO: Refresh driver list when implemented
        }}
      />
    </div>
  );
};

