import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiBugLine,
  RiLightbulbLine,
  RiBankCardLine,
  RiUserLine,
  RiQuestionLine,
} from "react-icons/ri";
import { useAppSelector, useAppDispatch } from "@/context/hooks";
import { fetchIssues } from "@/context/issues/actions";

const typeConfig: Record<string, { icon: React.ReactNode; badgeClass: string }> = {
  bug: {
    icon: <RiBugLine className="size-3.5" />,
    badgeClass: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  },
  feature_request: {
    icon: <RiLightbulbLine className="size-3.5" />,
    badgeClass: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800",
  },
  billing: {
    icon: <RiBankCardLine className="size-3.5" />,
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  },
  account: {
    icon: <RiUserLine className="size-3.5" />,
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  },
  general: {
    icon: <RiQuestionLine className="size-3.5" />,
    badgeClass: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800",
  },
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function IssueTable() {
  const dispatch = useAppDispatch();

  const { issues, metadata, loading } = useAppSelector((state) => state.issues);

  const currentPage = metadata?.page ?? 1;
  const totalPages = metadata?.totalPages ?? 1;

  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return;

    dispatch(
      fetchIssues({
        limit: metadata?.limit,
        page,
      }),
    );
  }

  return (
    <Card className="overflow-hidden border-border/60 shadow-sm">
      <CardContent className="p-0">
        {loading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-6">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-6 w-20 rounded-full" />

                <div className="flex items-center gap-3">
                  <Skeleton className="size-8 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-44" />
                  </div>
                </div>

                <Skeleton className="ml-auto h-4 w-24" />
              </div>
            ))}
          </div>
        ) : issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <p className="text-sm font-medium">No issues found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              New customer issues will appear here once they are created.
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-30 px-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    ID
                  </TableHead>

                  <TableHead className="w-20 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Type
                  </TableHead>

                  <TableHead className="w-[320px] text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Issue
                  </TableHead>

                  <TableHead className="w-35 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Status
                  </TableHead>

                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Customer
                  </TableHead>

                  <TableHead className="w-40 pr-6 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {issues.map((issue) => (
                  <TableRow
                    key={issue.id}
                    className="h-16 cursor-pointer transition-colors hover:bg-muted/40"
                  >
                    <TableCell className="w-30 px-6">
                      <span className="font-mono text-xs text-muted-foreground">
                        {issue.id.slice(0, 8)}...
                      </span>
                    </TableCell>

                    <TableCell className="w-20">
                      {issue.type && (
                        <Badge
                          variant="outline"
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-normal capitalize ${typeConfig[issue.type]?.badgeClass ?? ""}`}
                        >
                          {typeConfig[issue.type]?.icon}
                          {issue.type.replace("_", " ")}
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="w-[320px]">
                      <p className="max-w-75 truncate text-sm font-medium text-foreground">
                        {issue.subject || issue.userText}
                      </p>
                    </TableCell>

                    <TableCell className="w-35">
                      <Badge
                        variant="default"
                        className="rounded-full px-2.5 py-0.5 text-xs font-normal! capitalize"
                      >
                        {issue.status.replace("_", " ")}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar className="size-10 border">
                          <AvatarImage
                            src={issue.customer.profilePicture ?? undefined}
                            alt={issue.customer.name}
                          />
                          <AvatarFallback className="text-xs font-medium">
                            {issue.customer.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {issue.customer.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {issue.customer.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="w-40 pr-6 text-right text-sm text-muted-foreground">
                      {formatDate(issue.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {metadata && (
              <div className="flex items-center justify-between border-t px-6 py-4">
                <p className="text-sm text-muted-foreground">
                  Page{" "}
                  <span className="font-medium text-foreground">
                    {metadata.page}
                  </span>{" "}
                  of {metadata.totalPages}
                  <span className="ml-1">({metadata.total} total)</span>
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage <= 1}
                    onClick={() => goToPage(currentPage - 1)}
                    className="size-8"
                    aria-label="Previous page"
                  >
                    <RiArrowLeftSLine className="size-5" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage >= totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                    className="size-8"
                    aria-label="Next page"
                  >
                    <RiArrowRightSLine className="size-5" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
