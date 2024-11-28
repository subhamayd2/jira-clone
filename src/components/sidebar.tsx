import Link from 'next/link';
import DottedSepartor from './dotted-separator';
import LogoTitle from './logo-title';
import Navigation from './navigation';
import WorkspaceSwitcher from './workspace-switcher';

export const Sidebar = () => (
    <aside className="h-full bg-neutral-100 p-4 w-full">
        <Link href="/">
            <LogoTitle />
        </Link>
        <DottedSepartor className="my-4" />
        <WorkspaceSwitcher />
        <DottedSepartor className="my-4" />
        <Navigation />
    </aside>
);
