
import { AlertDialog } from '@base-ui/react/alert-dialog';
import { Button } from './components/button';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  errorMessage?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Potvrdit',
  cancelLabel = 'Zrušit',
  isPending = false,
  errorMessage,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => (
  <AlertDialog.Root
    open={open}
    onOpenChange={(isOpen) => {
      if (!isOpen && !isPending) {
        onCancel();
      }
    }}
  >
    <AlertDialog.Portal>
      <AlertDialog.Backdrop className="fixed inset-0 z-40 bg-foreground/50" />
      <AlertDialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <AlertDialog.Popup className="w-full max-w-md space-y-5 rounded-xl border border-border bg-background p-6 shadow-lg outline-none">
          <div className="space-y-2">
            <AlertDialog.Title className="text-lg font-semibold">
              {title}
            </AlertDialog.Title>
            <AlertDialog.Description className="text-sm text-muted-foreground">
              {description}
            </AlertDialog.Description>
          </div>

          {errorMessage && (
            <p role="alert" className="text-sm text-destructive">
              {errorMessage}
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-3">
            <Button
              disabled={isPending}
              onClick={onCancel}
              type="button"
              variant="outline"
            >
              {cancelLabel}
            </Button>

            <Button
              disabled={isPending}
              onClick={onConfirm}
              type="button"
            >
              {confirmLabel}
            </Button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Viewport>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);
