import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.projects[':projectId']['$patch'], 200>;
type RequestType = InferRequestType<typeof client.api.projects[':projectId']['$patch']>;

const useUpdateProject = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.projects[':projectId'].$patch({ form, param });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      return response.json();
    },
    onSuccess: ({ data }) => {
      toast.success('Project updated');
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', data.$id] });
    },
    onError: (e) => {
      console.error(e);
      toast.error('Failed to update project');
    },
  });

  return mutation;
};

export default useUpdateProject;
