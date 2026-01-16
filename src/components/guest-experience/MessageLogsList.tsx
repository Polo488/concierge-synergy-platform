
import { useState } from 'react';
import { 
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  MessageLog, 
  MessageLogStatus,
  CHANNEL_LABELS 
} from '@/types/guestExperience';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface MessageLogsListProps {
  logs: MessageLog[];
}

const getStatusIcon = (status: MessageLogStatus) => {
  switch (status) {
    case 'sent':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'failed':
      return <XCircle className="h-4 w-4 text-destructive" />;
    case 'skipped':
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const getStatusLabel = (status: MessageLogStatus) => {
  switch (status) {
    case 'sent':
      return 'Envoyé';
    case 'failed':
      return 'Échec';
    case 'skipped':
      return 'Ignoré';
    case 'pending':
      return 'En attente';
  }
};

const getStatusVariant = (status: MessageLogStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'sent':
      return 'default';
    case 'failed':
      return 'destructive';
    case 'skipped':
      return 'secondary';
    case 'pending':
      return 'outline';
  }
};

export function MessageLogsList({ logs }: MessageLogsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<MessageLog | null>(null);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ruleName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    const matchesChannel = filterChannel === 'all' || log.channel === filterChannel;
    
    return matchesSearch && matchesStatus && matchesChannel;
  });

  // Stats
  const sentCount = logs.filter(l => l.status === 'sent').length;
  const failedCount = logs.filter(l => l.status === 'failed').length;
  const skippedCount = logs.filter(l => l.status === 'skipped').length;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Historique des messages</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span className="text-2xl font-bold">{sentCount}</span>
              </div>
              <p className="text-sm text-green-600 mt-1">Envoyés</p>
            </div>
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-center gap-2 text-red-700">
                <XCircle className="h-5 w-5" />
                <span className="text-2xl font-bold">{failedCount}</span>
              </div>
              <p className="text-sm text-red-600 mt-1">Échecs</p>
            </div>
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 text-amber-700">
                <AlertCircle className="h-5 w-5" />
                <span className="text-2xl font-bold">{skippedCount}</span>
              </div>
              <p className="text-sm text-amber-600 mt-1">Ignorés</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par voyageur, propriété ou règle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="sent">Envoyé</SelectItem>
                <SelectItem value="failed">Échec</SelectItem>
                <SelectItem value="skipped">Ignoré</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterChannel} onValueChange={setFilterChannel}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Canal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {Object.entries(CHANNEL_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Logs Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Règle</TableHead>
                  <TableHead>Voyageur</TableHead>
                  <TableHead>Propriété</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucun message trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Badge 
                          variant={getStatusVariant(log.status)}
                          className="flex items-center gap-1 w-fit"
                        >
                          {getStatusIcon(log.status)}
                          {getStatusLabel(log.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{format(log.createdAt, 'dd MMM yyyy', { locale: fr })}</p>
                          <p className="text-muted-foreground">
                            {format(log.createdAt, 'HH:mm', { locale: fr })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{log.ruleName || '-'}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{log.guestName}</p>
                          {log.guestEmail && (
                            <p className="text-sm text-muted-foreground">{log.guestEmail}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{log.propertyName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{CHANNEL_LABELS[log.channel]}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Log Details Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Détails du message
            </DialogTitle>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <Badge 
                    variant={getStatusVariant(selectedLog.status)}
                    className="flex items-center gap-1 w-fit mt-1"
                  >
                    {getStatusIcon(selectedLog.status)}
                    {getStatusLabel(selectedLog.status)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {format(selectedLog.createdAt, 'dd MMMM yyyy à HH:mm', { locale: fr })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Voyageur</p>
                  <p className="font-medium">{selectedLog.guestName}</p>
                  {selectedLog.guestEmail && (
                    <p className="text-sm text-muted-foreground">{selectedLog.guestEmail}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Propriété</p>
                  <p className="font-medium">{selectedLog.propertyName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Règle</p>
                  <p className="font-medium">{selectedLog.ruleName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Canal</p>
                  <Badge variant="outline">{CHANNEL_LABELS[selectedLog.channel]}</Badge>
                </div>
              </div>

              {selectedLog.subject && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Sujet</p>
                  <p className="font-medium">{selectedLog.subject}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-1">Contenu</p>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="whitespace-pre-wrap text-sm">{selectedLog.content}</p>
                </div>
              </div>

              {selectedLog.status === 'failed' && selectedLog.errorMessage && (
                <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
                  <p className="text-sm font-medium text-destructive mb-1">Erreur</p>
                  <p className="text-sm">{selectedLog.errorMessage}</p>
                </div>
              )}

              {selectedLog.status === 'skipped' && selectedLog.skippedReason && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-700 mb-1">Raison</p>
                  <p className="text-sm text-amber-600">{selectedLog.skippedReason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
