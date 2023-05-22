import { useEffect, useState } from 'react';
import MdEditor from 'react-markdown-editor-lite';
// 导入编辑器的样式
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  FileImageOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Collapse,
  Form,
  Input,
  Modal,
  Select,
  Switch,
  Tree,
  message,
} from 'antd';
import { Space } from 'antd/lib';
import ReactMarkdown from 'react-markdown';
import 'react-markdown-editor-lite/lib/index.css';
import remarkGfm from 'remark-gfm';
import { history, useLocation, useModel } from 'umi';
import { addArticle, getArticle, updateArticle } from '../../../api/article';
import { getAllCategory } from '../../../api/category';
import { getAllTag } from '../../../api/tag';
import CoverPicture from '../../../components/CoverPicture';
import Categories from './Categories';
import Tag from './Tag';

const { Panel } = Collapse;

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

function buildTree(arr) {
  const temp = arr.map((it) => ({
    key: it.id,
    title: it.name,
    parentId: it.parentId,
    children: [],
  }));
  const obj = {};
  for (let a of temp) {
    obj[a.key] = a;
  }
  const result = [];
  for (let a of Reflect.ownKeys(obj)) {
    const { parentId } = obj[a];
    if (parentId === 1) {
      result.push(obj[a]);
    } else {
      if (parentId > 0) {
        obj[parentId].children.push(obj[a]);
      }
    }
  }
  return result;
}

