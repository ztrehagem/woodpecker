import type React from "react";
import { useCallback } from "react";
import { useNavigate } from "react-router";

import { useLogin } from "../../feature/auth/use-login";

export default function Login(): React.ReactElement {
  const login = useLogin();
  const navigate = useNavigate();

  const onClickLogin = useCallback(() => {
    login();
    navigate("/")?.catch(() => {
      // ignore
    });
  }, [login, navigate]);

  return (
    <div>
      <h1>Login Page</h1>
      <button type="button" onClick={onClickLogin}>
        login
      </button>
    </div>
  );
}
