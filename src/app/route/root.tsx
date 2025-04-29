import type React from "react";
import { Outlet } from "react-router";

export default function Root(): React.ReactElement {
  return <Outlet />;
}
