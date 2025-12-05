# Auth0 Setup Guide

Este proyecto usa Auth0 para autenticación. Sigue estos pasos para configurar Auth0 en tu aplicación.

## 1. Crear una cuenta en Auth0

1. Ve a [auth0.com](https://auth0.com) y crea una cuenta gratuita
2. Crea un nuevo "Tenant" (o usa uno existente)

## 2. Crear una aplicación en Auth0

1. En el dashboard de Auth0, ve a **Applications** > **Applications**
2. Haz clic en **Create Application**
3. Nombra tu aplicación (ej: "IntelligentVideos")
4. Selecciona **Regular Web Applications**
5. Haz clic en **Create**

## 3. Configurar la aplicación

En la configuración de tu aplicación, configura lo siguiente:

### Allowed Callback URLs
\`\`\`
http://localhost:3000/api/auth/callback
https://tu-dominio.vercel.app/api/auth/callback
\`\`\`

### Allowed Logout URLs
\`\`\`
http://localhost:3000
https://tu-dominio.vercel.app
\`\`\`

### Allowed Web Origins
\`\`\`
http://localhost:3000
https://tu-dominio.vercel.app
\`\`\`

## 4. Variables de entorno

Copia las siguientes variables de entorno y agrégalas a tu proyecto en Vercel:

\`\`\`env
# Auth0 Configuration
AUTH0_SECRET='use [openssl rand -hex 32] para generar un valor aleatorio'
AUTH0_BASE_URL='http://localhost:3000' # En producción: tu URL de Vercel
AUTH0_ISSUER_BASE_URL='https://TU-TENANT.auth0.com'
AUTH0_CLIENT_ID='tu_client_id_de_auth0'
AUTH0_CLIENT_SECRET='tu_client_secret_de_auth0'

# App URL para redirecciones
NEXT_PUBLIC_APP_URL='http://localhost:3000' # En producción: tu URL de Vercel
\`\`\`

### Dónde encontrar los valores:

- **AUTH0_ISSUER_BASE_URL**: En tu dashboard de Auth0, aparece como "Domain" (añade https:// al inicio)
- **AUTH0_CLIENT_ID**: En la pestaña "Settings" de tu aplicación
- **AUTH0_CLIENT_SECRET**: En la pestaña "Settings" de tu aplicación
- **AUTH0_SECRET**: Genera usando `openssl rand -hex 32` en tu terminal

## 5. Agregar variables en Vercel

1. Ve a tu proyecto en Vercel
2. Ve a **Settings** > **Environment Variables**
3. Agrega cada variable de entorno mencionada arriba
4. Asegúrate de seleccionar los ambientes correctos (Production, Preview, Development)

## 6. Personalización opcional

### Personalizar pantalla de login

1. En Auth0 dashboard, ve a **Branding** > **Universal Login**
2. Personaliza colores, logo y apariencia
3. Guarda los cambios

### Agregar proveedores sociales (Google, Facebook, etc.)

1. Ve a **Authentication** > **Social**
2. Haz clic en el proveedor que deseas agregar
3. Sigue las instrucciones para configurar
4. Activa la conexión en tu aplicación

## 7. Rutas protegidas

Las siguientes rutas están protegidas por el middleware y requieren autenticación:

- `/dashboard` - Dashboard principal del usuario
- `/subscription/manage` - Gestión de suscripciones
- `/settings` - Configuración de cuenta

## 8. Flujo de autenticación

### Login
- Usuario hace clic en "Login" o "Sign Up"
- Es redirigido a Auth0
- Después de autenticarse, regresa a `/dashboard`

### Logout
- Usuario hace clic en "Log out"
- Es redirigido a Auth0 para cerrar sesión
- Regresa a la página principal

### Rutas protegidas
- Si un usuario no autenticado intenta acceder a una ruta protegida
- Es redirigido automáticamente a Auth0 para iniciar sesión
- Después de autenticarse, regresa a la página que intentaba acceder

## 9. Integración con Stripe

El sistema ya está integrado con Stripe. El email del usuario de Auth0 se usa automáticamente para:
- Crear clientes en Stripe
- Asociar suscripciones
- Gestionar pagos

## 10. Testing

Para probar localmente:

1. Asegúrate de tener todas las variables de entorno configuradas
2. Ejecuta `npm run dev`
3. Ve a `http://localhost:3000`
4. Haz clic en "Login / Sign Up"
5. Prueba el flujo completo de autenticación

## Soporte

Si tienes problemas:
- Revisa la [documentación oficial de Auth0](https://auth0.com/docs)
- Verifica que todas las variables de entorno estén correctas
- Asegúrate de que las URLs de callback estén configuradas correctamente en Auth0
