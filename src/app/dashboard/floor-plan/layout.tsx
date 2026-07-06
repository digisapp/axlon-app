import { FeatureGate } from '@/components/dashboard/FeatureGate';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <FeatureGate feature="floorPlan">{children}</FeatureGate>;
}
