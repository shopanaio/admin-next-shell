import { registerModule } from '@/registry';

registerModule({
  path: '/products',
  component: async () => import('@/modules/products/page/page'),
});

registerModule({
  path: '/products/:id',
  component: async () => import('@/modules/products/page/detail'),
});
