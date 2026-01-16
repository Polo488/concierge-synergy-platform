
import { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  FileText,
  Languages
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  MessageTemplate, 
  TemplateCategory,
  TEMPLATE_CATEGORY_LABELS 
} from '@/types/guestExperience';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MessageTemplatesListProps {
  templates: MessageTemplate[];
  onCreateTemplate: () => void;
  onEditTemplate: (template: MessageTemplate) => void;
  onDeleteTemplate: (id: string) => void;
}

export function MessageTemplatesList({
  templates,
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate,
}: MessageTemplatesListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const groupedTemplates = filteredTemplates.reduce((acc, template) => {
    const category = template.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(template);
    return acc;
  }, {} as Record<TemplateCategory, MessageTemplate[]>);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Modèles de messages</CardTitle>
        <Button onClick={onCreateTemplate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau modèle
        </Button>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un modèle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {Object.entries(TEMPLATE_CATEGORY_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Templates by category */}
        <div className="space-y-8">
          {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {TEMPLATE_CATEGORY_LABELS[category as TemplateCategory]}
                <Badge variant="secondary" className="ml-2">
                  {categoryTemplates.length}
                </Badge>
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryTemplates.map(template => (
                  <div
                    key={template.id}
                    className="p-4 rounded-lg border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Modifié le {format(template.updatedAt, 'dd MMM yyyy', { locale: fr })}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onEditTemplate(template)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => onDeleteTemplate(template.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {template.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {template.variables.slice(0, 3).map(variable => (
                          <Badge key={variable} variant="outline" className="text-xs">
                            {variable}
                          </Badge>
                        ))}
                        {template.variables.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.variables.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      {template.translations && Object.keys(template.translations).length > 0 && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Languages className="h-3 w-3" />
                          {Object.keys(template.translations).length + 1}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {filteredTemplates.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun modèle trouvé</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
