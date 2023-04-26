export const route = [
  {
    path: '',
    redirect: 'list',
  },
  {
    name: '文件管理',
    path: 'list',
    component: './File/pages/List',
  },
  {
    name: '回收站',
    path: 'recycle',
    component: './File/pages/RecycleBin',
  },
];
