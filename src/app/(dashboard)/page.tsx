import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/queries';
import { getWorkspaces } from '@/features/workspaces/queries';

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) redirect('/sign-in');

  const workspaces = await getWorkspaces();

  if (workspaces.total === 0) {
    return redirect('/workspaces/create');
  }
  return redirect(`/workspaces/${workspaces.documents[0].$id}`);
}
