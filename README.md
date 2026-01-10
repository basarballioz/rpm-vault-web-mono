# 🏍️ RPM Vault Monorepo

A modern monorepo for motorcycle catalog and comparison platform.

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-8+-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo&logoColor=white)](https://expo.dev/)

## 📁 Project Structure

```
rpm-vault-web-mono/
├── frontend/           # Next.js 14 web application
│   ├── app/            # App Router pages
│   ├── components/     # React components (shadcn/ui)
│   ├── contexts/       # React Contexts
│   └── lib/            # Utility functions
├── mobile/             # React Native Expo mobile app
│   ├── src/
│   │   ├── components/ # Mobile components
│   │   ├── screens/    # App screens
│   │   └── navigation/ # React Navigation setup
│   └── assets/         # Images and icons
├── shared/             # Shared library
│   └── src/
│       ├── types.ts    # TypeScript types
│       ├── api.ts      # API client
│       ├── utils.ts    # Utility functions
│       └── constants.ts # Constants
├── package.json        # Root workspace configuration
└── pnpm-workspace.yaml # Workspace definitions
```

> 📌 **Note:** Backend is in a separate repository: [rpm-vault-back](https://github.com/basarballioz/rpm-vault-back)

## 📋 Requirements

| Tool | Version |
|------|---------|
| Node.js | >= 20.0.0 |
| pnpm | >= 8.0.0 |

## 🚀 Installation

### 1. Install pnpm (if not installed)
```bash
npm install -g pnpm
```

### 2. Install dependencies
```bash
pnpm install
```

## 💻 Development

### Start All Services
```bash
pnpm dev
```

### Individual Workspace
| Command | Description |
|---------|-------------|
| `pnpm dev:frontend` | Frontend only (Next.js) |
| `pnpm dev:mobile` | Mobile only (Expo) |
| `pnpm mobile` | Expo dev server (shortcut) |

## 🏗️ Build

| Command | Description |
|---------|-------------|
| `pnpm build` | Build all projects |
| `pnpm build:frontend` | Build frontend only |
| `pnpm start:frontend` | Start production frontend |

## 📱 Mobile App

### Testing on iPhone

1. Download **Expo Go** from the App Store
2. Run `pnpm dev:mobile`
3. Scan the **QR code** shown in terminal with your iPhone camera
4. Expo Go will open automatically

### Mobile Commands

| Command | Description |
|---------|-------------|
| `pnpm dev:mobile` | Expo dev server |
| `pnpm android` | Android emulator |
| `pnpm ios` | iOS simulator |

### Direct Expo Commands
```bash
cd mobile
npx expo start          # Dev server
npx expo start --ios    # iOS simulator
npx expo start --android # Android emulator
npx expo start --web    # Web browser
```

## 🧹 Cleanup & Maintenance

```bash
# Remove all node_modules, dist and .next folders
pnpm clean

# Reinstall
pnpm install
```

## 📦 Workspace Management

### Adding Packages
```bash
# Add package to frontend
pnpm --filter frontend add <package-name>

# Add package to mobile
pnpm --filter mobile add <package-name>

# Add package to shared
pnpm --filter shared add <package-name>
```

### Running Commands Across Workspaces
```bash
# Run lint in all workspaces
pnpm lint

# Run lint in frontend only
pnpm lint:frontend
```

## 🔧 Tech Stack

### Frontend (Web)
| Technology | Description |
|------------|-------------|
| Next.js 14 | React framework with App Router |
| React 18 | UI library |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first CSS |
| shadcn/ui | Radix UI based components |
| Recharts | Charting library |
| Lucide React | Icon library |

### Mobile (iOS & Android)
| Technology | Description |
|------------|-------------|
| React Native | Cross-platform mobile framework |
| Expo SDK 54 | Development tools |
| React Navigation 7 | Navigation library |
| TypeScript | Type safety |
| Expo Vector Icons | Icon library |
| React Native SVG | SVG support |

### Shared (Common Library)
| Technology | Description |
|------------|-------------|
| TypeScript | Shared types |
| Zod | Schema validation |

## 🛠️ All Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start all services in parallel |
| `pnpm dev:frontend` | Frontend dev server |
| `pnpm dev:mobile` | Mobile dev server |
| `pnpm mobile` | Mobile dev server (short) |
| `pnpm build` | Build all projects |
| `pnpm build:frontend` | Build frontend |
| `pnpm start:frontend` | Start frontend production |
| `pnpm android` | Android emulator |
| `pnpm ios` | iOS simulator |
| `pnpm lint` | Lint all projects |
| `pnpm lint:frontend` | Lint frontend |
| `pnpm clean` | Clean all build/cache |
| `pnpm install:all` | Install dependencies |

## 🔗 Links

| Service | URL |
|---------|-----|
| Frontend Web | http://localhost:3000 |
| Backend API | https://rpmvault-backend.vercel.app |
| Mobile Expo | http://localhost:8081 |
| API Docs | https://rpmvault-backend.vercel.app/docs |

## 📝 Notes

- This project uses **pnpm workspaces**
- Each workspace has its own `package.json`
- Root-level commands manage all workspaces
- Shared package is linked via `workspace:*`
- Dependencies are shared across workspaces (hoisting)

## 📄 License

ISC
