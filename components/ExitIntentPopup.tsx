'use client';

import { useEffect, useState } from 'react';
import site from '@/config/site.json';

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const { upsell } = site;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 5 && !sessionStorage.getItem('exit_shown')) {
        setShow(true);
        sessionStorage.setItem('exit_shown', '1');
      }
    };
    document.addEventListener('mouseout', handler);
    return () => document.removeEventListener('mouseout', handler);
  }, []);

  if (!show) return null;

  const utm = `?utm_source=curation&utm_medium=exit&utm_campaign=upsell`;

  return (
    <div className="fixed inset-0 z-[110] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#1A1A2E] border border-brand-accent rounded-2xl p-6 max-w-sm w-full text-center relative">
        <button onClick={() => setShow(false)} className="absolute top-3 right-3 text-gray-400 hover:text-white">✕</button>
        <h3 className="text-xl font-bold mb-2">{upsell.exitIntentTitle}</h3>
        <p className="text-gray-300 mb-4">{upsell.exitIntentBody}</p>
        <a
          href={`${upsell.url}${utm}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-brand-pink text-white font-bold px-6 py-2.5 rounded-lg"
          data-track="exit-cta"
        >
          {upsell.exitIntentCta}
        </a>
      </div>
    </div>
  );
}
