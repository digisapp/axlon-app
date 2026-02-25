import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create your free AxlonAI account. List trucks, trailers, and equipment for sale or start browsing thousands of listings with AI-powered search.',
  openGraph: {
    title: 'Create Your Free Account | AxlonAI',
    description: 'Join AxlonAI to buy and sell trucks, trailers, and equipment with AI-powered tools.',
  },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
