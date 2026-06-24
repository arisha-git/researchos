import { GapAnalysisResult } from '@/types/routing';

interface GapAnalysisPanelProps {
  result: GapAnalysisResult | null;
}

export const GapAnalysisPanel = ({ result }: GapAnalysisPanelProps) => {
  if (!result) return null;

  return (
    <div className="p-6 space-y-6 text-slate-200">
      <div className="bg-slate-900 border border-slate-700 p-5 rounded-lg">
        <h2 className="text-lg font-bold text-blue-400 mb-2">Synthesis Summary</h2>
        <p className="text-sm leading-relaxed">{result.synthesis_summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: "Missing Research Areas", items: result.missing_research_areas },
          { title: "Unanswered Questions", items: result.unanswered_questions },
          { title: "Weak Coverage Areas", items: result.weak_coverage_areas },
          { title: "Opportunities for Investigation", items: result.opportunities_for_investigation }
        ].map((section, idx) => (
          <div key={idx} className="border border-slate-800 p-4 rounded-lg bg-slate-950">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">{section.title}</h3>
            <ul className="space-y-2">
              {section.items.map((item, i) => (
                <li key={i} className="text-sm border-l-2 border-slate-700 pl-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};