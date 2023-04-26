export const route = [
  {
    path: '',
    redirect: 'list',
  },
  {
    name: '全部文章',
    path: 'list',
    component: './Article/pages/List.jsx',
  },
  {
    name: '编写文章',
    path: 'write',
    component: './Article/pages/Write.jsx',
  },
  {
    name: '标签管理',
    path: 'tag',
    component: './Article/pages/Tag.jsx',
  },
  {
    name: '分类管理',
    path: 'category',
    component: './Article/pages/Categories.jsx',
  },
];
