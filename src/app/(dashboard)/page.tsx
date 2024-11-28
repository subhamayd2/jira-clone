import { redirect } from 'next/navigation';
import DottedSepartor from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/features/auth/actions';

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
      <div className="flex flex-col gap-4 items-center p-7">
          <h2 className="text-2xl">Buttons</h2>
          <Button>Primary</Button>
          <Button loading>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ternary">Ternary</Button>
          <Button variant="ghost">Ghost</Button>
          <DottedSepartor />
          <h2 className="text-2xl">Disabled Buttons</h2>
          <Button disabled>Primary</Button>
          <Button disabled variant="secondary">Secondary</Button>
          <Button disabled variant="destructive">Destructive</Button>
          <Button disabled variant="outline">Outline</Button>
          <Button disabled variant="ternary">Ternary</Button>
          <Button disabled variant="ghost">Ghost</Button>
      </div>
  );
}
