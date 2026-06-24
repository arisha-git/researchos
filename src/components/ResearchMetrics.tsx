import React from 'react';
import { useResearchStore } from '../state/useResearchStore';
import { 
  Files, 
  Database, 
  Cpu, 
  Network, 
  GitCommit 
} from 'lucide-react';

export default function ResearchMetrics() {
  const { 
    documents, 
    chunks, 
    embeddings, 
    graphData 
  } = useResearchStore();

  const metrics = [
    {
      title: "Documents Uploaded",
      value: documents.length,
      icon: Files,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    },
    {
      title: "Semantic Chunks",
      value: chunks.length,
      icon: Database,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20"
    },
    {
      title: "Embeddings Indexed",
      value: embeddings.length,
      icon: Cpu,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20"
    },
    {
      title: "Graph Nodes",
      value: graphData?.nodes?.length || 0,
      icon: Network,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20"
    },
    {
      title: "Graph Edges",
      value: graphData?.edges?.length || 0,
      icon: GitCommit,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
      {metrics.map((metric, idx) => {
        const IconComponent = metric.icon;
        return (
          <div 
            key={idx} 
            className={`bg-slate-900/40 backdrop-blur-md border ${metric.borderColor} p-4 rounded-xl flex items-center justify-between transition-all hover:bg-slate-900/60`}
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {metric.title}
              </p>
              <p className="text-2xl font-extrabold text-slate-100 mt-1">
                {metric.value}
              </p>
            </div>
            <div className={`p-2.5 ${metric.bgColor} rounded-lg border ${metric.borderColor} shrink-0`}>
              <IconComponent className={`h-4 w-4 ${metric.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}