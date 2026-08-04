import clsx from "clsx";
import { useActionState } from "react";

import AtmarkIcon from "#src/shared/ui/icon/atmark.tsx";
import LoadingDotsIcon from "#src/shared/ui/icon/loading-dots.tsx";
import LoginIcon from "#src/shared/ui/icon/login.tsx";

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
      className="mx-5 my-4 w-full max-w-md rounded-2xl bg-stone-800 px-10 py-8 shadow-2xl"
    >
      <div className="grid auto-cols-auto">
        <label htmlFor="handle">ユーザー名</label>

        <div className="relative">
          <AtmarkIcon className="absolute top-1/2 left-2 -translate-y-1/2" />
          <input
            type="text"
            id="handle"
            name="handle"
            placeholder="user.bsky.social"
            required
            className="w-full border-b border-white px-3 py-2 pl-10 transition-colors focus-visible:border-blue-400 focus-visible:outline-none"
          />
        </div>

        {error && <p className="mt-2 text-red-400">{error.message}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="relative -mx-3 mt-8 cursor-pointer justify-self-end rounded-full border px-3 py-2 focus-visible:border-blue-400 focus-visible:outline-none"
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
