import { useAuthState } from "../../feature/auth/use-auth-state";
import AuthenticatedView from "./authenticated-view";
import PublicView from "./public-view";

export default function Home(): React.ReactElement {
  const authenticated = useAuthState();

  return authenticated ? <AuthenticatedView /> : <PublicView />;
}
