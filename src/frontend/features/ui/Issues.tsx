import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RiAddLine } from "react-icons/ri";
import { IssueTable } from "@/features/use-cases/issues/issue-table.tsx";
import { CreateIssueDialog } from "@/features/use-cases/issues/create-issue-dialog.tsx";

const Issues = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Issues</h1>
          <p className="text-sm text-muted-foreground">
            View and manage all customer support issues.
          </p>
        </div>
        <Button className="font-medium" onClick={() => setDialogOpen(true)}>
          <RiAddLine className="size-4" />
          Add Issue
        </Button>
      </div>

      <IssueTable />
      <CreateIssueDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};

export default Issues;
