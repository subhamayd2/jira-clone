import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.workspaces[':workspaceId']['$delete'], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[':workspaceId']['$delete']>;

const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[':workspaceId'].$delete({ param });
      if (!response.ok) {
        throw new Error('Failed to delete workspace');
      }
      return response.json();
    },
    onSuccess: ({ data }) => {
      toast.success('Workspace deleted');
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['workspace', data.$id] });
    },
    onError: (e) => {
      console.error(e);
      toast.error('Failed to delete workspace');
    },
  });

  return mutation;
};

export default useDeleteWorkspace;
