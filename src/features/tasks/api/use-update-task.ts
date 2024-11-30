import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.tasks[':taskId']['$patch'], 200>;
type RequestType = InferRequestType<typeof client.api.tasks[':taskId']['$patch']>;

const useUpdateTask = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.tasks[':taskId'].$patch({ json, param });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      return response.json();
    },
    onSuccess: ({ data }) => {
      toast.success('Task updated');
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', data.$id] });
    },
    onError: (e) => {
      console.error(e);
      toast.error('Failed to update task');
    },
  });

  return mutation;
};

export default useUpdateTask;
