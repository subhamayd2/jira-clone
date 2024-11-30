import { Loader } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import useWorkspaceId from '@/features/workspaces/hooks/use-workspace-id';
import CreateTaskForm from './create-task-form';

interface ICreateTaskFormWrapperProps {
    onCancel?: () => void
}

const CreateTaskFormWrapper = ({ onCancel }: ICreateTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading: loadingProjects } = useGetProjects({ workspaceId });
  const { data: members, isLoading: loadingMembers } = useGetMembers({ workspaceId });

  const projectOptions = projects?.documents.map((project) => ({ name: project.name, id: project.$id, imageUrl: project.imageUrl })) || [];
  const memberOptions = members?.documents.map((member) => ({ name: member.name, id: member.$id })) || [];

  const isLoading = loadingProjects || loadingMembers;

  if (isLoading) {
    return (
        <Card className="w-full h-[714px] border-none shadow-none">
            <CardContent className="flex items-center justify-center h-full">
                <Loader className="size-5 animate-spin text-muted-foreground" />
            </CardContent>
        </Card>
    );
  }

  return (
      <CreateTaskForm onCancel={onCancel} projectOptions={projectOptions} memberOptions={memberOptions} />
  );
};

export default CreateTaskFormWrapper;
