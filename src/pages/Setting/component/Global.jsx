import React, {useEffect, useState} from 'react';
import {getGlobalSettings, updateSettings} from "../../../api/settings";
import {Button, Form, Input} from "antd";

const { TextArea } = Input;

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
    const result = await getGlobalSettings();
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
        <Form.Item name={['global_javascript']} label="全局JavaScript脚本" rules={[{required: false}]}>
          <TextArea rows={10}/>
        </Form.Item>
        <Form.Item name={['global_head']} label="全局Head" rules={[{required: false}]}>
          <TextArea rows={10}/>
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
