import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/queries';
import { getWorkspaceInfo } from '@/features/workspaces/queries';
import JoinWorkspaceForm from '@/features/workspaces/components/join-workspace-form';

interface IWorkspaceIdJoinPageProps {
    params: {
        workspaceId: string;
        inviteCode: string;
    }
}

const WorkspaceIdJoinPage = async ({ params }: IWorkspaceIdJoinPageProps) => {
  const user = await getCurrentUser();
  if (!user) redirect('/sign-in');

  const { workspaceId } = params;

  const initialValues = await getWorkspaceInfo({ workspaceId });
  if (!initialValues) redirect('/');

  return (
      <div className="w-full lg:max-w-xl">
          <JoinWorkspaceForm initialValues={initialValues} />
      </div>
  );
};

export default WorkspaceIdJoinPage;
