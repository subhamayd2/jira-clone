import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.tasks[':taskId']['$delete'], 200>;
type RequestType = InferRequestType<typeof client.api.tasks[':taskId']['$delete']>;

const useDeleteTask = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.tasks[':taskId'].$delete({ param });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      return response.json();
    },
    onSuccess: ({ data }) => {
      toast.success('Task deleted');
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', data.$id] });
    },
    onError: (e) => {
      console.error(e);
      toast.error('Failed to delete task');
    },
  });

  return mutation;
};

export default useDeleteTask;
