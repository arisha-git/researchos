export interface RawParsedPage {
  page_number: number;
  section_header: string;
  raw_text: string;
}

export interface IngestedDocument {
  id: string;
  document_name: string;
  total_pages: number;
  pages: RawParsedPage[];
}

export interface SemanticChunk {
  chunk_id: string;
  document_name: string;
  page_number: number;
  section_header: string;
  chunk_text: string;
}

export interface CitationReference {
  citation_id: string;
  document_name: string;
  page_number: number;
  section_header: string;
  exact_quote_snippet: string;
}