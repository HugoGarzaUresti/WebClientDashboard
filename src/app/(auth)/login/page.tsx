"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/custom/button";
import { Input } from "@/components/custom/input";
import Link from 'next/link';

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
    // `res` can be undefined in some edge cases
    if (!res) return setError("Unexpected error");
    if ((res as any).error) return setError((res as any).error as string);
    // successful sign in
    router.push("/");
  }

  return (
    <main className="bg-white-500 h-screen w-screen flex flex-row">
      <div className="bg-black w-1/2 items-center justify-center flex flex-col gap-8">
        <h1 className="text-white text-3xl font-bold">Log in</h1>
      </div>
      <div className="bg-gray-700 w-1/2 gap-8 flex flex-col p-10 items-center justify-center">
        <form className="w-1/2 gap-4 flex flex-col" onSubmit={handleLoginForm}>
          <Input id="email" type="email" placeholder="Email" value={email} onChange={(e: any) => setEmail(e.target.value)} />
          <Input id="password" type="password" placeholder="Password" value={password} onChange={(e: any) => setPassword(e.target.value)} />
          <div className="w-full flex gap-2">
            <Button type="submit">{loading ? "Signing in..." : "Log in"}</Button>
            <Link href = "http://localhost:3000/register"className="text-blue-400 p-1 hover:underline">Don't have an account yet? Register here</Link>
          </div>
          {error ? <div className="text-red-600">{error}</div> : null}
        </form>
      </div>
    </main>
  );
}
