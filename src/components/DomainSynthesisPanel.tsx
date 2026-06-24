import { DomainSynthesisResult } from '@/types/routing';

export const DomainSynthesisPanel = ({ result }: { result: DomainSynthesisResult | null }) => {
  if (!result) return null;

  return (
    <div className="p-6 space-y-6 text-slate-200">
      <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
        <h2 className="text-blue-400 font-bold mb-2">Domain Summary</h2>
        <p className="text-sm">{result.domain_summary}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[
          { title: "Core Concepts", data: result.core_concepts },
          { title: "Recurring Themes", data: result.recurring_themes },
          { title: "Methodologies", data: result.methodologies },
          { title: "Key Findings", data: result.key_findings }
        ].map((section) => (
          <div key={section.title} className="bg-slate-950 p-4 border border-slate-800 rounded">
            <h3 className="text-xs font-bold uppercase text-slate-500 mb-2">{section.title}</h3>
            <ul className="list-disc pl-4 text-sm space-y-1">
              {section.data.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};