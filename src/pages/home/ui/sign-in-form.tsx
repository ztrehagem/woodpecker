import { useActionState } from "react";

import { AtIcon, LoginIcon } from "#src/shared/ui/icon/index.ts";
import { NakedButton } from "#src/shared/ui/naked-button.tsx";

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
      className="mx-auto w-full max-w-sm rounded-2xl bg-filling px-10 py-8"
    >
      <div className="grid auto-cols-auto">
        <label htmlFor="handle">Handle</label>

        <div className="relative">
          <AtIcon className="absolute top-1/2 left-2 -translate-y-1/2" />
          <input
            type="text"
            id="handle"
            name="handle"
            autoComplete="username"
            placeholder="user.bsky.social"
            required
            className="w-full border-b border-white px-3 py-2 pl-10 transition-colors"
          />
        </div>

        {error && <p className="mt-2 text-fg-danger">{error.message}</p>}

        <div className="-mx-2 flex justify-end gap-4 pt-4">
          <NakedButton type="submit" disabled={isPending} processing={isPending} emphasize>
            <LoginIcon />
            Login
          </NakedButton>
        </div>
      </div>
    </form>
  );
}
