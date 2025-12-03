import { createPage } from '@/registry';

const { Page } = createPage({
  modulesContext: require.context('../../modules', true, /register\.(t|j)sx?$/),
});

export default Page;
