"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useTransition } from "react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface DeleteButtonProps {
  onDelete: () => Promise<void>
  confirmTitle?: string
  confirmDescription?: string
  className?: string
  variant?: "ghost" | "destructive" | "outline"
  size?: "icon" | "sm" | "default"
}

export function DeleteButton({
  onDelete,
  confirmTitle = "Are you sure?",
  confirmDescription = "This action cannot be undone.",
  className,
  variant = "ghost",
  size = "icon"
}: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={cn("text-slate-400 hover:text-red-600 transition-colors", className)}
          disabled={isPending}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {confirmDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => startTransition(async () => {
                try {
                    await onDelete()
                    toast.success("Item deleted successfully")
                } catch (error) {
                    toast.error("Failed to delete item")
                }
            })}
            className="bg-red-600 hover:bg-red-700"
            disabled={isPending}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
