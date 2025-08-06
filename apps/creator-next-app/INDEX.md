# Creator Next.js App Index

## Overview
A Next.js 15 application for content creators to manage their profiles, content, earnings, and subscribers. Built with React 19, TypeScript, and modern tooling.

## 🚀 Quick Start

```bash
# Development
pnpm dev          # Runs on port 3001 with Turbopack

# Production
pnpm build
pnpm start
```

## 📁 Project Structure

### Core Directories

#### `/app` - Next.js App Router
- **`(auth)/`** - Authentication routes and layouts
- **`(dashboard)/`** - Protected dashboard routes
  - `[username]/` - Creator profile pages
  - `apply/` - Creator application flow
  - `content/` - Content management
  - `creator/` - Creator dashboard sections
    - `analytics/` - Analytics and insights
    - `earnings/` - Revenue tracking
    - `messages/` - Messaging system
    - `subscribers/` - Subscriber management
  - `settings/` - User settings
  - `subscriptions/` - Subscription management
  - `wallet/` - Wallet and transactions
- **`auth/`** - Authentication pages
- **`layout.tsx`** - Root layout with providers
- **`providers.tsx`** - React context providers

#### `/components` - Reusable UI Components

**Core Components:**
- `creator-sidebar.tsx` - Main navigation sidebar
- `dashboard-layout.tsx` - Dashboard layout wrapper
- `user-dropdown.tsx` - User profile dropdown
- `notification-bell.tsx` - Notification system
- `language-switcher.tsx` - Internationalization

**Feature Components:**
- **`analytics/`** - Analytics and reporting components
- **`apply/`** - Creator application forms
- **`auth/`** - Authentication components
- **`content/`** - Content management
- **`earnings/`** - Revenue and financial components
- **`home/`** - Media gallery and upload components
- **`messages/`** - Chat and messaging
- **`profile/`** - User profile components
- **`subscribers/`** - Subscriber management
- **`subscriptions/`** - Subscription handling
- **`wallet/`** - Financial transactions

**UI Components (`ui/`):**
- `alert.tsx` - Alert notifications
- `avatar.tsx` - User avatars
- `badge.tsx` - Status badges
- `button.tsx` - Button components
- `card.tsx` - Card layouts
- `checkbox.tsx` - Form checkboxes
- `dialog.tsx` - Modal dialogs
- `dropdown-menu.tsx` - Dropdown menus
- `form.tsx` - Form components
- `input.tsx` - Input fields
- `label.tsx` - Form labels
- `select.tsx` - Select dropdowns
- `skeleton.tsx` - Loading skeletons
- `textarea.tsx` - Text areas

#### `/lib` - Core Libraries and Utilities

**API Layer:**
- `api.service.ts` - Main API client
- `api-hooks.ts` - React Query hooks
- `api-types.ts` - TypeScript interfaces
- `proxy-client.ts` - External API proxy

**Authentication:**
- `auth/` - Authentication utilities
  - `auth-api.ts` - Auth API calls
  - `auth-guard.tsx` - Route protection
  - `auth-provider.tsx` - Auth context
  - `auth-store.ts` - Auth state management
  - `with-auth.tsx` - HOC for auth

**Feature Libraries:**
- `content/` - Content management
- `creator/` - Creator-specific logic
- `subscription/` - Subscription handling
- `wallet/` - Financial operations

**Utilities:**
- `i18n.ts` - Internationalization
- `route-config.ts` - Route definitions
- `route-guard.ts` - Route protection logic
- `utils.ts` - General utilities
- `apply-schema.ts` - Form validation schemas

#### `/types` - TypeScript Definitions
- `dashboard.ts` - Dashboard-specific types

#### `/public` - Static Assets
- `locales/` - Translation files (en.json, es.json, fr.json)
- `logo.svg` / `logo-white.svg` - Brand assets
- Various SVG icons

## 🔧 Key Technologies

### Core Dependencies
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Zustand** - State management
- **TanStack Query** - Data fetching
- **Zod** - Schema validation

### UI Components
- **Radix UI** - Accessible components
- **Lucide React** - Icons
- **Swiper** - Carousel/slider
- **Sonner** - Toast notifications

### Internationalization
- **i18next** - Translation framework
- **react-i18next** - React integration

## 🛡️ Security & Authentication

### Middleware (`middleware.ts`)
- JWT token validation
- Route protection based on authentication status
- Creator role verification
- Automatic redirects for unauthorized access

### Route Protection
- **Public Routes**: `/auth`, `/explore`
- **Protected Routes**: All dashboard pages
- **Creator Routes**: Analytics, earnings, content management

## 🌐 API Integration

### Proxy Client (`lib/proxy-client.ts`)
```typescript
// Handles external API communication
const EXTERNAL_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
```

### API Service (`lib/api.service.ts`)
- Centralized API client
- Request/response interceptors
- Error handling
- Authentication headers

## 📊 Features

### Creator Dashboard
- **Analytics**: Performance metrics and insights
- **Content Management**: Create, edit, and organize content
- **Earnings**: Revenue tracking and payouts
- **Subscribers**: Manage subscriber base
- **Messages**: Direct messaging system
- **Wallet**: Financial transactions and balance

### Content Management
- Media upload and gallery
- Post creation and editing
- Content organization
- Publishing workflow

### User Management
- Profile customization
- Settings management
- Notification preferences
- Language preferences

## 🎨 Styling & Design

### Tailwind CSS 4
- Custom design system
- Responsive layouts
- Dark/light theme support
- Component variants

### Component Architecture
- Atomic design principles
- Reusable UI components
- Consistent styling patterns
- Accessibility compliance

## 🔄 State Management

### Zustand Stores
- Authentication state
- User profile data
- Content state
- Subscription data

### React Query
- Server state management
- Caching and synchronization
- Optimistic updates
- Error handling

## 🌍 Internationalization

### Supported Languages
- English (en)
- Spanish (es)
- French (fr)

### Implementation
- i18next configuration
- Dynamic language switching
- Locale file management
- RTL support ready

## 🚀 Development Workflow

### Scripts
```bash
pnpm dev          # Development server (port 3001)
pnpm build        # Production build
pnpm start        # Production server
pnpm lint         # Code linting
```

### Environment Variables
- `NEXT_PUBLIC_API_URL` - External API endpoint
- Authentication tokens (handled via cookies)

## 📱 Responsive Design

### Breakpoints
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interactions

### Performance
- Next.js optimizations
- Image optimization
- Code splitting
- Bundle analysis

## 🔍 Development Tools

### TypeScript
- Strict type checking
- Interface definitions
- Type safety across the app

### ESLint & Prettier
- Code quality enforcement
- Consistent formatting
- Best practices

### Hot Reloading
- Fast refresh with Turbopack
- Development experience optimization

## 📈 Monitoring & Analytics

### Error Handling
- Global error boundaries
- API error management
- User-friendly error messages

### Performance Monitoring
- Next.js built-in analytics
- Bundle size optimization
- Loading performance

## 🔐 Security Features

### Authentication
- JWT token management
- Secure cookie handling
- Route protection
- Session management

### Data Protection
- Input validation
- XSS prevention
- CSRF protection
- Secure API communication

## 📚 Documentation

### Code Organization
- Feature-based directory structure
- Clear separation of concerns
- Consistent naming conventions
- Comprehensive TypeScript types

### Component Documentation
- Props interfaces
- Usage examples
- Accessibility features
- Styling guidelines

---

*This index provides a comprehensive overview of the Creator Next.js App architecture, features, and development guidelines.* 