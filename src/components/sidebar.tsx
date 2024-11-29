import Link from 'next/link';
import { Suspense } from 'react';
import DottedSeparator from './dotted-separator';
import LogoTitle from './logo-title';
import Navigation from './navigation';
import WorkspaceSwitcher from './workspace-switcher';

export const Sidebar = () => (
    <aside className="h-full bg-neutral-100 p-4 w-full">
        <Link href="/">
            <LogoTitle />
        </Link>
        <DottedSeparator className="my-4" />
        <Suspense fallback={null}>
            <WorkspaceSwitcher />
        </Suspense>
        <DottedSeparator className="my-4" />
        <Navigation />
    </aside>
);
