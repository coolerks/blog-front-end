import React, {useEffect, useState} from 'react';
import {getGlobalSettings, getSecuritySettings, updateSettings} from "../../../api/settings";
import {Button, Form, Input, Tag} from "antd";

const {TextArea} = Input;

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

function Global(props) {
  const [form] = Form.useForm();
  const [setting, setSetting] = useState({});

  async function loadingData() {
    const result = await getSecuritySettings();
    const {data} = result;
    const obj = {};
    data.forEach(it => {
      obj[it.key] = it.value;
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
        <Form.Item>
          <p>可以进行设置单个ip的访问频率，可以有效的阻止服务器被恶意的攻击。</p>
        </Form.Item>
        <Form.Item name={['security_time_seconds']} label="时间/秒" rules={[{required: false}]}>
          <Input/>
        </Form.Item>
        <Form.Item name={['security_count']} label="访问量/次" rules={[{required: false}]}>
          <Input/>
        </Form.Item>
        <Form.Item name={['security_no_access']} label="禁止访问时间/秒（0代表永远无法访问）" rules={[{required: false}]}>
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

export default Global;
