'use client';

import site from '@/config/site.json';

export default function InContentCTA() {
  const { upsell } = site;
  const utm = `?utm_source=curation&utm_medium=incontent&utm_campaign=upsell`;

  return (
    <div className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5 my-2">
      <div className="bg-gradient-to-r from-brand-dark to-brand-accent/80 rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-brand-pink/30">
        <div>
          <h4 className="font-bold text-lg">{upsell.inContentCtaTitle}</h4>
          <p className="text-sm text-gray-200">{upsell.inContentCtaBody}</p>
        </div>
        <a
          href={`${upsell.url}${utm}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 bg-white text-brand-dark font-bold px-5 py-2.5 rounded-lg hover:bg-gray-100"
          data-track="incontent-cta"
        >
          Join Now
        </a>
      </div>
    </div>
  );
}
