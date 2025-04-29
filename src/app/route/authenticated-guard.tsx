import type React from "react";
import { Navigate, Outlet } from "react-router";

import { useAuthState } from "../feature/auth/use-auth-state";

export default function AuthenticatedGuard({
  children,
}: Readonly<React.PropsWithChildren>): React.ReactElement {
  const authenticated = useAuthState();

  return authenticated ? (
    <>{children ?? <Outlet />}</>
  ) : (
    <Navigate to="/login" />
  );
}
