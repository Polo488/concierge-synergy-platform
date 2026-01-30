import { Outlet } from 'react-router-dom';
import { PortalHeader } from './PortalHeader';
import { EnhancedFooter } from './EnhancedFooter';

export function PortalLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PortalHeader />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <EnhancedFooter />
    </div>
  );
}
