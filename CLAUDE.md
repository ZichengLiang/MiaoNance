# MiaoNance - Crypto Investment Notebook

## Overview
MiaoNance is a sophisticated crypto investment analysis platform that allows users to create notebooks with interactive trading charts. The application features a modern React-based frontend with advanced charting capabilities for cryptocurrency market analysis.

## Architecture

### Frontend Stack
- **Framework**: Next.js 15.3.2 with App Router and Turbopack
- **React Version**: 19.0.0 with TypeScript 5
- **UI Libraries**: 
  - Material-UI 7.1.0 (components, icons)
  - TailwindCSS 4.0 (styling)
- **Charts**: TradingView Lightweight Charts 5.0.7
- **State Management**: React hooks with localStorage persistence
- **Development**: Jest testing framework, ESLint

### Project Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── vault/
│   │   │   ├── page.tsx                 # Notebook list page
│   │   │   ├── noteCard.tsx             # Individual notebook card
│   │   │   ├── noteCardWrapper.tsx      # Notebook grid container
│   │   │   ├── vaultControl.tsx         # Notebook management controls
│   │   │   ├── vaultDialog.tsx          # Create/edit notebook dialog
│   │   │   └── [id]/
│   │   │       ├── page.tsx             # Chart dashboard page
│   │   │       ├── dataCard.tsx         # Individual chart card
│   │   │       ├── dataCardWrapper.tsx  # Chart grid with controls
│   │   │       └── dataCardDialog.tsx   # Create/edit chart dialog
│   │   ├── globals.css                  # Global styles with custom scrollbar
│   │   └── layout.tsx                   # Root layout
│   ├── components/
│   │   └── PriceVolumeChart.tsx         # TradingView chart component
│   └── types/
│       ├── notebook_metadata.ts         # Notebook type definitions
│       └── dataCard.ts                  # Chart card type definitions
└── package.json                        # Dependencies and scripts
```

## Core Features

### 1. Notebook Management
- **Create/Edit/Delete**: Full CRUD operations for investment notebooks
- **Metadata Tracking**: Title, creation/update timestamps, UUID identification
- **LocalStorage Persistence**: No backend dependency, data stored locally
- **Card-based UI**: Material-UI cards with hover actions

### 2. Advanced Chart System
- **Multi-pair Analysis**: Support for multiple cryptocurrency trading pairs
- **Interactive Charts**: TradingView Lightweight Charts integration
- **Dynamic Data Generation**: Realistic price/volume simulation based on timeframe and symbol
- **Responsive Grid Layout**: Maximum 2-column grid with scrolling for 4+ cards

### 3. Sophisticated Timeframe Management
- **Global Timeframe**: Unified timeframe control affecting all synchronized charts
- **Individual Timeframes**: Per-card timeframe override capability
- **Visual Indicators**: Blue dot for global sync, orange dot for individual timeframes
- **Sync Functionality**: One-click synchronization of all cards to global timeframe
- **Status Display**: Chip showing count of global vs individual timeframe cards

### 4. User Experience Enhancements
- **Hover Controls**: Chart editing/deletion controls appear on card hover
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **Custom Scrollbars**: Styled scrollbars for better visual integration
- **Loading States**: Empty state with call-to-action for first-time users
- **Fade Indicators**: Visual cues for scrollable content

## Technical Implementation Details

### Chart Data Generation
The system generates realistic cryptocurrency price data based on:
- **Base Prices**: Symbol-specific starting prices (BTC: $45,000, ETH: $3,000, etc.)
- **Volatility Scaling**: Timeframe-dependent price movement ranges
- **Volume Correlation**: Volume patterns that correlate with price movements
- **Trend Simulation**: Realistic market behavior patterns

### Responsive Grid System
```typescript
const getGridClass = () => {
  if (cardCount === 0) return '';
  if (cardCount === 1) return 'grid-cols-1';
  return 'grid-cols-1 md:grid-cols-2';
};
const shouldScroll = cardCount > 4;
```

### Timeframe Management Logic
```typescript
const effectiveTimeframe = card.useGlobalTimeframe ? globalTimeframe : (card.timeframe || globalTimeframe);
```

### Component Architecture
- **DataCardWrapper**: Main container managing state, grid layout, and CRUD operations
- **DataCard**: Individual chart cards with hover controls and timeframe indicators
- **PriceVolumeChart**: TradingView chart wrapper with dynamic data generation
- **DataCardDialog**: Modal for creating/editing chart configurations

## Data Types

### NotebookMetadata
```typescript
{
  title: string;
  createdAt: Date;
  updatedAt: Date;
  uuid: string;
  user_id?: string;
  trading_pairs?: String[];
}
```

### DataCard
```typescript
{
  id: string;
  title: string;
  chartType: 'candlestick' | 'line' | 'area';
  symbol: string;
  timeframe: string;
  useGlobalTimeframe: boolean;
  data: any;
  createdAt: Date;
  updatedAt: Date;
}
```

## Available Scripts
- `npm run dev`: Development server with Turbopack
- `npm run build`: Production build
- `npm run start`: Production server
- `npm run lint`: ESLint code quality checks
- `npm test`: Jest test runner

## Development Workflow

### 1. Adding New Features
1. Update type definitions in `/types/` if needed
2. Implement component logic following existing patterns
3. Add responsive styling with TailwindCSS
4. Test across different screen sizes
5. Run linting to ensure code quality

### 2. Chart Integration
- Charts use TradingView Lightweight Charts library
- Data generation is handled in `PriceVolumeChart.tsx`
- Timeframe changes trigger data regeneration
- Charts are responsive with fixed 256px height

### 3. State Management
- React hooks for local state management
- LocalStorage for data persistence
- No external state management library required
- State lifting pattern for parent-child communication

## Current Status
The frontend is fully functional with:
- ✅ Complete notebook CRUD operations
- ✅ Advanced multi-chart dashboard
- ✅ Sophisticated timeframe management system
- ✅ Responsive grid layout with scrolling
- ✅ Professional UI/UX with Material-UI + TailwindCSS
- ✅ LocalStorage data persistence
- ✅ Trading pair focus (titles removed as unnecessary)
- ✅ Hover-based control visibility
- ✅ Custom scrollbar styling

## Future Enhancements
- Backend integration for data persistence
- Real cryptocurrency market data integration
- Advanced chart analysis tools
- User authentication and multi-user support
- Export/import functionality for notebooks
- Collaborative features for shared analysis

## Development Notes
- Uses hybrid Material-UI + TailwindCSS approach for maximum flexibility
- Custom CSS for scrollbar styling in `globals.css`
- Components follow React best practices with TypeScript
- Responsive design with mobile-first approach
- Accessibility considerations with proper ARIA labels and keyboard navigation