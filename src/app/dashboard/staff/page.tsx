import { redirect } from 'next/navigation';

export default function StaffPage() {
  redirect('/dashboard/voice-agent?tab=staff');
}
