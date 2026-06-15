import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RiMessage2Line,
  RiMailOpenLine,
  RiEyeLine,
  RiCheckLine,
  RiArrowUpLine,
  RiArrowDownLine,
} from "react-icons/ri";

interface DashboardStats {
  total: number;
  open: number;
  pendingReview: number;
  resolved: number;
}

type StatKey = keyof DashboardStats;

interface StatCardConfig {
  key: StatKey;
  label: string;
  icon: React.ReactNode;
  iconClassName: string;
  iconBgClassName: string;
  trend: string;
  trendDirection: "up" | "down";
  sparklineClassName: string;
  sparkline: string;
}

const cards: StatCardConfig[] = [
  {
    key: "total",
    label: "Total Issues",
    icon: <RiMessage2Line className="size-6" />,
    iconClassName: "text-blue-600",
    iconBgClassName: "bg-blue-50",
    trend: "33%",
    trendDirection: "up",
    sparklineClassName: "stroke-blue-600",
    sparkline: "M2 34 C10 18, 18 18, 26 30 S42 42, 50 18 S66 8, 78 30",
  },
  {
    key: "open",
    label: "Open",
    icon: <RiMailOpenLine className="size-6" />,
    iconClassName: "text-orange-600",
    iconBgClassName: "bg-orange-50",
    trend: "100%",
    trendDirection: "down",
    sparklineClassName: "stroke-orange-500",
    sparkline:
      "M2 36 C12 34, 18 20, 28 18 S38 36, 48 22 S58 8, 68 28 S74 24, 78 34",
  },
  {
    key: "pendingReview",
    label: "Pending Review",
    icon: <RiEyeLine className="size-6" />,
    iconClassName: "text-purple-600",
    iconBgClassName: "bg-purple-50",
    trend: "50%",
    trendDirection: "down",
    sparklineClassName: "stroke-purple-600",
    sparkline:
      "M2 34 C10 18, 18 18, 26 34 S42 34, 50 18 S60 10, 68 28 S74 30, 78 20",
  },
  {
    key: "resolved",
    label: "Resolved",
    icon: <RiCheckLine className="size-6" />,
    iconClassName: "text-green-600",
    iconBgClassName: "bg-green-50",
    trend: "100%",
    trendDirection: "up",
    sparklineClassName: "stroke-green-600",
    sparkline:
      "M2 36 C10 34, 18 28, 26 32 S38 40, 46 20 S56 4, 64 26 S72 34, 78 12",
  },
];

const OverviewCards = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {
        setStats({
          total: 2,
          open: 0,
          pendingReview: 1,
          resolved: 1,
        });
      });
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const value = stats?.[card.key];
        const isPositive = card.trendDirection === "up";

        return (
          <Card
            key={card.key}
            className="overflow-hidden border-border/70 bg-card shadow-none! transition hover:-translate-y-0.5"
          >
            <CardContent>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={[
                      "flex size-16 shrink-0 items-center justify-center rounded-xl",
                      card.iconBgClassName,
                      card.iconClassName,
                    ].join(" ")}
                  >
                    {card.icon}
                  </div>

                  <div className="space-y-2 pl-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      {card.label}
                    </p>

                    <div className="text-2xl font-bold tracking-tight text-foreground">
                      {typeof value === "number" ? (
                        value.toLocaleString()
                      ) : (
                        <Skeleton className="h-7 w-14" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={[
                      "inline-flex items-center gap-1 font-semibold",
                      isPositive ? "text-green-600" : "text-green-600",
                    ].join(" ")}
                  >
                    {isPositive ? (
                      <RiArrowUpLine className="size-4" />
                    ) : (
                      <RiArrowDownLine className="size-4" />
                    )}
                    {card.trend}
                  </span>

                  <span className="text-muted-foreground">vs last 7 days</span>
                </div>
                <MiniSparkline
                  path={card.sparkline}
                  className={card.sparklineClassName}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

interface MiniSparklineProps {
  path: string;
  className?: string;
}

function MiniSparkline({ path, className }: MiniSparklineProps) {
  return (
    <svg
      viewBox="0 0 80 44"
      fill="none"
      className="mt-3 h-8 w-20 shrink-0 opacity-90"
      aria-hidden="true"
    >
      <path
        d={path}
        className={className}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default OverviewCards;
