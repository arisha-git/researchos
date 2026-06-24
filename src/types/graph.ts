export type NodeType = 'document' | 'concept' | 'theme';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  val: number; // Size/relevance weight for node visualization scale
  x: number;   // Calculated layout x coordinate
  y: number;   // Calculated layout y coordinate
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
  weight: number; // Semantic strength or relationship confidence score (0.0 to 1.0)
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}