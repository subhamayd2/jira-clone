import { useMedia } from 'react-use';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';

interface IResponsiveModalProps {
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ResponsiveModal = ({ children, open, onOpenChange }: IResponsiveModalProps) => {
  const isDesktop = useMedia('(min-width: 1024px)', true);

  if (isDesktop) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTitle className="hidden">Modal</DialogTitle>
            <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]" aria-describedby={undefined}>
                {children}
            </DialogContent>
        </Dialog>
    );
  }

  return (
      <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerTitle className="hidden">Modal</DrawerTitle>
          <DrawerContent aria-describedby={undefined}>
              <div className="overflow-y-auto hide-scrollbar max-h-[85vh]">
                  {children}
              </div>
          </DrawerContent>
      </Drawer>
  );
};

export default ResponsiveModal;
