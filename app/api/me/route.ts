import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  console.log("token", token)

  if (!token) {
    return NextResponse.json(
      { user: null },
      { status: 401 }
    );
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

console.log(response)

  if (!response.ok) {
    return NextResponse.json(
      { user: null },
      { status: 401 }
    );
  }

  const user = await response.json();

  return NextResponse.json(user);
}
