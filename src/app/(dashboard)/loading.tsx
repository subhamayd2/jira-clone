import { Loader } from 'lucide-react';

const DashboardLoading = () => (
    <div className="h-full flex items-center justify-center">
        <Loader className="size-6 text-muted-foreground animate-spin" />
    </div>
);

export default DashboardLoading;
