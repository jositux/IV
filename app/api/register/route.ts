import { NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

export async function POST(req: Request) {
  const body = await req.json()

  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()

  console.log("data", data)

  if (!response.ok) {
    return NextResponse.json({ message: data.message || "Registration failed" }, { status: response.status })
  }

  return NextResponse.json({
    success: true,
    name: data.name,
  })
}
