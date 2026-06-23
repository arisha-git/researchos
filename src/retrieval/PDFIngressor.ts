import * as pdfjsLib from 'pdfjs-dist';

// Production-safe worker registration using Webpack 5 / Turbopack native URL asset binding
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();
}

export class PDFIngressor {
  /**
   * Reads a raw HTML5 File object, extracts pages and strings,
   * and runs structural academic heuristics to isolate chapter headings.
   */
  public static async parsePDF(file: File): Promise<{
    document_name: string;
    total_pages: number;
    pages: { page_number: number; section_header: string; raw_text: string }[];
  }> {
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the document using local worker task threads
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const totalPages = pdf.numPages;
    const pagesList: { page_number: number; section_header: string; raw_text: string }[] = [];

    // Regex identifying typical peer-reviewed chapter architectures
    const chapterRegex = /^(?:(?:[1-9]\d*|[I|V|X|L|C|D|M]+)\.?\s+)?(Abstract|Introduction|Methodology|Methods|Evaluation|Results|Discussion|Related\s+Work|Future\s+Work|References|Conclusion|Experimental\s+Setup)/i;

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      let rawPageText = '';
      let detectedHeader = `Page ${pageNum}`;
      
      // Structure strings page coordinates chronologically
      const items = textContent.items as any[];
      let lastY = -1;
      let currentLine = '';

      for (const item of items) {
        if ('str' in item) {
          const yCoordinate = item.transform[5];
          
          // Check if coordinate offset indicates a new line sequence
          if (lastY !== -1 && Math.abs(yCoordinate - lastY) > 6) {
            rawPageText += currentLine + '\n';
            
            const trimmedLine = currentLine.trim();
            if (trimmedLine.length < 80 && chapterRegex.test(trimmedLine)) {
              detectedHeader = trimmedLine;
            }
            
            currentLine = item.str;
          } else {
            currentLine += (currentLine ? ' ' : '') + item.str;
          }
          lastY = yCoordinate;
        }
      }
      
      // Commit leftover streams
      if (currentLine) {
        rawPageText += currentLine;
        const trimmedLine = currentLine.trim();
        if (trimmedLine.length < 80 && chapterRegex.test(trimmedLine)) {
          detectedHeader = trimmedLine;
        }
      }

      pagesList.push({
        page_number: pageNum,
        section_header: detectedHeader,
        raw_text: rawPageText.trim() || 'Empty page contents or image scanned artifact.'
      });
    }

    return {
      document_name: file.name,
      total_pages: totalPages,
      pages: pagesList
    };
  }
}