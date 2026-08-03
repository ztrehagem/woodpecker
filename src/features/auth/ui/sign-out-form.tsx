import { useActionState } from "react";

export default function SignOutForm({
  action,
}: {
  action: () => Promise<void>;
}): React.ReactElement {
  const [, dispatch, isPending] = useActionState<void, FormData>(
    async () => {
      await action();
    },
    void 0,
  );

  return (
    <form action={dispatch} noValidate name="signout">
      <button type="submit" disabled={isPending}>
        Sign Out
      </button>
    </form>
  );
}
