import { Button } from "@/components/ui/button";
import { RiAddLine } from "react-icons/ri";

const Issues = () => {
  return (
    <div>
      <div className="flex items-start justify-between">
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
    </div>
  );
};

export default Issues;
