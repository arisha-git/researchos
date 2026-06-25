# ResearchOS

> AI-powered multi-document research intelligence platform for academic paper analysis, knowledge synthesis, and automated presentation generation.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4)

---

## Overview

ResearchOS is an AI-powered research workspace that transforms collections of academic papers into structured insights.

Instead of manually reading dozens of PDFs, ResearchOS automatically extracts content, performs semantic analysis, identifies research gaps, generates domain syntheses, builds interactive knowledge graphs, and creates executive presentation reports.

The platform is designed for researchers, students, and technical professionals working with large collections of research papers.

---

## Features

### PDF Research Library

- Upload multiple research papers
- Automatic PDF parsing
- Multi-document workspace
- Page navigation
- Active document viewer

---

### AI Gap Analysis

Automatically identifies:

- Missing research areas
- Methodological limitations
- Unexplored opportunities
- Structural weaknesses
- Future research directions

---

### Domain Synthesis

Aggregates information across all uploaded papers and extracts:

- Dominant methodologies
- Common datasets
- Shared themes
- Research consensus
- Cross-document insights

---

### Knowledge Graph

Generate an interactive graph showing relationships between:

- Documents
- Concepts
- Themes
- Semantic connections

Interactive navigation allows users to move directly between connected research sources.

---

### Executive Presentation Generator

Generate an AI-created presentation including:

- Executive Summary
- Key Findings
- Methodological Overview
- Strategic Recommendations
- Research Conclusion

---

### PDF Export

Export the generated presentation as a professionally formatted PDF report.

---

## Tech Stack

### Frontend

- Next.js 15
- React
- TypeScript
- Zustand
- Tailwind CSS
- Lucide Icons

### AI

- Google Gemini 2.5 Flash
- Semantic document synthesis
- Automated presentation generation
- Research gap detection

### Document Processing

- PDF.js
- Custom chunking engine
- Embedding pipeline
- Retrieval engine

### Visualization

- Interactive Knowledge Graph
- Research Metrics Dashboard

---

## Project Architecture

```
ResearchOS
│
├── PDF Ingestion
│
├── Text Extraction
│
├── Semantic Chunking
│
├── Embedding Generation
│
├── Retrieval Engine
│
├── AI Analysis
│   ├── Gap Analysis
│   ├── Domain Synthesis
│   ├── Presentation Generation
│   └── Knowledge Graph
│
└── PDF Report Export
```

---

## Screenshots

### Source Viewer

*(Add screenshot here)*

---

### Gap Analysis

*(Add screenshot here)*

---

### Domain Synthesis

*(Add screenshot here)*

---

### Knowledge Graph

*(Add screenshot here)*

---

### Presentation Generator

*(Add screenshot here)*

---

## Installation

Clone the repository

```bash
git clone https://github.com/arisha-git/researchos.git
```

Navigate into the project

```bash
cd researchos
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

## Environment Variables

Create a `.env.local` file.

```env
NEXT_PUBLIC_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

Obtain an API key from Google AI Studio.

---

## Current Functionality

- PDF Upload
- Multi-document Library
- Source Viewer
- AI Gap Analysis
- Domain Synthesis
- Knowledge Graph
- Executive Presentation Generation
- PDF Export
- Responsive UI
- Vercel Deployment

---

## Future Improvements

- User Authentication
- Workspace Persistence
- Citation-aware AI Responses
- Multi-user Collaboration
- Research Timeline View
- Advanced Graph Analytics
- RAG Pipeline Improvements
- Local Embedding Models
- Research Comparison Mode

---

## Live Demo

https://researchos-ari.vercel.app/

---

