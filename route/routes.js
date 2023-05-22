import {route as articleRoutes} from '../src/pages/Article/route/index';
import {route as commentRoutes} from '../src/pages/Comment/route/index';
import {route as dashboardRoutes} from '../src/pages/Dashboard/route/index';
import {route as fileRoutes} from '../src/pages/File/route/index';
import {route as settingRoutes} from '../src/pages/Setting/route/index';
import {route as ThemeRoutes} from '../src/pages/Theme/route/index';
import {route as friendLinkRoutes} from '../src/pages/FriendLink/route/index'

export default [
  {
    path: '/',
    redirect: '/article',
  },
  // {
  //   name: '仪表盘',
  //   path: '/dashboard',
  //   icon: 'DashboardOutlined',
  //   component: './Dashboard',
  //   routes: dashboardRoutes,
  //   wrappers: ['@/utils/auth']
  // },
  {
    name: '文章',
    path: '/article',
    icon: 'FileWordOutlined',
    component: './Article',
    routes: articleRoutes,
    wrappers: ['@/utils/auth']
  },
  {
    name: '评论',
    path: '/comment',
    icon: 'CommentOutlined',
    component: './Comment',
    routes: commentRoutes,
    wrappers: ['@/utils/auth']
  },
  {
    name: '友情链接',
    path: '/friend',
    icon: 'LinkOutlined',
    component: './FriendLink',
    routes: friendLinkRoutes,
    wrappers: ['@/utils/auth']
  },
  {
    name: '文件',
    path: '/file',
    icon: 'FolderOpenOutlined',
    component: './File',
    routes: fileRoutes,
    wrappers: ['@/utils/auth']
  },
  {
    name: '主题',
    path: '/theme',
    icon: 'SkinOutlined',
    component: './Theme',
    routes: ThemeRoutes,
    wrappers: ['@/utils/auth']
  },
  {
    name: '设置',
    path: '/setting',
    icon: 'SettingOutlined',
    component: './Setting',
    routes: settingRoutes,
    wrappers: ['@/utils/auth']
  },
  {
    name: '登录',
    path: '/login',
    component: './Login',
    layout: false
  },
  {
    name: '退出登录',
    path: '/logout',
    component: './Logout'
  }
];
