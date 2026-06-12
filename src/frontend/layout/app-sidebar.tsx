import { NavLink } from "react-router";
import {
  RiDashboardLine,
  RiInboxArchiveLine,
  RiBookOpenLine,
  RiRobot2Line,
  RiUserLine,
  RiBarChart2Line,
  RiLoopRightLine,
  RiInboxLine,
  RiSettings3Line,
  RiShieldUserLine,
  RiPlugLine,
} from "react-icons/ri";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    title: "Overview",
    links: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: RiDashboardLine,
      },
      {
        label: "Issues",
        href: "/issues",
        icon: RiInboxArchiveLine,
      },
      {
        label: "Team Inbox",
        href: "/team-inbox",
        icon: RiInboxLine,
      },
    ],
  },
  {
    title: "AI Tools",
    links: [
      {
        label: "Knowledge Base",
        href: "/knowledge-base",
        icon: RiBookOpenLine,
      },
      {
        label: "AI Assistant",
        href: "/ai-assistant",
        icon: RiRobot2Line,
      },
      {
        label: "Automations",
        href: "/automations",
        icon: RiLoopRightLine,
      },
    ],
  },
  {
    title: "Management",
    links: [
      {
        label: "Customers",
        href: "/customers",
        icon: RiUserLine,
      },
      {
        label: "Analytics",
        href: "/analytics",
        icon: RiBarChart2Line,
      },
      {
        label: "Roles & Permissions",
        href: "/roles-permissions",
        icon: RiShieldUserLine,
      },
      {
        label: "Integrations",
        href: "/integrations",
        icon: RiPlugLine,
      },
      {
        label: "Settings",
        href: "/settings",
        icon: RiSettings3Line,
      },
    ],
  },
];

const AppSidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-75 border-r bg-sidebar p-3">
      <div className="flex items-center justify-center py-2">
        <img src="/logo.png" className="h-9 object-scale-down" />
      </div>

      <Separator className="my-3" />

      <nav className="flex flex-col gap-5">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1.5">
            <h3 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/45">
              {group.title}
            </h3>

            <div className="flex flex-col gap-1">
              {group.links.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    end={item.href === "/dashboard"}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors",
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        isActive &&
                          "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={cn(
                            "size-4 shrink-0 text-sidebar-foreground/60 transition-colors",
                            "group-hover:text-sidebar-accent-foreground",
                            isActive && "text-primary group-hover:text-primary",
                          )}
                        />

                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AppSidebar;