function Write(props) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [form] = Form.useForm();
  const [allowComment, setAllowComment] = useState(true);
  const [categoryKeys, setCategoryKeys] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [tagKeys, setTagKeys] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const { state } = useLocation();
  const [categories, setCategories] = useState([]);
  const [displayTagManager, setDisplayTagManager] = useState(false);
  const { displayCategoryManager, setCategoryTagManager } = useModel('article');
  const [displayImageSelectModal, setDisplayImageSelectModal] = useState(false);

  const operationButton = [
    <Button
      type={'primary'}
      onClick={() => setOpenSubmitModal(() => true)}
      key="submit"
    >
      {state === null ? '提交' : '更新'}
    </Button>,
  ];

  async function loadingArticle() {
    const result = await getArticle(state);
    const { data } = result;
    form.setFieldsValue({
      id: data.id,
      alias: data.alias,
      allowComment: data.allowComment,
      category: data.category,
      coverPictureUrl: data.coverPictureUrl,
      description: data.description,
      keywords: data.keyword
        .reduce((pre, now) => pre + ',' + now.value, '')
        .substring(1),
      tag: data.tag,
    });
    setContent(() => data.content);
    setTitle(() => data.title);
    setCategoryKeys(() => data.category.map((it) => it.id));
    setTagKeys(() => data.tag.map((it) => it.id));
  }

  async function loadingCategory() {
    const result = await getAllCategory();
    if (result.code === 200) {
      const { data } = result;
      setCategories(() => buildTree(data));
    }
  }

  useEffect(() => {
    loadingCategory();
  }, []);

  useEffect(() => {
    if (localStorage.article) {
      const data = JSON.parse(localStorage.article);
      setTitle(data.title);
      setContent(data.text);
    }
    loadingTag();
    window.onbeforeunload = function () {
      return true;
    };
    if (state !== null) {
      loadingArticle();
      return;
    }
    form.setFieldsValue({
      alias: '',
      allowComment: true,
      category: [],
      coverPictureUrl: 'file://local.file/default.img',
      description: '',
      keywords: '',
      tag: [],
    });
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  async function loadingTag() {
    const result = await getAllTag();
    if (result.code === 200) {
      const { data } = result;
      setTagOptions(() => data);
    }
  }

  function handleEditorChange({ text }) {
    const data = {
      title,
      text,
      time: new Date().getTime(),
    };
    localStorage.article = JSON.stringify(data);
    setContent(() => text);
  }

  function checkedCategory(keys) {
    setCategoryKeys(keys);
  }

  const onFinish = async (value) => {
    value.category = categoryKeys;
    value.keywords = value.keywords ? value.keywords.split(',') : [];
    value.content = content;
    value.tag = tagKeys;
    value.title = title;
    // if (value.coverPictureUrl === 'file://local.file/default.img' || value.coverPictureUrl === 'file://local.img/default.jpg') {
    //   value.coverPictureUrl = `https://up.api.daidr.me/apis/imgholder/800x500?text=${title}&bg=806d9e&fg=ffffff`
    // }
    setSubmitting(() => true);
    let result = { code: 400 };
    if (state === null) {
      result = await addArticle(value);
    } else {
      value.id = state;
      result = await updateArticle(value);
    }
    if (result.code === 200) {
      localStorage.removeItem('article');
      history.push('/article');
    } else {
      const { data } = result;
      for (let a of data) {
        message.error(a);
      }
    }
    setSubmitting(() => false);
  };

  const tagChange = (tags) => {
    setTagKeys(tags);
  };

  function tagManager() {
    return (
      <Modal
        title="管理标签"
        width={1000}
        closable={false}
        open={displayTagManager}
        onOk={async () => {
          await loadingTag();
          setDisplayTagManager(() => false);
        }}
        onCancel={async () => {
          await loadingTag();
          setDisplayTagManager(() => false);
        }}
        okText="确认"
        cancelText="取消"
      >
        <Tag />
      </Modal>
    );
  }

  function categoryManager() {
    return (
      <Modal
        width={1000}
        closable={false}
        title="分类管理"
        open={displayCategoryManager}
        onOk={async () => {
          await loadingCategory();
          setCategoryTagManager(() => false);
        }}
        onCancel={async () => {
          await loadingCategory();
          setCategoryTagManager(() => false);
        }}
        okText="确认"
        cancelText="取消"
      >
        <Categories container />
      </Modal>
    );
  }

  function articleInfo() {
    return (
      <Panel header="基本信息" key="1">
        {tagManager()}
        <Form.Item name={['alias']} label="别名" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="标签">
          <Select
            mode="multiple"
            allowClear
            defaultValue={tagKeys}
            style={{
              width: '100%',
            }}
            placeholder="选择标签"
            onChange={tagChange}
            options={tagOptions.map((it) => ({ label: it.name, value: it.id }))}
          />
        </Form.Item>
        <Form.Item>
          <Button
            icon={<EditOutlined />}
            onClick={() => setDisplayTagManager(() => true)}
            block
          >
            管理标签
          </Button>
        </Form.Item>

        <Form.Item name={['coverPictureUrl']} label="封面图">
          <Input disabled />
        </Form.Item>

        <Form.Item>
          <Button
            icon={<FileImageOutlined />}
            onClick={() => setDisplayImageSelectModal(() => true)}
            block
          >
            选择图片
          </Button>
        </Form.Item>
        <Form.Item
          name={['allowComment']}
          label="允许评论"
          rules={[{ required: true }]}
        >
          <Switch
            onChange={(e) => setAllowComment(() => e)}
            checked={allowComment}
          />
        </Form.Item>
      </Panel>
    );
  }

  function categoryInfo() {
    return (
      <Panel header="分类信息" key="2">
        {categoryManager()}
        {/*<Form.Item label="分类">*/}
        {/*  <Category*/}
        {/*    checkable*/}
        {/*    onCheck={checkedCategory}*/}
        {/*    root={0}/>*/}
        {/*</Form.Item>*/}
        <Tree
          checkable
          defaultCheckedKeys={categoryKeys}
          onCheck={checkedCategory}
          treeData={categories}
        />
        <br />
        <Button
          icon={<EditOutlined />}
          onClick={() => setCategoryTagManager(() => true)}
          block
        >
          管理分类
        </Button>
      </Panel>
    );
  }

  function otherInfo() {
    return (
      <Panel header="SEO信息" key="3">
        <Form.Item name={['description']} label="描述信息">
          <Input />
        </Form.Item>
        <Form.Item name={['keywords']} label="关键词">
          <Input placeholder={'如果有多个关键词，请用英文逗号分隔开'} />
        </Form.Item>
      </Panel>
    );
  }

  function submitModal() {
    return (
      <Modal
        open={openSubmitModal}
        closable={false}
        title="文章信息"
        footer={[]}
      >
        {imageSelectModal()}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Collapse defaultActiveKey={['1']}>
            {articleInfo()}
            {categoryInfo()}
            {otherInfo()}
          </Collapse>
          <br />
          <Space>
            <Button
              loading={submitting}
              htmlType="submit"
              icon={<CheckOutlined />}
              type={'primary'}
              key={'submit'}
            >
              {state === null ? '提交' : '更新'}
            </Button>
            <Button
              disabled={submitting}
              onClick={() => setOpenSubmitModal(() => false)}
              icon={<CloseOutlined />}
              key={'cancel'}
            >
              取消
            </Button>
          </Space>
        </Form>
      </Modal>
    );
  }

  function selectImage(name) {
    setDisplayImageSelectModal(() => false);
    form.setFieldValue('coverPictureUrl', `file://local.img/${name}`);
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
      {submitModal()}
      <PageContainer header={{ extra: operationButton }} ghost>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="文章标题"
        />
        <br />
        <br />
        <MdEditor
          value={content}
          onChange={handleEditorChange}
          style={{
            height: '66vh',
            font: 'sans-serif monospace',
          }}
          renderHTML={(text) => (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
          )}
        />
      </PageContainer>
    </>
  );
}

export default Write;
