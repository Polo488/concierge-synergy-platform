
import { CleaningStatus, CleaningTask } from '@/types/cleaning';

export const sortTasksByDateTime = (tasks: CleaningTask[]): CleaningTask[] => {
  return [...tasks].sort((a, b) => {
    // Sort by date first if available
    if (a.date && b.date) {
      const dateComparison = a.date.localeCompare(b.date);
      if (dateComparison !== 0) return dateComparison;
    }
    
    // Then sort by time
    const aTime = a.startTime || '';
    const bTime = b.startTime || '';
    return aTime.localeCompare(bTime);
  });
};

export const getStatusLabel = (status: CleaningStatus): string => {
  switch (status) {
    case 'todo':
      return 'À faire';
    case 'inProgress':
      return 'En cours';
    case 'completed':
      return 'Terminé';
    case 'scheduled':
      return 'Planifié';
    default:
      return status;
  }
};

export const getStatusBadgeClass = (status: CleaningStatus): string => {
  switch (status) {
    case 'todo':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'inProgress':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case 'completed':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'scheduled':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    default:
      return '';
  }
};

// Add missing utility functions
export const getNextId = (tasks: CleaningTask[]): number => {
  if (tasks.length === 0) return 1;
  return Math.max(...tasks.map(task => task.id)) + 1;
};

export const generateLabelsPrintWindow = (tasks: CleaningTask[]): void => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    console.error('Unable to open print window');
    return;
  }
  
  // Generate HTML content for labels
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Étiquettes de Ménage</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
        }
        .label {
          border: 1px solid #ccc;
          padding: 10px;
          margin-bottom: 20px;
          page-break-inside: avoid;
        }
        .property {
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 5px;
        }
        .info {
          margin-bottom: 5px;
          font-size: 14px;
        }
        .items {
          margin-top: 10px;
        }
        .item {
          display: inline-block;
          margin-right: 5px;
          margin-bottom: 5px;
          padding: 3px 8px;
          border-radius: 12px;
          background-color: #f0f0f0;
          font-size: 12px;
        }
        @media print {
          @page {
            margin: 0.5cm;
          }
        }
      </style>
    </head>
    <body>
      ${tasks.map(task => `
        <div class="label">
          <div class="property">${task.property}</div>
          <div class="info">
            ${task.date ? `Date: ${task.date}` : `Check-out: ${task.checkoutTime || 'N/A'} • Check-in: ${task.checkinTime || 'N/A'}`}
          </div>
          <div class="info">Agent: ${task.cleaningAgent || 'Non assigné'}</div>
          ${task.items.length > 0 ? `
            <div class="items">
              ${task.items.map(item => `<span class="item">${item}</span>`).join('')}
            </div>
          ` : ''}
          ${task.consumables.length > 0 ? `
            <div class="items">
              ${task.consumables.map(item => `<span class="item">${item}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}
      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;
  
  // Write content to the new window
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
};
