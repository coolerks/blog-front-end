import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, Table, Tag, message } from 'antd';
import { useRef } from 'react';
import { useNavigate } from 'umi';
import { deleteArticle, listArticle } from '../../../api/article';

// 加载数据
async function loadData(params) {
  const content = '' || params.content;
  const { current, pageSize } = params;
  const result = await listArticle(current, pageSize, content);
  return {
    data: result.data.records,
    success: result.code === 200,
    total: result.data.total,
  };
}

// 选中的元素

function List(props) {
  const navigate = useNavigate();

  const columns = [
    {
      title: '名称',
      dataIndex: 'title',
      search: false,
    },
    {
      title: '分类',
      search: false,
      dataIndex: 'category',
      render: (categories) => {
        return (
          <>
            {categories.length === 0 ? (
              <>无</>
            ) : (
              categories.map((it) => (
                <Tag color={it.color === null ? 'cyan' : it.color} key={it.id}>
                  {it.name}
                </Tag>
              ))
            )}
          </>
        );
      },
    },
    {
      title: '标签',
      search: false,
      dataIndex: 'tag',
      render: (tags) => {
        return (
          <>
            {tags.length === 0 ? (
              <>无</>
            ) : (
              tags.map((it) => (
                <Tag
                  color={it.color === null ? 'volcano' : it.color}
                  key={it.id}
                >
                  {it.name}
                </Tag>
              ))
            )}
          </>
        );
      },
    },
    {
      title: '时间',
      search: false,
      dataIndex: 'updateTime',
    },
    {
      title: '操作',
      search: false,
      dataIndex: 'id',
      render: (id, record) => {
        return (
          <>
            <Space size="middle">
              <a onClick={() => navigate('/article/write', { state: id })}>
                编辑
              </a>
              <Popconfirm
                title="确定移动到回收站?"
                onConfirm={() => handlerDelete(id)}
              >
                <a>删除</a>
              </Popconfirm>
            </Space>
          </>
        );
      },
    },
    {
      title: '内容',
      key: 'content',
      hideInTable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '内容为必填项',
          },
        ],
      },
    },
  ];

  const select = ({ selectedRowKeys, selectedRows, onCleanSelected }) => {
    return (
      <Space size={24}>
        <span>
          <Popconfirm
            title="确定移动到回收站?"
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
          <a style={{ marginInlineStart: 8 }} onClick={onCleanSelected}>
            取消选择
          </a>
        </span>
      </Space>
    );
  };

  async function handlerDelete(id) {
    let res = await deleteArticle(id);
    if (res.code === 200) {
      message.success('删除成功，如若遇到文章列表显示异常，请刷新页面。');
      table.current.reload();
    } else {
      message.error('删除失败，请刷新页面。');
    }
  }

  function toolBar() {
    return [
      <Button
        onClick={() => navigate('/article/write')}
        type="primary"
        key="primary"
        icon={<PlusOutlined />}
      >
        新建
      </Button>,
      <Button key="show" icon={<DeleteOutlined />}>
        回收站
      </Button>,
    ];
  }

  const table = useRef();
  return (
    <>
      <PageContainer header={{ title: false }} ghost>
        <ProTable
          columns={columns}
          request={loadData}
          rowKey={'id'}
          actionRef={table}
          rowSelection={{
            selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          }}
          tableAlertOptionRender={select}
          pagination={{ pageSize: 10 }}
          toolBarRender={toolBar}
        ></ProTable>
      </PageContainer>
    </>
  );
}

export default List;
