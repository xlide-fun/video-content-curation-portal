import site from '@/config/site.json';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-12 py-8 text-center text-sm text-gray-400">
      <p className="mb-2">{site.disclaimer}</p>
      <p className="mb-4">
        DMCA: <a href={`mailto:${site.dmcaEmail}`} className="underline hover:text-white">{site.dmcaEmail}</a>
      </p>
      <div className="flex justify-center gap-4">
        <Link href="/dmca/" className="hover:text-white">Takedown</Link>
        <Link href="/" className="hover:text-white">Home</Link>
      </div>
      <p className="mt-4 text-xs">© {new Date().getFullYear()} {site.siteName}</p>
    </footer>
  );
}
