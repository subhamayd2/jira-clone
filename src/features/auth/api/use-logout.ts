import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType } from 'hono';
import { toast } from 'sonner';
import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.auth.logout['$post']>;

const useLogout = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth.logout.$post();
      return response.json();
    },
    onSuccess: () => {
      toast.success('Logged out successfully');
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
    onError: (e) => {
      console.error(e);
      toast.error('Failed to logout');
    },
  });

  return mutation;
};

export default useLogout;
