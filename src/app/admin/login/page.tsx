// ─── Jakarta Laptops — Admin Login (noindex) ───

import { LoginClient } from "./login-client";

export const metadata = {
  title: "Admin Login",
  description: "",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
