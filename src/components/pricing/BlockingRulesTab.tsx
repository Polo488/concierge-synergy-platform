
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Construction } from 'lucide-react';

interface BlockingRulesTabProps {
  blockingRules: any[];
  addBlockingRule: (rule: any) => any;
  deleteBlockingRule: (id: string) => void;
}

export function BlockingRulesTab({ blockingRules }: BlockingRulesTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Règles de Blocage</CardTitle>
            <CardDescription>
              Bloquez des périodes fixes ou des jours récurrents
            </CardDescription>
          </div>
          <Button disabled className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouveau blocage
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Construction className="h-12 w-12 mb-4" />
          <p className="text-lg font-medium">Module en construction</p>
          <p className="text-sm">Les règles de blocage seront disponibles prochainement</p>
        </div>
      </CardContent>
    </Card>
  );
}
