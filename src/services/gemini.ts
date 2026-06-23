// Standard placeholder client fallback configuration
export const getGeminiClient = (apiKey: string) => {
  return {
    models: {
      generateContent: async ({ model, contents, config }: any) => {
        // Safe mock structured output response simulation fallback
        return {
          text: JSON.stringify({
            workflow_selected: contents.toLowerCase().includes("compare") 
              ? "Multi-Document Comparison" 
              : contents.toLowerCase().includes("gap") 
              ? "Research Gap Analysis"
              : "Single Document Analysis",
            classification_rationale: "Automated heuristics parsed dynamic semantic intent from active query text.",
            documents_to_consult: ["Attention_Is_All_You_Need.pdf"],
            analytical_strategy: "Execute structural comparison matrices across key metrics.",
            retrieval_strategy: "cross_document",
            retrieval_scope: "subset_nodes",
            evidence_requirements: ["Self-Attention Layer Metrics"],
            citation_mode: "strict",
            graph_generation_required: false,
            presentation_generation_required: false
          })
        };
      }
    }
  };
};