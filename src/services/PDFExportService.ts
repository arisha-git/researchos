import { jsPDF } from 'jspdf';
import { PresentationResult } from '../types/routing';

export class PDFExportService {
  /**
   * Generates and downloads a clean, professional PDF report from a PresentationResult.
   */
  public static exportPDF(presentation: PresentationResult): void {
    // Standard Letter size (8.5 x 11 inches) is approximately 612 x 792 points
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'letter'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 54; // 0.75 in margin
    const contentWidth = pageWidth - (margin * 2);
    
    let currentY = margin;

    // Helper: Check page bounds and add page if needed
    const checkPageBounds = (neededHeight: number): void => {
      if (currentY + neededHeight > pageHeight - margin) {
        doc.addPage();
        currentY = margin;
        // Draw Header on new pages
        drawHeader();
      }
    };

    // Helper: Draw running header rules
    const drawHeader = (): void => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // Slate 400
      doc.text('RESEARCHOS • EXECUTIVE SYNTHESIS REPORT', margin, 36);
      
      doc.setDrawColor(226, 232, 240); // Slate 200 light border line
      doc.setLineWidth(0.5);
      doc.line(margin, 42, pageWidth - margin, 42);
    };

    // Helper: Draw running footer rules
    const drawFooter = (): void => {
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        
        // Horizontal dividing line
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.5);
        doc.line(margin, pageHeight - 42, pageWidth - margin, pageHeight - 42);
        
        // Page numbering and disclaimer
        doc.text('Generated dynamically via ResearchOS Engine', margin, pageHeight - 30);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 30, { align: 'right' });
      }
    };

    // --- PAGE 1: COVER HEADER ---
    // Background brand highlight block (dark slate banner)
    doc.setFillColor(15, 23, 42); // slate 900
    doc.rect(margin, currentY, contentWidth, 110, 'F');

    // Title text (Inside the banner)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255); // White
    
    const titleLines = doc.splitTextToSize(presentation.title.toUpperCase(), contentWidth - 40);
    doc.text(titleLines, margin + 20, currentY + 40);
    
    // Sub-banner info
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text('COMPREHENSIVE MULTI-DOCUMENT EXECUTIVE SYNTHESIS', margin + 20, currentY + 85);
    
    currentY += 140;

    // SECTION 1: Executive Summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42); // slate 900
    doc.text('EXECUTIVE SUMMARY', margin, currentY);
    currentY += 10;
    
    // Divider line
    doc.setDrawColor(59, 130, 246); // Blue 500
    doc.setLineWidth(1.5);
    doc.line(margin, currentY, margin + 120, currentY);
    currentY += 15;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85); // Slate 700 text body
    const summaryLines = doc.splitTextToSize(presentation.executive_summary, contentWidth);
    doc.text(summaryLines, margin, currentY);
    
    // Calculate final block line height
    const summaryHeight = (summaryLines.length * 14);
    currentY += summaryHeight + 35;

    // SECTION 2: Key Findings
    checkPageBounds(100);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('KEY SCIENTIFIC FINDINGS', margin, currentY);
    currentY += 10;
    
    doc.setDrawColor(16, 185, 129); // Emerald 500
    doc.setLineWidth(1.5);
    doc.line(margin, currentY, margin + 140, currentY);
    currentY += 18;

    presentation.key_findings.forEach((finding, idx) => {
      const bulletText = `${idx + 1}.  ${finding}`;
      const lines = doc.splitTextToSize(bulletText, contentWidth - 20);
      const height = lines.length * 14;
      
      checkPageBounds(height + 10);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      doc.text(lines, margin + 10, currentY);
      currentY += height + 8;
    });
    
    currentY += 25;

    // SECTION 3: Methodological Approach
    checkPageBounds(100);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('METHODOLOGICAL APPROACH', margin, currentY);
    currentY += 10;
    
    doc.setDrawColor(245, 158, 11); // Amber 500
    doc.setLineWidth(1.5);
    doc.line(margin, currentY, margin + 170, currentY);
    currentY += 18;

    presentation.methodologies.forEach((methodology, idx) => {
      const bulletText = `•  ${methodology}`;
      const lines = doc.splitTextToSize(bulletText, contentWidth - 20);
      const height = lines.length * 14;
      
      checkPageBounds(height + 10);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      doc.text(lines, margin + 10, currentY);
      currentY += height + 8;
    });

    currentY += 25;

    // SECTION 4: Recommendations
    checkPageBounds(100);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('RECOMMENDATIONS', margin, currentY);
    currentY += 10;
    
    doc.setDrawColor(6, 182, 212); // Cyan 500
    doc.setLineWidth(1.5);
    doc.line(margin, currentY, margin + 120, currentY);
    currentY += 18;

    presentation.recommendations.forEach((rec, idx) => {
      const bulletText = `RECOMMENDATION ${idx + 1}: ${rec}`;
      const lines = doc.splitTextToSize(bulletText, contentWidth - 20);
      const height = lines.length * 14;
      
      checkPageBounds(height + 10);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(`[REC 0${idx + 1}]`, margin + 10, currentY);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(doc.splitTextToSize(rec, contentWidth - 80), margin + 70, currentY);
      currentY += height + 10;
    });

    currentY += 25;

    // SECTION 5: Synthesis Conclusion
    checkPageBounds(120);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('SYNTHESIS CONCLUSION', margin, currentY);
    currentY += 10;
    
    doc.setDrawColor(236, 72, 153); // Pink 500
    doc.setLineWidth(1.5);
    doc.line(margin, currentY, margin + 140, currentY);
    currentY += 18;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    const conclusionLines = doc.splitTextToSize(presentation.conclusion, contentWidth);
    doc.text(conclusionLines, margin, currentY);

    // Call footer decorator function to index total page numbers correctly
    drawFooter();

    // Trigger raw browser download payload
    doc.save('ResearchOS_Presentation.pdf');
  }
}