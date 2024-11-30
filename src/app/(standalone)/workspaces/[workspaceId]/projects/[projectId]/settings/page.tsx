import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/queries';
import { getProject } from '@/features/projects/queries';
import EditProjectForm from '@/features/projects/components/edit-project-form';

interface IProjectIdSettingsPageProps {
    params: {
        projectId: string;
    };
}

const ProjectIdSettingsPage = async ({ params: { projectId } }: IProjectIdSettingsPageProps) => {
  const user = await getCurrentUser();
  if (!user) redirect('/sign-in');

  const initialValues = await getProject({ projectId });

  return (
      <div className="w-full lg:max-w-xl">
          <EditProjectForm initialValues={initialValues} />
      </div>
  );
};

export default ProjectIdSettingsPage;
