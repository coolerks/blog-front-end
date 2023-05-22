import React, {useEffect, useState} from 'react';
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Form, Input, Popconfirm, Space} from 'antd';
import {getMenuSettings, updateMenuSettings} from "../../../api/settings";

const defaultMenu = {
  "menu": [
    {
      "path": "/",
      "name": "首页"
    },
    {
      "path": "/archive",
      "name": "归档"
    },
    {
      "path": "/categories",
      "name": "标签云"
    },
    {
      "path": "/friend",
      "name": "友情链接"
    }
  ]
}

function Menu(props) {
  const [form] = Form.useForm();
  const [menu, setMenu] = useState({menu: []});

  async function loadingData() {
    const result = await getMenuSettings();
    const {data} = result;
    console.log(data);
    setMenu(() => data);
    form.setFieldsValue(data)
  }

  const onFinish = async (values) => {
    await updateMenuSettings(values)
  };

  useEffect(() => {
    loadingData();
  }, [])

  return (
    <>
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        style={{
          maxWidth: 600,
          margin: 'auto'
        }}
        autoComplete="off"
        form={form}
      >
        <Form.List name="menu">
          {(fields, {add, remove}) => (
            <>
              {fields.map(({key, name, ...restField}) => (
                <Space
                  key={key}
                  style={{
                    display: 'flex',
                    marginBottom: 8,
                  }}
                  align="baseline"
                >
                  <Form.Item
                    label={'菜单名称'}
                    {...restField}
                    name={[name, 'name']}
                    rules={[
                      {
                        required: true,
                        message: '名称不能为空',
                      },
                    ]}
                  >
                    <Input placeholder="名称"/>
                  </Form.Item>
                  <Form.Item
                    label={'路径'}
                    {...restField}
                    name={[name, 'path']}
                    rules={[
                      {
                        required: true,
                        message: '路径不能为空',
                      },
                    ]}
                  >
                    <Input placeholder="路径"/>
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)}/>
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                  添加新菜单
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item style={{textAlign: 'right'}}>
          <Popconfirm
            title="重置"
            description="确定重置?"
            onConfirm={() => form.setFieldsValue(defaultMenu)}
            okText="确定"
            cancelText="取消"
          >
            <Button style={{marginRight: 10}} type="dashed">
              恢复默认
            </Button>
          </Popconfirm>
          <Button type="primary" htmlType="submit">
            更新
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default Menu;
