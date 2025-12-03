# Drawers Module

A powerful, type-safe drawer management system for React/Next.js applications. This module provides a registry-based architecture that allows domains to register their own drawers while maintaining full TypeScript support.

## Features

- **Registry Pattern**: Register drawers from any domain without modifying the core module
- **Type-Safe**: Full TypeScript support with module augmentation for payload types
- **Nested Drawers**: Support for stacked/nested drawers with proper lifecycle management
- **Dirty State Handling**: Built-in confirmation dialogs for unsaved changes
- **Lazy Loading**: Support for `next/dynamic` for code splitting
- **Flexible API**: Multiple ways to open drawers (hooks, actions, factory)

## Architecture

```
layouts/drawers/
├── registry/
│   └── drawerRegistry.ts    # Global drawer registry
├── store/
│   └── drawers.ts           # Zustand store for drawer state
├── hooks/
│   ├── useDrawer.ts         # Hook to open drawers
│   └── useDrawerContext.ts  # Hook to access drawer context
├── components/
│   ├── Drawers.tsx          # Root component (place once in layout)
│   ├── Drawer.tsx           # Individual drawer wrapper
│   └── Provider.tsx         # Context provider
├── context/
│   └── context.tsx          # React context definitions
├── types.ts                 # Type definitions
└── index.ts                 # Public exports
```

## Quick Start

### 1. Add Drawers component to your layout

```tsx
// app/layout.tsx
import { Drawers } from '@/layouts/drawers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Drawers />
      </body>
    </html>
  );
}
```

### 2. Create a drawer in your domain

```tsx
// domains/products/drawers/ProductDrawer.tsx
'use client';

import { useDrawerContext } from '@/layouts/drawers';
import type { ProductDrawerPayload } from './types';

export const ProductDrawer = () => {
  const { payload, close, setDirty } = useDrawerContext<ProductDrawerPayload>();

  return (
    <div>
      <h1>Product: {payload.entityId}</h1>
      <button onClick={close}>Close</button>
    </div>
  );
};
```

### 3. Define payload types with module augmentation

```tsx
// domains/products/drawers/types.ts
import type { IDrawerPayload } from '@/layouts/drawers';

export interface ProductDrawerPayload extends IDrawerPayload {
  entityId: string;
  mode?: 'view' | 'edit';
}

// Module augmentation for type-safe access
declare module '@/layouts/drawers' {
  interface DrawerPayloads {
    product: ProductDrawerPayload;
  }
}
```

### 4. Register the drawer

```tsx
// domains/products/drawers/index.ts
import dynamic from 'next/dynamic';
import { registerDrawer } from '@/layouts/drawers';

export function registerProductDrawers() {
  registerDrawer({
    type: 'product',
    component: dynamic(() =>
      import('./ProductDrawer').then((m) => m.ProductDrawer)
    ),
    width: 800,
    confirmOnDirtyClose: true,
  });
}
```

### 5. Register during app initialization

```tsx
// domains/products/register.tsx
import { registerProductDrawers } from './drawers';

// Call during module registration
registerProductDrawers();
```

### 6. Use the drawer

```tsx
// Any component
import { useDrawer } from '@/layouts/drawers';
import '../drawers/types'; // Import for type augmentation

function ProductList() {
  const openProduct = useDrawer('product');

  const handleClick = (id: string) => {
    // Fully typed! TypeScript knows payload shape
    openProduct({ entityId: id, mode: 'view' });
  };

  return <button onClick={() => handleClick('123')}>Open Product</button>;
}
```

## API Reference

### Registry

#### `registerDrawer(definition)`

Register a drawer definition.

```tsx
registerDrawer({
  type: 'product',                    // Unique drawer type identifier
  component: MyDrawerComponent,        // React component or dynamic import
  width: 800,                         // Optional: drawer width (number or string)
  confirmOnDirtyClose: true,          // Optional: show confirmation when dirty
  closeConfirmMessage: 'Are you sure?', // Optional: custom confirmation message
});
```

#### `registerDrawers(definitions[])`

Register multiple drawers at once.

#### `drawerRegistry`

Direct access to the registry instance for advanced use cases.

```tsx
drawerRegistry.has('product');     // Check if registered
drawerRegistry.get('product');     // Get definition
drawerRegistry.getTypes();         // Get all registered types
drawerRegistry.unregister('product'); // Remove registration
```

### Hooks

#### `useDrawer(type)`

Returns a function to open a drawer of the specified type.

```tsx
const openProduct = useDrawer('product');
const uuid = openProduct({ entityId: '123' }); // Returns drawer UUID
```

#### `useDrawerContext<T>()`

