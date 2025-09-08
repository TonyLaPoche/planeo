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
  const title = `Planneo - ${new Date(month + '-01').toLocaleDateString('fr-FR', {
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
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(user.name, margin, currentY);
    currentY += 8;

    // Statistiques générales
    doc.setFontSize(20);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total d'heures: ${report.totalHours}h`, margin, currentY);
    doc.text(`Nombre de jours: ${report.totalDays}`, margin + 60, currentY);
    doc.text(`Moyenne par jour: ${report.averageHoursPerDay}h`, margin + 120, currentY);
    currentY += 10;

    // Tableau des créneaux hebdomadaires
    if (options.includeNotes && report.weeklyBreakdown.length > 0) {
      // En-tête du tableau
      doc.setFontSize(16);
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
        if (currentY > pageHeight - 35) {
          doc.addPage();
          currentY = margin;
        }

        // const weekStart = new Date(week.weekStart); // Not used
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
        doc.setFontSize(16);
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
            doc.setFontSize(16);
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

  // Pied de page - Page unique pour ce rapport simple
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Généré le ${new Date().toLocaleDateString('fr-FR')} avec Planneo`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

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
 * Génère un PDF optimisé du planning avec tableau hebdomadaire et détails
 */
export const generateOptimizedPlanningPDF = async (data: PDFData): Promise<void> => {
  const { month, users, shifts } = data;
  const doc = new jsPDF('portrait', 'mm', 'a4');

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 8;

  // === PAGE 1 : TABLEAU HEBDOMADAIRE EN PAYSAGE ===
  doc.setPage(0);

  // Titre principal (marge réduite)
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const title = `Planneo - ${new Date(month + '-01').toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  })}`;
  doc.text(title, pageWidth / 2, margin + 2, { align: 'center' });

  // Préparer les données du tableau hebdomadaire
  const monthStart = new Date(month + '-01');

  // Créer un tableau compact pour tout le mois
  let currentY = margin + 12;

  // Obtenir tous les jours du mois
  const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
  const daysInMonth = monthEnd.getDate();

  // Collecter toutes les données des employés actifs
  const activeUsers = users.filter(user => user.isActive);

  // Créer un tableau détaillé : Jour | Employé1 | Employé2 | Employé3 | etc.
  const tableData: string[][] = [];

  // En-tête du tableau avec noms complets
  const headerRow = ['Jour'];
  activeUsers.forEach(user => {
    headerRow.push(user.name); // Nom complet
  });
  tableData.push(headerRow);

  // Remplir les données pour chaque jour
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
    const dayName = currentDate.toLocaleDateString('fr-FR', { weekday: 'long' });
    const dayLabel = `${dayName} ${day}`;

    const row = [dayLabel];

    // Pour chaque employé actif
    activeUsers.forEach(user => {
      const userShifts = shifts.filter(shift => {
        const shiftDate = new Date(shift.date);
        return shiftDate.getDate() === day &&
               shiftDate.getMonth() === monthStart.getMonth() &&
               shift.userId === user.id;
      });

      if (userShifts.length === 0) {
        row.push('-');
      } else {
        // Afficher les horaires détaillés (ouverture-fermeture)
        const timeSlots = userShifts.map(shift => `${shift.startTime}-${shift.endTime}`);
        row.push(timeSlots.join(' '));
      }
    });

    tableData.push(row);
  }

  // Calculer les largeurs de colonnes (optimisées pour portrait)
  const dayColWidth = 55; // Largeur pour jours complets en portrait
  const remainingWidth = pageWidth - (margin * 2) - dayColWidth;
  const employeeColWidth = Math.max(remainingWidth / activeUsers.length, 25); // Largeur adaptée au portrait

  // Calculer la largeur totale du tableau
  const tableWidth = dayColWidth + (activeUsers.length * employeeColWidth);

  // Afficher le tableau avec police encore plus agrandie
  doc.setFontSize(10); // Police agrandie pour les en-têtes
  doc.setFont('helvetica', 'bold');

  tableData.forEach((row, rowIndex) => {
    if (currentY > pageHeight - 35) {
      // Si on dépasse, ajouter une nouvelle page
      doc.addPage();
      currentY = margin + 12;

      // Redessiner l'en-tête sur la nouvelle page (marge réduite)
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(title, pageWidth / 2, margin + 5, { align: 'center' });
      currentY = margin + 12;
    }

    const isHeader = rowIndex === 0;
    const isAlternateRow = rowIndex > 0 && rowIndex % 2 === 1; // Une ligne sur deux pour les données

    let fillColor: number[];
    let backgroundWidth: number;

    if (isHeader) {
      // En-tête : fond gris sur toute la largeur du tableau
      fillColor = [240, 240, 240];
      backgroundWidth = tableWidth;
    } else if (isAlternateRow) {
      // Ligne alternée : fond gris très clair
      fillColor = [245, 245, 245];
      backgroundWidth = tableWidth;
    } else {
      // Ligne normale : pas de fond
      fillColor = [255, 255, 255];
      backgroundWidth = 0; // Pas de fond
    }

    // Fond de ligne (ajusté pour polices encore plus grandes)
    if (backgroundWidth > 0) {
      doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
      doc.rect(margin, currentY - 1, backgroundWidth, 8, 'F');

      // Ajouter une bordure de 1px autour de chaque ligne
      doc.setDrawColor(0, 0, 0); // Noir
      doc.setLineWidth(0.5); // 1px = 0.5pt en jsPDF
      doc.rect(margin, currentY - 1, backgroundWidth, 8);
    }

    row.forEach((cell, colIndex) => {
      let x, maxWidth;
      if (colIndex === 0) {
        // Colonne des jours (ajustée pour jours complets) avec padding 4px
        x = margin + 4; // 4px de padding
        maxWidth = dayColWidth - 8; // Soustraire 8px pour le padding gauche + droite
      } else {
        // Colonnes des employés (écarts ultra-minimisés) avec padding 4px
        x = margin + dayColWidth + ((colIndex - 1) * employeeColWidth) + 4; // 4px de padding
        maxWidth = employeeColWidth - 8; // Soustraire 8px pour le padding gauche + droite
      }

      // Ajuster la police selon le contenu (tailles encore plus agrandies)
      if (isHeader) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10); // Police agrandie pour les en-têtes
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9); // Police agrandie pour les données (jours + horaires)
      }

      // Tronquer si trop long
      let displayText = cell;
      if (doc.getTextWidth(displayText) > maxWidth) {
        while (doc.getTextWidth(displayText + '...') > maxWidth && displayText.length > 3) {
          displayText = displayText.slice(0, -1);
        }
        if (displayText.length < cell.length) {
          displayText += '...';
        }
      }

      doc.text(displayText, x, currentY + 4); // Centré dans cellules plus hautes
    });

    currentY += 8; // Espace ajusté pour polices encore plus grandes
  });

  // Ajouter une bordure de 2px autour du tableau complet
  const tableStartY = margin + 11; // Position Y ultra-précise
  const tableHeight = (tableData.length * 8) + 0; // Hauteur exacte sans ajustement supplémentaire

  doc.setDrawColor(0, 0, 0); // Noir
  doc.setLineWidth(1); // 2px = 1pt en jsPDF
  doc.rect(margin, tableStartY, tableWidth, tableHeight);

  // === PAGE 2 : DÉTAILS DES TOTAUX HORAIRES ===
  doc.addPage();

  // Titre de la page 2 (marge réduite)
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Totaux Horaires - Détails par Employé', pageWidth / 2, margin + 5, { align: 'center' });

  currentY = margin + 15;

  // Statistiques détaillées pour chaque employé
  activeUsers.forEach((user) => {
    const userShifts = shifts.filter(shift => shift.userId === user.id);
    const monthlyReport = generateMonthlyReport(shifts, month, user.id);

    if (userShifts.length === 0) return;

    // Vérifier l'espace
    if (currentY > pageHeight - 40) {
      doc.addPage();
      currentY = margin + 10;
    }

    // Nom de l'employé avec fond
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, currentY - 3, pageWidth - (margin * 2), 8, 'F');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(user.name, margin + 5, currentY + 2);
    currentY += 12;

    // Statistiques principales
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total heures: ${monthlyReport.totalHours.toFixed(1)}h`, margin + 5, currentY);
    doc.text(`Jours travaillés: ${monthlyReport.totalDays}`, margin + 80, currentY);
    doc.text(`Moyenne/jour: ${monthlyReport.averageHoursPerDay.toFixed(1)}h`, margin + 150, currentY);
    currentY += 8;

    // Ventilation par semaine si disponible
    if (monthlyReport.weeklyBreakdown && monthlyReport.weeklyBreakdown.length > 0) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('Répartition par semaine:', margin + 5, currentY);
      currentY += 6;

      doc.setFont('helvetica', 'normal');
      monthlyReport.weeklyBreakdown.forEach((week, weekIndex) => {
        if (currentY > pageHeight - 15) {
          doc.addPage();
          currentY = margin + 10;
        }

        const weekDays = week.dailyHours.filter(day => day.totalHours > 0).length;
        doc.text(`Semaine ${weekIndex + 1}: ${week.totalHours.toFixed(1)}h (${weekDays} jours)`, margin + 10, currentY);
        currentY += 5;
      });
    }

    // Espace entre employés
    currentY += 8;
  });

  // Pied de page sur toutes les pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Page ${i}/${totalPages} - Généré le ${new Date().toLocaleDateString('fr-FR')} avec Planning Local`,
      pageWidth / 2,
      pageHeight - 3,
      { align: 'center' }
    );
    doc.setTextColor(0, 0, 0);
  }

  // Télécharger le PDF
  const filename = `planneo-optimise-${month}.pdf`;
  doc.save(filename);
};

