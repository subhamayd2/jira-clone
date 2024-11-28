import { useMedia } from 'react-use';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Drawer, DrawerContent } from '@/components/ui/drawer';

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
            <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]">
                {children}
            </DialogContent>
        </Dialog>
    );
  }

  return (
      <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent>
              <div className="overflow-y-auto hide-scrollbar max-h-[85vh]">
                  {children}
              </div>
          </DrawerContent>
      </Drawer>
  );
};

export default ResponsiveModal;
