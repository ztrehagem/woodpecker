import type React from "react";
import { useActionState } from "react";

import { useLogout } from "../../../feature/auth/use-logout";

export default function LogoutButton(): React.ReactElement {
  const logout = useLogout();

  const [, action, isPending] = useActionState<null, FormData>(async () => {
    await logout();
    return null;
  }, null);

  return (
    <form action={action} inert={isPending}>
      <button type="submit">{isPending ? "処理中" : "ログアウト"}</button>
    </form>
  );
}
