
import jsPDF from "jspdf";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { RentCall, RentReceipt, Lease, Booking } from "../types";

// Common PDF settings
const PDF_CONFIG = {
  margin: 20,
  lineHeight: 7,
  titleSize: 18,
  subtitleSize: 14,
  bodySize: 11,
  smallSize: 9,
  primaryColor: [41, 98, 255] as [number, number, number],
  textColor: [33, 33, 33] as [number, number, number],
  mutedColor: [128, 128, 128] as [number, number, number],
};

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

// Format date
const formatDate = (dateString: string): string => {
  return format(parseISO(dateString), "dd MMMM yyyy", { locale: fr });
};

// Format month
const formatMonth = (month: string): string => {
  return format(parseISO(`${month}-01`), "MMMM yyyy", { locale: fr });
};

// Add header to PDF
const addHeader = (doc: jsPDF, title: string, subtitle?: string) => {
  const { margin, titleSize, subtitleSize, primaryColor, textColor } = PDF_CONFIG;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Company name
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("BNB LYON", margin, margin);

  // Title
  doc.setFontSize(titleSize);
  doc.setTextColor(...textColor);
  doc.text(title, pageWidth / 2, margin + 20, { align: "center" });

  // Subtitle
  if (subtitle) {
    doc.setFontSize(subtitleSize);
    doc.setTextColor(...PDF_CONFIG.mutedColor);
    doc.setFont("helvetica", "normal");
    doc.text(subtitle, pageWidth / 2, margin + 30, { align: "center" });
  }

  // Horizontal line
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(margin, margin + 40, pageWidth - margin, margin + 40);

  return margin + 50;
};

// Add footer to PDF
const addFooter = (doc: jsPDF) => {
  const { margin, smallSize, mutedColor } = PDF_CONFIG;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFontSize(smallSize);
  doc.setTextColor(...mutedColor);
  doc.setFont("helvetica", "normal");

  const footerY = pageHeight - margin;
  doc.line(margin, footerY - 10, pageWidth - margin, footerY - 10);
  doc.text(
    `Document généré le ${format(new Date(), "dd/MM/yyyy à HH:mm", { locale: fr })}`,
    pageWidth / 2,
    footerY,
    { align: "center" }
  );
};

// Add a labeled row
const addRow = (
  doc: jsPDF,
  label: string,
  value: string,
  y: number,
  options?: { bold?: boolean; large?: boolean }
) => {
  const { margin, bodySize, subtitleSize, textColor, mutedColor } = PDF_CONFIG;
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(options?.large ? subtitleSize : bodySize);

  // Label
  doc.setTextColor(...mutedColor);
  doc.setFont("helvetica", "normal");
  doc.text(label, margin, y);

  // Value
  doc.setTextColor(...textColor);
  doc.setFont("helvetica", options?.bold ? "bold" : "normal");
  doc.text(value, pageWidth - margin, y, { align: "right" });

  return y + PDF_CONFIG.lineHeight;
};

// Add a section title
const addSectionTitle = (doc: jsPDF, title: string, y: number) => {
  const { margin, subtitleSize, primaryColor } = PDF_CONFIG;

  doc.setFontSize(subtitleSize);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text(title, margin, y);

  return y + PDF_CONFIG.lineHeight + 3;
};

