import React, {useEffect, useState} from 'react';
import {getSeoSettings, getUserSettings, updateSettings} from "../../../api/settings";
import {Button, Form, Input, Switch} from "antd";

const validateMessages = {
  required: '${label}不能为空',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

function Seo(props) {
  const [form] = Form.useForm();
  const [setting, setSetting] = useState({});

  async function loadingData() {
    const result = await getSeoSettings();
    const {data} = result;
    const obj = {};
    data.forEach(it => {
      let val = it.value;
      if (val === 'true' || val === 'false') {
        val = val === 'true';
      }
      obj[it.key] = val;
    })
    setSetting(() => obj);
    form.setFieldsValue(obj)
  }
  async function finish(value) {
    const data = [];
    for (let key in value) {
      let val = value[key];
      if (typeof val === 'boolean') {
        val = val ? 'true' : 'false';
      }
      data.push({
        key,
        value: val
      })
    }
    await updateSettings(data)
  }

  useEffect(() => {
    loadingData();
  }, [])
  return (
    <>
      <Form
        onFinish={finish}
        name="nest-messages"
        style={{maxWidth: 600, margin: 'auto'}}
        form={form}
        layout="vertical"
        validateMessages={validateMessages}>
        <Form.Item name={['seo_allow_spider']} valuePropName={'checked'} label="允许爬虫" rules={[{required: true}]}>
          <Switch/>
        </Form.Item>
        <Form.Item name={['seo_description']} label="描述" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name={['seo_keywords']} label="关键词" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <br/>
        <Form.Item style={{textAlign: "right"}}>
          <Button type="primary" htmlType="submit">
            更新
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default Seo;
