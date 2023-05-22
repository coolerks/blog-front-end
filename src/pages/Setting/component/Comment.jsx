import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Modal, Switch} from "antd";
import {getCommentSettings, updateSettings} from "../../../api/settings";
import {FileImageOutlined} from "@ant-design/icons";
import CoverPicture from "../../../components/CoverPicture";

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

function Comment(props) {
  const [form] = Form.useForm();
  const [setting, setSetting] = useState({});
  const [displayImageSelectModal, setDisplayImageSelectModal] = useState(false);

  async function loadingData() {
    const result = await getCommentSettings();
    const {data} = result;
    const obj = {};
    data.forEach(it => {
      let val = it.value;
      if (val === 'true' || val === 'false') {
        val = val === 'true';
      }
      obj[it.key] = val;
    })
    obj['email_enabled'] = obj['email_enabled'] === 'true';
    setSetting(() => obj);
    form.setFieldsValue(obj)
  }

  useEffect(() => {
    loadingData();
  }, [])


  function selectImage(name) {
    setDisplayImageSelectModal(() => false);
    form.setFieldValue('comment_default_avatar', `file://local.img/${name}`);
    console.log(name);
  }

  function imageSelectModal() {
    return (
      <Modal
        width={1100}
        onCancel={() => setDisplayImageSelectModal(() => false)}
        open={displayImageSelectModal}
        footer={[]}
        title={'选择图片'}
      >
        <CoverPicture selectImage={selectImage}/>
      </Modal>
    );
  }


  async function finish(value) {
    console.log(value)
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


  return (
    <>
      {imageSelectModal()}
      <Form
        onFinish={finish}
        name="nest-messages"
        style={{maxWidth: 600, margin: 'auto'}}
        form={form}
        layout="vertical"
        validateMessages={validateMessages}>
        <Form.Item name={['comment_default_avatar']} label="评论者默认头像" rules={[{required: true}]}>
          <Input disabled={true}/>
        </Form.Item>
        <Form.Item rules={[{required: true}]}>
          <Button
            icon={<FileImageOutlined/>}
            onClick={() => setDisplayImageSelectModal(() => true)}
            block
          >
            选择图片
          </Button>
        </Form.Item>

        <Form.Item name={['avatar_proxy_url']} label="Gravatar头像源" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name={'email_enabled'} valuePropName={'checked'} label="邮件通知" rules={[{required: true}]}>
          {/*<Input/>*/}
          <Switch/>
        </Form.Item>
        <Form.Item name={['email_smtp_address']} label="邮箱服务器" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name={['email_protocol']} label="邮箱发送协议" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name={['email_account']} label="邮箱账户" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name={['email_password']} label="邮箱密码" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name={['email_template']} label="邮箱模板" rules={[{required: true}]}>
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

export default Comment;
