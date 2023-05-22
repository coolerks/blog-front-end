import Editor from '@monaco-editor/react';
import {Avatar, Card, List as Lists, Tag, message} from "antd";
import {useEffect, useState} from "react";
import {changeTheme, getNowTheme, getThemeList} from "../../../api/theme";
import {CheckOutlined, EditOutlined, EllipsisOutlined, EyeOutlined, SettingOutlined} from "@ant-design/icons";
import Meta from "antd/es/card/Meta";

function List(props) {
  const [theme, setTheme] = useState([]);
  const [name, setName] = useState("");
  async function loadingThemeList() {
    const result = await getThemeList();
    if (result.code === 200) {
      setTheme(() => result.data);
    }
  }
  async function loadingNowThemeName() {
    const result = await getNowTheme();
    if (result.code === 200) {
      setName(result.data);
    }
  }
  async function changeNowTheme(name) {
    const result = await changeTheme(name);
    if (result.code === 200) {
      message.success("修改成功");
      await loadingThemeList();
      await loadingNowThemeName();
    }
  }
  useEffect(() => {
    loadingThemeList();
    loadingNowThemeName();
  }, [])
  return (
    <>
      <Card bordered={false} style={{margin: "auto" }}>
        <span>当前应用的主题：<Tag color="blue">{name}</Tag></span>
      </Card>
      <br/>
      <Lists
        grid={{ gutter: 16, column: 4 }}
        dataSource={theme}
        renderItem={(item) => (
          <Lists.Item>
            <Card
              style={{ width: 300 }}
              cover={
                <img
                  alt="example"
                  src={`/api/theme/preview/${item.manifest.name}`}
                />
              }
              actions={[
                <SettingOutlined key="setting" />,
                <a href={item.manifest.demo} target={'_blank'} key={'eye'} rel="noreferrer"><EyeOutlined /></a>,
                <CheckOutlined onClick={() => changeNowTheme(item.manifest.name)} key={'use'} />
              ]}>
              <p style={{fontWeight: "bold"}}>名称：{item.manifest.name}</p>
              <p>描述信息：{item.manifest.description}</p>
              <p>版本：{item.manifest.version}</p>
              <p>作者：<a href={item.manifest.author.site} target={"_blank"} rel="noreferrer">{item.manifest.author.name}</a></p>
            </Card>
          </Lists.Item>
        )}
      />
    </>
  );
}

export default List;
