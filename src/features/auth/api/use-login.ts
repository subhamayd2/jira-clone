import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.auth.login['$post']>;
type RequestType = InferRequestType<typeof client.api.auth.login['$post']>;

const useLogin = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.login.$post({ json });
      return response.json();
    },
    onSuccess: () => {
      toast.success('Logged in successfully');
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (e) => {
      console.error(e);
      toast.error('Failed to login');
    },
  });

  return mutation;
};

export default useLogin;
