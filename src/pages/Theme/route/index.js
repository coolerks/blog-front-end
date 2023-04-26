export const route = [
  {
    path: '',
    redirect: 'list',
  },
  {
    path: 'list',
    name: '全部主题',
    component: './Theme/pages/List',
  },
  {
    path: 'development',
    name: '主题开发',
    component: './Theme/pages/ThemeDevelopment',
  },
];
