"use client"

import Link from "next/link"

export default function EmbeddedFormPage() {
  // Construimos la URL oficial de login de tu cuenta de Auth0
  const auth0Domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
  const redirectUri = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/auth/callback`;


  const authUrl = `https://${auth0Domain}/authorize?` + 
    `client_id=${clientId}&` +
    `response_type=code&` +
    `scope=openid profile email&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `prompt=login`; // Esto fuerza a que siempre muestre el formulario

  return (
    <div className="min-h-screen bg-white flex">
      {/* Columna Izquierda */}
      <div className="flex-1 flex flex-col justify-center p-8 md:p-16">
        <div className="max-w-md w-full mx-auto">
          {/* Tu diseño de marca */}
          <div className="text-5xl md:text-7xl font-medium text-[#761D78] leading-none mb-4">
            1.
          </div>
          <h1 className="text-2xl font-bold mb-8 text-gray-800">Inicia sesión en tu cuenta</h1>

          {/* EL FORMULARIO OFICIAL EMBEBIDO */}
          <div className="w-full border rounded-xl overflow-hidden shadow-2xl bg-white" style={{ height: '550px' }}>
            <iframe
              src={authUrl}
              className="w-full h-full border-none"
              title="Auth0 Login"
              allow="border-none"
            />
          </div>
          
          <p className="mt-4 text-center text-sm text-gray-400">
            Conexión segura vía Auth0
          </p>
        </div>
      </div>

      {/* Columna Derecha Decorativa */}
      <div className="hidden lg:flex flex-1 bg-[#761D78] items-center justify-center">
        <div className="text-white text-center p-12">
          <h2 className="text-4xl font-bold mb-4">IntelligentVideos</h2>
          <p className="text-purple-200">Tu plataforma de análisis de video.</p>
        </div>
      </div>
    </div>
  )
}