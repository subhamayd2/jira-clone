import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.workspaces[':workspaceId']['$patch'], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[':workspaceId']['$patch']>;

const useUpdateWorkspace = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.workspaces[':workspaceId'].$patch({ form, param });
      if (!response.ok) {
        throw new Error('Failed to update workspace');
      }
      return response.json();
    },
    onSuccess: ({ data }) => {
      toast.success('Workspace updated');
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['workspace', data.$id] });
    },
    onError: (e) => {
      console.error(e);
      toast.error('Failed to update workspace');
    },
  });

  return mutation;
};

export default useUpdateWorkspace;
