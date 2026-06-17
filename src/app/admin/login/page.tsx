// ─── Nauka CMS — Login Page (Server Component Wrapper) ───

import { LoginClient } from "./login-client";

export const metadata = {
  title: "Login — Nauka CMS",
  description: "Sign in to Nauka CMS",
};

export default function LoginPage() {
  return <LoginClient />;
}
