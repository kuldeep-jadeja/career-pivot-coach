/**
 * Data Footer Disclaimer
 * 
 * Shows O*NET version and release date in footer.
 * Provides transparency about data source and freshness.
 */

import { loadManifest } from '@/lib/data/onet-loader';
import Link from 'next/link';

export async function DataFooterDisclaimer() {
  const manifest = await loadManifest();

  const releaseDate = new Date(manifest.releaseDate);
  const formattedDate = releaseDate.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  const downloadDate = new Date(manifest.downloadDate);
  const formattedDownload = downloadDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="text-sm text-muted-foreground text-center py-4 border-t">
      <p>
        Powered by O*NET v{manifest.version} (released {formattedDate}) |{' '}
        Last updated: {formattedDownload}
      </p>
      <p className="mt-1">
        <Link
          href="/methodology"
          className="underline hover:text-foreground transition-colors"
        >
          Methodology
        </Link>
        {' • '}
        <Link
          href="/about"
          className="underline hover:text-foreground transition-colors"
        >
          About O*NET Data
        </Link>
      </p>
    </div>
  );
}