// Generate Rent Call PDF
export const generateRentCallPDF = (
  rentCall: RentCall,
  booking: Booking,
  companyInfo?: { name?: string; address?: string; siret?: string }
): jsPDF => {
  const doc = new jsPDF();
  const { margin, bodySize, textColor, mutedColor, lineHeight } = PDF_CONFIG;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  let y = addHeader(doc, "APPEL DE LOYER", formatMonth(rentCall.month));

  // Reference
  doc.setFontSize(bodySize);
  doc.setTextColor(...mutedColor);
  doc.text(`Référence : ${rentCall.id}`, margin, y);
  y += lineHeight * 2;

  // Landlord section
  y = addSectionTitle(doc, "BAILLEUR", y);
  doc.setFontSize(bodySize);
  doc.setTextColor(...textColor);
  doc.setFont("helvetica", "normal");
  doc.text(companyInfo?.name || "BNB Lyon", margin, y);
  y += lineHeight;
  doc.text(companyInfo?.address || "Lyon, France", margin, y);
  y += lineHeight;
  if (companyInfo?.siret) {
    doc.text(`SIRET : ${companyInfo.siret}`, margin, y);
    y += lineHeight;
  }
  y += lineHeight;

  // Tenant section
  y = addSectionTitle(doc, "LOCATAIRE", y);
  doc.setFontSize(bodySize);
  doc.setTextColor(...textColor);
  doc.text(booking.tenant, margin, y);
  y += lineHeight * 2;

  // Property section
  y = addSectionTitle(doc, "LOGEMENT", y);
  doc.setFontSize(bodySize);
  doc.setTextColor(...textColor);
  doc.text(booking.property, margin, y);
  y += lineHeight * 2;

  // Details box
  doc.setFillColor(245, 245, 250);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 50, 3, 3, "F");
  y += 15;

  y = addRow(doc, "Période concernée", formatMonth(rentCall.month), y);
  y = addRow(doc, "Date d'échéance", formatDate(rentCall.dueDate), y);
  y += 5;
  y = addRow(doc, "MONTANT À PAYER", formatCurrency(rentCall.amount), y, {
    bold: true,
    large: true,
  });

  y += 20;

  // Payment instructions
  y = addSectionTitle(doc, "INSTRUCTIONS DE PAIEMENT", y);
  doc.setFontSize(bodySize);
  doc.setTextColor(...textColor);
  doc.setFont("helvetica", "normal");

  const instructions = [
    "Merci de procéder au règlement avant la date d'échéance indiquée.",
    "Modes de paiement acceptés : virement bancaire, prélèvement automatique.",
    "En cas de retard de paiement, des pénalités pourront être appliquées.",
  ];

  instructions.forEach((line) => {
    doc.text(`• ${line}`, margin, y);
    y += lineHeight;
  });

  // Footer
  addFooter(doc);

  return doc;
};

// Generate Rent Receipt PDF
export const generateReceiptPDF = (
  receipt: RentReceipt,
  booking: Booking,
  companyInfo?: { name?: string; address?: string; siret?: string }
): jsPDF => {
  const doc = new jsPDF();
  const { margin, bodySize, textColor, mutedColor, lineHeight } = PDF_CONFIG;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  let y = addHeader(doc, "QUITTANCE DE LOYER", formatMonth(receipt.month));

  // Reference
  doc.setFontSize(bodySize);
  doc.setTextColor(...mutedColor);
  doc.text(`Référence : ${receipt.id}`, margin, y);
  y += lineHeight * 2;

  // Landlord section
  y = addSectionTitle(doc, "BAILLEUR", y);
  doc.setFontSize(bodySize);
  doc.setTextColor(...textColor);
  doc.setFont("helvetica", "normal");
  doc.text(companyInfo?.name || "BNB Lyon", margin, y);
  y += lineHeight;
  doc.text(companyInfo?.address || "Lyon, France", margin, y);
  y += lineHeight * 2;

  // Tenant section
  y = addSectionTitle(doc, "LOCATAIRE", y);
  doc.setFontSize(bodySize);
  doc.setTextColor(...textColor);
  doc.text(booking.tenant, margin, y);
  y += lineHeight * 2;

  // Property section
  y = addSectionTitle(doc, "LOGEMENT", y);
  doc.setFontSize(bodySize);
  doc.setTextColor(...textColor);
  doc.text(booking.property, margin, y);
  y += lineHeight * 2;

  // Receipt details box
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 60, 3, 3, "F");
  y += 15;

  y = addRow(doc, "Période concernée", formatMonth(receipt.month), y);
  y = addRow(doc, "Date de paiement", formatDate(receipt.paymentDate), y);
  y += 5;

  // Green highlight for amount received
  doc.setFillColor(34, 197, 94);
  doc.roundedRect(margin + 10, y - 5, pageWidth - margin * 2 - 20, 20, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("MONTANT REÇU", margin + 20, y + 5);
  doc.text(formatCurrency(receipt.amount), pageWidth - margin - 20, y + 5, {
    align: "right",
  });

  y += 30;

  // Legal text
  doc.setFontSize(bodySize);
  doc.setTextColor(...textColor);
  doc.setFont("helvetica", "normal");

  y += 20;
  const legalText = [
    "Le bailleur soussigné déclare avoir reçu du locataire désigné ci-dessus",
    `la somme de ${formatCurrency(receipt.amount)} au titre du loyer et des charges`,
    `pour la période de ${formatMonth(receipt.month)}.`,
    "",
    "Cette quittance est délivrée sous réserve de l'encaissement définitif",
    "du paiement et ne préjuge pas des sommes restant éventuellement dues",
    "au titre de loyers ou charges antérieurs.",
  ];

  legalText.forEach((line) => {
    doc.text(line, margin, y);
    y += lineHeight;
  });

  // Signature area
  y += 20;
  doc.setFontSize(bodySize);
  doc.text("Fait à Lyon,", margin, y);
  y += lineHeight;
  doc.text(`le ${format(new Date(), "dd MMMM yyyy", { locale: fr })}`, margin, y);

  y += 20;
  doc.text("Signature du bailleur :", margin, y);
  doc.setDrawColor(...PDF_CONFIG.mutedColor);
  doc.line(margin + 50, y + 15, margin + 120, y + 15);

  // Footer
  addFooter(doc);

  return doc;
};

