import React, {useEffect, useState} from 'react';
import {getBlogSettings, getUserSettings, modifyPassword, modifyUsername, updateSettings} from "../../../api/settings";
import {Button, Form, Input, Modal, message} from "antd";
import CoverPicture from "../../../components/CoverPicture";
import {FileImageOutlined} from "@ant-design/icons";

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

function User(props) {
  const [form] = Form.useForm();
  const [setting, setSetting] = useState({});
  const [item, setItem] = useState("");
  const [displayImageSelectModal, setDisplayImageSelectModal] = useState(false);
  const [disPlayPasswordModal, setDisPlayPasswordModal] = useState(false);
  const [displayUsernameModal, setDisplayUsernameModal] = useState(false);

  function selectImage(name) {
    setDisplayImageSelectModal(() => false);
    form.setFieldValue(item, `file://local.img/${name}`);
    console.log(item, name)
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


  async function loadingData() {
    const result = await getUserSettings();
    const {data} = result;
    const obj = {};
    data.forEach(it => {
      obj[it.key] = it.value;
    })
    setSetting(() => obj);
    form.setFieldsValue(obj)
  }

  useEffect(() => {
    loadingData();
  }, [])

  async function updateUsername(value) {
    const result = await modifyUsername(value);
    if (result.code === 200) {
      setDisplayUsernameModal(() => false);
    }
  }

  async function updatePassword(value) {
    if (value.newPassword !== value.repeatNewPassword) {
      message.error("两次密码不一致");
      return;
    }
    delete value.repeatNewPassword;
    const result = await modifyPassword(value);
    if (result.code === 200) {
      setDisPlayPasswordModal(() => false);
    }
  }

  function updatePasswordModal() {
    return (
      <Modal
        title={'修改密码'}
        open={disPlayPasswordModal}
        onCancel={() => setDisPlayPasswordModal(() => false)}
        footer={[]}>
        <Form
          name={'updateUsername'}
          layout={'vertical'}
          onFinish={updatePassword}
          validateMessages={validateMessages}>
          <Form.Item name={['username']} label="用户名" rules={[{required: true}]}>
            <Input/>
          </Form.Item>
          <Form.Item name={['password']} label="密码" rules={[{required: true}]}>
            <Input.Password/>
          </Form.Item>
          <Form.Item name={['newPassword']} label="新密码" rules={[{required: true}]}>
            <Input.Password/>
          </Form.Item>
          <Form.Item name={['repeatNewPassword']} label="确认新密码" rules={[{required: true}]}>
            <Input.Password/>
          </Form.Item>
          <Form.Item style={{textAlign: "right"}}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  function updateUsernameModal() {
    return (
      <Modal
        title={'修改用户名'}
        open={displayUsernameModal}
        onCancel={() => setDisplayUsernameModal(() => false)}
        footer={[]}>
        <Form
          name={'updateUsername'}
          layout={'vertical'}
          onFinish={updateUsername}
          validateMessages={validateMessages}>
          <Form.Item name={['username']} label="当前用户名" rules={[{required: true}]}>
            <Input/>
          </Form.Item>
          <Form.Item name={['password']} label="密码" rules={[{required: true}]}>
            <Input.Password/>
          </Form.Item>
          <Form.Item name={['newUsername']} label="新用户名" rules={[{required: true}]}>
            <Input/>
          </Form.Item>
          <Form.Item style={{textAlign: "right"}}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    )
  }


  return (
    <>
      {imageSelectModal()}
      {updateUsernameModal()}
      {updatePasswordModal()}
      <Form
        onFinish={finish}
        name="nest-messages"
        style={{maxWidth: 600, margin: 'auto'}}
        form={form}
        layout="vertical"
        validateMessages={validateMessages}>
        <Form.Item name={['user_nickname']} label="昵称" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name={['user_email']} label="邮箱" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name={['user_avatar_url']} label="头像" rules={[{required: true}]}>
          <Input disabled/>
        </Form.Item>
        <Form.Item rules={[{required: true}]}>
          <Button
            icon={<FileImageOutlined/>}
            onClick={() => {
              setDisplayImageSelectModal(() => true)
              setItem('user_avatar_url')
            }}
            block
          >
            选择图片
          </Button>
        </Form.Item>
        <Form.Item name={['user_description']} label="介绍" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <br/>
        <Form.Item style={{textAlign: "right"}}>
          <a onClick={() => setDisPlayPasswordModal(() => true)} style={{marginRight: 10}}>修改密码</a>
          <a onClick={() => setDisplayUsernameModal(() => true)} style={{marginRight: 10}}>修改账户</a>
          <Button type="primary" htmlType="submit">
            更新
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default User;
