import { Loader } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { useGetTask } from '@/features/tasks/api/use-get-task';
import useWorkspaceId from '@/features/workspaces/hooks/use-workspace-id';
import EditTaskForm from './edit-task-form';

interface IEditTaskFormWrapperProps {
    onCancel?: () => void
    id: string;
}

const EditTaskFormWrapper = ({ onCancel, id }: IEditTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading: loadingProjects } = useGetProjects({ workspaceId });
  const { data: members, isLoading: loadingMembers } = useGetMembers({ workspaceId });
  const { data: initialValues, isLoading: loadingTask } = useGetTask({ taskId: id });

  const projectOptions = projects?.documents.map((project) => ({ name: project.name, id: project.$id, imageUrl: project.imageUrl })) || [];
  const memberOptions = members?.documents.map((member) => ({ name: member.name, id: member.$id })) || [];

  const isLoading = loadingProjects || loadingMembers || loadingTask;

  if (isLoading) {
    return (
        <Card className="w-full h-[714px] border-none shadow-none">
            <CardContent className="flex items-center justify-center h-full">
                <Loader className="size-5 animate-spin text-muted-foreground" />
            </CardContent>
        </Card>
    );
  }

  if (!initialValues) {
    return null;
  }

  return (
      <EditTaskForm
          onCancel={onCancel}
          projectOptions={projectOptions}
          memberOptions={memberOptions}
          initialValues={initialValues}
      />
  );
};

export default EditTaskFormWrapper;
