import Link from 'next/link';
import Image from 'next/image';
import { SALES_PHONE_DISPLAY, SALES_PHONE_E164 } from '@/lib/contact';

const footerLinks = {
  marketplace: [
    { href: '/search', label: 'Browse Equipment' },
    { href: '/new-trailers', label: 'New Trailers' },
    { href: '/categories', label: 'Categories' },
    { href: '/deals', label: 'Below-Market Deals' },
    { href: '/dealers', label: 'Directory' },
    { href: '/finance', label: 'Financing' },
    { href: '/tools/axle-weight-calculator', label: 'Axle Calculator' },
  ],
  platform: [
    { href: '/how-it-works', label: 'AI Platform' },
    { href: '/voice', label: 'Voice Agent' },
    { href: '/transform', label: 'AI Transformation' },
    { href: '/apply', label: 'Apply Now' },
    { href: '/for-business', label: 'For Business' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" aria-label="Axleyard home" className="inline-block p-2 -m-2 mb-2">
              <Image
                src="/images/axlonai-logo.png"
                alt="Axleyard"
                width={100}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              The Super Intelligence platform for equipment businesses. Buy, sell, and manage in one place.
            </p>
          </div>

          {/* Marketplace Links */}
          <div>
            <h3 className="font-semibold mb-1.5 md:mb-3">Marketplace</h3>
            <ul className="md:space-y-2">
              {footerLinks.marketplace.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block py-2.5 md:py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold mb-1.5 md:mb-3">Platform</h3>
            <ul className="md:space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block py-2.5 md:py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-1.5 md:mb-3">Company</h3>
            <ul className="md:space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block py-2.5 md:py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-1.5 md:mb-3">Legal</h3>
            <ul className="md:space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block py-2.5 md:py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {currentYear} <span className="font-[family-name:var(--font-gunship)]">AXLEYARD</span>. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            <a href={`tel:${SALES_PHONE_E164}`} className="inline-block py-3 -my-3 hover:text-foreground whitespace-nowrap">
              {SALES_PHONE_DISPLAY}
            </a>
            <span aria-hidden="true"> · </span>
            Made with AI in Miami, FL
          </p>
        </div>
      </div>
    </footer>
  );
}
