import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { TaskStatus } from '@/features/tasks/types';

interface IUseGetTasks {
    workspaceId: string;
    projectId?: string | null;
    status?: TaskStatus | null;
    assigneeId?: string | null;
    dueDate?: string | null;
    search?: string | null;
}

export const useGetTasks = ({
  workspaceId, projectId, assigneeId, dueDate, search, status,
}: IUseGetTasks) => useQuery({
  queryKey: ['tasks', workspaceId, projectId, assigneeId, dueDate, search, status],
  queryFn: async () => {
    const response = await client.api.tasks.$get({
      query: {
        workspaceId,
        projectId: projectId ?? undefined,
        assigneeId: assigneeId ?? undefined,
        dueDate: dueDate ?? undefined,
        search: search ?? undefined,
        status: status ?? undefined,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    const { data } = await response.json();
    return data;
  },
});
