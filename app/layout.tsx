import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'Falkland Big Board',
  description: 'Fantasy Football Co-Manager Rankings',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
