
import { useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { FIELD_KEY_OPTIONS } from '@/types/signature';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlignLeft, Variable, Bold, Italic, Heading1, Heading2, Heading3, 
  List, ListOrdered, Undo, Redo, Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Props {
  content: string;
  onChange: (content: string) => void;
}

export function DocumentContentEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: 'Collez ici le contenu de votre mandat de gestion...\n\nUtilisez la barre d\'outils pour mettre en forme le texte, puis insérez des variables dynamiques depuis le panneau de droite.',
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[500px] p-6 focus:outline-none font-serif',
      },
    },
  });

  // Sync external content changes
  useEffect(() => {
    if (editor && content !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  const handleInsertVariable = useCallback((fieldKey: string) => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    const variableText = `{{${fieldKey}}}`;

    editor.chain().focus().deleteRange({ from, to }).insertContent(variableText).run();

    const field = FIELD_KEY_OPTIONS.find(f => f.key === fieldKey);
    if (from !== to) {
      toast.success(`Texte remplacé par "${field?.label}"`);
    } else {
      toast.success(`"${field?.label}" inséré`);
    }
  }, [editor]);

  const usedVariables = FIELD_KEY_OPTIONS.filter(f => content.includes(`{{${f.key}}}`));

  if (!editor) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-2">
        {/* Toolbar */}
        <Card className="border border-border/50">
          <CardContent className="p-2">
            <div className="flex items-center gap-1 flex-wrap">
              <Button
                variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                title="Titre 1"
              >
                <Heading1 size={14} />
              </Button>
              <Button
                variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                title="Titre 2"
              >
                <Heading2 size={14} />
              </Button>
              <Button
                variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                title="Titre 3"
              >
                <Heading3 size={14} />
              </Button>

              <div className="w-px h-5 bg-border mx-1" />

              <Button
                variant={editor.isActive('bold') ? 'default' : 'ghost'}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="Gras"
              >
                <Bold size={14} />
              </Button>
              <Button
                variant={editor.isActive('italic') ? 'default' : 'ghost'}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                title="Italique"
              >
                <Italic size={14} />
              </Button>

              <div className="w-px h-5 bg-border mx-1" />

              <Button
                variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                title="Liste à puces"
              >
                <List size={14} />
              </Button>
              <Button
                variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                title="Liste numérotée"
              >
                <ListOrdered size={14} />
              </Button>

              <div className="w-px h-5 bg-border mx-1" />

              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Ligne horizontale"
              >
                <Minus size={14} />
              </Button>

              <div className="w-px h-5 bg-border mx-1" />

              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Annuler"
              >
                <Undo size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Refaire"
              >
                <Redo size={14} />
              </Button>

              <span className="text-xs text-muted-foreground ml-auto">
                {usedVariables.length} variable{usedVariables.length !== 1 ? 's' : ''}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Editor */}
        <Card className="border border-border/50 overflow-hidden">
          <CardContent className="p-0">
            <EditorContent editor={editor} className="document-editor" />
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
              Sélectionnez du texte dans l'éditeur puis cliquez sur une variable pour remplacer la sélection.
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
