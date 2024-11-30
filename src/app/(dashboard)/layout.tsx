import { ReactNode, Suspense } from 'react';
import { Sidebar } from '@/components/sidebar';
import Navbar from '@/components/navbar';
import CreateWorkspaceModal from '@/features/workspaces/components/create-workspace-modal';
import CreateProjectModal from '@/features/projects/components/create-project-modal';
import CreateTaskModal from '@/features/tasks/components/create-task-modal';
import EditTaskModal from '@/features/tasks/components/edit-task-modal';

interface IDashboardLayoutProps {
    children: ReactNode
}

const DashboardLayout = ({ children }: IDashboardLayoutProps) => (
    <div className="min-h-screen">
        <Suspense fallback={null}>
            <CreateWorkspaceModal />
            <CreateProjectModal />
            <CreateTaskModal />
            <EditTaskModal />
        </Suspense>
        <div className="flex w-full h-full">
            <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto">
                <Sidebar />
            </div>
            <div className="lg:pl-[264px] w-full">
                <div className="mx-auto max-w-screen-2xl h-full">
                    <Navbar />
                    <main className="h-full py-8 px-6 flex flex-col">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    </div>
);

export default DashboardLayout;
