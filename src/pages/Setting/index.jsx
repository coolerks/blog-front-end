import { PageContainer } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import {Card, Segmented} from "antd";
import logo from "../../.umi-production/plugin-layout/Logo";
import {
  BugOutlined,
  GlobalOutlined,
  HomeOutlined,
  MenuOutlined,
  MessageOutlined, SafetyOutlined,
  UserOutlined
} from "@ant-design/icons";
import Comment from "./component/Comment";
import Blog from "./component/Blog";
import User from "./component/User";
import Seo from "./component/Seo";
import Global from "./component/Global";
import Menu from "./component/Menu";
import Security from "./component/Security";

function Index(props) {
  const options = [
    {
      label: '评论',
      value: 0,
      icon: <MessageOutlined />
    },
    {
      label: '博客',
      value: 1,
      icon: <HomeOutlined />
    },
    {
      label: '个人',
      value: 2,
      icon: <UserOutlined />
    },
    {
      label: 'SEO',
      value: 3,
      icon: <BugOutlined />
    },
    {
      label: '全局',
      value: 4,
      icon: <GlobalOutlined />
    },
    {
      label: '菜单',
      value: 5,
      icon: <MenuOutlined />
    },
    {
      label: '安全',
      value: 6,
      icon: <SafetyOutlined />
    }
  ]
  const [index, setIndex] = useState(0);
  const settings = [
    <Comment key={'comment'}/>,
    <Blog key={'blog'} />,
    <User key={'my'} />,
    <Seo key={'seo'} />,
    <Global key={'global'} />,
    <Menu key={'menu'} />,
    <Security key={'security'} />
  ];


  return (
    <PageContainer header={{ title: false }} ghost>
      <div style={{
        textAlign: 'center'
      }}>
        <Segmented style={{
          selector: 'none'
        }} onChange={e => setIndex(() => e)} options={options} />
      </div>
      <br/>
      <Card bordered={false} style={{ width: '98%',margin: "auto" }}>
        {settings[index]}
      </Card>
    </PageContainer>
  );
}

export default Index;
