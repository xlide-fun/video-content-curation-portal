'use client';

import { useEffect, useState } from 'react';
import site from '@/config/site.json';

const STORAGE_KEY = 'interstitial_count';

export default function InterstitialOverlay() {
  const [show, setShow] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const { upsell } = site;

  useEffect(() => {
    const count = Number(sessionStorage.getItem(STORAGE_KEY) || 0) + 1;
    sessionStorage.setItem(STORAGE_KEY, String(count));
    if (count % 3 === 0) setShow(true);
  }, []);

  useEffect(() => {
    if (!show || countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [show, countdown]);

  if (!show) return null;

  const utm = `?utm_source=curation&utm_medium=interstitial&utm_campaign=upsell`;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
      <div className="bg-brand-dark border border-brand-pink/40 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">{upsell.interstitialHeadline}</h2>
        <p className="text-gray-300 mb-6">{upsell.interstitialSub}</p>
        <a
          href={`${upsell.url}${utm}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-brand-pink text-white font-bold px-8 py-3 rounded-xl hover:bg-brand-accent transition"
          data-track="interstitial-cta"
        >
          {upsell.interstitialCta}
        </a>
        <button
          onClick={() => setShow(false)}
          disabled={countdown > 0}
          className="block w-full mt-4 text-sm text-gray-400 hover:text-white disabled:opacity-50"
        >
          {countdown > 0 ? `Continue in ${countdown}s` : 'Continue watching'}
        </button>
      </div>
    </div>
  );
}
