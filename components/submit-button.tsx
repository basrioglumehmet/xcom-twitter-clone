"use client";

import { Button } from "@/components/ui/button";
import { toggleOperationModal } from "@/store/actions/operationModalActions";
import { useAppDispatch } from "@/store/configureStore";
import { useEffect, type ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
};
export function SubmitButton({
  children,
  pendingText = "Submitting...",
  ...props
}: Props) {
  const { pending } = useFormStatus();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(toggleOperationModal(pending));
  }, [pending, dispatch]);

  return (
    <Button type="submit" aria-disabled={pending} {...props}>
      {pending ? pendingText : children}
    </Button>
  );
}
