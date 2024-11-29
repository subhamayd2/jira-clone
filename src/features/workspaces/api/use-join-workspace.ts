import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.workspaces[':workspaceId']['join']['$post'], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[':workspaceId']['join']['$post']>;

const useJoinWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.workspaces[':workspaceId'].join.$post({ json, param });
      if (!response.ok) {
        throw new Error('Failed to join workspace');
      }
      return response.json();
    },
    onSuccess: ({ data }) => {
      toast.success(`Joined workspace ${data.name} 🎉`);
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['workspace', data.$id] });
    },
    onError: (e) => {
      console.error(e);
      toast.error('Failed to join workspace');
    },
  });

  return mutation;
};

export default useJoinWorkspace;