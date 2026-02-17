
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type IdeaStatus = 'proposed' | 'accepted' | 'in_development' | 'done';

export interface Idea {
  id: string;
  title: string;
  description: string | null;
  status: IdeaStatus;
  author_name: string;
  author_email: string | null;
  votes_count: number;
  created_at: string;
  updated_at: string;
}

export function useIdeaBox() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  const voterIdentifier = useCallback(() => {
    let id = localStorage.getItem('idea_voter_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('idea_voter_id', id);
    }
    return id;
  }, []);

  const fetchIdeas = useCallback(async () => {
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .order('votes_count', { ascending: false });

    if (error) {
      console.error('Error fetching ideas:', error);
      return;
    }
    setIdeas((data as unknown as Idea[]) || []);
    setLoading(false);
  }, []);

  const fetchMyVotes = useCallback(async () => {
    const vid = voterIdentifier();
    const { data } = await supabase
      .from('idea_votes')
      .select('idea_id')
      .eq('voter_identifier', vid);

    if (data) {
      setVotedIds(new Set((data as unknown as { idea_id: string }[]).map(v => v.idea_id)));
    }
  }, [voterIdentifier]);

  useEffect(() => {
    fetchIdeas();
    fetchMyVotes();
  }, [fetchIdeas, fetchMyVotes]);

  const submitIdea = async (title: string, description: string, authorName: string) => {
    const { error } = await supabase.from('ideas').insert({
      title,
      description,
      author_name: authorName,
    } as any);

    if (error) {
      toast.error("Erreur lors de la soumission");
      return false;
    }
    toast.success("Idée soumise avec succès !");
    await fetchIdeas();
    return true;
  };

  const toggleVote = async (ideaId: string) => {
    const vid = voterIdentifier();
    const hasVoted = votedIds.has(ideaId);

    if (hasVoted) {
      await supabase
        .from('idea_votes')
        .delete()
        .eq('idea_id', ideaId)
        .eq('voter_identifier', vid);
      setVotedIds(prev => {
        const next = new Set(prev);
        next.delete(ideaId);
        return next;
      });
    } else {
      await supabase.from('idea_votes').insert({
        idea_id: ideaId,
        voter_identifier: vid,
      } as any);
      setVotedIds(prev => new Set(prev).add(ideaId));
    }
    await fetchIdeas();
  };

  const updateStatus = async (ideaId: string, status: IdeaStatus) => {
    await supabase.from('ideas').update({ status } as any).eq('id', ideaId);
    await fetchIdeas();
    toast.success("Statut mis à jour");
  };

  const deleteIdea = async (ideaId: string) => {
    await supabase.from('ideas').delete().eq('id', ideaId);
    await fetchIdeas();
    toast.success("Idée supprimée");
  };

  const getByStatus = (status: IdeaStatus) =>
    ideas.filter(i => i.status === status).sort((a, b) => b.votes_count - a.votes_count);

  return {
    ideas,
    loading,
    votedIds,
    submitIdea,
    toggleVote,
    updateStatus,
    deleteIdea,
    getByStatus,
  };
}
