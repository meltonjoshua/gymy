import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import TopBar from '@/components/layout/TopBar';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Gymy | The Best Gym App',
  description: 'Your ultimate fitness companion for workouts, tracking, and progress.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-950 text-gray-100 flex flex-col">
        <TopBar />
        <main className="flex-1 pb-20 md:pb-8 overflow-x-hidden">{children}</main>
        <Navbar />
      </body>
    </html>
  );
}
