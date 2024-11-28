import Link from 'next/link';
import { ReactNode } from 'react';
import LogoTitle from '@/components/logo-title';
import UserButton from '@/features/auth/components/user-button';

interface IStandaloneLayoutProps {
    children: ReactNode
}

const StandaloneLayout = ({ children }: IStandaloneLayoutProps) => (
    <main className="bg-neutral-100 min-h-screen">
        <div className="mx-auto max-w-screen-2xl p-4">
            <nav className="flex h-[73px] items-center justify-between">
                <Link href="/">
                    <LogoTitle />
                </Link>
                <UserButton />
            </nav>
            <div className="flex flex-col items-center justify-center py-4">
                {children}
            </div>
        </div>
    </main>
);

export default StandaloneLayout;
