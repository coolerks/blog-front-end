import {
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  message,
} from 'antd';
import { useState } from 'react';
import { useNavigate } from 'umi';
import { useModel } from '../../../.umi/exports';
import {
  deleteCategory,
  getCategoryById,
  insertCategory,
  updateCategory,
} from '../../../api/category';
import Category from '../component/Category';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: '${label}不能够为空!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

function Categories(props) {
  async function select(key) {
    if (!disable) {
      message.info('当前处于新增/修改模式，无法查看分类信息。');
      return;
    }
    const result = await getCategoryById(key[0]);
    setCategoryKey(key[0]);
    if (result.code === 200 && result.data) {
      const { data } = result;
      const parent = (await getCategoryById(data.parentId)).data;
      if (parent) {
        setParentInfo(parent);
      }
      form.setFieldsValue(data);
    }
  }

  const [form] = Form.useForm();
  const [parentInfo, setParentInfo] = useState({});
  const [update, setUpdate] = useState(true);
  const [disable, setDisable] = useState(true);
  const [displaySelectParent, setDisplaySelectPatent] = useState(false);
  const [selectKey, setSelectKey] = useState(-1);
  const [categoryKey, setCategoryKey] = useState(-3);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const navigate = useNavigate();
  const { displayCategoryManager, setCategoryTagManager } = useModel('article');

  const openSelectParentModal = () => {
    if (!disable) {
      return;
    }
    setDisplaySelectPatent(() => true);
    setSelectKey(() => 0);
  };

  const onFinish = async (value) => {
    if (!update) {
      const res = await insertCategory(value);
      if (res.code === 200) {
        // setCategoryTagManager(() => false);
        if (props.container) {
          return;
        }
        setTimeout(() => {
          navigate(0);
        }, 300);
      }
    } else {
      value.id = categoryKey;
      const res = await updateCategory(value);
      if (res.code === 200) {
        // setCategoryTagManager(() => false);
        setTimeout(() => {
          navigate(0);
        }, 300);
      }
    }
  };

  const extra = [
    <Button
      onClick={() => {
        setUpdate(() => false);
        setDisable((pre) => {
          if (!pre) {
            setUpdate(() => true);
          } else {
            openSelectParentModal();
          }
          return !pre;
        });
        form.setFieldsValue({
          name: '',
          alias: '',
          description: '',
        });
      }}
      type={'primary'}
      icon={<PlusOutlined />}
      key={'add'}
    >
      {!update ? (disable ? '新增' : '取消新增') : '新增'}
    </Button>,
    <Button
      onClick={() => {
        if (categoryKey === -3) {
          message.info('未选择分类，请先在左侧选择一个需要修改的分类');
          return;
        }
        setUpdate(() => true);
        setDisable((pre) => !pre);
      }}
      icon={<ReloadOutlined />}
      key={'update'}
    >
      {update ? (disable ? '修改' : '取消修改') : '修改'}
    </Button>,
    checkedKeys.length > 0 && (
      <Popconfirm
        onConfirm={async () => {
          if (checkedKeys.length === 0) {
            message.info('尚未选择任何分类');
            return;
          }
          const res = await deleteCategory(checkedKeys);
          if (res.code === 200) {
            if (props.container) {
              return;
            }
            setTimeout(() => {
              navigate(0);
            }, 300);
          }
        }}
        key={'delete'}
        title="确定删除已选择的分类吗?"
      >
        <Button type="primary" icon={<DeleteOutlined />} danger>
          删除
        </Button>
      </Popconfirm>
    ),
  ];

  function selectParent() {
    return (
      <Modal
        title="选择父分类"
        open={displaySelectParent}
        onOk={async () => {
          console.log('select = ', selectKey);
          if (selectKey !== undefined) {
            const res = await getCategoryById(selectKey);
            const { data } = res;
            console.log(data);
            setParentInfo(() => data);
            form.setFieldValue('parentId', selectKey);
          }
          setDisplaySelectPatent(false);
        }}
        onCancel={() => {
          setDisplaySelectPatent(false);
        }}
      >
        <Category
          root={-1}
          select={(keys) => {
            setSelectKey(keys[0]);
          }}
        />
      </Modal>
    );
  }

  const onCheck = (checkedKeys, info) => {
    setCheckedKeys(() => checkedKeys);
  };
  return (
    <PageContainer extra={extra}>
      {selectParent()}
      <Row gutter={20}>
        <Col span={8}>
          <ProCard
            style={{ height: '75vh', overflow: 'auto' }}
            title="分类"
            bordered
            headerBordered
          >
            <Category root={0} checkable select={select} onCheck={onCheck} />
          </ProCard>
        </Col>
        <Col span={16}>
          <ProCard
            style={{ height: '75vh', overflow: 'auto' }}
            title="详情"
            bordered
            headerBordered
          >
            <Form
              layout="vertical"
              name="nest-messages"
              onFinish={onFinish}
              form={form}
              style={{ maxWidth: 600 }}
              disabled={disable}
              validateMessages={validateMessages}
            >
              <Form.Item
                name={['name']}
                label="名称"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={['alias']}
                label="别名"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={['description']}
                label="描述"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={['parentId']}
                label="父分类"
                rules={[{ required: true }]}
              >
                <a
                  style={{
                    backgroundColor: disable ? 'rgba(0, 0, 0, 0.04)' : '#fff',
                    padding: '4px 11px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '7px',
                    cursor: disable ? 'not-allowed' : 'pointer',
                  }}
                  onClick={openSelectParentModal}
                >
                  {parentInfo.name}
                </a>
              </Form.Item>
              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button type="primary" htmlType="submit">
                  {update ? '更新' : '新增'}
                </Button>
              </Form.Item>
            </Form>
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
}

export default Categories;
