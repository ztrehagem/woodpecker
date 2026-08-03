import { useActionState } from "react";

interface FormParams {
  readonly handle: string;
}

export default function SignInForm({
  action,
}: {
  action: (params: FormParams) => Promise<void>;
}): React.ReactElement {
  const [error, dispatch, isPending] = useActionState<Error | null, FormData>(
    async (_error, fd) => {
      try {
        const handle = (fd.get("handle") as string).trim();
        await action({ handle });
      } catch (error) {
        console.error(error);
        return error instanceof Error ? error : new Error("Unknown error");
      }
      return null;
    },
    null,
  );

  return (
    <form
      action={dispatch}
      noValidate
      name="signin"
      style={{ display: "inline-grid", gap: "12px", grid: "auto-flow auto / auto" }}
    >
      <div
        style={{
          display: "inline-grid",
          gap: "8px 12px",
          grid: "auto-flow auto / repeat(2, auto)",
        }}
      >
        <label htmlFor="handle">Handle *</label>

        <input type="text" id="handle" name="handle" placeholder="user.bsky.social" required />
      </div>

      <div style={{ justifySelf: "end" }}>
        <button type="submit" disabled={isPending}>
          Sign In
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error.message}</p>}
    </form>
  );
}
