import { IngestedDocument, SemanticChunk } from '../types/retrieval';

export class ChunkingEngine {
  /**
   * Automatically segments an IngestedDocument into logical semantic chunks
   * of approximately 500-1000 characters, respecting section and page boundaries.
   */
  public static chunkDocument(doc: IngestedDocument): SemanticChunk[] {
    const chunks: SemanticChunk[] = [];
    let chunkCounter = 0;

    for (const page of doc.pages) {
      const text = page.raw_text;
      
      // Split by paragraphs
      const paragraphs = text.split(/\n\s*\n/);
      let currentChunkText = "";

      for (const para of paragraphs) {
        const trimmedPara = para.trim();
        if (!trimmedPara) continue;

        // Check if adding this paragraph exceeds our upper ceiling (1000 chars)
        if (currentChunkText.length + trimmedPara.length + 1 <= 1000) {
          currentChunkText += (currentChunkText ? " " : "") + trimmedPara;
        } else {
          // If the accumulated chunk is at least 500 characters, save it
          if (currentChunkText.length >= 500) {
            chunkCounter++;
            chunks.push({
              chunk_id: `chunk-${doc.id}-${page.page_number}-${chunkCounter}`,
              document_name: doc.document_name,
              page_number: page.page_number,
              section_header: page.section_header,
              chunk_text: currentChunkText,
              word_count: currentChunkText.split(/\s+/).filter(Boolean).length
            });
            currentChunkText = trimmedPara;
          } else {
            // Handle massive single paragraph blocks (> 1000 chars) by splitting on sentences
            if (trimmedPara.length > 1000) {
              if (currentChunkText.length > 0) {
                chunkCounter++;
                chunks.push({
                  chunk_id: `chunk-${doc.id}-${page.page_number}-${chunkCounter}`,
                  document_name: doc.document_name,
                  page_number: page.page_number,
                  section_header: page.section_header,
                  chunk_text: currentChunkText,
                  word_count: currentChunkText.split(/\s+/).filter(Boolean).length
                });
                currentChunkText = "";
              }

              // Split paragraph by sentences
              const sentences = trimmedPara.split(/(?<=[.?!])\s+/);
              let sentenceBuffer = "";

              for (const sentence of sentences) {
                if (sentenceBuffer.length + sentence.length + 1 <= 1000) {
                  sentenceBuffer += (sentenceBuffer ? " " : "") + sentence;
                } else {
                  if (sentenceBuffer.length > 0) {
                    chunkCounter++;
                    chunks.push({
                      chunk_id: `chunk-${doc.id}-${page.page_number}-${chunkCounter}`,
                      document_name: doc.document_name,
                      page_number: page.page_number,
                      section_header: page.section_header,
                      chunk_text: sentenceBuffer,
                      word_count: sentenceBuffer.split(/\s+/).filter(Boolean).length
                    });
                  }
                  sentenceBuffer = sentence;
                }
              }

              if (sentenceBuffer.length > 0) {
                currentChunkText = sentenceBuffer;
              }
            } else {
              // Flush current chunk first if we need to start a fresh sequence
              if (currentChunkText.length > 0) {
                chunkCounter++;
                chunks.push({
                  chunk_id: `chunk-${doc.id}-${page.page_number}-${chunkCounter}`,
                  document_name: doc.document_name,
                  page_number: page.page_number,
                  section_header: page.section_header,
                  chunk_text: currentChunkText,
                  word_count: currentChunkText.split(/\s+/).filter(Boolean).length
                });
              }
              currentChunkText = trimmedPara;
            }
          }
        }
      }

      // Flush remaining text for this page boundary
      if (currentChunkText.length > 0) {
        chunkCounter++;
        chunks.push({
          chunk_id: `chunk-${doc.id}-${page.page_number}-${chunkCounter}`,
          document_name: doc.document_name,
          page_number: page.page_number,
          section_header: page.section_header,
          chunk_text: currentChunkText,
          word_count: currentChunkText.split(/\s+/).filter(Boolean).length
        });
      }
    }

    return chunks;
  }
}