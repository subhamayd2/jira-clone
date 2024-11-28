import { useMutation } from '@tanstack/react-query';
import { InferResponseType } from 'hono';
import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.auth.logout['$post']>;

const useLogout = () => {
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth.logout.$post();
      return response.json();
    },
  });

  return mutation;
};

export default useLogout;
