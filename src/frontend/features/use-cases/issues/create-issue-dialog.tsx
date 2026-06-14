import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/context/hooks";
import { createIssue, fetchIssues } from "@/context/issues/actions";
import { toast } from "sonner";
import { RiLoader2Line } from "react-icons/ri";

interface CreateIssueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateIssueDialog({
  open,
  onOpenChange,
}: CreateIssueDialogProps) {
  const dispatch = useAppDispatch();
  const customers = useAppSelector((state) => state.customers.list);
  const [customerId, setCustomerId] = useState("");
  const [userText, setUserText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerId || !userText.trim()) return;

    setSubmitting(true);

    try {
      await dispatch(
        createIssue({ customerId, userText: userText.trim() }),
      ).unwrap();
      setCustomerId("");
      setUserText("");
      dispatch(fetchIssues({}));
      onOpenChange(false);
      toast.success("Issue created");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create issue");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="default">
        <AlertDialogHeader>
          <AlertDialogTitle>Create Issue</AlertDialogTitle>
          <AlertDialogDescription>
            Record a new customer support issue.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer</Label>
            <Select
              value={customerId}
              onValueChange={(value) => setCustomerId(value)}
            >
              <SelectTrigger id="customer" className="w-full">
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userText">Issue</Label>
            <Textarea
              id="userText"
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              placeholder="Describe the issue..."
              className="resize-none"
              required
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <Button type="submit" disabled={submitting}>
              {submitting && <RiLoader2Line className="size-4 animate-spin" />}
              {submitting ? "Creating..." : "Create"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
