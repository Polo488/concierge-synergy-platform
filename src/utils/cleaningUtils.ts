
import { CleaningTask } from "@/types/cleaning";
import { format, addDays, isSameDay } from 'date-fns';

export const getNextId = (tasks: CleaningTask[]): number => {
  return Math.max(...tasks.map(t => t.id), 0) + 1;
};

export const getStatusBadge = (status: string): JSX.Element | null => {
  switch(status) {
    case 'todo':
      return <span className="bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-full px-2 py-1 text-xs font-medium">À faire</span>;
    case 'inProgress':
      return <span className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded-full px-2 py-1 text-xs font-medium">En cours</span>;
    case 'completed':
      return <span className="bg-green-100 text-green-800 hover:bg-green-200 rounded-full px-2 py-1 text-xs font-medium">Terminé</span>;
    case 'scheduled':
      return <span className="bg-purple-100 text-purple-800 hover:bg-purple-200 rounded-full px-2 py-1 text-xs font-medium">Planifié</span>;
    default:
      return null;
  }
};

export const generateLabelsPrintWindow = (selectedTasks: CleaningTask[]) => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Étiquettes Ménage - GESTION BNB LYON</title>
          <style>
            @media print {
              @page { 
                margin: 0.5cm;
                size: auto;
              }
            }
            body { 
              font-family: Arial, sans-serif; 
              margin: 0;
              padding: 15px;
            }
            .container { 
              display: flex;
              flex-direction: column;
              gap: 30px;
            }
            .label { 
              page-break-inside: avoid;
              page-break-after: always;
              width: 100%;
              max-width: 800px;
            }
            .property-header {
              border: 3px solid #000;
              border-radius: 15px;
              padding: 10px 15px;
              font-weight: bold;
              font-size: 24px;
              display: inline-block;
              margin-bottom: 15px;
            }
            .arrival-status {
              font-size: 24px;
              font-weight: bold;
              float: right;
              margin-top: 10px;
            }
            .items-container {
              display: flex;
              justify-content: space-between;
            }
            .left-column {
              flex: 3;
              font-size: 18px;
            }
            .right-column {
              flex: 1;
              display: flex;
              flex-direction: column;
              gap: 10px;
              font-size: 24px;
              font-weight: bold;
            }
            .item-row {
              margin-bottom: 10px;
              font-size: 22px;
            }
            .item-qty {
              font-weight: bold;
              font-size: 24px;
            }
            .item-name {
              font-style: italic;
            }
            .consumable-row {
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 10px;
            }
            .consumable-icon {
              border: 1px solid #000;
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
            }
            .consumable-text {
              font-size: 24px;
              font-weight: bold;
            }
            .box-icon {
              border: 1px solid #000;
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            ${selectedTasks.map(task => {
              // Extract property number and name
              const propertyMatch = task.property.match(/^([^a-zA-Z]+)\\s*(.*)$/);
              const propertyNum = propertyMatch ? propertyMatch[1].trim() : '';
              const propertyName = propertyMatch ? propertyMatch[2].trim() : task.property;
              
              return `
              <div class="label">
                <div class="header-row">
                  <span class="property-header">${propertyNum} : ${propertyName}</span>
                  <span class="arrival-status">ARRIVÉE AUJD : ${task.status === 'scheduled' ? 'NON' : 'OUI'}</span>
                </div>
                
                <div class="items-container">
                  <div class="left-column">
                    ${task.bedding?.map(item => {
                      const qtyMatch = item.match(/x(\\d+)$/);
                      const qty = qtyMatch ? qtyMatch[1] : '1';
                      const itemName = item.replace(/x\\d+$/, '').trim();
                      return `<div class="item-row"><span class="item-qty">${qty} x</span> <span class="item-name">${itemName}</span></div>`;
                    }).join('') || ''}
                    
                    ${task.items?.map(item => {
                      const qtyMatch = item.match(/x(\\d+)$/);
                      const qty = qtyMatch ? qtyMatch[1] : '1';
                      const itemName = item.replace(/x\\d+$/, '').trim();
                      // Filter out only items related to towels, bath mats, etc.
                      if (itemName.toLowerCase().includes('serviette') || 
                          itemName.toLowerCase().includes('tapis')) {
                        return `<div class="item-row"><span class="item-qty">${qty} x</span> <span class="item-name">${itemName}</span></div>`;
                      }
                      return '';
                    }).join('') || ''}
                  </div>
                  
                  <div class="right-column">
                    <div class="consumable-row">
                      <div class="box-icon">☕</div>
                      <span class="consumable-text">x 4</span>
                    </div>
                    <div class="consumable-row">
                      <div class="box-icon">🍵</div>
                      <span class="consumable-text">x 4</span>
                    </div>
                    <div class="consumable-row">
                      <div class="box-icon">CUISINE</div>
                      <span class="consumable-text">x 1</span>
                    </div>
                    <div class="consumable-row">
                      <div class="box-icon">SDB</div>
                      <span class="consumable-text">x 2</span>
                    </div>
                  </div>
                </div>
              </div>
            `;
            }).join('')}
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
};
