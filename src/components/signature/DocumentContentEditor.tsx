
import { useState, useRef, useCallback } from 'react';
import { FIELD_KEY_OPTIONS } from '@/types/signature';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlignLeft, Variable, Eye, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Props {
  content: string;
  onChange: (content: string) => void;
}

function renderContentWithBadges(content: string) {
  const parts = content.split(/(\\{\\{[a-z_]+\\}\\})/g);
  return parts.map((part, i) => {
    const match = part.match(/^\\{\\{([a-z_]+)\\}\\}$/);
    if (match) {
      const fieldKey = match[1];
      const field = FIELD_KEY_OPTIONS.find(f => f.key === fieldKey);
      return (
        <span
          key={i}
          className="inline-flex items-center gap-1 px-2 py-0.5 mx-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium border border-primary/20"
        >
          <Variable size={10} />
          {field?.label || fieldKey}
        </span>
      );
    }
    // Preserve whitespace and line breaks
    return part.split('\n').map((line, j, arr) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 && <br />}
      </span>
    ));
  });
}

export function DocumentContentEditor({ content, onChange }: Props) {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInsertVariable = useCallback((fieldKey: string) => {
    const ta = textareaRef.current;
    if (!ta) {
      // No selection, just append
      onChange(content + `{{${fieldKey}}}`);
      toast.success('Variable insérée');
      return;
    }

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = content.slice(0, start);
    const after = content.slice(end);
    const newContent = before + `{{${fieldKey}}}` + after;
    onChange(newContent);

    // Restore cursor position after the inserted variable
    requestAnimationFrame(() => {
      const newPos = start + `{{${fieldKey}}}`.length;
      ta.selectionStart = newPos;
      ta.selectionEnd = newPos;
      ta.focus();
    });

    const field = FIELD_KEY_OPTIONS.find(f => f.key === fieldKey);
    if (start !== end) {
      toast.success(`Texte remplacé par "${field?.label}"`);
    } else {
      toast.success(`"${field?.label}" inséré`);
    }
  }, [content, onChange]);

  // Count used variables
  const usedVariables = FIELD_KEY_OPTIONS.filter(f => content.includes(`{{${f.key}}}`));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Editor / Preview */}
      <div className="lg:col-span-2 space-y-2">
        <div className="flex items-center gap-2">
          <Button
            variant={mode === 'edit' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('edit')}
          >
            <Edit size={12} className="mr-1" />
            Éditer
          </Button>
          <Button
            variant={mode === 'preview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('preview')}
          >
            <Eye size={12} className="mr-1" />
            Aperçu
          </Button>
          <span className="text-xs text-muted-foreground ml-auto">
            {usedVariables.length} variable{usedVariables.length !== 1 ? 's' : ''} utilisée{usedVariables.length !== 1 ? 's' : ''}
          </span>
        </div>

        <Card className="border border-border/50">
          <CardContent className="p-0">
            {mode === 'edit' ? (
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={e => onChange(e.target.value)}
                placeholder="Collez ici le contenu de votre mandat de gestion...&#10;&#10;Sélectionnez ensuite un passage de texte puis cliquez sur une variable dans le panneau de droite pour le remplacer."
                className="min-h-[500px] border-0 rounded-none font-serif text-sm leading-relaxed resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            ) : (
              <ScrollArea className="h-[500px]">
                <div className="p-6 font-serif text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                  {content ? renderContentWithBadges(content) : (
                    <p className="text-muted-foreground italic">Aucun contenu. Passez en mode édition pour coller votre document.</p>
                  )}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Variables panel */}
      <div className="space-y-3">
        <Card className="border border-border/50">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-xs font-medium flex items-center gap-1.5">
              <Variable size={12} className="text-primary" />
              Variables dynamiques
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-1.5">
            <p className="text-[10px] text-muted-foreground mb-2">
              {mode === 'edit'
                ? 'Sélectionnez du texte dans l\'éditeur puis cliquez sur une variable pour remplacer la sélection.'
                : 'Passez en mode édition pour insérer des variables.'}
            </p>
            {FIELD_KEY_OPTIONS.map(field => {
              const isUsed = content.includes(`{{${field.key}}}`);
              return (
                <Button
                  key={field.key}
                  variant="outline"
                  size="sm"
                  className={cn(
                    'w-full justify-start text-xs h-8',
                    isUsed && 'border-primary/30 bg-primary/5'
                  )}
                  disabled={mode !== 'edit'}
                  onClick={() => handleInsertVariable(field.key)}
                >
                  <AlignLeft size={10} className="mr-1.5 text-primary" />
                  <span className="flex-1 text-left">{field.label}</span>
                  {isUsed && (
                    <Badge variant="default" className="h-4 text-[9px] px-1.5">
                      ✓
                    </Badge>
                  )}
                </Button>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border border-border/50">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-xs font-medium">Syntaxe</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Les variables sont insérées sous la forme <code className="bg-muted px-1 rounded text-[9px]">{'{{nom_variable}}'}</code> dans le texte. Elles seront automatiquement remplacées par les vraies valeurs lors de la signature.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
