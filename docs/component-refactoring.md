# Refactored Component Structure

## Overview
The dashboard components have been refactored to separate reusable components into shared directories. This improves code reusability, maintainability, and consistency across the application.

## New Structure

### `/src/components/` - Shared Components Directory

#### `/layout/` - Layout Components
- **ResponsiveLayout.tsx**: Contains `ResponsiveContainer`, `GridLayout`, and `MobileAdaptiveCard`
  - `ResponsiveContainer`: Full-screen responsive wrapper
  - `GridLayout`: Flexible grid system with responsive breakpoints
  - `MobileAdaptiveCard`: Adaptive card component with mobile-friendly styling

#### `/loading/` - Loading State Components
- **LoadingStates.tsx**: Contains all loading and skeleton components
  - `DashboardSkeleton`: Complete dashboard loading skeleton
  - `KpiCardSkeleton`: Individual KPI card skeleton
  - `ListSkeleton`: Generic list loading skeleton
  - `LoadingState`: Spinner with message
  - `EmptyState`: Empty state with optional action

#### `/navigation/` - Navigation Components
- **SidebarNavigation.tsx**: Generic sidebar navigation component
  - `SidebarNavigation`: Reusable sidebar with mobile support
  - `MenuItem`: Type definition for menu items

#### `/common/` - Common UI Components
- **StatusIndicator.tsx**: System status indicator with refresh functionality
- **MetricCard.tsx**: Reusable metric/KPI card components
  - `MetricCard`: Individual metric card
  - `MetricGrid`: Grid layout for multiple metrics
  - `MetricData`: Type definition for metric data

## Usage Examples

### Using the new Sidebar Navigation
```tsx
import { SidebarNavigation, MenuItem } from '@/components/navigation';
import { Home, Settings } from 'lucide-react';

const menuItems: MenuItem[] = [
  { label: 'Home', href: '/home', icon: Home },
  { label: 'Settings', href: '/settings', icon: Settings },
];

<SidebarNavigation 
  menuItems={menuItems}
  title="My App"
  subtitle="Dashboard"
  headerColor="bg-blue-600"
>
  {children}
</SidebarNavigation>
```

### Using Metric Cards
```tsx
import { MetricGrid, MetricData } from '@/components/common';
import { Users } from 'lucide-react';

const metrics: MetricData[] = [
  {
    title: 'Total Users',
    value: '1,234',
    target: '1,500',
    icon: Users,
    trend: 'up',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  }
];

<MetricGrid 
  metrics={metrics}
  columns={{ default: 1, md: 2, xl: 4 }}
/>
```

### Using Layout Components
```tsx
import { ResponsiveContainer, GridLayout } from '@/components/layout';

<ResponsiveContainer>
  <GridLayout cols={{ default: 1, md: 2, lg: 3 }} gap={6}>
    {children}
  </GridLayout>
</ResponsiveContainer>
```

### Using Loading States
```tsx
import { DashboardSkeleton, LoadingState, EmptyState } from '@/components/loading';

// Full dashboard skeleton
<DashboardSkeleton />

// Simple loading state
<LoadingState message="Loading dashboard..." />

// Empty state with action
<EmptyState 
  title="No data available"
  description="Start by adding some data"
  action={<Button>Add Data</Button>}
/>
```

## Import Paths

### From Main Index
```tsx
// Import from main components index
import { 
  SidebarNavigation, 
  MetricCard, 
  LoadingState,
  ResponsiveContainer 
} from '@/components';
```

### From Specific Directories
```tsx
// Import from specific directories
import { SidebarNavigation } from '@/components/navigation';
import { MetricCard } from '@/components/common';
import { LoadingState } from '@/components/loading';
import { ResponsiveContainer } from '@/components/layout';
```

## Benefits of Refactoring

1. **Reusability**: Components can be used across different parts of the application
2. **Consistency**: Standardized components ensure consistent UI/UX
3. **Maintainability**: Centralized components are easier to update and maintain
4. **Type Safety**: Proper TypeScript interfaces for all components
5. **Mobile-First**: All components are designed with mobile responsiveness in mind
6. **Modularity**: Clear separation of concerns with organized directory structure

## Dashboard Components Migration

The existing dashboard components now use the shared components internally:
- `SidebarNavigasi` → Uses `SidebarNavigation`
- `KartuKpi` → Uses `MetricGrid` and `MetricCard`
- `StatusIndicator` → Uses shared `StatusIndicator`
- `LoadingStates` → Re-exports shared loading components
- `ResponsiveLayout` → Re-exports shared layout components

This maintains backward compatibility while providing the benefits of the refactored structure.