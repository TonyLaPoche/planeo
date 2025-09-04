import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { User, Shift, PDFExportOptions } from '@/types';
import { formatDate, formatDuration, calculateShiftDuration, generateMonthlyReport } from '@/utils/time';

export interface PDFData {
  month: string;
  users: User[];
  shifts: Shift[];
  options: PDFExportOptions;
}

/**
 * Génère un PDF du planning mensuel
 */
export const generatePlanningPDF = async (data: PDFData): Promise<void> => {
  const { month, users, shifts, options } = data;
  const doc = new jsPDF(options.orientation === 'landscape' ? 'l' : 'p', 'mm', options.format);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  let currentY = margin;

  // Titre
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  const title = `Planning - ${new Date(month + '-01').toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  })}`;
  doc.text(title, pageWidth / 2, currentY, { align: 'center' });
  currentY += 15;

  // Générer les rapports mensuels pour chaque utilisateur
  const monthlyReports = users.map(user =>
    generateMonthlyReport(shifts, month, user.id)
  ).filter(report => report.totalHours > 0);

  // Trier par nom d'utilisateur
  monthlyReports.sort((a, b) => {
    const userA = users.find(u => u.id === a.userId);
    const userB = users.find(u => u.id === b.userId);
    return (userA?.name || '').localeCompare(userB?.name || '');
  });

  // Pour chaque utilisateur
  for (const report of monthlyReports) {
    const user = users.find(u => u.id === report.userId);
    if (!user) continue;

    // Vérifier si on a assez d'espace pour ce rapport
    if (currentY > pageHeight - 60) {
      doc.addPage();
      currentY = margin;
    }

    // Nom de l'utilisateur
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(user.name, margin, currentY);
    currentY += 8;

    // Statistiques générales
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total d'heures: ${report.totalHours}h`, margin, currentY);
    doc.text(`Nombre de jours: ${report.totalDays}`, margin + 60, currentY);
    doc.text(`Moyenne par jour: ${report.averageHoursPerDay}h`, margin + 120, currentY);
    currentY += 10;

    // Tableau des créneaux hebdomadaires
    if (options.includeNotes && report.weeklyBreakdown.length > 0) {
      // En-tête du tableau
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      const headers = ['Semaine', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche', 'Total'];
      const colWidth = contentWidth / headers.length;

      headers.forEach((header, index) => {
        doc.text(header, margin + (index * colWidth), currentY);
      });
      currentY += 6;

      // Ligne de séparation
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 4;

      // Données hebdomadaires
      doc.setFont('helvetica', 'normal');
      report.weeklyBreakdown.forEach((week, weekIndex) => {
        if (currentY > pageHeight - 20) {
          doc.addPage();
          currentY = margin;
        }

        const weekStart = new Date(week.weekStart);
        const weekLabel = `S${weekIndex + 1}`;

        // Semaine
        doc.text(weekLabel, margin, currentY);

        // Jours de la semaine
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        days.forEach((day, dayIndex) => {
          const dayData = week.dailyHours.find(d => {
            const dayOfWeek = new Date(d.date).getDay();
            return (dayOfWeek === 0 ? 6 : dayOfWeek - 1) === dayIndex; // Convertir dimanche=0 à samedi=6
          });

          const hours = dayData ? dayData.totalHours.toFixed(1) : '-';
          doc.text(hours, margin + ((dayIndex + 1) * colWidth), currentY);
        });

        // Total semaine
        doc.text(week.totalHours.toFixed(1), margin + (8 * colWidth), currentY);
        currentY += 6;
      });

      currentY += 8;
    }

    // Détail des créneaux quotidiens
    if (options.includeNotes) {
      const userShifts = shifts
        .filter(shift => shift.userId === user.id)
        .sort((a, b) => a.date.localeCompare(b.date));

      if (userShifts.length > 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Détail des créneaux:', margin, currentY);
        currentY += 6;

        doc.setFont('helvetica', 'normal');
        userShifts.forEach(shift => {
          if (currentY > pageHeight - 15) {
            doc.addPage();
            currentY = margin;
          }

          const dateStr = formatDate(shift.date, 'dd/MM');
          const timeStr = `${shift.startTime}-${shift.endTime}`;
          const duration = calculateShiftDuration(shift);
          const durationStr = formatDuration(duration);

          doc.text(`${dateStr}: ${timeStr} (${durationStr})`, margin, currentY);

          if (shift.notes) {
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text(`Note: ${shift.notes}`, margin + 80, currentY);
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
          }

          currentY += 5;
        });

        currentY += 8;
      }
    }

    currentY += 10; // Espace entre utilisateurs
  }

  // Pied de page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Généré le ${new Date().toLocaleDateString('fr-FR')} - Page ${i}/${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Télécharger le PDF
  const filename = `planning-${month}.pdf`;
  doc.save(filename);
};

/**
 * Génère un PDF à partir d'un élément HTML
 */
export const generatePDFFromHTML = async (
  elementId: string,
  filename: string,
  options: Partial<PDFExportOptions> = {}
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF(options.orientation || 'portrait', 'mm', options.format || 'a4');

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pdfWidth - 20; // Marges de 10mm de chaque côté
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 10;

  // Ajouter la première page
  pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight - 20; // 20mm de marge totale

  // Ajouter les pages suivantes si nécessaire
  while (heightLeft >= 0) {
    position = heightLeft - imgHeight + 10;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight - 20;
  }

  pdf.save(filename);
};

/**
 * Génère un rapport PDF simple avec les totaux
 */
export const generateSimpleReportPDF = (data: PDFData): void => {
  const { month, users, shifts, options } = data;
  const doc = new jsPDF('portrait', 'mm', 'a4');

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;

  let currentY = margin;

  // Titre
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  const title = `Rapport Mensuel - ${new Date(month + '-01').toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  })}`;
  doc.text(title, pageWidth / 2, currentY, { align: 'center' });
  currentY += 20;

  // Tableau des totaux
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Récapitulatif des heures travaillées', margin, currentY);
  currentY += 10;

  // En-têtes du tableau
  const headers = ['Employé', 'Jours travaillés', 'Total heures', 'Moyenne/jour'];
  const colWidths = [60, 40, 40, 40];
  let xPos = margin;

  doc.setFontSize(10);
  headers.forEach((header, index) => {
    doc.text(header, xPos, currentY);
    xPos += colWidths[index];
  });
  currentY += 8;

  // Ligne de séparation
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 6;

  // Données
  doc.setFont('helvetica', 'normal');
  users.forEach(user => {
    const userShifts = shifts.filter(shift => shift.userId === user.id);
    if (userShifts.length === 0) return;

    const report = generateMonthlyReport(shifts, month, user.id);
    const days = new Set(userShifts.map(s => s.date)).size;

    xPos = margin;
    doc.text(user.name, xPos, currentY);
    xPos += colWidths[0];
    doc.text(days.toString(), xPos, currentY);
    xPos += colWidths[1];
    doc.text(`${report.totalHours}h`, xPos, currentY);
    xPos += colWidths[2];
    doc.text(`${report.averageHoursPerDay}h`, xPos, currentY);

    currentY += 8;
  });

  // Total général
  currentY += 10;
  const totalHours = users.reduce((total, user) => {
    const report = generateMonthlyReport(shifts, month, user.id);
    return total + report.totalHours;
  }, 0);

  doc.setFont('helvetica', 'bold');
  doc.text(`Total général: ${totalHours.toFixed(1)} heures`, margin, currentY);

  // Pied de page
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Généré le ${new Date().toLocaleDateString('fr-FR')} avec Planning Local`,
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  );

  const filename = `rapport-${month}.pdf`;
  doc.save(filename);
};
