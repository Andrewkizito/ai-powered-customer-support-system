import { useAuth } from "react-oidc-context";
import { cognitoDomain } from "./authConfig";
import { useEffect } from "react";

function App() {
  const auth = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated && window.location.search) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [auth.isAuthenticated]);

  const signOutRedirect = () => {
    const clientId = auth.settings.client_id;
    const logoutUri = window.location.origin;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <pre> Hello: {auth.user?.profile.email} </pre>
        <pre> ID Token: {auth.user?.id_token} </pre>
        <pre> Access Token: {auth.user?.access_token} </pre>
        <pre> Refresh Token: {auth.user?.refresh_token} </pre>

        <button onClick={signOutRedirect}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
    </div>
  );
}

export default App;
