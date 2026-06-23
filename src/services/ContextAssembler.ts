import { SemanticChunk } from '../types/retrieval';

/**
 * Service responsible for assembling retrieved chunks into a grounded
 * context string for LLM generation.
 */
export class ContextAssembler {
  /**
   * Transforms an array of retrieved chunks into a formatted string
   * for prompt injection.
   */
  public static assemble(chunks: SemanticChunk[]): string {
    if (chunks.length === 0) return "No relevant research context found.";

    return chunks
      .map((chunk, index) => {
        return `--- Evidence Node ${index + 1} ---
Source: ${chunk.document_name} (Page ${chunk.page_number})
Section: ${chunk.section_header}
Content: ${chunk.chunk_text}
`;
      })
      .join("\n");
  }
}