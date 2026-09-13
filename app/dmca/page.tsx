import site from '@/config/site.json';

export const metadata = {
  title: 'DMCA / Takedown',
  robots: { index: false }
};

export default function DmcaPage() {
  return (
    <div className="max-w-2xl mx-auto prose prose-invert">
      <h1>DMCA & Takedown</h1>
      <p>
        We do not host any video files. All media is streamed from third-party CDNs via public APIs.
      </p>
      <p>
        To request removal of a listing, email{' '}
        <a href={`mailto:${site.dmcaEmail}`}>{site.dmcaEmail}</a> with:
      </p>
      <ul>
        <li>URL of the page</li>
        <li>Source ID</li>
        <li>Proof of ownership / rights</li>
      </ul>
      <p>We process valid requests within 24 hours.</p>
    </div>
  );
}
