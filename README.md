# Personal Blog

A modern, production-ready blog built with Next.js 15, React 19, TypeScript, Prisma, and PostgreSQL.

## Features

- ✨ **Modern Stack**: Next.js 15 App Router, React 19, TypeScript
- 📝 **Rich Text Editor**: TipTap editor with full formatting support
- 🎨 **Beautiful UI**: shadcn/ui components with Tailwind CSS
- 🔒 **Secure Admin**: Supabase Auth with `ADMIN_EMAIL` gating
- 🗄️ **Database**: PostgreSQL with Prisma ORM
- 🖼️ **Media**: Image uploads with UploadThing
- 📱 **Responsive**: Mobile-first design
- 🚀 **Performance**: Optimized with React Server Components and caching
- 🔍 **SEO**: Automatic sitemap, OG images, structured data
- 📊 **Analytics Ready**: Structured logging for easy integration

## Prerequisites

- Node.js 18+
- PostgreSQL database
- npm/pnpm/yarn/bun

## Getting Started

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd blog
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with your values:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/blog?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/blog?schema=public"

# Supabase (Auth/session via @supabase/ssr)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Admin access (single-admin model)
ADMIN_EMAIL="you@example.com"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3001"

# Environment
NODE_ENV="development"
```

### 3. Database Setup

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### 5. Access Admin Panel

Navigate to `/admin/login` and sign in with a Supabase Auth user whose email matches `ADMIN_EMAIL`.

## Project Structure

```
blog/
├── prisma/
│   ├── migrations/       # Database migrations
│   └── schema.prisma     # Database schema
├── public/              # Static assets
├── src/
│   ├── actions/         # Server actions
│   ├── app/            # Next.js app router pages
│   │   ├── admin/      # Admin panel
│   │   ├── api/        # API routes
│   │   └── blog/       # Public blog pages
│   ├── components/     # React components
│   │   ├── blog/       # Blog UI + TipTap editor
│   │   ├── layout/     # Layout components
│   │   ├── posts/      # Post-related components
│   │   ├── shared/     # Shared components
│   │   └── ui/         # UI components (shadcn)
│   ├── lib/           # Utility functions
│   │   ├── auth.ts    # Authentication helpers
│   │   ├── db.ts      # Prisma client
│   │   ├── logger.ts  # Structured logging
│   └── types/         # TypeScript types
└── package.json
```

## Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format with Prettier
npm run format:check     # Check formatting
npm run type-check       # TypeScript type checking

# Database
npx prisma studio        # Open Prisma Studio
npx prisma migrate dev   # Create and apply migration
npx prisma generate      # Generate Prisma Client
```

## Database Schema

### Post

- Rich content with TipTap JSON format
- Categories and tags (many-to-many)
- Draft/published status
- SEO fields (slug, excerpt, cover image)
- View counter

### Category

- Hierarchical organization
- Unique slugs for URLs

### Tag

- Flexible tagging system
- Unique slugs for URLs

## Admin Features

- Create, edit, and delete posts
- Rich text editor with formatting
- Image uploads
- Category and tag management
- Draft/publish workflow
- SEO optimization fields
- Preview before publishing

## Production Deployment

### Environment Variables

Ensure all required environment variables are set in your production environment:

- `DATABASE_URL`: Production PostgreSQL connection string
- `DIRECT_URL`: Direct database connection (for migrations)
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key
- `ADMIN_EMAIL`: Email address allowed to access admin
- `NEXT_PUBLIC_APP_URL`: Your production domain
- `NODE_ENV`: Set to `production`

### Database Migration

Run migrations in production:

```bash
npx prisma migrate deploy
```

### Build and Deploy

```bash
npm run build
npm run start
```

### Recommended Platforms

- **Vercel**: Zero-config deployment for Next.js
- **Railway**: Easy PostgreSQL + Next.js hosting
- **Fly.io**: Full-stack deployment with PostgreSQL

## Security

- Supabase Auth-backed sessions
- HTTP-only secure cookies (via Supabase SSR helpers)
- Middleware refresh + server-side admin gating (`ADMIN_EMAIL`)
- Security headers (X-Frame-Options, CSP, etc.)
- Input validation with Zod

## Performance

- React Server Components for optimal performance
- Database indexes on frequently queried fields
- Image optimization with next/image
- Automatic code splitting
- Static page generation where possible

## Logging

Structured logging system with:

- Environment-aware formatting (pretty in dev, JSON in production)
- Context-rich error tracking
- Ready for integration with logging services (Sentry, LogRocket, etc.)

## Troubleshooting

### Database Connection Issues

1. Verify PostgreSQL is running
2. Check `DATABASE_URL` format
3. Ensure database exists
4. Test connection: `npx prisma db pull`

### Build Errors

1. Clear Next.js cache: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Regenerate Prisma Client: `npx prisma generate`

### Admin Login Issues

1. Verify `ADMIN_EMAIL` matches the Supabase user email you’re signing in with
2. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
3. Check browser cookies are enabled and clear cookies if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and type checking
5. Submit a pull request

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
