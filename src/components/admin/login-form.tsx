"use client";

import { useActionState, useState } from "react";
import { login } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  const [show, setShow] = useState(false);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="password" className="label">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            autoFocus
            className="field pr-16"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-semibold text-muted"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      <button disabled={pending} className="btn-gold w-full py-3">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
