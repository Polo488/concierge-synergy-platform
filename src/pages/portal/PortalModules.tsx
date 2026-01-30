import { ModulesValueSection } from '@/components/portal/ModulesValueSection';
import { FinalCTA } from '@/components/portal/FinalCTA';

export default function PortalModules() {
  return (
    <div>
      {/* Modules with sticky nav and full value blocks */}
      <ModulesValueSection />

      {/* Final CTA */}
      <FinalCTA />
    </div>
  );
}
