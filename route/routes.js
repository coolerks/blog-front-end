import { route as articleRoutes } from '../src/pages/Article/route/index';
import { route as commentRoutes } from '../src/pages/Comment/route/index';
import { route as dashboardRoutes } from '../src/pages/Dashboard/route/index';
import { route as fileRoutes } from '../src/pages/File/route/index';
import { route as settingRoutes } from '../src/pages/Setting/route/index';
import { route as ThemeRoutes } from '../src/pages/Theme/route/index';

export default [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    name: '仪表盘',
    path: '/dashboard',
    icon: 'DashboardOutlined',
    component: './Dashboard',
    routes: dashboardRoutes,
  },
  {
    name: '文章',
    path: '/article',
    icon: 'FileWordOutlined',
    component: './Article',
    routes: articleRoutes,
  },
  {
    name: '评论',
    path: '/comment',
    icon: 'CommentOutlined',
    component: './Comment',
    routes: commentRoutes,
  },
  {
    name: '文件',
    path: '/file',
    icon: 'FolderOpenOutlined',
    component: './File',
    routes: fileRoutes,
  },
  {
    name: '主题',
    path: '/theme',
    icon: 'SkinOutlined',
    component: './Theme',
    routes: ThemeRoutes,
  },
  {
    name: '设置',
    path: '/setting',
    icon: 'SettingOutlined',
    component: './Setting',
    routes: settingRoutes,
  },
];
