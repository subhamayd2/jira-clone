import {
  FolderIcon,
  ListCheckIcon, Loader, UserIcon,
} from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import useTaskFilters from '@/features/tasks/hooks/use-task-filters';
import { TaskStatus } from '@/features/tasks/types';
import useWorkspaceId from '@/features/workspaces/hooks/use-workspace-id';
import DatePicker from '@/components/date-picker';

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

  const [
    filters,
    setFilters,
  ] = useTaskFilters();

  const {
    projectId,
    status,
    assigneeId,
    dueDate,
    search,
  } = filters;

  const onStatusChange = (value:string) => {
    setFilters({ status: value === 'all' ? null : value as TaskStatus });
  };

  const onFilterChange = (key: keyof typeof filters) => (value: string) => {
    setFilters({ [key]: value === 'all' ? null : value });
  };

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
          <Select defaultValue={status ?? undefined} onValueChange={onStatusChange}>
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
          <Select defaultValue={projectId ?? undefined} onValueChange={onFilterChange('projectId')}>
              <SelectTrigger className="w-full lg:w-auto h-8">
                  <div className="flex items-center pr-2">
                      <FolderIcon className="size-4 mr-2" />
                      <SelectValue placeholder="All projects" />
                  </div>
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">All projects</SelectItem>
                  <SelectSeparator />
                  {projectOptions.map((project) => (
                      <SelectItem key={project.value} value={project.value}>
                          {project.label}
                      </SelectItem>
                  ))}
              </SelectContent>
          </Select>
          <Select defaultValue={assigneeId ?? undefined} onValueChange={onFilterChange('assigneeId')}>
              <SelectTrigger className="w-full lg:w-auto h-8">
                  <div className="flex items-center pr-2">
                      <UserIcon className="size-4 mr-2" />
                      <SelectValue placeholder="All assignees" />
                  </div>
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">All assignees</SelectItem>
                  <SelectSeparator />
                  {memberOptions.map((member) => (
                      <SelectItem key={member.value} value={member.value}>
                          {member.label}
                      </SelectItem>
                  ))}
              </SelectContent>
          </Select>
          <DatePicker
              placeholder="Due Date"
              className="w-full lg:w-auto h-8"
              value={dueDate ? new Date(dueDate) : undefined}
              onChange={(date) => setFilters({ dueDate: date ? date.toISOString() : null })}
          />
      </div>
  );
};

export default DataFilters;
