
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  HRTeam, 
  HREmployee, 
  PlanningDay, 
  PLANNING_STATUSES, 
  EmployeeMonthlySummary 
} from '@/types/hrPlanning';

// PDF Configuration for A4 landscape
const PDF_CONFIG = {
  margin: 10,
  headerHeight: 25,
  rowHeight: 6,
  cellWidth: 8,
  employeeColWidth: 45,
  recapColWidth: 8,
  fontSize: {
    title: 14,
    subtitle: 10,
    header: 6,
    body: 5,
    small: 4,
  },
  colors: {
    primary: [41, 98, 255] as [number, number, number],
    text: [33, 33, 33] as [number, number, number],
    muted: [128, 128, 128] as [number, number, number],
    border: [220, 220, 220] as [number, number, number],
    weekend: [248, 250, 252] as [number, number, number],
    today: [239, 246, 255] as [number, number, number],
    teamHeader: [243, 244, 246] as [number, number, number],
  },
  statusColors: {
    P: [220, 252, 231] as [number, number, number], // emerald-100
    R: [241, 245, 249] as [number, number, number], // slate-100
    C: [224, 242, 254] as [number, number, number], // sky-100
    S: [254, 226, 226] as [number, number, number], // red-100
    TR: [243, 232, 255] as [number, number, number], // purple-100
    TT: [254, 243, 199] as [number, number, number], // amber-100
    UNK: [249, 250, 251] as [number, number, number], // gray-50
  },
  statusTextColors: {
    P: [22, 101, 52] as [number, number, number], // emerald-800
    R: [71, 85, 105] as [number, number, number], // slate-500
    C: [7, 89, 133] as [number, number, number], // sky-800
    S: [153, 27, 27] as [number, number, number], // red-800
    TR: [107, 33, 168] as [number, number, number], // purple-800
    TT: [146, 64, 14] as [number, number, number], // amber-800
    UNK: [107, 114, 128] as [number, number, number], // gray-500
  },
};

interface ExportData {
  currentMonth: Date;
  teams: HRTeam[];
  employeesByTeam: Record<string, HREmployee[]>;
  monthDays: Date[];
  getPlanningDay: (employeeId: string, date: string) => PlanningDay | undefined;
  getEmployeeSummary: (employeeId: string) => EmployeeMonthlySummary;
}

