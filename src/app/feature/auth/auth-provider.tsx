import { useState } from "react";

import { AuthStateContext, SetAuthStateContext } from "./context";

/** @public */
export default function AuthProvider({
  children,
}: Readonly<React.PropsWithChildren>): React.ReactElement {
  const [state, setState] = useState(false);

  return (
    <SetAuthStateContext value={setState}>
      <AuthStateContext value={state}>{children}</AuthStateContext>
    </SetAuthStateContext>
  );
}
