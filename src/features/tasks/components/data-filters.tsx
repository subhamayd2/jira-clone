import {
  Grid2x2CheckIcon, ListCheckIcon, Loader, UsersIcon,
} from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import useWorkspaceId from '@/features/workspaces/hooks/use-workspace-id';
import { TaskStatus } from '@/features/tasks/types';

interface IDataFiltersProps {
    hideProjectFilter?: boolean
}

const DataFilters = ({ hideProjectFilter }: IDataFiltersProps) => {
  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading: loadingProjects } = useGetProjects({ workspaceId });
  const { data: members, isLoading: loadingMembers } = useGetMembers({ workspaceId });

  const isLoading = loadingProjects || loadingMembers;

  const projectOptions = projects?.documents.map((project) => ({ label: project.name, value: project.$id })) || [];
  const memberOptions = members?.documents.map((member) => ({ label: member.name, value: member.$id })) || [];

  if (hideProjectFilter) return null;

  if (isLoading) {
    return (
        <div className="flex items-center w-full">
            <Loader className="size-4 animate-spin text-muted-foreground" />
        </div>
    );
  }

  return (
      <div className="flex flex-col lg:flex-row gap-2">
          <Select defaultValue={undefined} onValueChange={() => {}}>
              <SelectTrigger className="w-full lg:w-auto h-8">
                  <div className="flex items-center pr-2">
                      <ListCheckIcon className="size-4 mr-2" />
                      <SelectValue placeholder="All statuses" />
                  </div>
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectSeparator />
                  <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
                  <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
                  <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                  <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
                  <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
              </SelectContent>
          </Select>
          <Select defaultValue={undefined} onValueChange={() => {}}>
              <SelectTrigger className="w-full lg:w-auto h-8">
                  <div className="flex items-center pr-2">
                      <Grid2x2CheckIcon className="size-4 mr-2" />
                      <SelectValue placeholder="All projects" />
                  </div>
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">All projects</SelectItem>
                  <SelectSeparator />
                  {projectOptions.map((project) => (
                      <SelectItem key={project.value} value={project.value}>
                          <div className="flex items-center gap-x-2">
                              {project.label}
                          </div>
                      </SelectItem>
                  ))}
              </SelectContent>
          </Select>
          <Select defaultValue={undefined} onValueChange={() => {}}>
              <SelectTrigger className="w-full lg:w-auto h-8">
                  <div className="flex items-center pr-2">
                      <UsersIcon className="size-4 mr-2" />
                      <SelectValue placeholder="All members" />
                  </div>
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">All members</SelectItem>
                  <SelectSeparator />
                  {memberOptions.map((member) => (
                      <SelectItem key={member.value} value={member.value}>
                          <div className="flex items-center gap-x-2">
                              {member.label}
                          </div>
                      </SelectItem>
                  ))}
              </SelectContent>
          </Select>
      </div>
  );
};

export default DataFilters;
