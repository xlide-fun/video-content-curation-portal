'use client';

import site from '@/config/site.json';

export default function StickyBanner() {
  const { upsell } = site;
  const utm = `?utm_source=curation&utm_medium=sticky&utm_campaign=upsell`;

  return (
    <div className="sticky-banner">
      <p className="text-sm md:text-base font-medium">{upsell.stickyBannerText}</p>
      <a
        href={`${upsell.url}${utm}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white text-brand-dark font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
        data-track="sticky-cta"
      >
        {upsell.stickyBannerCta}
      </a>
    </div>
  );
}
