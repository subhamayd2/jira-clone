'use client';

import Image from 'next/image';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ILayoutProps {
    children: ReactNode
}

function AuthLayout({ children }: ILayoutProps) {
  const pathname = usePathname();

  return (
      <main className="bg-neutral-100 min-h-screen">
          <div className="mx-auto max-w-screen-2xl p-4">
              <nav className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <Image src="/logo.svg" width={36} height={36} alt="logo" />
                      <h1 className="text-2xl font-bold">JIRA clone</h1>
                  </div>
                  <Button asChild variant="secondary">
                      <Link href={pathname === '/sign-in' ? '/sign-up' : '/sign-in'}>
                          {pathname === '/sign-in' ? 'Sign up' : 'Login'}
                      </Link>
                  </Button>
              </nav>
              <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
                  {children}
              </div>
          </div>
      </main>
  );
}

export default AuthLayout;
