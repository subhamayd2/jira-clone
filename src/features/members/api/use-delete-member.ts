import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.members[':memberId']['$delete'], 200>;
type RequestType = InferRequestType<typeof client.api.members[':memberId']['$delete']>;

const useDeleteMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.members[':memberId'].$delete({ param });
      if (!response.ok) {
        throw new Error('Failed to delete member');
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success('Member deleted');
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: (e) => {
      console.error(e);
      toast.error('Failed to delete member');
    },
  });

  return mutation;
};

export default useDeleteMember;
