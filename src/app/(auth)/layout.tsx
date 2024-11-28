'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import LogoTitle from '@/components/logo-title';

interface ILayoutProps {
    children: ReactNode
}

function AuthLayout({ children }: ILayoutProps) {
  const pathname = usePathname();

  return (
      <main className="bg-neutral-100 min-h-screen">
          <div className="mx-auto max-w-screen-2xl p-4">
              <nav className="flex items-center justify-between">
                  <LogoTitle />
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
