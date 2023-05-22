import React, {useEffect, useState} from 'react';
import {getBlogSettings, getCommentSettings, updateSettings} from "../../../api/settings";
import {Button, Form, Input, Modal} from "antd";
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
function Blog(props) {
  const [form] = Form.useForm();
  const [setting, setSetting] = useState({});
  const [item, setItem] = useState("");
  const [displayImageSelectModal, setDisplayImageSelectModal] = useState(false);


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
    const result = await getBlogSettings();
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
        <Form.Item name={['blog_name']} label="博客名称" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name={['blog_address']} label="博客地址" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name={['blog_favicon_url']} label="网站图标" rules={[{required: true}]}>
          <Input disabled/>
        </Form.Item>
        <Form.Item rules={[{required: true}]}>
          <Button
            icon={<FileImageOutlined/>}
            onClick={() => {
              setDisplayImageSelectModal(() => true)
              setItem('blog_favicon_url')
            }}
            block
          >
            选择图片
          </Button>
        </Form.Item>
        <Form.Item name={['blog_logo_url']} label="网站logo" rules={[{required: true}]}>
          <Input disabled/>
        </Form.Item>
        <Form.Item rules={[{required: true}]}>
          <Button
            icon={<FileImageOutlined/>}
            onClick={() => {
              setDisplayImageSelectModal(() => true)
              setItem('blog_logo_url')
            }}
            block
          >
            选择图片
          </Button>
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

export default Blog;
