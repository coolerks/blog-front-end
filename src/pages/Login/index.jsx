import React, {useEffect} from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';
import Cookies from 'js-cookie'
import {login} from "../../api/login";

function Index(props) {
  const onFinish = async (values) => {
    const result = await login(values);
    if (result.code === 200) {
      message.success("登录成功")
      Cookies.set("token", result.data, {expires: 1});
      window.location.hash = "/"
    }
  };
  useEffect(() => {
    Cookies.remove("token");
  }, [])
  return (
    <>
      <div style={{
        display: "flex",
        height: '100vh',
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div style={{
          width: 280,
          height: 300,
          boxShadow: '0 4px 12px rgba(0,0,0,.08)',
          borderRadius: 10,
          padding: 30,
          display: "flex",
          flexDirection: "column"
        }}>
          <p style={{textAlign: "center", fontSize: 30}}>登录</p>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: '用户名不能为空!',
                },
              ]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: '密码不能为空!',
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" block htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
      </div>


      </div>
    </>
  );
}

export default Index;
