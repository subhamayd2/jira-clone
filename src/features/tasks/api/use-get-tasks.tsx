import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

interface IUseGetTasks {
    workspaceId: string
    projectId?: string
}

export const useGetTasks = ({ workspaceId, projectId }: IUseGetTasks) => useQuery({
  queryKey: ['tasks', workspaceId, projectId],
  queryFn: async () => {
    const response = await client.api.tasks.$get({ query: { workspaceId, projectId } });

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    const { data } = await response.json();
    return data;
  },
});