Access the current drawer's context inside a drawer component.

```tsx
const {
  uuid,           // Unique drawer instance ID
  type,           // Drawer type
  payload,        // Typed payload data
  isDirty,        // Whether drawer has unsaved changes
  close,          // Close with confirmation if dirty
  forceClose,     // Close without confirmation
  setDirty,       // Mark drawer as dirty/clean
  updatePayload,  // Update payload data
} = useDrawerContext<ProductDrawerPayload>();
```

#### `useDrawerActions()`

Get all drawer actions without specifying a type.

```tsx
const { open, close, closeTop, closeAll } = useDrawerActions();

open('product', { entityId: '123' });
closeTop();    // Close topmost drawer
closeAll();    // Close all drawers
```

#### `createDrawerHook<T>(type)`

Factory to create a pre-typed hook for a specific drawer.

**Important**: This can only be used in client components (`'use client'`), not in registration files that run on the server.

```tsx
// In a client component file
'use client';

import { createDrawerHook } from '@/layouts/drawers';
import type { ProductDrawerPayload } from './types';

// Create and use in the same client file
const useProductDrawer = createDrawerHook<ProductDrawerPayload>('product');

function MyComponent() {
  const openProduct = useProductDrawer();
  openProduct({ entityId: '123' });
}
```

For most cases, prefer using `useDrawer('type')` directly with module augmentation for type safety.

### Store

#### `useDrawersStore`

Zustand store for direct state access (advanced).

```tsx
const drawers = useDrawersStore((state) => state.drawers);
const { openDrawer, closeDrawer, setDirty } = useDrawersStore();
```

### Types

```tsx
interface IDrawerPayload {
  entityId?: string | number;
  mode?: 'view' | 'edit' | 'create';
  [key: string]: unknown;
}

interface IDrawerDefinition {
  type: string;
  component: ComponentType | LazyExoticComponent;
  width?: number | string;
  confirmOnDirtyClose?: boolean;
  closeConfirmMessage?: string;
}

interface IDrawerContext<T> {
  uuid: string;
  type: string;
  payload: T;
  isDirty: boolean;
  close: () => void;
  forceClose: () => void;
  setDirty: (dirty: boolean) => void;
  updatePayload: (payload: Partial<T>) => void;
}
```

## Patterns

### Domain-based Organization

```
domains/
├── products/
│   ├── drawers/
│   │   ├── types.ts           # Payload types + module augmentation
│   │   ├── ProductDrawer.tsx  # Drawer component
│   │   └── index.ts           # Registration + hooks
│   ├── page/
│   └── register.tsx           # Calls registerProductDrawers()
├── orders/
│   ├── drawers/
│   │   ├── types.ts
│   │   ├── OrderDrawer.tsx
│   │   └── index.ts
│   └── register.tsx
```

### Opening Nested Drawers

```tsx
// Inside ProductDrawer
const openCategory = useDrawer('category');

const handleCategoryClick = () => {
  // Opens category drawer stacked on top of product drawer
  openCategory({ entityId: product.categoryId });
};
```

### Handling Dirty State

```tsx
const { setDirty, close } = useDrawerContext();

// Mark as dirty when form changes
const handleFormChange = () => {
  setDirty(true);
};

// User will see confirmation dialog when trying to close
<button onClick={close}>Close</button>
```

### Create Mode

```tsx
// types.ts
export interface ProductCreatePayload extends IDrawerPayload {
  mode: 'create';
  categoryId?: string;
  duplicateFromId?: string;
}

declare module '@/layouts/drawers' {
  interface DrawerPayloads {
    'product-create': ProductCreatePayload;
  }
}

// Usage
const openCreate = useDrawer('product-create');
openCreate({ mode: 'create', categoryId: 'electronics' });
```

## Migration from Legacy API

The module maintains backward compatibility with the legacy API:

```tsx
// Legacy (deprecated)
import { useDrawersStore, DrawerTypes } from '@/layouts/drawers';
const addDrawer = useDrawersStore((state) => state.addDrawer);
addDrawer({ type: DrawerTypes.PRODUCT, entityId: '123' });

// New (recommended)
import { useDrawer } from '@/layouts/drawers';
const openProduct = useDrawer('product');
openProduct({ entityId: '123' });
```

## Best Practices

1. **Always use module augmentation** for type safety
2. **Use `next/dynamic`** for lazy loading drawer components
3. **Register drawers early** in your module's initialization
4. **Create typed hooks** using `createDrawerHook` for each drawer
5. **Keep drawer components in their domain** folder
6. **Use meaningful type names** that reflect the entity and action (e.g., `product`, `product-create`, `product-bulk-edit`)
