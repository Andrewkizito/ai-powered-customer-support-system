import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "react-oidc-context";

export function SignIn() {
  const auth = useAuth();

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden px-6 py-10 w-screen">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.10),transparent_35%)]" />
      <div className="w-full max-w-lg">
        <div className="mb-8 flex justify-center">
          <img
            src="/logo.png"
            alt="Supportly"
            className="h-12 w-auto object-contain"
          />
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader className="space-y-2 px-8 text-center">
            <CardTitle className="text-2xl font-semibold tracking-tight text-slate-950">
              Sign in to your workspace
            </CardTitle>

            <CardDescription className="mx-auto max-w-sm text-sm leading-6 text-slate-500">
              Continue with your organization account to access your support
              dashboard.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-8 pt-3">
            <Button
              type="button"
              className="h-12 w-full rounded-xl bg-primary text-base font-medium text-white shadow-sm transition hover:bg-blue-700"
              onClick={() => auth.signinRedirect()}
              disabled={auth.isLoading}
            >
              {auth.isLoading ? "Opening sign in..." : "Continue with SSO"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
