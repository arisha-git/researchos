import React, { useEffect, useRef, useState } from 'react';
import { GraphData, GraphNode, GraphEdge } from '../types/graph';

interface GraphPanelProps {
  graphData: GraphData | null;
  isLoading: boolean;
  onNavigateToDoc?: (docId: string, pageNum: number) => void;
}

export const GraphPanel: React.FC<GraphPanelProps> = ({
  graphData,
  isLoading,
  onNavigateToDoc
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 450 });

  // Handle Container Resizing
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: Math.max(entry.contentRect.width, 300),
          height: Math.max(entry.contentRect.height, 400),
        });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Simple, highly performant client-side force layout simulation running on canvas
  useEffect(() => {
    if (!graphData || !canvasRef.current || isLoading) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Shallow copy nodes to store running coordinates
    const nodes = graphData.nodes.map(n => ({ ...n }));
    const edges = graphData.edges.map(e => ({ ...e }));

    // Initialize positions if coordinates are default zero
    nodes.forEach((node, i) => {
      if (node.x === 150 || node.x === 100 || node.x === 200) {
        // Distribute nicely across the center space
        const angle = (i / nodes.length) * Math.PI * 2;
        const radius = 100 + Math.random() * 50;
        node.x = dimensions.width / 2 + Math.cos(angle) * radius;
        node.y = dimensions.height / 2 + Math.sin(angle) * radius;
      }
    });

    const runSimulation = () => {
      // 1. Calculate forces (Repulsion between nodes)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 180) {
            const force = (180 - dist) * 0.04;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            nodes[i].x -= fx;
            nodes[i].y -= fy;
            nodes[j].x += fx;
            nodes[j].y += fy;
          }
        }
      }

      // 2. Calculate forces (Attraction along edges)
      edges.forEach((edge) => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        if (sourceNode && targetNode) {
          const dx = targetNode.x - sourceNode.x;
          const dy = targetNode.y - sourceNode.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const targetDist = 120;
          const force = (dist - targetDist) * 0.015 * edge.weight;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          sourceNode.x += fx;
          sourceNode.y += fy;
          targetNode.x -= fx;
          targetNode.y -= fy;
        }
      });

      // 3. Keep within viewport boundaries with light gravity pull to center
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      nodes.forEach(node => {
        node.x += (centerX - node.x) * 0.01;
        node.y += (centerY - node.y) * 0.01;

        // Hard bounds
        const padding = 25;
        node.x = Math.max(padding, Math.min(dimensions.width - padding, node.x));
        node.y = Math.max(padding, Math.min(dimensions.height - padding, node.y));
      });

      // --- RENDERING ROUTINE ---
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Draw Edges
      edges.forEach((edge) => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        if (sourceNode && targetNode) {
          ctx.beginPath();
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)'; // Slate connection line
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Draw edge relationship label in small muted text at the midpoint
          const midX = (sourceNode.x + targetNode.x) / 2;
          const midY = (sourceNode.y + targetNode.y) / 2;
          ctx.font = '8px sans-serif';
          ctx.fillStyle = '#64748b';
          ctx.textAlign = 'center';
          ctx.fillText(edge.label, midX, midY - 4);
        }
      });

      // Draw Nodes
      nodes.forEach((node) => {
        ctx.beginPath();
        const radius = Math.max(node.val, 6);
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);

        // Assign semantic colors based on Node Type
        let fillColor = '#3b82f6'; // Blue for document
        if (node.type === 'concept') fillColor = '#10b981'; // Emerald
        if (node.type === 'theme') fillColor = '#a855f7'; // Purple

        ctx.fillStyle = fillColor;
        ctx.shadowColor = fillColor;
        ctx.shadowBlur = selectedNode?.id === node.id ? 12 : 0;
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow

        // Add visual border ring around the node circles
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw node labels underneath
        ctx.font = 'bold 9px sans-serif';
        ctx.fillStyle = '#f1f5f9';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + radius + 11);
      });

      animationFrameId = requestAnimationFrame(runSimulation);
    };

    runSimulation();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [graphData, dimensions, isLoading, selectedNode]);

  // Click handler inside the Canvas to display rich detail cards
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !graphData) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Check if clicked near any nodes
    let foundNode = false;
    for (const node of graphData.nodes) {
      const radius = Math.max(node.val, 6);
      const dx = clickX - node.x;
      const dy = clickY - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= radius + 12) {
        setSelectedNode(node);
        foundNode = true;
        break;
      }
    }

    if (!foundNode) {
      setSelectedNode(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-slate-400">
        <svg className="animate-spin h-8 w-8 text-blue-500 mb-3" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span>Constructing semantic relations...</span>
      </div>
    );
  }

  if (!graphData || graphData.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] text-slate-500 border border-dashed border-slate-800 rounded-lg p-6">
        No semantic map generated yet. Please upload research papers to visualize connections.
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full flex flex-col min-h-[450px]">
      <div className="absolute top-4 left-4 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-lg text-[10px] space-y-1.5 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 block" />
          <span className="text-slate-300">Documents</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
          <span className="text-slate-300">Key Concepts</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 block" />
          <span className="text-slate-300">Transversal Themes</span>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onClick={handleCanvasClick}
        className="flex-1 w-full h-full bg-slate-950 rounded-lg border border-slate-800 cursor-pointer"
      />

      {/* Selected Node Inspector Detail Block */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 bg-slate-900 border border-slate-700 p-4 rounded-lg shadow-xl z-10">
          <div className="flex justify-between items-start">
            <div>
              <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                selectedNode.type === 'document' ? 'bg-blue-500/20 text-blue-400' :
                selectedNode.type === 'concept' ? 'bg-emerald-500/20 text-emerald-400' :
                'bg-purple-500/20 text-purple-400'
              }`}>
                {selectedNode.type}
              </span>
              <h4 className="text-sm font-bold text-slate-100 mt-2">{selectedNode.label}</h4>
            </div>
            {selectedNode.type === 'document' && onNavigateToDoc && (
              <button
                onClick={() => onNavigateToDoc(selectedNode.id, 1)}
                className="text-[11px] bg-blue-600 hover:bg-blue-500 text-white font-medium px-2.5 py-1 rounded transition-colors"
              >
                Inspect Paper
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};