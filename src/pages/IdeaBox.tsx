
import { useState } from 'react';
import { useIdeaBox, IdeaStatus } from '@/hooks/useIdeaBox';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Lightbulb,
  ThumbsUp,
  Plus,
  CheckCircle2,
  Code2,
  Sparkles,
  Trash2,
  ArrowUpDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<IdeaStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  proposed: { label: 'Proposées', icon: Lightbulb, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  accepted: { label: 'Acceptées', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  in_development: { label: 'En développement', icon: Code2, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  done: { label: 'Terminées', icon: Sparkles, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/30' },
};

const STATUSES: IdeaStatus[] = ['proposed', 'accepted', 'in_development', 'done'];

export default function IdeaBox() {
  const { loading, votedIds, submitIdea, toggleVote, updateStatus, deleteIdea, getByStatus } = useIdeaBox();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'supervisor';

  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) return;
    const success = await submitIdea(title.trim(), description.trim(), user?.name || 'Anonyme');
    if (success) {
      setTitle('');
      setDescription('');
      setDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Lightbulb className="text-amber-500" size={28} />
            Boîte à idées
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Proposez vos idées, votez et suivez la roadmap en temps réel
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} />
              Proposer une idée
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle idée</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <Input
                placeholder="Titre de l'idée"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Décrivez votre idée en détail..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
              />
              <Button onClick={handleSubmit} disabled={!title.trim()} className="w-full">
                Soumettre
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATUSES.map(status => {
          const config = STATUS_CONFIG[status];
          const ideas = getByStatus(status);
          const Icon = config.icon;

          return (
            <div key={status} className="space-y-3">
              {/* Column header */}
              <div className={cn("flex items-center gap-2 px-3 py-2 rounded-xl", config.bg)}>
                <Icon size={18} className={config.color} />
                <span className={cn("text-sm font-semibold", config.color)}>{config.label}</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {ideas.length}
                </Badge>
              </div>

              {/* Cards */}
              <div className="space-y-2 min-h-[100px]">
                {ideas.map(idea => {
                  const hasVoted = votedIds.has(idea.id);
                  return (
                    <Card key={idea.id} className="p-3 space-y-2 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-medium text-foreground leading-tight">{idea.title}</h3>
                        {isAdmin && (
                          <button
                            onClick={() => deleteIdea(idea.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      {idea.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{idea.description}</p>
                      )}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => toggleVote(idea.id)}
                          className={cn(
                            "flex items-center gap-1.5 text-xs font-medium rounded-lg px-2 py-1 transition-all",
                            hasVoted
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-accent/50"
                          )}
                        >
                          <ThumbsUp size={14} className={hasVoted ? 'fill-primary' : ''} />
                          {idea.votes_count}
                        </button>

                        {isAdmin && (
                          <Select
                            value={idea.status}
                            onValueChange={(v) => updateStatus(idea.id, v as IdeaStatus)}
                          >
                            <SelectTrigger className="h-7 w-auto text-xs border-none bg-transparent px-2">
                              <ArrowUpDown size={12} />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUSES.map(s => (
                                <SelectItem key={s} value={s} className="text-xs">
                                  {STATUS_CONFIG[s].label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                      <div className="text-[10px] text-muted-foreground/60">
                        par {idea.author_name} · {new Date(idea.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </Card>
                  );
                })}
                {ideas.length === 0 && (
                  <div className="text-center py-6 text-xs text-muted-foreground/50">
                    Aucune idée
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
