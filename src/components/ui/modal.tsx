"use client"

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cn } from "@/lib/utils"
import { XIcon } from "lucide-react"

function Modal({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="modal" {...props} />
}

function ModalTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="modal-trigger" nativeButton={false} render={<div role="button" tabIndex={0} />} {...props} />
}

function ModalClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="modal-close" {...props} />
}

function ModalContent({
  className,
  children,
  ...props
}: DialogPrimitive.Popup.Props) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 transition-opacity duration-300"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPrimitive.Popup
          className={cn(
            "w-full max-w-md max-h-[85vh] overflow-y-auto rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10 shadow-2xl p-6",
            "[animation:modal-bounce-in_400ms_cubic-bezier(0.34,1.56,0.64,1)]",
            "data-[ending-style]:[animation:modal-bounce-out_200ms_ease-in_forwards]",
            className
          )}
          {...props}
        >
          <DialogPrimitive.Close className="absolute top-4 right-4 rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
          {children}
        </DialogPrimitive.Popup>
      </div>
    </DialogPrimitive.Portal>
  )
}

function ModalTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="modal-title"
      className={cn("text-xl font-semibold", className)}
      {...props}
    />
  )
}

function ModalDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="modal-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export { Modal, ModalTrigger, ModalClose, ModalContent, ModalTitle, ModalDescription }