const formatOvertime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h${mins}`;
};

export const generatePlanningPDF = (data: ExportData): jsPDF => {
  const { currentMonth, teams, employeesByTeam, monthDays, getPlanningDay, getEmployeeSummary } = data;
  
  // A4 Landscape
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const { margin, headerHeight, rowHeight, cellWidth, employeeColWidth, recapColWidth, fontSize, colors, statusColors, statusTextColors } = PDF_CONFIG;
  
  // Calculate content area
  const contentWidth = pageWidth - margin * 2;
  const daysCount = monthDays.length;
  const recapCols = 6; // P, R, C, S, TR, H+
  
  // Title and header
  doc.setFontSize(fontSize.title);
  doc.setTextColor(...colors.primary);
  doc.setFont('helvetica', 'bold');
  doc.text('PLANNING RH', margin, margin + 5);
  
  doc.setFontSize(fontSize.subtitle);
  doc.setTextColor(...colors.text);
  doc.setFont('helvetica', 'normal');
  const monthTitle = format(currentMonth, 'MMMM yyyy', { locale: fr });
  doc.text(monthTitle.charAt(0).toUpperCase() + monthTitle.slice(1), margin + 35, margin + 5);
  
  // Generated date
  doc.setFontSize(fontSize.small);
  doc.setTextColor(...colors.muted);
  doc.text(
    `Généré le ${format(new Date(), "dd/MM/yyyy 'à' HH:mm", { locale: fr })}`,
    pageWidth - margin,
    margin + 5,
    { align: 'right' }
  );
  
  // Start positions
  let startY = margin + headerHeight;
  const gridStartX = margin + employeeColWidth;
  const recapStartX = gridStartX + (daysCount * cellWidth) + 3;
  
  // Draw day headers
  const drawDayHeaders = (y: number) => {
    // Weekday row
    doc.setFontSize(fontSize.header);
    doc.setTextColor(...colors.muted);
    doc.setFont('helvetica', 'normal');
    
    monthDays.forEach((day, index) => {
      const x = gridStartX + (index * cellWidth);
      const dayName = format(day, 'EEE', { locale: fr }).charAt(0).toUpperCase();
      const isWeekend = day.getDay() === 0 || day.getDay() === 6;
      
      if (isWeekend) {
        doc.setFillColor(...colors.weekend);
        doc.rect(x, y - 3, cellWidth, rowHeight * 2 + 3, 'F');
      }
      
      doc.setTextColor(...colors.muted);
      doc.text(dayName, x + cellWidth / 2, y, { align: 'center' });
    });
    
    // Day number row
    doc.setFontSize(fontSize.header);
    doc.setTextColor(...colors.text);
    doc.setFont('helvetica', 'bold');
    
    monthDays.forEach((day, index) => {
      const x = gridStartX + (index * cellWidth);
      const dayNum = format(day, 'd');
      doc.text(dayNum, x + cellWidth / 2, y + rowHeight, { align: 'center' });
    });
    
    // Recap headers
    doc.setFontSize(fontSize.small);
    doc.setFont('helvetica', 'bold');
    const recapHeaders = ['P', 'R', 'C', 'S', 'TR', 'H+'];
    recapHeaders.forEach((header, index) => {
      const x = recapStartX + (index * recapColWidth);
      doc.setTextColor(...(statusTextColors[header as keyof typeof statusTextColors] || colors.text));
      doc.text(header, x + recapColWidth / 2, y + rowHeight / 2, { align: 'center' });
    });
    
    return y + rowHeight * 2 + 2;
  };
  
  // Draw grid lines
  const drawGridLines = (startY: number, endY: number) => {
    doc.setDrawColor(...colors.border);
    doc.setLineWidth(0.1);
    
    // Vertical lines for days
    for (let i = 0; i <= daysCount; i++) {
      const x = gridStartX + (i * cellWidth);
      doc.line(x, startY, x, endY);
    }
    
    // Vertical lines for recap
    for (let i = 0; i <= recapCols; i++) {
      const x = recapStartX + (i * recapColWidth);
      doc.line(x, startY, x, endY);
    }
  };
  
  // Track current page and y position
  let currentY = startY;
  let headerY = startY;
  
  // Draw headers on first page
  currentY = drawDayHeaders(currentY);
  const gridStartY = currentY;
  
  // Process each team
  teams.forEach((team) => {
    const teamEmployees = employeesByTeam[team.id] || [];
    if (teamEmployees.length === 0) return;
    
    // Check if we need a new page
    const teamHeight = (teamEmployees.length + 1) * rowHeight + 4;
    if (currentY + teamHeight > pageHeight - margin) {
      // Draw grid lines for current page
      drawGridLines(gridStartY, currentY);
      
      // New page
      doc.addPage();
      currentY = margin + 10;
      
      // Redraw headers
      currentY = drawDayHeaders(currentY);
    }
    
    // Team header row
    doc.setFillColor(...colors.teamHeader);
    doc.rect(margin, currentY, pageWidth - margin * 2, rowHeight + 1, 'F');
    
    doc.setFontSize(fontSize.body);
    doc.setTextColor(...colors.text);
    doc.setFont('helvetica', 'bold');
    doc.text(`${team.name} (${teamEmployees.length})`, margin + 2, currentY + rowHeight - 1);
    
    currentY += rowHeight + 2;
    
    // Employee rows
    teamEmployees.forEach((employee) => {
      // Check for page break
      if (currentY + rowHeight > pageHeight - margin) {
        drawGridLines(gridStartY, currentY);
        doc.addPage();
        currentY = margin + 10;
        currentY = drawDayHeaders(currentY);
      }
      
      // Horizontal line
      doc.setDrawColor(...colors.border);
      doc.setLineWidth(0.1);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      
      // Employee name
      doc.setFontSize(fontSize.body);
      doc.setTextColor(...colors.text);
      doc.setFont('helvetica', 'normal');
      
      const displayName = employee.displayName.length > 20 
        ? employee.displayName.substring(0, 18) + '...'
        : employee.displayName;
      doc.text(displayName, margin + 2, currentY + rowHeight - 1.5);
      
      // Day cells
      monthDays.forEach((day, index) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const planning = getPlanningDay(employee.id, dateStr);
        const status = planning?.status || 'UNK';
        const x = gridStartX + (index * cellWidth);
        
        // Cell background
        const bgColor = statusColors[status as keyof typeof statusColors] || statusColors.UNK;
        doc.setFillColor(...bgColor);
        doc.rect(x, currentY, cellWidth, rowHeight, 'F');
        
        // Status code
        if (status !== 'UNK') {
          const textColor = statusTextColors[status as keyof typeof statusTextColors] || colors.text;
          doc.setTextColor(...textColor);
          doc.setFontSize(fontSize.small);
          doc.setFont('helvetica', 'bold');
          doc.text(status, x + cellWidth / 2, currentY + rowHeight - 1.5, { align: 'center' });
        }
        
        // Overtime indicator
        if (planning?.overtimeMinutes && planning.overtimeMinutes > 0) {
          doc.setFontSize(3);
          doc.setTextColor(180, 83, 9); // amber-700
          doc.text('+', x + cellWidth - 1.5, currentY + 2);
        }
      });
      
      // Recap values
      const summary = getEmployeeSummary(employee.id);
      const recapValues = [
        summary.presentDays,
        summary.restDays,
        summary.paidLeaveDays,
        summary.sickDays,
        summary.trainingDays,
        summary.totalOvertimeMinutes > 0 ? formatOvertime(summary.totalOvertimeMinutes) : '-',
      ];
      
      doc.setFontSize(fontSize.small);
      doc.setFont('helvetica', 'normal');
      
      recapValues.forEach((value, index) => {
        const x = recapStartX + (index * recapColWidth);
        doc.setTextColor(...colors.text);
        doc.text(String(value), x + recapColWidth / 2, currentY + rowHeight - 1.5, { align: 'center' });
      });
      
      currentY += rowHeight;
    });
    
    currentY += 2; // Gap after team
  });
  
  // Draw final grid lines
  drawGridLines(gridStartY, currentY);
  
  // Legend at the bottom
  const legendY = currentY + 5;
  if (legendY < pageHeight - margin - 10) {
    doc.setFontSize(fontSize.small);
    doc.setFont('helvetica', 'normal');
    
    const statuses = Object.values(PLANNING_STATUSES).filter(s => s.code !== 'UNK');
    let legendX = margin;
    
    statuses.forEach((status) => {
      const bgColor = statusColors[status.code as keyof typeof statusColors];
      const textColor = statusTextColors[status.code as keyof typeof statusTextColors];
      
      // Color box
      doc.setFillColor(...bgColor);
      doc.rect(legendX, legendY, 4, 3, 'F');
      
      // Text
      doc.setTextColor(...textColor);
      doc.text(`${status.code} = ${status.label}`, legendX + 5, legendY + 2.5);
      
      legendX += 35;
    });
  }
  
  // Footer on each page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(fontSize.small);
    doc.setTextColor(...colors.muted);
    doc.text(
      `Page ${i} / ${pageCount}`,
      pageWidth / 2,
      pageHeight - 5,
      { align: 'center' }
    );
  }
  
  return doc;
};

export const downloadPlanningPDF = (data: ExportData) => {
  const doc = generatePlanningPDF(data);
  const monthStr = format(data.currentMonth, 'yyyy-MM', { locale: fr });
  doc.save(`planning-rh-${monthStr}.pdf`);
};

export const getPlanningPDFBlob = (data: ExportData): Blob => {
  const doc = generatePlanningPDF(data);
  return doc.output('blob');
};
