"use client";

import { ChangeEvent, SubmitEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/custom/button";
import { Input } from "@/components/custom/input";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLoginForm(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    } as any);

    setLoading(false);

    if (!res) return setError("Unexpected error");
    if ((res as any).error) return setError((res as any).error as string);

    router.push("/");
  }

  return (
    <main className="h-screen w-screen grid grid-cols-3">
      <div className="bg-background items-center justify-center md:flex flex-col gap-8 col-span-1 hidden">
        <h1 className="text-foreground text-3xl font-bold">Log in</h1>
      </div>
      <div className="h-full bg-secondary gap-8 flex flex-col items-center justify-center col-span-3 md:col-span-2">
        <div className="h-1/4 flex items-center justify-center">
          <h1 className="font-bold text-2xl self-end">Typeshit</h1>
        </div>
        <div className="h-3/4 w-full flex items-start justify-center mdpt-35">
          <form
            className="gap-4 flex flex-col md:w-2/5"
            onSubmit={handleLoginForm}
          >
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
            <div className="w-full flex gap-2 flex-col md:flex-row">
              <Button type="submit">
                {loading ? "Signing in..." : "Log in"}
              </Button>
              <Link
                href="/register"
                className="text-muted-foreground p-1 hover:underline "
              >
                Don't have an account yet? Register here
              </Link>
            </div>
            {error ? <div className="text-red-600">{error}</div> : null}
          </form>
        </div>
      </div>
    </main>
  );
}
