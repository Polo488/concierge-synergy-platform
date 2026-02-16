
import { useEffect } from 'react';
import { TransitoryDashboard } from '@/components/transitory/TransitoryDashboard';

const Transitory = () => {
  useEffect(() => {
    document.title = 'LCD Transitoire – Commercialisation';
  }, []);

  return (
    <div className="space-y-8">
      <TransitoryDashboard />
    </div>
  );
};

export default Transitory;
