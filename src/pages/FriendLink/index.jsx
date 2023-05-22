import {PageContainer, ProTable} from '@ant-design/pro-components';
import {Outlet} from '../../.umi/exports';
import {Button, Form, Input, message, Modal, Popconfirm, Space, Table} from "antd";
import {addFriend, getFriendList, removeFriendLink, updateFriend} from "../../api/friendLink";
import {useRef, useState} from "react";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";

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

function Index(props) {
  const table = useRef();
  const [displayModal, setDisplayModal] = useState(false);
  const [update, setUpdate] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const columns = [
    {
      title: '名称',
      dataIndex: 'siteName',
      search: false,
      render(id, record) {
        return (
          <a href={record.siteUrl} target={'_blank'} rel="noreferrer">{id}</a>
        )
      }
    },
    {
      title: 'logo',
      dataIndex: 'logoUrl',
      search: false,
      render(id) {
        return (<img height={50} src={id}/>)
      }
    },
    {
      title: '优先级',
      dataIndex: 'sort',
      search: false
    },
    {
      title: '操作',
      search: false,
      dataIndex: 'id',
      render: (id, record) => {
        return (
          <>
            <Space size="middle">
              <Popconfirm
                title="确定删除?"
                onConfirm={() => handlerDelete(id)}
              >
                <a>删除</a>
              </Popconfirm>
              <a onClick={() => updateOperation(record)}>修改</a>
            </Space>
          </>
        );
      },
    },
    {
      title: '内容',
      key: 'keyword',
      hideInTable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '内容为必填项',
          },
        ],
      },
    }
  ]

  async function loadData(params) {
    const param = {
      current: params.current,
      size: params.pageSize,
    };
    if (params.keyword !== undefined) {
      param.keyword = params.keyword;
    }
    const result = await getFriendList(param);
    return {
      data: result.data.records,
      success: result.code === 200,
      total: result.data.total,
    };
  }

  const select = ({selectedRowKeys, selectedRows, onCleanSelected}) => {
    return (
      <Space size={24}>
        <span>
          <Popconfirm
            title="确定删除?"
            onConfirm={() => handlerDelete(selectedRowKeys)}
          >
            <a>删除</a>
          </Popconfirm>
          {/*<a style={{marginInlineStart: 8}} onClick={() => console.log(selectedRowKeys)}>*/}
          {/*  移至回收站*/}
          {/*</a>*/}
        </span>
        <span>
          已选 {selectedRowKeys.length} 项
          <a style={{marginInlineStart: 8}} onClick={onCleanSelected}>
            取消选择
          </a>
        </span>
      </Space>
    );
  };

  async function handlerDelete(id) {
    let res = await removeFriendLink(id);
    if (res.code === 200) {
      message.success('删除成功，如若遇到评论列表显示异常，请刷新页面。');
      table.current.reload();
    } else {
      message.error('删除失败，请刷新页面。');
    }
  }

  function updateOperation(data) {
    setUpdate(() => true);
    setDisplayModal(() => true);
    setUpdateData(() => {
      form.setFieldsValue(data);
      return data;
    });
  }

  function addOperation() {
    setUpdate(() => false);
    setDisplayModal(() => true);
    form.setFieldsValue({
      "description": "",
      "logoUrl": "",
      "siteName": "",
      "siteUrl": "",
      "sort": 1
    })
  }

  const onFinish = async (value) => {
    let result;
    if (update) {
      value.id = updateData.id;
      result = await updateFriend(value)
    } else {
      result = await addFriend(value);
    }
    if (result.code === 200)  {
      table.current.reload();
      setDisplayModal(() => false);
    }
  }

  function showModal() {
    return (
      <Modal
        title={update ? '更新' : '新增'}
        footer={[]}
        onCancel={() => setDisplayModal(() => false)}
        open={displayModal}>

        <Form
          name="nest-messages"
          onFinish={onFinish}
          style={{maxWidth: 600}}
          form={form}
          layout="vertical"
          validateMessages={validateMessages}>
          <Form.Item name={['siteName']} label="站点名称" rules={[{required: true}]}>
            <Input/>
          </Form.Item>
          <Form.Item name={['siteUrl']} label="站点地址" rules={[{required: true}]}>
            <Input/>
          </Form.Item>
          <Form.Item name={['logoUrl']} label="站点logo" rules={[{required: true}]}>
            <Input/>
          </Form.Item>
          <Form.Item name={['description']} label="站点描述" rules={[{required: true}]}>
            <Input/>
          </Form.Item>
          <Form.Item name={['sort']} label="优先级" rules={[{required: true}]}>
            <Input/>
          </Form.Item>
          <br/>
          <Form.Item style={{textAlign: "right"}}>
            <Button loading={loading} type="primary" htmlType="submit">
              {update ? '更新' : '新增'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  function toolBar() {
    return [
      <Button
        onClick={addOperation}
        type="primary"
        key="primary"
        icon={<PlusOutlined/>}
      >
        新建
      </Button>
    ];
  }

  return (
    <PageContainer header={{title: false}} ghost>
      {showModal()}
      <PageContainer header={{title: false}} ghost>
        <ProTable
          columns={columns}
          request={loadData}
          rowKey={'id'}
          actionRef={table}
          rowSelection={{
            selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          }}
          tableAlertOptionRender={select}
          pagination={{pageSize: 10}}
          toolBarRender={toolBar}
        ></ProTable>
      </PageContainer>
    </PageContainer>
  );
}


export default Index;
