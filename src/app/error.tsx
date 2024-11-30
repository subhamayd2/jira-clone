'use client';

import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface IErrorPageProps {
    error: Error;
}

const ErrorPage = ({ error }: IErrorPageProps) => (
    <div className="h-screen flex flex-col gap-y-4 items-center justify-center">
        <AlertTriangle className="size-6 text-muted-foreground" />
        <p className="text-lg text-muted-foreground">Something went wrong</p>
        <p className="text-sm ">{error.message}</p>
        <Button variant="secondary" size="sm" asChild>
            <Link href="/">
                Back to home
            </Link>
        </Button>
    </div>
);

export default ErrorPage;
