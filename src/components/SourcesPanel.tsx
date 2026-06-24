import { RetrievedChunk } from '@/types/citation';

interface SourcesPanelProps {
  results: RetrievedChunk[];
  onNavigate: (docId: string, page: number) => void;
}

export const SourcesPanel = ({ results, onNavigate }: SourcesPanelProps) => {
  if (results.length === 0) return null;

  return (
    <div className="mt-8 border-t border-slate-800 pt-6">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">Retrieved Sources</h3>
      <div className="space-y-3">
        {results.map((r) => (
          <div
            key={r.chunk.chunk_id}
            onClick={() => onNavigate(r.chunk.document_name, r.chunk.page_number)}
            className="p-4 border border-slate-700 bg-slate-900 rounded cursor-pointer hover:border-blue-500 transition-all hover:bg-slate-800"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Rank {r.rank}</span>
              <span className="text-[10px] text-slate-500">Score: {(r.relevance_score * 100).toFixed(1)}%</span>
            </div>
            <p className="text-sm font-bold text-slate-100 truncate">{r.chunk.document_name}</p>
            <p className="text-xs text-slate-400 mt-1">{r.chunk.section_header} • Page {r.chunk.page_number}</p>
            <p className="text-xs text-slate-500 mt-2 line-clamp-2 italic">"{r.chunk.chunk_text.substring(0, 150)}..."</p>
          </div>
        ))}
      </div>
    </div>
  );
};