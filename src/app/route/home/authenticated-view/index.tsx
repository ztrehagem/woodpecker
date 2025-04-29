import { useUser } from "../../../feature/auth/use-user";
import LogoutButton from "./logout-button";

export default function AuthenticatedView(): React.ReactElement {
  const user = useUser();

  return (
    <div>
      <p>Authenticated</p>

      <div>
        <strong>@{user?.handle}</strong>
      </div>

      <div>
        <small>{user?.did}</small>
      </div>

      <LogoutButton />
    </div>
  );
}
