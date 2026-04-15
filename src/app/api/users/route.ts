import { NextResponse } from "next/server";
import { usersService } from "@/layers/services/users";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await usersService.register(body);

    return NextResponse.json(user);
  } catch (error: unknown) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    const status = message === "Missing required fields" ? 400 : 500;

    return NextResponse.json(
      { error: status === 400 ? message : "Something went wrong" },
      { status }
    );
  }
}
