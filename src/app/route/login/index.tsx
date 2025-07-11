import type React from "react";
import { useActionState, useId } from "react";

import { hc } from "../../hc";

export default function Login(): React.ReactElement {
  const id = useId();
  const formId = `${id}form`;
  const handleId = `${id}handle`;

  const [errorText, action, isPending] = useActionState<
    string | null,
    FormData
  >(async (_, fd) => {
    const res = await hc.api.login.$post({
      json: { handle: fd.get("handle") as string },
    });

    if (res.ok) {
      const result = await res.json();
      location.assign(result.redirectTo as string);
    }

    return "ログインに失敗しました";
  }, null);

  return (
    <form aria-labelledby={id} action={action} inert={isPending}>
      <h1 id={formId}>ログイン</h1>

      <div>
        <label htmlFor={handleId}>ハンドル</label>
        <input
          type="text"
          name="handle"
          autoComplete="username"
          id={handleId}
        />
      </div>

      <button type="submit">{isPending ? "処理中" : "ログイン"}</button>

      {errorText != null && <p>{errorText}</p>}
    </form>
  );
}
