import { NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

export async function POST(req: Request) {
  const body = await req.json()

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()

  console.log("data", data)

  if (!response.ok) {
    return NextResponse.json({ message: data.message || "Login failed" }, { status: response.status })
  }

  const res = NextResponse.json({
    success: true,
    user: {
      id: data.id,
      email: data.email,
      name: data.name,
      isNewUser: data.isNewUser,
    },
  })

  res.cookies.set("auth_token", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })

  res.cookies.set(
    "user_data",
    JSON.stringify({
      id: data.id,
      email: data.email,
      name: data.name,
      isNewUser: data.isNewUser,
    }),
    {
      httpOnly: false, // Necesita ser accesible desde el cliente
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    },
  )

  return res
}
