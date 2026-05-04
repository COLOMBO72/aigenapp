'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '../dashboard/auth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    if (!getToken()) {
      router.replace('/dashboard');
    }
  }, [router]);
  return <>{children}</>;
}
