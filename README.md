# Stripe Subscription System with Auth0 Authentication

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/josituxs-projects/v0-stripe-subscription-system)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/rStnNhQavze)

## Overview

This is a complete subscription system built with Next.js, featuring:
- **Auth0 Authentication** - Secure login and registration
- **Stripe Integration** - Subscription payments and management
- **Protected Routes** - Dashboard, settings, and subscription management
- **Modern UI** - Built with shadcn/ui components

## Features

### Authentication (Auth0)
- Social login support (Google, Facebook, etc.)
- Email/password authentication
- Protected routes with middleware
- User profile management
- Secure session handling

### Subscriptions (Stripe)
- Multiple subscription tiers
- Embedded Stripe checkout
- Subscription management
- Customer portal integration
- Automatic customer creation

### Pages
- **Landing Page** - Marketing and product showcase
- **Dashboard** - User dashboard with stats
- **Subscription Plans** - Plan selection and checkout
- **Settings** - User profile and account management
- **Subscription Management** - Active subscriptions overview

## Setup

### 1. Auth0 Configuration

See [AUTH0_SETUP.md](./AUTH0_SETUP.md) for detailed Auth0 setup instructions.

**Required Environment Variables:**
\`\`\`env
AUTH0_SECRET='generate-with-openssl-rand-hex-32'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://YOUR-TENANT.auth0.com'
AUTH0_CLIENT_ID='your_client_id'
AUTH0_CLIENT_SECRET='your_client_secret'
\`\`\`

### 2. Stripe Configuration

The Stripe integration is already configured in Vercel. Make sure these variables are set:
\`\`\`env
STRIPE_SECRET_KEY='sk_...'
STRIPE_PUBLISHABLE_KEY='pk_...'
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY='pk_...'
\`\`\`

### 3. Local Development

1. Clone the repository
2. Copy `.env.example` to `.env.local`
3. Fill in your Auth0 and Stripe credentials
4. Install dependencies:
\`\`\`bash
npm install
\`\`\`
5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`
6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

\`\`\`
├── app/
│   ├── api/auth/[auth0]/     # Auth0 API routes
│   ├── dashboard/            # Protected dashboard page
│   ├── settings/             # User settings page
│   ├── subscription/
│   │   ├── plans/           # Subscription plans page
│   │   └── manage/          # Subscription management
│   ├── actions/             # Server actions (Stripe)
│   └── layout.tsx           # Root layout with AuthProvider
├── components/
│   ├── auth/
│   │   ├── auth-provider.tsx    # Auth0 provider wrapper
│   │   └── user-menu.tsx        # User menu with login/logout
│   ├── ui/                      # shadcn/ui components
│   └── video-landing-page.tsx   # Main landing page
├── lib/
│   ├── auth0.ts                 # Auth0 configuration
│   ├── stripe.ts                # Stripe client
│   └── subscription-plans.ts    # Plan definitions
└── middleware.ts                # Route protection
\`\`\`

## Protected Routes

The following routes require authentication:
- `/dashboard` - User dashboard
- `/subscription/manage` - Subscription management
- `/settings` - Account settings

Unauthenticated users are automatically redirected to Auth0 login.

## Deployment

Your project is live at:

**[https://vercel.com/josituxs-projects/v0-stripe-subscription-system](https://vercel.com/josituxs-projects/v0-stripe-subscription-system)**

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard:
   - Auth0 configuration
   - Stripe keys
   - `NEXT_PUBLIC_APP_URL` (your production URL)
4. Deploy

## Build your app

Continue building your app on:

**[https://v0.app/chat/rStnNhQavze](https://v0.app/chat/rStnNhQavze)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Authentication:** Auth0
- **Payments:** Stripe
- **UI Components:** shadcn/ui + Radix UI
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Deployment:** Vercel

## Learn More

- [Auth0 Documentation](https://auth0.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [v0.app Documentation](https://v0.dev)
