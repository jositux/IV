import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  const userDataCookie = cookieStore.get("user_data")?.value

  if (userDataCookie) {
    try {
      const userData = JSON.parse(userDataCookie)
      return NextResponse.json(userData)
    } catch (error) {
      console.error("Error parsing user data cookie:", error)
    }
  }

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    // Primero decodificamos el token para obtener el userId (esto es solo un ejemplo)
    // En producción, deberías usar una librería como jsonwebtoken
    const tokenPayload = JSON.parse(atob(token.split(".")[1]))
    const userId = tokenPayload.userId

    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return NextResponse.json({ message: "Failed to fetch user data" }, { status: response.status })
    }

    const userData = await response.json()
    return NextResponse.json(userData)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
