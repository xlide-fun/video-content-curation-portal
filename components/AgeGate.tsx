'use client';

import { useEffect, useState } from 'react';
import site from '@/config/site.json';

export default function AgeGate() {
  const [visible, setVisible] = useState(false);
  const { ageGate } = site;

  useEffect(() => {
    if (!ageGate.enabled) return;
    if (!localStorage.getItem('age_confirmed')) setVisible(true);
  }, [ageGate.enabled]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center p-4">
      <div className="bg-brand-dark rounded-2xl p-8 max-w-sm w-full text-center border border-white/10">
        <h2 className="text-2xl font-bold mb-4">{ageGate.title}</h2>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              localStorage.setItem('age_confirmed', '1');
              setVisible(false);
            }}
            className="bg-brand-pink text-white font-bold px-6 py-2.5 rounded-lg"
          >
            {ageGate.confirm}
          </button>
          <a href="https://www.google.com" className="bg-gray-700 text-white px-6 py-2.5 rounded-lg">
            {ageGate.deny}
          </a>
        </div>
      </div>
    </div>
  );
}
