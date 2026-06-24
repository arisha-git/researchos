import { create } from 'zustand';
import { IngestedDocument, SemanticChunk, ChunkEmbedding } from '../types/retrieval';
import { ClassificationRoute, GapAnalysisResult, DomainSynthesisResult, PresentationResult } from '../types/routing';
import { ChunkingEngine } from '../services/ChunkingEngine';
import { EmbeddingService } from '../services/EmbeddingService';
import { RetrievalService } from '../services/RetrievalService';
import { GapAnalysisService } from '../services/GapAnalysisService';
import { DomainSynthesisService } from '../services/DomainSynthesisService';
import { RetrievedChunk} from '../types/citation';
import { GraphService } from '../services/GraphService';
import { GraphData } from '../types/graph';
import { PresentationService } from '../services/PresentationService';


interface ResearchStore {
  apiKey: string;
  documents: IngestedDocument[];
  chunks: SemanticChunk[];
  embeddings: ChunkEmbedding[];
  retrievedChunks: RetrievedChunk[];
  gapAnalysisResult: GapAnalysisResult | null;
  domainSynthesisResult: DomainSynthesisResult | null;
  presentationResult: PresentationResult | null;
  graphData: GraphData | null;
  activeDocId: string | null;
  activePage: number;
  currentRoute: ClassificationRoute | null;
  copilotResponse: string | null;
  isCopilotLoading: boolean;
  isPDFIngesting: boolean;
  isEmbedding: boolean;
  isGraphLoading: boolean;

  
  setApiKey: (key: string) => void;
  addDocument: (doc: IngestedDocument) => Promise<void>;
  performSemanticSearch: (query: string) => Promise<void>;
  runGapAnalysis: () => Promise<void>;
  runDomainSynthesis: () => Promise<void>;
  runPresentationGeneration: () => Promise<void>;
  generateGraph: () => Promise<void>;
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
  retrievedChunks: [],
  gapAnalysisResult: null,
  domainSynthesisResult: null,
  presentationResult: null,
  graphData: null,
  activeDocId: "sample-attention",
  activePage: 1,
  currentRoute: null,
  copilotResponse: null,
  isCopilotLoading: false,
  isPDFIngesting: false,
  isEmbedding: false,
  isGraphLoading: false,

  setApiKey: (key) => set({ apiKey: key }),

  addDocument: async (doc) => {
    const generatedChunks = ChunkingEngine.chunkDocument(doc);
    set({ isEmbedding: true });
    
    try {
      const embeddingService = new EmbeddingService(get().apiKey || "DEFAULT_KEY");
      const chunkTexts = generatedChunks.map(c => c.chunk_text);
      const vectors = await embeddingService.generateEmbeddings(chunkTexts);
      
      const newEmbeddings: ChunkEmbedding[] = vectors.map((vec, idx) => ({
        chunk_id: generatedChunks[idx].chunk_id,
        embedding: vec
      }));

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

  performSemanticSearch: async (query: string) => {
    const { apiKey, chunks, embeddings } = get();
    if (!apiKey || embeddings.length === 0) return;

    try {
      const embeddingService = new EmbeddingService(apiKey);
      const queryEmbedding = await embeddingService.generateEmbedding(query);
      
      const results = RetrievalService.search(queryEmbedding, embeddings, chunks, 3);

      set({ retrievedChunks: results });
    } catch (error) {
      console.error("Semantic search failed:", error);
    }
  },

  runGapAnalysis: async () => {
    const { documents, apiKey } = get();
    if (!apiKey || documents.length === 0) return;

    set({ isCopilotLoading: true });
    try {
      const result = await GapAnalysisService.analyze(documents, apiKey);
      set({ gapAnalysisResult: result, isCopilotLoading: false });
    } catch (error) {
      console.error("Failed to perform gap analysis:", error);
      set({ isCopilotLoading: false });
    }
  },

  runDomainSynthesis: async () => {
    const { documents, apiKey } = get();
    if (!apiKey || documents.length === 0) return;

    set({ isCopilotLoading: true });
    try {
      const result = await DomainSynthesisService.synthesize(documents, apiKey);
      set({ domainSynthesisResult: result, isCopilotLoading: false });
    } catch (error) {
      console.error("Failed to perform domain synthesis:", error);
      set({ isCopilotLoading: false });
    }
  },

  runPresentationGeneration: async () => {
    const { documents, apiKey } = get();
    if (!apiKey || documents.length === 0) return;

    set({ isCopilotLoading: true });

    try {
      const result = await PresentationService.generatePresentation(
        documents,
        apiKey
      );

      set({
        presentationResult: result,
        isCopilotLoading: false
      });
    } catch (error) {
      console.error("Presentation generation failed:", error);
      set({ isCopilotLoading: false });
    }
  },

  generateGraph: async () => {
    const { documents, apiKey } = get();
    if (!apiKey || documents.length === 0) return;

    set({ isGraphLoading: true });
    try {
      const result = await GraphService.generateGraph(documents, apiKey);
      set({ 
        graphData: result, 
        isGraphLoading: false 
      });
    } catch (error) {
      console.error("Failed to construct graph:", error);
      set({ isGraphLoading: false });
    }
  },
  
  setActiveDocId: (id) => set({ activeDocId: id, activePage: 1 }),
  setActivePage: (page) => set({ activePage: page }),
  setRoute: (route) => set({ currentRoute: route }),
  setCopilotResponse: (response) => set({ copilotResponse: response }),
  setCopilotLoading: (loading) => set({ isCopilotLoading: loading }),
  setPDFIngesting: (loading) => set({ isPDFIngesting: loading })
}));