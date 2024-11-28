import { useMutation } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.auth.signup['$post']>;
type RequestType = InferRequestType<typeof client.api.auth.signup['$post']>;

const useSignup = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.signup.$post({ json });
      return response.json();
    },
  });

  return mutation;
};

export default useSignup;
