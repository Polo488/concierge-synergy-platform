
import { useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { FIELD_KEY_OPTIONS } from '@/types/signature';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Variable, Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, 
  List, ListOrdered, Undo, Redo, Minus, Highlighter, Palette, Type
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Props {
  content: string;
  onChange: (content: string) => void;
}

const FONT_OPTIONS = [
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Inter, sans-serif', label: 'Inter' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica' },
  { value: 'Courier New, monospace', label: 'Courier New' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
  { value: 'Garamond, serif', label: 'Garamond' },
];

const TEXT_COLORS = [
  { value: '#000000', label: 'Noir' },
  { value: '#374151', label: 'Gris foncé' },
  { value: '#6B7280', label: 'Gris' },
  { value: '#1D4ED8', label: 'Bleu' },
  { value: '#DC2626', label: 'Rouge' },
  { value: '#059669', label: 'Vert' },
  { value: '#D97706', label: 'Orange' },
  { value: '#7C3AED', label: 'Violet' },
];

const HIGHLIGHT_COLORS = [
  { value: '#FEF08A', label: 'Jaune' },
  { value: '#BBF7D0', label: 'Vert' },
  { value: '#BFDBFE', label: 'Bleu' },
  { value: '#FECACA', label: 'Rouge' },
  { value: '#E9D5FF', label: 'Violet' },
  { value: '#FED7AA', label: 'Orange' },
];

function ToolbarDivider() {
  return <div className="w-px h-5 bg-border mx-0.5" />;
}

export function DocumentContentEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: 'Collez ici le contenu de votre mandat de gestion...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      FontFamily,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[500px] p-6 focus:outline-none',
      },
    },
  });

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

  const currentFont = editor?.getAttributes('textStyle')?.fontFamily || '';
  const currentFontLabel = FONT_OPTIONS.find(f => f.value === currentFont)?.label || 'Police';

  if (!editor) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-2">
        {/* Toolbar */}
        <Card className="border border-border/50">
          <CardContent className="p-2 space-y-1.5">
            {/* Row 1: Font, headings */}
            <div className="flex items-center gap-1 flex-wrap">
              {/* Font family selector */}
              <Select
                value={currentFont}
                onValueChange={(v) => editor.chain().focus().setFontFamily(v).run()}
              >
                <SelectTrigger className="h-7 w-[140px] text-xs">
                  <Type size={12} className="mr-1 shrink-0" />
                  <SelectValue placeholder="Police" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map(f => (
                    <SelectItem key={f.value} value={f.value} className="text-xs" style={{ fontFamily: f.value }}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <ToolbarDivider />

              <Button
                variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
                size="sm" className="h-7 w-7 p-0"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                title="Titre 1"
              >
                <Heading1 size={14} />
              </Button>
              <Button
                variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
                size="sm" className="h-7 w-7 p-0"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                title="Titre 2"
              >
                <Heading2 size={14} />
              </Button>
              <Button
                variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
                size="sm" className="h-7 w-7 p-0"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                title="Titre 3"
              >
                <Heading3 size={14} />
              </Button>

              <ToolbarDivider />

              {/* Undo / Redo */}
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0"
                onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Annuler">
                <Undo size={14} />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0"
                onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Refaire">
                <Redo size={14} />
              </Button>

              <span className="text-[10px] text-muted-foreground ml-auto">
                {usedVariables.length} var.
              </span>
            </div>

            {/* Row 2: Formatting, alignment, colors */}
            <div className="flex items-center gap-1 flex-wrap">
              {/* Bold */}
              <Button
                variant={editor.isActive('bold') ? 'default' : 'ghost'}
                size="sm" className="h-7 w-7 p-0"
                onClick={() => editor.chain().focus().toggleBold().run()} title="Gras (Ctrl+B)">
                <Bold size={14} />
              </Button>
              {/* Italic */}
              <Button
                variant={editor.isActive('italic') ? 'default' : 'ghost'}
                size="sm" className="h-7 w-7 p-0"
                onClick={() => editor.chain().focus().toggleItalic().run()} title="Italique (Ctrl+I)">
                <Italic size={14} />
              </Button>
              {/* Underline */}
              <Button
                variant={editor.isActive('underline') ? 'default' : 'ghost'}
                size="sm" className="h-7 w-7 p-0"
                onClick={() => editor.chain().focus().toggleUnderline().run()} title="Souligné (Ctrl+U)">
                <UnderlineIcon size={14} />
              </Button>
              {/* Strikethrough */}
              <Button
                variant={editor.isActive('strike') ? 'default' : 'ghost'}
                size="sm" className="h-7 w-7 p-0"
                onClick={() => editor.chain().focus().toggleStrike().run()} title="Barré">
                <Strikethrough size={14} />
              </Button>

              <ToolbarDivider />

              {/* Text color */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Couleur du texte">
                    <Palette size={14} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <p className="text-[10px] text-muted-foreground mb-1.5 font-medium">Couleur du texte</p>
                  <div className="flex gap-1 flex-wrap max-w-[180px]">
                    {TEXT_COLORS.map(c => (
                      <button
                        key={c.value}
                        className="w-6 h-6 rounded-md border border-border hover:scale-110 transition-transform"
                        style={{ backgroundColor: c.value }}
                        onClick={() => editor.chain().focus().setColor(c.value).run()}
                        title={c.label}
                      />
                    ))}
                    <button
                      className="w-6 h-6 rounded-md border border-border hover:scale-110 transition-transform text-[8px] flex items-center justify-center"
                      onClick={() => editor.chain().focus().unsetColor().run()}
                      title="Réinitialiser"
                    >
                      ✕
                    </button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Highlight */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={editor.isActive('highlight') ? 'default' : 'ghost'} size="sm" className="h-7 w-7 p-0" title="Surligner">
                    <Highlighter size={14} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <p className="text-[10px] text-muted-foreground mb-1.5 font-medium">Surlignage</p>
                  <div className="flex gap-1 flex-wrap max-w-[180px]">
                    {HIGHLIGHT_COLORS.map(c => (
                      <button
                        key={c.value}
                        className="w-6 h-6 rounded-md border border-border hover:scale-110 transition-transform"
                        style={{ backgroundColor: c.value }}
                        onClick={() => editor.chain().focus().toggleHighlight({ color: c.value }).run()}
                        title={c.label}
                      />
                    ))}
                    <button
                      className="w-6 h-6 rounded-md border border-border hover:scale-110 transition-transform text-[8px] flex items-center justify-center"
                      onClick={() => editor.chain().focus().unsetHighlight().run()}
                      title="Retirer"
                    >
                      ✕
                    </button>
                  </div>
                </PopoverContent>
              </Popover>

              <ToolbarDivider />

              {/* Alignment */}
              <Button
                variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
                size="sm" className="h-7 w-7 p-0"
                onClick={() => editor.chain().focus().setTextAlign('left').run()} title="Aligner à gauche">
                <AlignLeft size={14} />
              </Button>
              <Button
                variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
                size="sm" className="h-7 w-7 p-0"
                onClick={() => editor.chain().focus().setTextAlign('center').run()} title="Centrer">
                <AlignCenter size={14} />
              </Button>
              <Button
                variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
                size="sm" className="h-7 w-7 p-0"
                onClick={() => editor.chain().focus().setTextAlign('right').run()} title="Aligner à droite">
                <AlignRight size={14} />
              </Button>
              <Button
                variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'ghost'}
                size="sm" className="h-7 w-7 p-0"
                onClick={() => editor.chain().focus().setTextAlign('justify').run()} title="Justifier">
                <AlignJustify size={14} />
              </Button>

              <ToolbarDivider />

              {/* Lists & HR */}
              <Button
                variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
                size="sm" className="h-7 w-7 p-0"
                onClick={() => editor.chain().focus().toggleBulletList().run()} title="Liste à puces">
                <List size={14} />
              </Button>
              <Button
                variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
                size="sm" className="h-7 w-7 p-0"
                onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Liste numérotée">
                <ListOrdered size={14} />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0"
                onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Séparateur">
                <Minus size={14} />
              </Button>
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
              Sélectionnez du texte puis cliquez sur une variable pour le remplacer.
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
                  <Variable size={10} className="mr-1.5 text-primary" />
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
            <CardTitle className="text-xs font-medium">Raccourcis clavier</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-1">
            {[
              ['Ctrl+B', 'Gras'],
              ['Ctrl+I', 'Italique'],
              ['Ctrl+U', 'Souligné'],
              ['Ctrl+Z', 'Annuler'],
              ['Ctrl+Shift+Z', 'Refaire'],
            ].map(([key, label]) => (
              <div key={key} className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">{label}</span>
                <kbd className="bg-muted px-1.5 py-0.5 rounded text-[9px] font-mono">{key}</kbd>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
