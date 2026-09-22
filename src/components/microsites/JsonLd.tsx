import { headers } from 'next/headers';
import { jsonLdString } from '@/lib/seo/json-ld';

/**
 * Emits one <script type="application/ld+json"> per object, carrying the
 * request's CSP nonce the same way the marketplace's OrganizationJsonLd does.
 * Browsers do not execute data blocks, but the app's CSP is nonce + strict-
 * dynamic, and matching the established pattern costs nothing.
 */
export async function JsonLd({ data }: { data: object[] }) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  return (
    <>
      {data.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: jsonLdString(obj) }}
        />
      ))}
    </>
  );
}
