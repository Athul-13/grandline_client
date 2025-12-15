# GrandLine Web Client

> A modern, responsive web application for the GrandLine bus rental booking platform, built with React 19 and TypeScript.

[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8.svg)](https://tailwindcss.com/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Key Features](#key-features)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

## Overview

GrandLine Web Client is a comprehensive web application that provides both user and admin interfaces for the GrandLine bus rental booking platform. Users can create quotes, make reservations, manage their profile, and communicate with support, while admins have access to a full dashboard for managing the entire platform.

### User Interface

- **Quote Builder**: Step-by-step quote creation with route calculation and pricing
- **Reservation Management**: View and manage bookings
- **Profile Management**: Update profile, change password, manage notifications
- **Real-time Chat**: Communicate with support team
- **Payment Processing**: Secure Stripe payment integration

### Admin Interface

- **Dashboard**: Analytics and statistics overview
- **User Management**: Manage users and their status
- **Driver Management**: Onboard and manage drivers
- **Fleet Management**: Manage vehicles, vehicle types, and amenities
- **Quote Management**: Review and assign drivers to quotes
- **Reservation Management**: Handle bookings, modifications, and refunds
- **Pricing Configuration**: Manage dynamic pricing rules
- **Support**: Handle user concerns and chat

## Features

### Core Features

- ✅ User authentication (Email/Password, Google OAuth)
- ✅ Quote creation with multi-step wizard
- ✅ Route calculation and mapping (Mapbox)
- ✅ Real-time pricing calculation
- ✅ Reservation booking and management
- ✅ Stripe payment integration
- ✅ Real-time chat and notifications (Socket.io)
- ✅ Multi-language support (English, Spanish, French, German, Hindi, Arabic)
- ✅ Dark mode support
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Advanced filtering and search
- ✅ Admin dashboard with analytics

### User Features

- 📝 Create and manage quotes
- 🗺️ Interactive map for route selection
- 💳 Secure payment processing
- 📱 View reservation history
- 💬 Real-time chat with support
- 🔔 Push notifications
- 👤 Profile management

### Admin Features

- 📊 Comprehensive dashboard with metrics
- 👥 User and driver management
- 🚗 Fleet management (vehicles, types, amenities)
- 📋 Quote and reservation management
- 💰 Pricing configuration
- 📧 Email template management
- 📈 Analytics and reporting
- 💬 Support chat management

## Tech Stack

### Core Technologies

- **Framework**: React 19
- **Language**: TypeScript 5.9
- **Build Tool**: Vite 7.1
- **Routing**: React Router DOM 7.9
- **Styling**: Tailwind CSS 4.1
- **UI Components**: Ant Design 5.29

### State Management

- **Global State**: Redux Toolkit 2.9
- **Server State**: TanStack React Query 5.90
- **Form Management**: React Hook Form 7.66 + Zod 4.1

### Real-time & Communication

- **WebSocket**: Socket.io Client 4.8
- **Notifications**: React Hot Toast 2.6

### Maps & Location

- **Maps**: Mapbox GL 3.16
- **Geocoding**: Mapbox GL Geocoder 5.1

### Payment

- **Payment Processing**: Stripe React 5.4 + Stripe.js 8.5

### Additional Libraries

- **Date Handling**: date-fns 4.1, dayjs 1.11
- **Animations**: Framer Motion 12.23
- **Icons**: Lucide React 0.552
- **Charts**: Recharts 3.5
- **Image Upload**: React Easy Crop 5.5
- **Theme**: next-themes 0.4

## Project Structure

```
client/
├── src/
│   ├── components/          # React components
│   │   ├── admin/           # Admin-specific components
│   │   ├── auth/            # Authentication components
│   │   ├── chat/            # Chat components
│   │   ├── common/          # Shared components (UI, forms, modals)
│   │   ├── dashboard/       # Dashboard components
│   │   ├── drivers/         # Driver management components
│   │   ├── fleet/           # Fleet management components
│   │   ├── home/            # Home page components
│   │   ├── layouts/         # Layout components
│   │   ├── payment/         # Payment components
│   │   ├── pricing_config/  # Pricing configuration components
│   │   ├── quotes/          # Quote management components
│   │   ├── reservations/    # Reservation components
│   │   ├── routes/          # Route protection components
│   │   ├── user/            # User-specific components
│   │   └── users/           # User management components
│   │
│   ├── pages/               # Page components
│   │   ├── admin/          # Admin pages
│   │   ├── auth/           # Authentication pages
│   │   ├── user/           # User pages
│   │   └── common/         # Shared pages
│   │
│   ├── routes/              # Route definitions
│   │   ├── admin_routes.tsx
│   │   └── user_routes.tsx
│   │
│   ├── services/            # API services
│   │   ├── api/            # API client and service functions
│   │   └── socket/         # Socket.io services
│   │
│   ├── store/               # Redux store
│   │   ├── slices/         # Redux slices
│   │   ├── store.ts        # Store configuration
│   │   └── hooks.ts        # Typed hooks
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── chat/
│   │   ├── drivers/
│   │   ├── fleet/
│   │   ├── notifications/
│   │   ├── quotes/
│   │   ├── reservations/
│   │   └── user/
│   │
│   ├── contexts/            # React contexts
│   │   ├── language_provider.tsx
│   │   ├── notification_context.tsx
│   │   ├── search_provider.tsx
│   │   └── theme_provider.tsx
│   │
│   ├── types/               # TypeScript type definitions
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── drivers/
│   │   ├── fleet/
│   │   ├── quotes/
│   │   └── reservations/
│   │
│   ├── utils/               # Utility functions
│   │   ├── validation/      # Form validation schemas
│   │   ├── cloudinary_uploader.ts
│   │   ├── date_utils.ts
│   │   └── ...
│   │
│   ├── constants/           # Application constants
│   │   ├── api.ts          # API endpoints
│   │   ├── routes.ts       # Route paths
│   │   └── languages.ts    # Language codes
│   │
│   ├── locales/             # Translation files
│   │   ├── en.json
│   │   ├── es.json
│   │   ├── fr.json
│   │   ├── de.json
│   │   ├── hi.json
│   │   └── ar.json
│   │
│   ├── config/              # Configuration files
│   │   └── query_client.ts  # React Query configuration
│   │
│   ├── assets/              # Static assets
│   │   └── images/
│   │
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
│
├── public/                  # Public assets
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **GrandLine Server API** running (see [server README](../server/README.md))

## Installation

1. **Navigate to the client directory**:
   ```bash
   cd client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables** (see [Environment Variables](#environment-variables) section)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api/v1
VITE_SOCKET_URL=http://localhost:3000

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Mapbox (for maps and geocoding)
VITE_MAPBOX_ACCESS_TOKEN=your-mapbox-access-token

# Stripe (for payment processing)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
```

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port Vite assigns).

### Preview Production Build

Build and preview the production version:

```bash
npm run build
npm run preview
```

### Other Scripts

- `npm run lint` - Run ESLint
- `npm run build` - Build for production

## Building for Production

1. **Set production environment variables** in `.env.production`

2. **Build the application**:
   ```bash
   npm run build
   ```

3. **The build output** will be in the `dist/` directory, ready to be deployed to any static hosting service (Vercel, Netlify, AWS S3, etc.)

## Key Features

### Quote Builder

The quote builder is a multi-step wizard that guides users through:

1. **Trip Details**: Trip name, event type, passenger count
2. **Route Selection**: Pickup, stops, and dropoff locations with interactive map
3. **Vehicle Selection**: Choose from available vehicles with filters
4. **Amenities**: Select optional amenities
5. **Review & Submit**: Review quote and submit for pricing

### Real-time Features

- **Chat**: Real-time messaging with support team
- **Notifications**: Instant notifications for quote updates, reservations, and messages
- **Live Updates**: Socket.io integration for real-time data synchronization

### Multi-language Support

The application supports 6 languages:
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Hindi (hi)
- Arabic (ar)

Users can switch languages from the settings menu.

### Dark Mode

Full dark mode support with system preference detection. Users can:
- Use system preference
- Enable dark mode
- Enable light mode

### Payment Processing

Secure payment processing using Stripe:
- Payment intent creation
- Secure card input
- Payment confirmation
- Invoice generation

## Screenshots

> **Note**: Add screenshots of key features here

### User Interface

- [ ] Home page
- [ ] Quote builder (step-by-step)
- [ ] Reservation list
- [ ] Payment page
- [ ] Profile page
- [ ] Chat interface

### Admin Interface

- [ ] Admin dashboard
- [ ] User management
- [ ] Driver management
- [ ] Fleet management
- [ ] Quote management
- [ ] Reservation management

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Follow React best practices** - Use functional components and hooks
2. **TypeScript** - Use proper types, avoid `any`
3. **Component structure** - Keep components small and focused
4. **Styling** - Use Tailwind CSS utility classes
5. **State management** - Use Redux for global state, React Query for server state
6. **Testing** - Write tests for new features (when test setup is available)

### Code Style

- Use **functional components** with hooks
- Use **TypeScript** for all files
- Follow **naming conventions**: PascalCase for components, camelCase for functions
- Use **snake_case** for file names
- Keep components **small and focused**
- Use **custom hooks** for reusable logic

## License

ISC

---

**Built with ❤️ using React 19 and TypeScript**
