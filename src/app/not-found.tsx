'use client';

import { HomeIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TbRouteX } from 'react-icons/tb';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  const router = useRouter();

  return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-neutral-100 gap-y-8">
          <TbRouteX className="size-20 text-neutral-300" />
          <h1 className="text-4xl text-neutral-400 font-bold text-center md:text-5xl lg:text-6xl">Page not found</h1>
          <Button
              variant="secondary"
              size="lg"
              icon={<HomeIcon className="size-4" />}
              onClick={() => router.push('/')}
          >
              Go home
          </Button>
      </div>
  );
};

export default NotFoundPage;
