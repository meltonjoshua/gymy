'use client';

import Navbar from '@/components/layout/Navbar';
import TopBar from '@/components/layout/TopBar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar />
      <main className="flex-1 pb-20 md:pb-4">{children}</main>
      <Navbar />
    </>
  );
}