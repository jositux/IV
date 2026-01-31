import { NextResponse } from "next/server"

export async function POST() {
  const res = NextResponse.json({ success: true })

  // Delete the auth_token cookie
  res.cookies.delete("auth_token")

  return res
}
