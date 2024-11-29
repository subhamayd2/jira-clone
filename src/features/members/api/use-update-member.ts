import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.members[':memberId']['$patch'], 200>;
type RequestType = InferRequestType<typeof client.api.members[':memberId']['$patch']>;

const useUpdateMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.members[':memberId'].$patch({ json, param });
      if (!response.ok) {
        throw new Error('Failed to update member');
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success('Member updated');
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: (e) => {
      console.error(e);
      toast.error('Failed to update member');
    },
  });

  return mutation;
};

export default useUpdateMember;
