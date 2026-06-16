import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "react-oidc-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { cognitoAuthConfig } from "@/config/auth";
import { store } from "@/context/index.ts";
import { PrefetchProvider } from "./prefetch.tsx";
import { EventsProvider } from "./events.tsx";

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <EventsProvider>
        <BrowserRouter>
          <AuthProvider
            {...cognitoAuthConfig}
            onSigninCallback={() => {
              window.history.replaceState({}, document.title, "/");
            }}
          >
            <TooltipProvider>
              <PrefetchProvider>{children}</PrefetchProvider>
            </TooltipProvider>
            <Toaster richColors />
          </AuthProvider>
        </BrowserRouter>
      </EventsProvider>
    </Provider>
  );
}
