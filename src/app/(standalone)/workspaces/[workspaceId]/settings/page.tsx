import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/queries';
import { getWorkspace } from '@/features/workspaces/queries';
import EditWorkspaceForm from '@/features/workspaces/components/edit-workspace-form';

interface IWorkspaceIdSettingsPageProps {
    params: {
        workspaceId: string
    }
}

const WorkspaceIdSettingsPage = async ({ params: { workspaceId } }: IWorkspaceIdSettingsPageProps) => {
  const user = await getCurrentUser();
  if (!user) redirect('/sign-in');

  const initialValues = await getWorkspace({ workspaceId });

  return (
      <div className="w-full lg:max-w-xl">
          <EditWorkspaceForm initialValues={initialValues} />
      </div>
  );
};

export default WorkspaceIdSettingsPage;