// Generate Lease PDF
export const generateLeasePDF = (
  lease: Lease,
  booking: Booking,
  companyInfo?: { name?: string; address?: string; siret?: string }
): jsPDF => {
  const doc = new jsPDF();
  const { margin, bodySize, textColor, lineHeight } = PDF_CONFIG;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header
  let y = addHeader(doc, "CONTRAT DE LOCATION", lease.templateName);

  // Reference and version
  doc.setFontSize(PDF_CONFIG.smallSize);
  doc.setTextColor(...PDF_CONFIG.mutedColor);
  doc.text(`Référence : ${lease.id} • Version ${lease.currentVersion}`, margin, y);
  y += lineHeight * 2;

  // Content
  doc.setFontSize(bodySize);
  doc.setTextColor(...textColor);
  doc.setFont("helvetica", "normal");

  // Split content into lines and add pages as needed
  const maxWidth = pageWidth - margin * 2;
  const lines = doc.splitTextToSize(lease.content, maxWidth);
  const maxY = pageHeight - 40;

  lines.forEach((line: string) => {
    if (y > maxY) {
      addFooter(doc);
      doc.addPage();
      y = margin + 20;
    }
    doc.text(line, margin, y);
    y += lineHeight - 1;
  });

  // Signature area on last page
  if (y > maxY - 60) {
    addFooter(doc);
    doc.addPage();
    y = margin + 20;
  }

  y += 20;
  doc.setFontSize(bodySize);
  doc.setFont("helvetica", "bold");
  doc.text("SIGNATURES", margin, y);
  y += lineHeight * 2;

  doc.setFont("helvetica", "normal");

  // Two signature columns
  const colWidth = (pageWidth - margin * 2 - 20) / 2;

  doc.text("Le Bailleur :", margin, y);
  doc.text("Le Locataire :", margin + colWidth + 20, y);
  y += 5;

  doc.setDrawColor(...PDF_CONFIG.mutedColor);
  doc.line(margin, y + 25, margin + colWidth - 10, y + 25);
  doc.line(margin + colWidth + 20, y + 25, pageWidth - margin, y + 25);

  y += 35;
  doc.text("Date :", margin, y);
  doc.text("Date :", margin + colWidth + 20, y);
  doc.line(margin + 20, y + 5, margin + colWidth - 10, y + 5);
  doc.line(margin + colWidth + 40, y + 5, pageWidth - margin, y + 5);

  // Footer
  addFooter(doc);

  return doc;
};

// Download PDF helper
export const downloadPDF = (doc: jsPDF, filename: string) => {
  doc.save(`${filename}.pdf`);
};

// Get PDF as blob for email attachment
export const getPDFBlob = (doc: jsPDF): Blob => {
  return doc.output("blob");
};
