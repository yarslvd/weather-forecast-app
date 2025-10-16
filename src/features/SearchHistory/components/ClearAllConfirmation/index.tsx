import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@components/ui/alert-dialog";
import { buttonVariants } from "@components/ui/button";

interface ClearAllConfirmationProps {
  onConfirm: () => void;
}

export const ClearAllConfirmation = ({
  onConfirm,
}: ClearAllConfirmationProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="text-xs text-red-300 hover:text-red-500 cursor-pointer p-0 hover:no-underline">
          Clear All
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will delete all search history entries. This cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={onConfirm}
          >
            Delete All
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
