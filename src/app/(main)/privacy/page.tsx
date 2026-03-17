import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — AXLON AI',
  description: 'AXLON AI privacy policy. Learn how we collect, use, and protect your data.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy — AXLON AI',
    description: 'Learn how AXLON AI collects, uses, and protects your data.',
    type: 'website',
    url: '/privacy',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy — AXLON AI',
    description: 'Learn how AXLON AI collects, uses, and protects your data.',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 via-background to-background">
      <div className="max-w-3xl mx-auto px-4 py-10 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: March 11, 2026</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-foreground [&_h3]:text-lg [&_h3]:font-medium [&_h3]:mt-6 [&_h3]:mb-2 [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline">
          <p>
            AXLON AI (&quot;AXLON,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is
            committed to protecting your privacy. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you use our website and platform
            at axlon.ai (the &quot;Service&quot;).
          </p>

          <h2>1. Information We Collect</h2>

          <h3>Information You Provide</h3>
          <p>
            We collect information you provide directly, including: your name, email address,
            phone number, and company name when you create an account; listing details and
            images when you post equipment for sale; messages sent through our platform; and
            payment information when you subscribe to paid plans.
          </p>

          <h3>Information Collected Automatically</h3>
          <p>
            When you use our Service, we automatically collect: device and browser information,
            IP address, pages visited and time spent, search queries and filters used, and
            interactions with AI features (chat messages, voice calls).
          </p>

          <h3>Information from Third Parties</h3>
          <p>
            We may receive information from authentication providers (Google, email) when you
            sign in, and from payment processors when you make transactions.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide, maintain, and improve our Service</li>
            <li>Process transactions and send related information</li>
            <li>Connect buyers with sellers and facilitate communications</li>
            <li>Power AI features including sales assistants and voice agents</li>
            <li>Send you updates, marketing communications, and support messages</li>
            <li>Monitor and analyze usage trends to improve the platform</li>
            <li>Detect, prevent, and address fraud and security issues</li>
          </ul>

          <h2>3. AI Features & Data</h2>
          <p>
            Our AI sales assistants and voice agents process conversation data to provide
            responses. Conversations may be reviewed to improve AI quality. We do not sell
            conversation data to third parties. You can request deletion of your AI
            conversation history at any time.
          </p>

          <h2>4. Information Sharing</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Other users:</strong> Your public profile, listings, and storefront
              information are visible to other users
            </li>
            <li>
              <strong>Service providers:</strong> Third-party companies that help us operate
              the platform (hosting, analytics, payment processing)
            </li>
            <li>
              <strong>Legal requirements:</strong> When required by law, subpoena, or
              government request
            </li>
            <li>
              <strong>Business transfers:</strong> In connection with a merger, acquisition, or
              sale of assets
            </li>
          </ul>

          <h2>5. Data Security</h2>
          <p>
            We use industry-standard security measures to protect your data, including
            encryption in transit (TLS/SSL), secure database storage with Supabase
            row-level security, and regular security audits. However, no method of transmission
            over the Internet is 100% secure.
          </p>

          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access and download your personal data</li>
            <li>Correct inaccurate information</li>
            <li>Delete your account and associated data</li>
            <li>Opt out of marketing communications</li>
            <li>Request information about data sharing</li>
          </ul>

          <h2>7. Cookies</h2>
          <p>
            We use essential cookies for authentication and session management. We may use
            analytics cookies to understand how the Service is used. You can control cookie
            preferences through your browser settings.
          </p>

          <h2>8. Children&apos;s Privacy</h2>
          <p>
            Our Service is not intended for users under 18. We do not knowingly collect
            information from children under 18.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any
            changes by posting the new policy on this page and updating the &quot;Last
            updated&quot; date.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:privacy@axlon.ai">privacy@axlon.ai</a> or visit our{' '}
            <a href="/contact">contact page</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
