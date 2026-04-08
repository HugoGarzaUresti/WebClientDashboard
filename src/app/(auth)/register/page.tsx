"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/custom/button";
import { Input } from "@/components/custom/input";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";

export default function RegisterPage() {
  type Inputs = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => handleSubmitForm(data);

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmitForm(data: Inputs) {
    console.log(data);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.status === 200 || res.status == 201) router.push("/");
    else {
      const body = await res.json();
      setError(body.error || "Registration failed");
    }
  }

  return (
    <main className="h-screen w-screen flex flex-row">
      <div className="bg-background w-1/2 items-center justify-center flex flex-col gap-8">
        <h1 className="text-white text-3xl font-bold">Register</h1>
      </div>
      <div className="bg-secondary w-1/2 gap-8 flex flex-col p-10 items-center justify-center">
        <form
          className="w-1/2 gap-4 flex flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            {...register("firstName", { required: true })}
          />
          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            {...register("lastName", { required: true })}
          />
          <Input
            id="email"
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
          />
          <Input
            id="password"
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
          />
          <div className="w-full flex gap-2">
            <Button type="submit">
              {loading ? "Signing in..." : "Log in"}
            </Button>
            <Link href="/login" className="text-foreground p-1 hover:underline">
              Already have an account? Log in here
            </Link>
          </div>
          {error ? <div className="text-red-600">{error}</div> : null}
        </form>
      </div>
    </main>
  );
}
