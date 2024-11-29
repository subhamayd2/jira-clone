import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.workspaces['$post']>;
type RequestType = InferRequestType<typeof client.api.workspaces['$post']>;

const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.workspaces.$post({ form });
      return response.json();
    },
    onSuccess: () => {
      toast.success('Workspace created');
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
    onError: (e) => {
      console.error(e);
      toast.error('Failed to create workspace');
    },
  });

  return mutation;
};

export default useCreateWorkspace;