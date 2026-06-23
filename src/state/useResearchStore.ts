import { create } from 'zustand';
import { IngestedDocument } from '../types/retrieval';
import { ClassificationRoute } from '../types/routing';

interface ResearchStore {
  apiKey: string;
  documents: IngestedDocument[];
  activeDocId: string | null;
  activePage: number;
  currentRoute: ClassificationRoute | null;
  copilotResponse: string | null;
  isCopilotLoading: boolean;
  isPDFIngesting: boolean;
  
  setApiKey: (key: string) => void;
  addDocument: (doc: IngestedDocument) => void;
  setActiveDocId: (id: string | null) => void;
  setActivePage: (page: number) => void;
  setRoute: (route: ClassificationRoute | null) => void;
  setCopilotResponse: (response: string | null) => void;
  setCopilotLoading: (loading: boolean) => void;
  setPDFIngesting: (loading: boolean) => void;
}

export const useResearchStore = create<ResearchStore>((set) => ({
  apiKey: "",
  documents: [
    {
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
    }
  ],
  activeDocId: "sample-attention",
  activePage: 1,
  currentRoute: null,
  copilotResponse: null,
  isCopilotLoading: false,
  isPDFIngesting: false,

  setApiKey: (key) => set({ apiKey: key }),
  
  addDocument: (doc) => set((state) => ({ 
    documents: [...state.documents, doc],
    activeDocId: doc.id,
    activePage: 1
  })),
  
  setActiveDocId: (id) => set({ activeDocId: id, activePage: 1 }),
  setActivePage: (page) => set({ activePage: page }),
  setRoute: (route) => set({ currentRoute: route }),
  setCopilotResponse: (response) => set({ copilotResponse: response }),
  setCopilotLoading: (loading) => set({ isCopilotLoading: loading }),
  setPDFIngesting: (loading) => set({ isPDFIngesting: loading })
}));