# Whispers Application Index

## Project Overview
**Whispers** is a monorepo application built with Nuxt 3, consisting of three main applications and shared packages. It appears to be a content creator platform with web, creator, and admin interfaces.

## Architecture
- **Monorepo Structure**: Uses pnpm workspaces
- **Framework**: Nuxt 3 (Vue.js)
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Package Manager**: pnpm

## Applications

### 1. Web Application (`apps/web/`)
**Purpose**: Public-facing website for content consumers
**Port**: 3000 (default)
**Key Features**:
- Landing page and marketing content
- Creator discovery and browsing
- Content feed and exploration
- Terms and privacy pages

**Routes**:
- `/` - Home/Landing page
- `/feed` - Content feed
- `/explore` - Content discovery
- `/creators/[username]` - Individual creator profiles
- `/how-it-works` - Platform explanation
- `/terms` - Terms of service
- `/privacy` - Privacy policy

**Dependencies**:
- `@whispers/config` - Shared configuration
- `@whispers/ui` - Shared UI components
- `vee-validate` - Form validation
- `vue3-toastify` - Toast notifications
- `zod` - Schema validation

**Configuration**:
- Uses Inter font family
- Tailwind CSS with custom configuration
- Pinia for state management
- Nuxt Icon for icon system

### 2. Creator Application (`apps/creator/`)
**Purpose**: Dashboard for content creators
**Port**: 3001
**Key Features**:
- Content management and creation
- Analytics and earnings tracking
- Subscriber management
- Messaging system
- Settings and profile management

**Routes**:
- `/` - Creator dashboard
- `/creator/posts` - Content management
- `/creator/analytics` - Performance analytics
- `/creator/earnings` - Revenue tracking
- `/creator/subscribers` - Subscriber management
- `/apply` - Creator application
- `/settings` - Account settings
- `/messages` - Messaging interface
- `/auth` - Authentication
- `/content` - Content creation/management

**Dependencies**:
- `@whispers/api` - API client
- `@whispers/types` - TypeScript types
- `@api.video/player-sdk` - Video player
- `vue-paystack` - Payment integration
- `vue-plyr` - Media player
- `@nuxtjs/i18n` - Internationalization
- `swiper` - Carousel/slider

**Configuration**:
- **Internationalization**: Supports English, French, Spanish
- **Color Mode**: Dark/light theme support
- **API Configuration**: Configurable base URL via environment
- **Auto-imports**: Pinia stores and composables

### 3. Admin Application (`apps/admin/`)
**Purpose**: Administrative dashboard
**Port**: 3002
**Key Features**:
- Platform administration
- User management
- Content moderation
- System monitoring

**Routes**:
- `/` - Admin dashboard

**Dependencies**:
- `@whispers/config` - Shared configuration
- `@whispers/ui` - Shared UI components

## Shared Packages

### 1. API Package (`packages/api/`)
**Purpose**: API client and backend communication
**Features**:
- HTTP client (axios)
- API endpoints and methods
- Request/response handling
- Authentication and token refresh
- Error handling and interceptors

**API Services**:
- `api.service.ts` - Core HTTP client with authentication
- `auth.ts` - Authentication endpoints
- `creator.service.ts` - Creator-specific API calls
- `content.ts` - Content management API
- `useApiRequest.ts` - Vue composable for API requests

**Key Features**:
- **Token Refresh**: Automatic JWT token refresh on 401 errors
- **Error Handling**: Centralized error handling and logout on auth failures
- **Base URL Configuration**: Configurable API base URL
- **Type Safety**: Full TypeScript support

**Current API Endpoint**: `https://d30e-197-255-46-64.ngrok-free.app` (development)

**Build Output**:
- CommonJS: `dist/index.js`
- ES Modules: `dist/index.mjs`
- TypeScript: `dist/index.d.ts`

### 2. UI Package (`packages/ui/`)
**Purpose**: Shared UI components
**Features**:
- Reusable Vue components
- Design system components
- Cross-app component library

### 3. Types Package (`packages/types/`)
**Purpose**: Shared TypeScript type definitions
**Features**:
- Common interfaces
- API response types
- Shared data models

### 4. Config Package (`packages/config/`)
**Purpose**: Shared configuration
**Features**:
- Tailwind configuration
- Environment settings
- Build configurations

## Development Workflow

