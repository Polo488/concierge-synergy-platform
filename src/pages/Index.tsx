
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-6 text-slate-900">
          {t('dashboard.title')} - GESTION BNB LYON
        </h1>
        <p className="text-xl text-slate-600 mb-8">
          {t('dashboard.subtitle')}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            size="lg" 
            onClick={() => navigate('/dashboard')}
            className="animate-fade-in"
          >
            {t('dashboard.title')}
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => navigate('/inventory')}
            className="animate-fade-in delay-100"
          >
            {t('inventory.title')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
