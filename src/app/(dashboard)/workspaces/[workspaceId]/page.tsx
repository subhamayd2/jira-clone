import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/queries';
import { getWorkspace } from '@/features/workspaces/queries';

interface IWorkspaceIdSettingsPageProps {
    params: {
        workspaceId: string
    }
}

const WorkspaceIdPage = async ({ params: { workspaceId } }: IWorkspaceIdSettingsPageProps) => {
  const user = await getCurrentUser();
  if (!user) redirect('/sign-in');

  const initialValues = await getWorkspace({ workspaceId });
  if (!initialValues) redirect('/');

  return (
      <div>WorkspaceIdPage</div>
  );
};

export default WorkspaceIdPage;