/**
 * Génère un PDF du planning uniquement (sans page des totaux)
 */
export const generatePlanningOnlyPDF = async (data: PDFData): Promise<void> => {
  const { month, users, shifts } = data;
  const doc = new jsPDF('portrait', 'mm', 'a4');

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 8;

  // === PAGE UNIQUE : TABLEAU DU PLANNING ===
  doc.setPage(0);

  // Titre principal
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const title = `Planneo - ${new Date(month + '-01').toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  })}`;
  doc.text(title, pageWidth / 2, margin + 2, { align: 'center' });

  // Préparer les données du tableau hebdomadaire
  const monthStart = new Date(month + '-01');

  // Créer un tableau compact pour tout le mois
  let currentY = margin + 12;

  // Obtenir tous les jours du mois
  const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
  const daysInMonth = monthEnd.getDate();

  // Collecter toutes les données des employés actifs
  const activeUsers = users.filter(user => user.isActive);

  // Créer un tableau détaillé : Jour | Employé1 | Employé2 | Employé3 | etc.
  const tableData: string[][] = [];

  // En-tête du tableau avec noms complets
  const headerRow = ['Jour'];
  activeUsers.forEach(user => {
    headerRow.push(user.name); // Nom complet
  });
  tableData.push(headerRow);

  // Remplir les données pour chaque jour
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
    const dayName = currentDate.toLocaleDateString('fr-FR', { weekday: 'long' });
    const dayLabel = `${dayName} ${day}`;

    const row = [dayLabel];

    // Pour chaque employé actif
    activeUsers.forEach(user => {
      const userShifts = shifts.filter(shift => {
        const shiftDate = new Date(shift.date);
        return shiftDate.getDate() === day &&
               shiftDate.getMonth() === monthStart.getMonth() &&
               shift.userId === user.id;
      });

      if (userShifts.length === 0) {
        row.push('-');
      } else {
        // Afficher les horaires détaillés (ouverture-fermeture)
        const timeSlots = userShifts.map(shift => `${shift.startTime}-${shift.endTime}`);
        row.push(timeSlots.join(' '));
      }
    });

    tableData.push(row);
  }

  // Calculer les largeurs de colonnes (ultra-compact pour minimiser les écarts)
  const dayColWidth = 55; // Largeur pour jours complets en portrait
  const remainingWidth = pageWidth - (margin * 2) - dayColWidth;
  const employeeColWidth = Math.max(remainingWidth / activeUsers.length, 25); // Largeur adaptée au portrait

  // Calculer la largeur totale du tableau
  const tableWidth = dayColWidth + (activeUsers.length * employeeColWidth);

  // Afficher le tableau avec police agrandie
  doc.setFontSize(10); // Police agrandie pour les en-têtes
  doc.setFont('helvetica', 'bold');

  tableData.forEach((row, rowIndex) => {
    if (currentY > pageHeight - 30) {
      // Si on dépasse, ajouter une nouvelle page
      doc.addPage();
      currentY = margin + 12;

      // Redessiner l'en-tête sur la nouvelle page
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(title, pageWidth / 2, margin + 5, { align: 'center' });
      currentY = margin + 25;
    }

    const isHeader = rowIndex === 0;
    const isAlternateRow = rowIndex > 0 && rowIndex % 2 === 1; // Une ligne sur deux pour les données

    let fillColor: number[];
    let backgroundWidth: number;

    if (isHeader) {
      // En-tête : fond gris sur toute la largeur du tableau
      fillColor = [240, 240, 240];
      backgroundWidth = tableWidth;
    } else if (isAlternateRow) {
      // Ligne alternée : fond gris très clair
      fillColor = [245, 245, 245];
      backgroundWidth = tableWidth;
    } else {
      // Ligne normale : pas de fond
      fillColor = [255, 255, 255];
      backgroundWidth = 0; // Pas de fond
    }

    // Fond de ligne (ajusté pour polices encore plus grandes)
    if (backgroundWidth > 0) {
      doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
      doc.rect(margin, currentY - 1, backgroundWidth, 8, 'F');

      // Ajouter une bordure de 1px autour de chaque ligne
      doc.setDrawColor(0, 0, 0); // Noir
      doc.setLineWidth(0.5); // 1px = 0.5pt en jsPDF
      doc.rect(margin, currentY - 1, backgroundWidth, 8);
    }

    row.forEach((cell, colIndex) => {
      let x, maxWidth;
      if (colIndex === 0) {
        // Colonne des jours (ajustée pour jours complets)
        x = margin + 4; // 4px de padding
        maxWidth = dayColWidth - 8; // Soustraire 8px pour le padding gauche + droite
      } else {
        // Colonnes des employés (écarts ultra-minimisés) avec padding 4px
        x = margin + dayColWidth + ((colIndex - 1) * employeeColWidth) + 4; // 4px de padding
        maxWidth = employeeColWidth - 8; // Soustraire 8px pour le padding gauche + droite
      }

      // Ajuster la police selon le contenu (tailles encore plus agrandies)
      if (isHeader) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10); // Police agrandie pour les en-têtes
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9); // Police agrandie pour les données (jours + horaires)
      }

      // Tronquer si trop long
      let displayText = cell;
      if (doc.getTextWidth(displayText) > maxWidth) {
        while (doc.getTextWidth(displayText + '...') > maxWidth && displayText.length > 3) {
          displayText = displayText.slice(0, -1);
        }
        if (displayText.length < cell.length) {
          displayText += '...';
        }
      }

      doc.text(displayText, x, currentY + 4); // Centré dans cellules plus hautes
    });

    currentY += 8; // Espace ajusté pour polices encore plus grandes
  });

  // Ajouter une bordure de 2px autour du tableau complet
  const tableStartY = margin + 11; // Position Y ultra-précise
  const tableHeight = (tableData.length * 8) + 0; // Hauteur exacte sans ajustement supplémentaire

  doc.setDrawColor(0, 0, 0); // Noir
  doc.setLineWidth(1); // 2px = 1pt en jsPDF
  doc.rect(margin, tableStartY, tableWidth, tableHeight);

  // Pied de page compact
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Généré le ${new Date().toLocaleDateString('fr-FR')} avec Planneo`,
    pageWidth - margin,
    pageHeight - 3,
    { align: 'right' }
  );
  doc.setTextColor(0, 0, 0);

  // Télécharger le PDF
  const filename = `planneo-simple-${month}.pdf`;
  doc.save(filename);
};

/**
 * Génère un rapport PDF simple avec les totaux
 */
export const generateSimpleReportPDF = (data: PDFData): void => {
  const { month, users, shifts } = data;
  // options is destructured but not used in this function
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

  // Pied de page (marge réduite)
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Généré le ${new Date().toLocaleDateString('fr-FR')} avec Planneo`,
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 6,
    { align: 'center' }
  );

  const filename = `rapport-${month}.pdf`;
  doc.save(filename);
};
