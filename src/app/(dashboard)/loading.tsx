import { Loader } from 'lucide-react';

const Loading = () => (
    <div className="flex items-center justify-center h-screen w-screen">
        <Loader className="size-24 animate-spin text-muted-foreground" />
    </div>
);

export default Loading;
