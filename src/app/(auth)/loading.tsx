import { Loader } from 'lucide-react';

const LoadingPage = () => (
    <div className="h-full flex flex-col items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
);

export default LoadingPage;
