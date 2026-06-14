import { Button } from "@/components/ui/button";
import { RiAddLine } from "react-icons/ri";
import { IssueTable } from "@/features/use-cases/issues/issue-table.tsx";

const Issues = () => {
  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Issues</h1>
          <p className="text-sm text-muted-foreground">
            View and manage all customer support issues.
          </p>
        </div>
        <Button className="font-medium">
          <RiAddLine className="size-4" />
          Add Issue
        </Button>
      </div>

      <IssueTable />
    </div>
  );
};

export default Issues;
