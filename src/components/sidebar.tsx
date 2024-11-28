import Image from 'next/image';
import Link from 'next/link';
import DottedSepartor from './dotted-separator';
import Navigation from './navigation';

export const Sidebar = () => (
    <aside className="h-full bg-neutral-100 p-4 w-full">
        <Link href="/">
            <Image src="/logo.svg" width={36} height={36} alt="logo" />
        </Link>
        <DottedSepartor className="my-4" />
        <Navigation />
    </aside>
);
