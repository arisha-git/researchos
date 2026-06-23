import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ResearchOS - Understand entire research domains in minutes',
  description: 'AI-powered research operating system that helps users analyze multiple research papers simultaneously.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="h-full overflow-hidden flex flex-col">{children}</body>
    </html>
  );
}