
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  message: string;
  type?: 'info' | 'error' | 'success' | 'warning';
}

interface ImportLogsProps {
  logs?: LogEntry[];
  onClearLogs?: () => void;
}

export function ImportLogs({ logs = [], onClearLogs }: ImportLogsProps) {
  const getLogClass = (type: string = 'info') => {
    switch (type) {
      case 'error':
        return 'text-red-500';
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-amber-500';
      default:
        return 'text-slate-700';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Logs d'importation</h3>
        {onClearLogs && (
          <Button variant="outline" size="sm" onClick={onClearLogs}>
            <Trash className="h-4 w-4 mr-1" /> Effacer les logs
          </Button>
        )}
      </div>
      
      <ScrollArea className="h-[300px] border rounded-md bg-slate-50 p-2">
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Aucun log disponible. Lancez un import pour voir les logs.
          </div>
        ) : (
          <pre className="text-xs font-mono">
            {logs.map((log, index) => (
              <div key={index} className={`py-1 ${getLogClass(log.type)}`}>
                <span className="text-slate-400">[{log.timestamp}]</span> {log.message}
              </div>
            ))}
          </pre>
        )}
      </ScrollArea>
    </div>
  );
}
