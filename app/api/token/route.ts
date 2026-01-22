import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie") || ""
  const cookies = cookieHeader.split("; ")
  const authCookie = cookies.find((row) => row.startsWith("auth_token="))

  if (authCookie) {
    const token = authCookie.split("=")[1]
    return NextResponse.json({ token })
  }

  return NextResponse.json({ token: null }, { status: 401 })
}
