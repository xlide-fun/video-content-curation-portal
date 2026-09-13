'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import site from '@/config/site.json';

export default function Header() {
  const [q, setQ] = useState('');
  const router = useRouter();

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/tag/${encodeURIComponent(q.trim().toLowerCase())}/`);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0f0f1a]/95 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="font-bold text-xl text-brand-pink shrink-0">
          {site.siteName}
        </Link>
        <form onSubmit={onSearch} className="flex-1 max-w-xl">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tags, niches..."
            className="w-full bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-brand-pink"
          />
        </form>
        <nav className="hidden md:flex gap-4 text-sm">
          <Link href="/playlist/trending-now/" className="hover:text-brand-pink">Trending</Link>
          <Link href="/playlist/staff-picks/" className="hover:text-brand-pink">Staff Picks</Link>
          <Link href="/playlist/best-of-2026/" className="hover:text-brand-pink">Best Of</Link>
        </nav>
      </div>
    </header>
  );
}