### Scripts
- `pnpm dev` - Start all applications in development mode
- `pnpm build` - Build all applications for production
- `pnpm preview` - Preview production builds
- `pnpm lint` - Run ESLint across all packages
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm format` - Format code with Prettier
- `pnpm clean` - Clean all build artifacts

### Development Ports
- **Web App**: http://localhost:3000
- **Creator App**: http://localhost:3001
- **Admin App**: http://localhost:3002

## Technology Stack

### Frontend
- **Framework**: Nuxt 3 (Vue.js 3)
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Form Validation**: Vee-validate + Yup/Zod
- **Icons**: Nuxt Icon
- **Notifications**: Vue3-toastify

### Backend Integration
- **HTTP Client**: Axios
- **API**: Custom API package
- **Video**: API.video player SDK
- **Payments**: Paystack integration

### Development Tools
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Git Hooks**: Husky + lint-staged
- **TypeScript**: Full TypeScript support
- **Build Tool**: Tsup (for packages)

## API Architecture

### Authentication Flow
1. **Login**: POST to `/auth/login` with credentials
2. **Token Storage**: JWT tokens stored in client
3. **Request Interceptor**: Automatically adds Authorization header
4. **Token Refresh**: On 401 errors, attempts to refresh using refresh token
5. **Logout**: Clears tokens and redirects to login

### API Service Structure
```typescript
// Core API service with authentication
const api = createApiService(token, refreshToken, onTokenRefresh, onAuthError);

// Available methods
api.get<T>(endpoint, params)
api.post<T>(endpoint, data)
api.put<T>(endpoint, data)
api.patch<T>(endpoint, data)
api.del<T>(endpoint)
```

### Error Handling
- **401 Unauthorized**: Attempts token refresh, logs out if failed
- **403 Forbidden**: Logs out user
- **Network Errors**: Handled gracefully with user feedback

## Key Features by Application

### Web App (Consumer-facing)
- Content discovery and browsing
- Creator profiles and portfolios
- Public content feed
- Marketing and informational pages

### Creator App (Creator Dashboard)
- Content creation and management
- Analytics and performance tracking
- Revenue and earnings management
- Subscriber relationship management
- Messaging and communication
- Profile and settings management
- **Internationalization**: Multi-language support (EN, FR, ES)
- **Theme Support**: Dark/light mode toggle

### Admin App (Platform Management)
- User and creator management
- Content moderation
- Platform analytics
- System administration

## File Structure Summary

```
whispers/
├── apps/
│   ├── web/           # Consumer-facing website
│   │   ├── pages/     # Route pages
│   │   ├── components/ # Vue components
│   │   ├── stores/    # Pinia stores
│   │   └── assets/    # Static assets
│   ├── creator/       # Creator dashboard
│   │   ├── pages/     # Route pages
│   │   ├── components/ # Vue components
│   │   ├── store/     # Pinia stores
│   │   ├── composables/ # Vue composables
│   │   ├── i18n/      # Internationalization
│   │   └── middleware/ # Route middleware
│   └── admin/         # Admin panel
│       ├── pages/     # Route pages
│       └── components/ # Vue components
├── packages/
│   ├── api/           # API client
│   │   ├── src/       # Source code
│   │   │   ├── api.service.ts
│   │   │   ├── auth.ts
│   │   │   ├── creator.service.ts
│   │   │   ├── content.ts
│   │   │   └── types/
│   │   └── dist/      # Built output
│   ├── ui/            # Shared UI components
│   ├── types/         # TypeScript types
│   └── config/        # Shared configuration
├── public/            # Static assets
├── server/            # Server-side code
└── package.json       # Root package configuration
```

## Development Notes

1. **Monorepo Benefits**: Shared code, consistent tooling, unified development experience
2. **Type Safety**: Full TypeScript support across all packages
3. **Component Reusability**: UI components shared between applications
4. **API Consistency**: Centralized API client for all applications
5. **Development Experience**: Hot reloading, linting, and formatting across all apps
6. **Authentication**: Robust JWT-based auth with automatic token refresh
7. **Internationalization**: Multi-language support in creator app
8. **Theme Support**: Dark/light mode in creator app
9. **Payment Integration**: Paystack for creator monetization
10. **Video Support**: API.video SDK for video content

## Current Development Status

- **API**: Connected to ngrok tunnel for development
- **Authentication**: JWT-based with refresh token support
- **Creator Features**: Full dashboard with analytics, content management, and payments
- **Web Features**: Public-facing content discovery and creator profiles
- **Admin**: Basic admin interface (minimal implementation)

This is a sophisticated content creator platform with separate interfaces for consumers, creators, and administrators, built with modern web technologies and best practices. 