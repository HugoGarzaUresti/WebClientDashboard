'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/custom/button";
import { Input } from "@/components/custom/input";
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

async function handleSubmit(e?: React.FormEvent) {
  e?.preventDefault();
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, firstName, lastName})
  });
  if (res.status === 201) router.push("/"); // or call signIn(...)
  else { const body = await res.json(); setError(body.error || "Registration failed"); }
}

  return (
    <main className="bg-white-500 h-screen w-screen flex flex-row">
      <div className="bg-black w-1/2 items-center justify-center flex flex-col gap-8">
        <h1 className="text-white text-3xl font-bold">Register</h1>
      </div>
      <div className="bg-blue-400 w-1/2 gap-8 flex flex-col p-10 items-center justify-center">
        <form className="w-1/2 gap-4 flex flex-col" onSubmit={handleSubmit}>
          <Input id="firstName" type="text" placeholder="John" value={firstName} onChange={(e: any) => setFirstName(e.target.value)} />
          <Input id="lastName" type="text" placeholder="Doe" value={lastName} onChange={(e: any) => setLastName(e.target.value)} />
          <Input id="email" type="email" placeholder="Email" value={email} onChange={(e: any) => setEmail(e.target.value)} />
          <Input id="password" type="password" placeholder="Password" value={password} onChange={(e: any) => setPassword(e.target.value)} />
          <div className="w-full flex gap-2">
            <Button type="submit">{loading ? "Signing in..." : "Log in"}</Button>
            <Link href = "http://localhost:3000/login"className="text-black p-1 hover:underline">Already have an account? Log in here</Link>
          </div>
          {error ? <div className="text-red-600">{error}</div> : null}
        </form>
      </div>
    </main>
  );
}
