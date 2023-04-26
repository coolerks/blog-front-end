import {
  DeleteOutlined,
  FileImageOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Tag as T,
  Tabs,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { addTag, deleteTag, getAllTag, updateTag } from '../../../api/tag';
import CoverPicture from '../../../components/CoverPicture';

function Tag(props) {
  const [tagList, setTagList] = useState([]);
  const [disable, setDisable] = useState(true);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [nowColor, setNowColor] = useState('#aabbcc');
  const [update, setUpdate] = useState(true);
  const [displayImageSelectModal, setDisplayImageSelectModal] = useState(false);

  const [form] = Form.useForm();

  const [tag, setTag] = useState({
    name: '',
    color: '',
    alias: '',
    coverPicture: '',
  });

  function setColor(color) {
    setTag(() => ({ ...tag, color }));
  }

  async function loadingData() {
    const result = await getAllTag();
    if (result.code === 200) {
      setTagList((pre) => {
        form.setFieldsValue(result.data[0]);
        setTag(result.data[0]);
        return result.data;
      });
    }
  }

  useEffect(() => {
    loadingData();
  }, []);

  function changeTab(key) {
    setTag(() => {
      const result = tagList.filter((it) => it.id === key)[0];
      form.setFieldsValue(result);
      return result;
    });
  }

  async function handlerDelete() {
    if (!disable) {
      message.error(
        '当前在编辑的状态下，请取消修改或者取消新增后再进行删除操作。',
      );
    } else {
      await deleteTag(tag.id);
      loadingData();
    }
  }

  function edit() {
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
    /* eslint-enable no-template-curly-in-string */

    const onFinish = async (value) => {
      delete value['articleCount'];
      value.color = tag.color;
      if (value.coverPicture.trim().length === 0) {
        delete value['coverPicture'];
      }
      if (update) {
        value.id = tag.id;
        await updateTag(value);
      } else {
        await addTag(value);
      }
      loadingData();
    };

    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    function selectImage(name) {
      setDisplayImageSelectModal(() => false);
      form.setFieldValue('coverPicture', `file://local.img/${name}`);
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
          <CoverPicture selectImage={selectImage} />
        </Modal>
      );
    }

    return (
      <>
        {imageSelectModal()}
        <Modal
          title="颜色选择器"
          open={displayColorPicker}
          onOk={() => {
            setColor(nowColor);
            setDisplayColorPicker(() => false);
          }}
          onCancel={() => setDisplayColorPicker(() => false)}
        >
          <HexColorPicker color={nowColor} onChange={setNowColor} />
        </Modal>
        <Form
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          disabled={disable}
          style={{ maxWidth: 600 }}
          form={form}
          validateMessages={validateMessages}
        >
          <Form.Item name={['name']} label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={['alias']} label="别名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={['color']} label="颜色" rules={[{ required: true }]}>
            <a
              onClick={() => {
                if (disable) {
                  return;
                }
                setNowColor(tag.color);
                setDisplayColorPicker(() => true);
              }}
              style={{ color: tag.color }}
            >
              {tag.color}
            </a>
          </Form.Item>
          <Form.Item
            name={['coverPicture']}
            label="图片Url"
            rules={[{ required: false }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item label={'选择图片'}>
            <Button
              icon={<FileImageOutlined />}
              onClick={() => setDisplayImageSelectModal(() => true)}
              block
            >
              选择图片
            </Button>
          </Form.Item>
          {update && (
            <Form.Item
              name={['articleCount']}
              label="文章总数"
              rules={[{ required: false }]}
            >
              <Input disabled={true} />
            </Form.Item>
          )}
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit">
              {update ? '更新' : '新增'}
            </Button>
          </Form.Item>
        </Form>
      </>
    );
  }

  return (
    <>
      <PageContainer
        header={{
          extra: [
            <Button
              onClick={() => {
                setUpdate(() => true);
                setDisable((pre) => !pre);
              }}
              icon={<ReloadOutlined />}
              key={'update'}
            >
              {update ? (disable ? '修改' : '取消修改') : '修改'}
            </Button>,
            <Popconfirm
              key={'delete'}
              title="确定删除?"
              onConfirm={handlerDelete}
            >
              <Button type="primary" icon={<DeleteOutlined />} danger>
                删除当前标签
              </Button>
            </Popconfirm>,
            <Button
              onClick={() => {
                setUpdate(() => false);
                setDisable((pre) => {
                  if (!pre) {
                    setUpdate(() => true);
                  }
                  return !pre;
                });
                form.setFieldsValue({
                  name: '',
                  color: '#1677ff',
                  alias: '',
                  coverPicture: '',
                });
              }}
              icon={<PlusOutlined />}
              type="primary"
              key={'add'}
            >
              {!update ? (disable ? '新增' : '取消新增') : '新增'}
            </Button>,
          ],
        }}
        ghost
      >
        <ProCard split="vertical">
          <Tabs
            defaultActiveKey="1"
            tabPosition={'left'}
            onChange={changeTab}
            style={{ height: '80vh' }}
            items={tagList.map((it) => ({
              label: <T color={it.color}>{it.name}</T>,
              key: it.id,
            }))}
          />
          <ProCard title="详情" headerBordered>
            {edit()}
          </ProCard>
        </ProCard>
      </PageContainer>
    </>
  );
}

export default Tag;
