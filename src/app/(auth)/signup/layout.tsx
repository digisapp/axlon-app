import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create your free Axleyard account. List trucks, trailers, and equipment for sale or start browsing thousands of listings with AI-powered search.',
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Create Your Free Account | Axleyard',
    description: 'Join Axleyard to buy and sell trucks, trailers, and equipment with AI-powered tools.',
  },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
