import { create } from 'zustand';
import { IngestedDocument, SemanticChunk, ChunkEmbedding } from '../types/retrieval';
import { ClassificationRoute } from '../types/routing';
import { ChunkingEngine } from '../services/ChunkingEngine';
import { EmbeddingService } from '../services/EmbeddingService';

interface ResearchStore {
  apiKey: string;
  documents: IngestedDocument[];
  chunks: SemanticChunk[];
  embeddings: ChunkEmbedding[];
  activeDocId: string | null;
  activePage: number;
  currentRoute: ClassificationRoute | null;
  copilotResponse: string | null;
  isCopilotLoading: boolean;
  isPDFIngesting: boolean;
  isEmbedding: boolean;
  
  setApiKey: (key: string) => void;
  addDocument: (doc: IngestedDocument) => Promise<void>;
  setActiveDocId: (id: string | null) => void;
  setActivePage: (page: number) => void;
  setRoute: (route: ClassificationRoute | null) => void;
  setCopilotResponse: (response: string | null) => void;
  setCopilotLoading: (loading: boolean) => void;
  setPDFIngesting: (loading: boolean) => void;
}

const initialDoc: IngestedDocument = {
  id: "sample-attention",
  document_name: "Attention_Is_All_You_Need.pdf",
  total_pages: 2,
  pages: [
    {
      page_number: 1,
      section_header: "Abstract",
      raw_text: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms."
    },
    {
      page_number: 2,
      section_header: "3.1 Scaled Dot-Product Attention",
      raw_text: "We compute the attention matrix scores precisely via softmax(QK^T / sqrt(d_k))V. This parallelizes sequences and reduces memory overheads."
    }
  ]
};

const initialChunks = ChunkingEngine.chunkDocument(initialDoc);

export const useResearchStore = create<ResearchStore>((set, get) => ({
  apiKey: "",
  documents: [initialDoc],
  chunks: initialChunks,
  embeddings: [],
  activeDocId: "sample-attention",
  activePage: 1,
  currentRoute: null,
  copilotResponse: null,
  isCopilotLoading: false,
  isPDFIngesting: false,
  isEmbedding: false,

  setApiKey: (key) => set({ apiKey: key }),

  addDocument: async (doc) => {
    // 1. Chunk the document
    const generatedChunks = ChunkingEngine.chunkDocument(doc);
    
    // 2. Prepare for embedding generation
    set({ isEmbedding: true });
    
    try {
      const apiKey = get().apiKey;
if (!apiKey) {
  throw new Error('Gemini API key not configured.');
}
const embeddingService = new EmbeddingService(apiKey);
      const chunkTexts = generatedChunks.map(c => c.chunk_text);
      const vectors = await embeddingService.generateEmbeddings(chunkTexts);
      
      const newEmbeddings: ChunkEmbedding[] = vectors.map((vec, idx) => ({
        chunk_id: generatedChunks[idx].chunk_id,
        embedding: vec
      }));

      // 3. Update state with both Chunks and Embeddings
      set((state) => ({
        documents: [...state.documents, doc],
        chunks: [...state.chunks, ...generatedChunks],
        embeddings: [...state.embeddings, ...newEmbeddings],
        activeDocId: doc.id,
        activePage: 1,
        isEmbedding: false
      }));
    } catch (error) {
      console.error("Failed to generate embeddings for document:", error);
      set({ isEmbedding: false });
    }
  },
  
  setActiveDocId: (id) => set({ activeDocId: id, activePage: 1 }),
  setActivePage: (page) => set({ activePage: page }),
  setRoute: (route) => set({ currentRoute: route }),
  setCopilotResponse: (response) => set({ copilotResponse: response }),
  setCopilotLoading: (loading) => set({ isCopilotLoading: loading }),
  setPDFIngesting: (loading) => set({ isPDFIngesting: loading })
}));