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
    <form action={dispatch} noValidate name="signin">
      <div className="inline-grid gap-3 auto-cols-auto">
        <div className="inline-grid gap-x-3 gap-y-2 grid-cols-[auto_1fr]">
          <label htmlFor="handle">Handle *</label>

          <input type="text" id="handle" name="handle" placeholder="user.bsky.social" required />
        </div>

        <div className="justify-self-end">
          <button type="submit" disabled={isPending}>
            Sign In
          </button>
        </div>
      </div>

      {error && <p className="text-red-600">{error.message}</p>}
    </form>
  );
}
