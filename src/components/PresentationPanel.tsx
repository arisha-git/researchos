import React from 'react';
import { useResearchStore } from '../state/useResearchStore';
import { PDFExportService } from '@/services/PDFExportService';
import { 
  Presentation, 
  Sparkles, 
  BookOpen, 
  Compass, 
  Lightbulb, 
  CheckCircle, 
  FileText, 
  Loader2,
  Download
} from 'lucide-react';

export default function PresentationPanel() {
  const { 
    presentationResult, 
    isCopilotLoading, 
    runPresentationGeneration 
  } = useResearchStore();

  // 1. Loading State
  if (isCopilotLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] p-8 text-center bg-slate-950 rounded-xl border border-slate-900">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500 mb-4" />
        <h3 className="text-lg font-bold text-slate-100 mb-2">Generating Presentation</h3>
        <p className="text-sm text-slate-400 max-w-md">
          Synthesizing key findings, methodologies, and recommendations from the ingested research corpus. This may take a moment...
        </p>
      </div>
    );
  }

  // 2. Empty State
  if (!presentationResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-slate-950 rounded-xl border border-slate-900">
        <div className="p-4 bg-blue-500/10 rounded-full border border-blue-500/20 mb-6">
          <Presentation className="h-10 w-10 text-blue-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-100 mb-3">Presentation Generator</h2>
        <p className="text-sm text-slate-400 max-w-lg mb-8 leading-relaxed">
          Transform your ingested document library into a structured, highly analytical slide deck summary. Synthesize core concepts, methodologies, and actionable recommendations in one click.
        </p>
        <button
          onClick={runPresentationGeneration}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-medium text-sm transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95"
        >
          <Sparkles className="h-4 w-4" />
          Generate Slides
        </button>
      </div>
    );
  }

  // 3. Render Presentation Layout
  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto text-slate-200">
      {/* Dynamic Slide Deck Header with Integrated PDF Export Action */}
      <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-1.5 bg-blue-500/15 border border-blue-500/20 rounded-md">
              <Presentation className="h-5 w-5 text-blue-400" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Executive Slide Deck Synthesis</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
            {presentationResult.title}
          </h1>
        </div>
        
        <button
          onClick={() => PDFExportService.exportPDF(presentationResult)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 rounded-lg font-semibold text-xs transition-all shadow-md active:scale-95 shrink-0 self-start sm:self-auto"
        >
          <Download className="h-4 w-4 text-blue-400" />
          Export PDF
        </button>
      </div>

      {/* Main Slides Content Grid */}
      <div className="space-y-6">
        {/* Slide 1: Executive Summary */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-xl relative overflow-hidden transition-all hover:border-slate-700">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <FileText className="h-24 w-24 text-white" />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Slide 1: Executive Summary</h3>
          </div>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed pl-1">
            {presentationResult.executive_summary}
          </p>
        </div>

        {/* Dynamic 2-Column Grid for Findings and Methodologies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Slide 2: Key Findings */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-xl flex flex-col justify-between transition-all hover:border-slate-700">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Slide 2: Key Findings</h3>
              </div>
              <ul className="space-y-3.5 pl-1">
                {presentationResult.key_findings.map((finding, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
                    <span className="flex items-center justify-center bg-emerald-500/10 text-emerald-400 font-bold text-[10px] w-5 h-5 rounded-full shrink-0 mt-0.5 border border-emerald-500/20">
                      {idx + 1}
                    </span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Slide 3: Methodologies */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-xl flex flex-col justify-between transition-all hover:border-slate-700">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Slide 3: Methodological Approach</h3>
              </div>
              <ul className="space-y-3.5 pl-1">
                {presentationResult.methodologies.map((methodology, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
                    <span className="flex items-center justify-center bg-amber-500/10 text-amber-400 font-bold text-[10px] w-5 h-5 rounded-full shrink-0 mt-0.5 border border-amber-500/20">
                      {idx + 1}
                    </span>
                    <span>{methodology}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Slide 4: Recommendations */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-xl transition-all hover:border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Slide 4: Strategic Recommendations</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-1">
            {presentationResult.recommendations.map((recommendation, idx) => (
              <div key={idx} className="bg-slate-950/50 border border-slate-800/80 p-4 rounded-lg relative hover:border-slate-800">
                <span className="absolute -top-2.5 left-3 px-2 py-0.5 bg-slate-900 border border-slate-800 text-[9px] font-bold text-slate-400 rounded">
                  Rec {idx + 1}
                </span>
                <p className="text-sm text-slate-300 leading-relaxed pt-1.5">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Slide 5: Strategic Conclusion */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-xl relative overflow-hidden transition-all hover:border-slate-700">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Compass className="h-24 w-24 text-white" />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Compass className="h-5 w-5 text-pink-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-pink-400">Slide 5: Synthesis Conclusion</h3>
          </div>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed pl-1">
            {presentationResult.conclusion}
          </p>
        </div>
      </div>
    </div>
  );
}