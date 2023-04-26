import { defineConfig } from '@umijs/max';
import routes from './route/routes';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '博客',
  },
  history: {
    type: 'hash',
  },
  routes,
  npmClient: 'npm',
});
