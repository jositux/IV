"use client";
import { useUser } from '@auth0/nextjs-auth0/client';

export default function ProfileClient() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>{error.message}</div>;

  return <div>Hola {user?.name}</div>;
}