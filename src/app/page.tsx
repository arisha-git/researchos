'use client';

import React, { useState } from 'react';
import { 
  Layers, PlusCircle, Database, BookOpen, ChevronLeft, ChevronRight, 
  HelpCircle, Sparkles, Brain, Code, Network, Presentation, Bot, ArrowRight, ShieldAlert
} from 'lucide-react';
import { useResearchStore } from '../state/useResearchStore';
import { AgenticRouter } from '../routing/AgenticRouter';

export default function ResearchOSPage() {
  const { 
    apiKey, setApiKey, documents, addDocument, activeDocId, 
    setActiveDocId, activePage, setActivePage, currentRoute, 
    setRoute, copilotResponse, setCopilotResponse, isCopilotLoading, setCopilotLoading 
  } = useResearchStore();

  const [activeTab, setActiveTab] = useState<'reader' | 'gap' | 'synthesis' | 'graph' | 'presentation'>('reader');
  const [queryInput, setQueryInput] = useState('');
  const [isTraceOpen, setIsTraceOpen] = useState(false);

  // Active Doc computation
  const activeDoc = documents.find(d => d.id === activeDocId);

  // Mock document adding ingestion system
  const handleIngestFakeDocument = () => {
    const docName = `Dynamic_Research_Node_0${documents.length + 1}.pdf`;
    addDocument({
      id: `doc-${Date.now()}`,
      document_name: docName,
      total_pages: 1,
      pages: [
        {
          page_number: 1,
          section_header: "Methodology Extract",
          raw_text: "This document extracts baseline properties for structural evaluations under localized testing guidelines."
        }
      ]
    });
  };

  // Agentic Query Execution flow
  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) return;

    setCopilotLoading(true);
    setCopilotResponse(null);

    try {
      // Use local routing simulation fallback logic
      const router = new AgenticRouter();
      const route = await router.triageQuery(
        queryInput, 
        documents.map(d => d.document_name), 
        apiKey || "AIzaSyFakeKey"
      );

      setRoute(route);

      // Core simulation based on workflow outputs
      setTimeout(() => {
        let simulatedBody = "";
        if (route.workflow_selected === "Multi-Document Comparison") {
          simulatedBody = `**Analysis compiled:** Based on cross-document evaluation, ${documents[0]?.document_name} targets parallelization, whereas newly uploaded vectors address specific parameter efficiency optimizations.`;
        } else if (route.workflow_selected === "Research Gap Analysis") {
          simulatedBody = "**Analysis compiled:** Structural tracking detects gaps within quadratic compute boundaries. Evaluations under extreme sequence limits remain completely missing.";
        } else {
          simulatedBody = `**Analysis compiled:** Found targeted context markers inside ${activeDoc?.document_name}. Methodology matches baseline state transformations.`;
        }
        setCopilotResponse(simulatedBody);
        setCopilotLoading(false);
      }, 1000);

    } catch (err) {
      setCopilotLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top Header */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/60 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">ResearchOS</span>
            <span className="text-[10px] text-slate-500 ml-2 border-l border-slate-700 pl-2">v1.0.0 MVP</span>
          </div>
        </div>

        {/* Dynamic workspace mode toggle */}
        <div className="flex bg-slate-800 p-1 rounded-lg text-xs font-medium">
          <button onClick={() => setActiveTab('reader')} className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${activeTab === 'reader' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            <BookOpen className="w-3.5 h-3.5" /> Source Viewer
          </button>
          <button onClick={() => setActiveTab('gap')} className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${activeTab === 'gap' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            <Brain className="w-3.5 h-3.5" /> Gap Analysis
          </button>
          <button onClick={() => setActiveTab('synthesis')} className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${activeTab === 'synthesis' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            <Sparkles className="w-3.5 h-3.5" /> Domain Synthesis
          </button>
          <button onClick={() => setActiveTab('graph')} className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${activeTab === 'graph' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            <Network className="w-3.5 h-3.5" /> Graph
          </button>
          <button onClick={() => setActiveTab('presentation')} className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${activeTab === 'presentation' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            <Presentation className="w-3.5 h-3.5" /> Slides
          </button>
        </div>
      </header>

      {/* Main Workspace Grid */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Sources Ingestion */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/20 flex flex-col h-full shrink-0">
          <div className="p-4 border-b border-slate-800">
            <button onClick={handleIngestFakeDocument} className="w-full border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all bg-slate-900/50 hover:bg-indigo-950/10 group">
              <PlusCircle className="w-5 h-5 text-slate-400 group-hover:text-indigo-400" />
              <div className="text-center">
                <span className="text-xs font-semibold text-slate-300">Add Research Source</span>
                <p className="text-[10px] text-slate-500 mt-0.5">Ingest PDF papers</p>
              </div>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center justify-between px-2">
              Domain Library ({documents.length}) <Database className="w-3 h-3" />
            </span>
            <div className="space-y-1">
              {documents.map(doc => (
                <div 
                  key={doc.id} 
                  onClick={() => setActiveDocId(doc.id)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all truncate text-xs font-medium ${doc.id === activeDocId ? 'bg-indigo-950/30 border-indigo-500/50 text-indigo-400' : 'bg-slate-900/30 border-slate-800/80 text-slate-300 hover:bg-slate-800/50'}`}
                >
                  📄 {doc.document_name}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center Canvas Viewports */}
        <main className="flex-1 bg-slate-950 flex flex-col overflow-hidden relative">
          
          {/* TAB 1: Source Document Reader */}
          {activeTab === 'reader' && (
            <div className="flex flex-col h-full w-full">
              <div className="h-10 border-b border-slate-800 bg-slate-900/30 px-4 flex items-center justify-between shrink-0">
                <span className="text-xs font-medium text-slate-400 truncate max-w-[50%]">
                  Active Focus: {activeDoc?.document_name || "No source mapped"}
                </span>
                {activeDoc && (
                  <div className="flex items-center gap-3 text-xs bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    <button 
                      disabled={activePage === 1} 
                      onClick={() => setActivePage(activePage - 1)}
                      className="text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-mono text-slate-300">{activePage} / {activeDoc.total_pages}</span>
                    <button 
                      disabled={activePage === activeDoc.total_pages} 
                      onClick={() => setActivePage(activePage + 1)}
                      className="text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex justify-center items-start bg-slate-900/10">
                {activeDoc ? (
                  <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 shadow-2xl rounded-xl p-10 min-h-[600px] text-sm text-slate-300 leading-relaxed font-serif">
                    <h2 className="text-slate-100 font-sans font-bold text-lg mb-2">
                      {activeDoc.pages[activePage - 1]?.section_header || "Section Frame"}
                    </h2>
                    <p className="text-slate-400 text-xs font-sans italic mb-6">Page {activePage} of {activeDoc.document_name}</p>
                    <div>{activeDoc.pages[activePage - 1]?.raw_text}</div>
                  </div>
                ) : (
                  <div className="text-slate-500 text-xs mt-20">Please select an ingested research node.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Research Gap Analysis */}
          {activeTab === 'gap' && (
            <div className="p-6 overflow-y-auto h-full space-y-4">
              <h2 className="text-base font-bold text-slate-100">Structural Research Gaps</h2>
              <p className="text-xs text-slate-400 max-w-xl leading-relaxed">System audits scan documentation arrays for unresolved limits, metric boundaries, or missing baseline confirmations.</p>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-red-950/40 text-red-400 border border-red-900/50 rounded text-[10px] font-mono font-bold uppercase">Critical Gap Found</span>
                  <h3 className="text-xs font-semibold text-slate-200">Quadratic Context Limitation</h3>
                </div>
                <p className="text-xs text-slate-400 leading-normal">Vaswani et al. demonstrates scaling limits that restrict downstream deployment on context lengths longer than 4096 tokens without introducing local approximations.</p>
              </div>
            </div>
          )}

          {/* TAB 3: Domain Synthesis */}
          {activeTab === 'synthesis' && (
            <div className="p-6 overflow-y-auto h-full space-y-4">
              <h2 className="text-base font-bold text-slate-100">Domain Synthesis Overview</h2>
              <p className="text-xs text-slate-400 max-w-xl leading-relaxed">Aggregates consensus, disagreements, themes, and primary metrics computed across the ingested document index.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                  <h3 className="text-xs font-semibold text-slate-200 mb-1">Dominant Methodologies</h3>
                  <p className="text-xs text-slate-400 leading-normal">Cross-Head Attention, Local Parametric fine-tuning matrix allocations.</p>
                </div>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                  <h3 className="text-xs font-semibold text-slate-200 mb-1">Common Datasets</h3>
                  <p className="text-xs text-slate-400 leading-normal">WMT-14, GLUE benchmark configurations, General NLP fine-tuning partitions.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Knowledge Graph Placeholder */}
          {activeTab === 'graph' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <Network className="w-12 h-12 stroke-[1.2] text-slate-600 mb-3" />
              <h3 className="text-sm font-semibold text-slate-300">Topology Map Offline</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1 leading-normal">Connecting extracted concept occurrences to construct real-time topological interaction networks. Available in production iterations.</p>
            </div>
          )}

          {/* TAB 5: Presentation Placeholder */}
          {activeTab === 'presentation' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <Presentation className="w-12 h-12 stroke-[1.2] text-slate-600 mb-3" />
              <h3 className="text-sm font-semibold text-slate-300">Briefing Slides Pending</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1 leading-normal">Synthesizing thematic clusters into clean, presentation-ready modular components automatically.</p>
            </div>
          )}

        </main>

        {/* Right Side: Agentic Research Copilot */}
        <aside className="w-80 border-l border-slate-800 bg-slate-900/20 flex flex-col h-full shrink-0">
          
          {/* API Setup Control */}
          <div className="p-3 border-b border-slate-800 bg-slate-900/60 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${apiKey ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                <span className="text-[10px] font-semibold text-slate-400">
                  {apiKey ? 'API Operational' : 'Offline Mode active'}
                </span>
              </div>
              <span className="text-[9px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">Gemini 2.5 Flash</span>
            </div>
            <div className="relative">
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste Gemini API Key to unlock..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-1.5 text-[10px] text-slate-300 placeholder-slate-600 focus:outline-none"
              />
              <ShieldAlert className="w-3 h-3 text-slate-600 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Copilot Chat Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 flex flex-col gap-2 shadow-sm">
              <div className="flex items-center gap-1.5 font-medium text-indigo-400">
                <Bot className="w-4 h-4" />
                <span>Copilot Active</span>
              </div>
              <p className="text-slate-400 leading-normal">
                I resolve document connections dynamically. Ask questions about architectures, methodologies, or research gaps across your source list.
              </p>
            </div>

            {/* Simulated Triage Workflow Details Panel */}
            {currentRoute && (
              <div className="space-y-3 p-3 bg-slate-950 border border-slate-800 rounded-xl animate-fadeIn text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500">Selected:</span>
                  <span className="px-1.5 py-0.5 rounded bg-indigo-950/40 border border-indigo-950 text-indigo-400 font-semibold text-[10px]">
                    {currentRoute.workflow_selected}
                  </span>
                </div>

                <div className="border-t border-slate-900 pt-2">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block mb-1">Target Context Nodes</span>
                  <div className="flex flex-wrap gap-1">
                    {currentRoute.documents_to_consult.map((doc, idx) => (
                      <span key={idx} className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-[10px] text-slate-300">
                        📄 {doc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-900 pt-2">
                  <button 
                    onClick={() => setIsTraceOpen(!isTraceOpen)}
                    className="w-full text-left text-[9px] font-mono tracking-wider text-indigo-400 hover:text-indigo-300 flex justify-between"
                  >
                    <span>{isTraceOpen ? '▼ Hide' : '▶ Show'} System Triage Trace</span>
                  </button>
                  {isTraceOpen && (
                    <div className="mt-2 space-y-2 bg-slate-900 p-2 rounded border border-slate-800 text-[10px] text-slate-400 leading-relaxed font-sans">
                      <div>
                        <strong className="text-slate-300 font-mono text-[9px] block uppercase">[Rationale]</strong>
                        {currentRoute.classification_rationale}
                      </div>
                      <div>
                        <strong className="text-slate-300 font-mono text-[9px] block uppercase">[Analytical Strategy]</strong>
                        {currentRoute.analytical_strategy}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Copilot Response Block */}
            {isCopilotLoading && (
              <div className="text-center py-4 text-xs text-indigo-400 animate-pulse font-mono">
                Running agentic router classification...
              </div>
            )}

            {copilotResponse && (
              <div className="p-3.5 bg-[#0e1320] border border-indigo-950/40 rounded-xl text-xs leading-relaxed text-slate-200 space-y-2">
                <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">Copilot Output</div>
                <div dangerouslySetInnerHTML={{ __html: copilotResponse.replace(/\n/g, '<br/>') }} />
              </div>
            )}

          </div>

          {/* User Query Input Form */}
          <div className="p-3 border-t border-slate-800 bg-slate-900/40 shrink-0">
            <form onSubmit={handleQuerySubmit} className="relative flex items-center">
              <input 
                type="text" 
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Query domain parameters or comparison..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-3 pr-10 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none"
              />
              <button type="submit" className="absolute right-1.5 top-1.5 p-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </aside>

      </div>
    </div>
  );
}
