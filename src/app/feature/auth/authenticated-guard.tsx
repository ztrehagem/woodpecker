import type React from "react";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router";

import { AuthStateContext } from "./context";

/** @public */
export default function AuthenticatedGuard(): React.ReactElement {
  const authenticated = useContext(AuthStateContext);

  return authenticated ? <Outlet /> : <Navigate to="/login" />;
}
