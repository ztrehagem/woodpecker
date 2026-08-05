import clsx from "clsx";
import { useActionState } from "react";

import { AtIcon, LoadingDotsIcon, LoginIcon } from "#src/shared/ui/icon/index.ts";

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
      className="mx-5 my-4 w-full max-w-mobile rounded-2xl bg-filling px-10 py-8 shadow-2xl"
    >
      <div className="grid auto-cols-auto">
        <label htmlFor="handle">ユーザー名</label>

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

        {error && <p className="mt-2 text-danger">{error.message}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="relative -mx-3 mt-8 cursor-pointer justify-self-end rounded-full border px-3 py-2"
        >
          {isPending && (
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <LoadingDotsIcon />
            </span>
          )}
          <span className={clsx("flex items-center gap-2", isPending && "invisible")}>
            <LoginIcon />
            ログイン
          </span>
        </button>
      </div>
    </form>
  );
}
