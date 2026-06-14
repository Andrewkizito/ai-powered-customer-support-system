import { useEffect } from "react";
import { useAppDispatch } from "@/context/hooks.ts";
import { fetchIssues } from "@/context/issues/actions.ts";
import { fetchCustomers } from "@/context/customers/actions.ts";

export function PrefetchProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchIssues({}));
    dispatch(fetchCustomers());
  }, [dispatch]);

  return <>{children}</>;
}
