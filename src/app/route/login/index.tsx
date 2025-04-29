import type React from "react";
import { useActionState, useId } from "react";
import { useNavigate } from "react-router";

import { useLogin } from "../../feature/auth/use-login";

export default function Login(): React.ReactElement {
  const id = useId();
  const formId = `${id}form`;
  const serviceId = `${id}service`;
  const identifierId = `${id}identifier`;
  const passwordId = `${id}password`;
  const login = useLogin();
  const navigate = useNavigate();

  const [errorText, action, isPending] = useActionState<
    string | null,
    FormData
  >(async (_, fd) => {
    const result = await login({
      service: fd.get("service") as string,
      identifier: fd.get("identifier") as string,
      password: fd.get("password") as string,
    });

    switch (result) {
      case "invalid_service":
        return "ホスティングプロバイダのURLが不正です";
      case "authentication_failure":
        return "ログインに失敗しました";
      case null:
        await navigate("/");
        return null;
    }
  }, null);

  return (
    <form aria-labelledby={id} action={action} inert={isPending}>
      <h1 id={formId}>ログイン</h1>

      <div>
        <label htmlFor={serviceId}>ホスティングプロバイダ</label>
        <input
          type="text"
          name="service"
          placeholder="https://bsky.social"
          id={serviceId}
        />
      </div>

      <div>
        <label htmlFor={identifierId}>ユーザ名またはメールアドレス</label>
        <input
          type="text"
          name="identifier"
          autoComplete="username"
          id={identifierId}
        />
      </div>

      <div>
        <label htmlFor={passwordId}>パスワード</label>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          id={passwordId}
        />
      </div>

      <button type="submit">{isPending ? "処理中" : "ログイン"}</button>

      {errorText != null && <p>{errorText}</p>}
    </form>
  );
}
