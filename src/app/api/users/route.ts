import { NextResponse } from "next/server";
import { usersService } from "@/layers/services/users";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await usersService.register(body);

    return NextResponse.json(user);
  } catch (error: any) {
    console.error(error);
    const status = error?.message === "Missing required fields" ? 400 : 500;
    return NextResponse.json(
      { error: status === 400 ? error.message : "Something went wrong" },
      { status }
    );
  }
}