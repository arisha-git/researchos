import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ResearchOS',
  description: 'AI-powered research operating system that helps users analyze multiple research papers simultaneously.',

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
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
