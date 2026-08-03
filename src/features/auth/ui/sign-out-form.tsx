import { useActionState } from "react";

export default function SignOutForm({
  onSubmit,
}: {
  onSubmit: () => Promise<void>;
}): React.ReactElement {
  const [, action, isPending] = useActionState(async () => {
    await onSubmit();
  }, null);

  return (
    <form action={action} noValidate name="signout">
      <button type="submit" disabled={isPending}>
        Sign Out
      </button>
    </form>
  );
}
