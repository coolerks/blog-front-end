// 运行时配置
import defaultSettings from '../config/defaultSettings';
import './app.css';
import './assets/image/excel.png'
import notifications from './assets/image/notifications.png'
import {QuestionCircleOutlined} from "@ant-design/icons";
// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState() {
  return {
    name: '用户',
    settings: defaultSettings,
  };
}

export const layout = ({ initialState, setInitialState }) => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    ...initialState?.settings,
    avatarProps: {
      src: notifications,
      size: 'small',
      title: '暂无消息',
    }
  };
};

