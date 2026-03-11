import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — AXLON AI',
  description: 'AXLON AI terms of service. Read the terms governing your use of our platform.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 via-background to-background">
      <div className="max-w-3xl mx-auto px-4 py-10 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: March 11, 2026</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-foreground [&_h3]:text-lg [&_h3]:font-medium [&_h3]:mt-6 [&_h3]:mb-2 [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline">
          <p>
            Welcome to AXLON AI. These Terms of Service (&quot;Terms&quot;) govern your use of
            the AXLON AI website and platform at axlon.ai (the &quot;Service&quot;) operated by
            AXLON AI (&quot;AXLON,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By
            using the Service, you agree to these Terms.
          </p>

          <h2>1. Accounts</h2>
          <p>
            You must be at least 18 years old to use the Service. When you create an account,
            you must provide accurate and complete information. You are responsible for
            maintaining the security of your account and password. AXLON is not liable for any
            loss from unauthorized access to your account.
          </p>

          <h2>2. Listings & Content</h2>
          <p>
            Dealers and sellers are responsible for the accuracy of their listings. You
            represent that you have the right to sell any equipment you list and that listing
            information (including pricing, specifications, and photos) is accurate.
          </p>
          <p>
            You retain ownership of content you post. By posting content, you grant AXLON a
            non-exclusive, worldwide license to use, display, and distribute your content in
            connection with the Service.
          </p>
          <p>
            AXLON reserves the right to remove any listing or content that violates these Terms
            or is otherwise objectionable.
          </p>

          <h2>3. AI Features</h2>
          <p>
            Our Service includes AI-powered features such as sales assistants, voice agents,
            and automated communications. You acknowledge that:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              AI responses are generated automatically and may not always be accurate
            </li>
            <li>
              AI features are tools to assist your business, not replacements for professional
              judgment
            </li>
            <li>
              You are responsible for reviewing and approving AI-generated communications sent
              on your behalf
            </li>
            <li>
              Conversations with AI features may be recorded and analyzed to improve the
              Service
            </li>
          </ul>

          <h2>4. Dealer Subscriptions</h2>
          <p>
            Certain features require a paid subscription. Subscription fees are billed in
            advance on a monthly or annual basis. You can cancel your subscription at any time,
            and cancellation will take effect at the end of the current billing period. Refunds
            are provided at AXLON&apos;s discretion.
          </p>

          <h2>5. Transactions</h2>
          <p>
            AXLON facilitates connections between buyers and sellers but is not a party to any
            transaction. We do not guarantee the quality, safety, or legality of listed
            equipment. Buyers and sellers are solely responsible for their transactions,
            including payment, delivery, and any disputes.
          </p>

          <h2>6. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Post false, misleading, or fraudulent listings</li>
            <li>Use the Service for any illegal purpose</li>
            <li>Harass, abuse, or threaten other users</li>
            <li>Scrape, crawl, or use automated tools to access the Service without permission</li>
            <li>Attempt to bypass security features or access restrictions</li>
            <li>Interfere with or disrupt the Service</li>
            <li>Impersonate another person or entity</li>
          </ul>

          <h2>7. Intellectual Property</h2>
          <p>
            The Service, including its design, features, and content (excluding user-generated
            content), is owned by AXLON and protected by copyright, trademark, and other
            intellectual property laws. You may not copy, modify, or distribute any part of the
            Service without our written consent.
          </p>

          <h2>8. Disclaimer of Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT
            WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. AXLON DOES NOT WARRANT THAT THE
            SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE. WE DO NOT ENDORSE OR
            GUARANTEE ANY EQUIPMENT LISTED ON THE PLATFORM.
          </p>

          <h2>9. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, AXLON SHALL NOT BE LIABLE FOR ANY
            INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM
            YOUR USE OF THE SERVICE, INCLUDING DAMAGES FROM TRANSACTIONS BETWEEN USERS.
          </p>

          <h2>10. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless AXLON and its officers, directors,
            employees, and agents from any claims, damages, or expenses arising from your use
            of the Service or violation of these Terms.
          </p>

          <h2>11. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. We will notify you of significant
            changes by posting a notice on the Service or sending you an email. Your continued
            use of the Service after changes take effect constitutes acceptance of the new
            Terms.
          </p>

          <h2>12. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the State of Florida, without regard to
            conflict of law principles. Any disputes shall be resolved in the courts located in
            Miami-Dade County, Florida.
          </p>

          <h2>13. Contact</h2>
          <p>
            Questions about these Terms? Contact us at{' '}
            <a href="mailto:legal@axlon.ai">legal@axlon.ai</a> or visit our{' '}
            <a href="/contact">contact page</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
