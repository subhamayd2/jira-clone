import { useMutation } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.auth.signup['$post']>;
type RequestType = InferRequestType<typeof client.api.auth.signup['$post']>;

const useSignup = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.signup.$post({ json });
      return response.json();
    },
    onSuccess: () => {
      toast.success('Signed up successfully');
    },
    onError: (e) => {
      console.error(e);
      toast.error('Failed to signup');
    },
  });

  return mutation;
};

export default useSignup;
