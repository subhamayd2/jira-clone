import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.projects[':projectId']['$delete'], 200>;
type RequestType = InferRequestType<typeof client.api.projects[':projectId']['$delete']>;

const useDeleteProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.projects[':projectId'].$delete({ param });
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      return response.json();
    },
    onSuccess: ({ data }) => {
      toast.success('Project deleted');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', data.$id] });
    },
    onError: (e) => {
      console.error(e);
      toast.error('Failed to delete project');
    },
  });

  return mutation;
};

export default useDeleteProject;
