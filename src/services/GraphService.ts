import { IngestedDocument } from '../types/retrieval';
import { GraphData, GraphNode, GraphEdge } from '../types/graph';
import { getGeminiClient } from './gemini';

/**
 * Service responsible for analyzing document texts and dynamically extracting
 * semantic nodes (concepts, themes) and relations (edges) to build a Knowledge Graph.
 */
export class GraphService {
  /**
   * Orchestrates the extraction of concepts, themes, and semantic links
   * using Gemini 2.5 Flash.
   */
  public static async generateGraph(
    documents: IngestedDocument[],
    apiKey: string
  ): Promise<GraphData> {
    if (documents.length === 0) {
      return { nodes: [], edges: [] };
    }

    const client = getGeminiClient(apiKey);

    // Prepare document manifests containing names and snippets of their abstract/content
    const documentSummaries = documents.map(doc => ({
      id: doc.id,
      name: doc.document_name,
      abstractSnippet: doc.pages.find(p => p.section_header.toLowerCase().includes('abstract'))?.raw_text 
        || doc.pages[0]?.raw_text.substring(0, 800) || ""
    }));

    const prompt = `
You are an advanced Semantic Knowledge Graph Generator. Analyze the following document summaries and extract key scientific concepts and cross-document themes to build an interconnected network of research.

--- INGESTED DOCUMENTS ---
${JSON.stringify(documentSummaries, null, 2)}
--- END INGESTED DOCUMENTS ---

`;

    try {
      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          temperature: 0.2
        }
      });

      const text =
  typeof response.text === "string"
    ? response.text
    : JSON.stringify(response.text);

const cleanText = text
  .replace(/^```json\s*/, '')
  .replace(/```\s*$/, '')
  .trim();

      const parsed = JSON.parse(cleanText);

      // Build Document Nodes
      const docNodes: GraphNode[] = documents.map((doc, idx) => ({
        id: doc.id,
        label: doc.document_name,
        type: 'document',
        val: 15,
        x: 150 + idx * 250,
        y: 200
      }));

      // Build Concept Nodes
      const conceptNodes: GraphNode[] = (parsed.concepts || []).map((c: any, idx: number) => ({
        id: c.id,
        label: c.label,
        type: 'concept',
        val: c.relevance_weight || 8,
        x: 100 + (idx % 4) * 200,
        y: 350 + Math.floor(idx / 4) * 120
      }));

      // Build Theme Nodes
      const themeNodes: GraphNode[] = (parsed.themes || []).map((t: any, idx: number) => ({
        id: t.id,
        label: t.label,
        type: 'theme',
        val: t.relevance_weight || 12,
        x: 200 + (idx % 3) * 250,
        y: 80 + Math.floor(idx / 3) * 100
      }));

      // Collect complete nodes array
      const allNodes = [...docNodes, ...conceptNodes, ...themeNodes];

      // Format and validate edges
      const allEdges: GraphEdge[] = (parsed.edges || []).map((e: any) => ({
        source: e.source,
        target: e.target,
        label: e.label || "Semantic Link",
        weight: typeof e.weight === 'number' ? e.weight : 0.5
      })).filter((e: GraphEdge) => {
        // Validate that both source and target exist within our generated nodes list
        const sourceExists = allNodes.some(n => n.id === e.source);
        const targetExists = allNodes.some(n => n.id === e.target);
        return sourceExists && targetExists;
      });

      return {
        nodes: allNodes,
        edges: allEdges
      };
    } 
    
    catch (error) {
  console.error("Knowledge Graph generation failure:", error);

  const fallbackNodes: GraphNode[] = documents.map((doc, idx) => ({
    id: doc.id,
    label: doc.document_name,
    type: 'document',
    val: 12,
    x: 150 + idx * 150,
    y: 200
  }));

  const fallbackEdges: GraphEdge[] = [];

  for (let i = 0; i < fallbackNodes.length - 1; i++) {
    fallbackEdges.push({
      source: fallbackNodes[i].id,
      target: fallbackNodes[i + 1].id,
      label: "Related Document",
      weight: 0.5
    });
  }

  return {
    nodes: fallbackNodes,
    edges: fallbackEdges
  };
}}}
