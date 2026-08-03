import { useActionState } from "react";

interface FormParams {
  readonly handle: string;
}

export default function SignInForm({
  onSubmit,
}: {
  onSubmit: (params: FormParams) => Promise<void>;
}): React.ReactElement {
  const [, action, isPending] = useActionState(async (fd: FormData) => {
    const handle = (fd.get("handle") as string).trim();
    await onSubmit({ handle });
    return fd;
  }, new FormData());

  return (
    <form
      action={action}
      noValidate
      name="signin"
      style={{
        display: "inline-grid",
        gap: "8px 12px",
        grid: "auto-flow auto / repeat(2, auto)",
      }}
    >
      <label htmlFor="handle">Handle *</label>
      <input type="text" id="handle" name="handle" placeholder="user.bsky.social" required />
      <button type="submit" disabled={isPending}>
        Sign In
      </button>
    </form>
  );
}
