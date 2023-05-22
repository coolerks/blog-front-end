import {PageContainer, ProTable} from '@ant-design/pro-components';
import {Popconfirm, Space, Table, message, Modal, Input} from 'antd';
import {useEffect, useRef, useState} from 'react';
import {getIdTitleMap} from '../../api/article';
import {addComment, getComment, removeComment} from '../../api/comment';

const {TextArea} = Input;

function Index(props) {
  const table = useRef();
  const [idTitleMap, setIdTitleMap] = useState({});
  const [displayReplyModal, setDisplayModal] = useState(false);
  const [comment, setComment] = useState({
    "articleId": 0,
    "content": "",
    "parentId": 0
  })
  useEffect(() => {
    loadingIdTitleMap();
  }, []);

  async function submit() {
    const result = await addComment(comment);
    if (result.code === 200) {
      table.current.reload();
      setDisplayModal(() => false);
    }
  }

  function reply(articleId, parentId) {
    setDisplayModal(() => true);
    setComment(pre => ({...pre, parentId, articleId}))
  }

  async function loadingIdTitleMap() {
    const result = await getIdTitleMap();
    if (result.code === 200) {
      const {data} = result;
      setIdTitleMap(() => data);
    }
  }

  const columns = [
    {
      title: '昵称',
      dataIndex: 'nickname',
      search: false,
      render: (id, item) => (
        <a target={'_blank'} href={item.site} rel="noreferrer">
          {id}
        </a>
      ),
    },
    {
      title: '内容',
      dataIndex: 'content',
      search: false,
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      search: false,
    },
    {
      title: '标题',
      dataIndex: 'articleName',
      search: false,
    },
    {
      title: '时间',
      dataIndex: 'createTime',
      search: false,
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
                title="确定移动到回收站?"
                onConfirm={() => handlerDelete(id)}
              >
                <a>删除</a>
              </Popconfirm>
              <a onClick={() => reply(record.articleId, record.id)}>回复</a>
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
    },
    {
      title: '文章',
      key: 'id',
      hideInTable: true,
      valueEnum: idTitleMap,
    },
  ];

  async function handlerDelete(id) {
    let res = await removeComment(id);
    if (res.code === 200) {
      message.success('删除成功，如若遇到评论列表显示异常，请刷新页面。');
      table.current.reload();
    } else {
      message.error('删除失败，请刷新页面。');
    }
  }

  const select = ({selectedRowKeys, selectedRows, onCleanSelected}) => {
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
          <a style={{marginInlineStart: 8}} onClick={onCleanSelected}>
            取消选择
          </a>
        </span>
      </Space>
    );
  };

  async function loadData(params) {
    const param = {
      page: params.current,
      size: params.pageSize,
    };
    if (params.id !== undefined) {
      param.id = params.id;
    }
    if (params.keyword !== undefined) {
      param.keyword = params.keyword;
    }
    const result = await getComment(param);

    return {
      data: result.data.records,
      success: result.code === 200,
      total: result.data.total,
    };
  }

  return (
    <PageContainer header={{title: false}} ghost>
      <Modal
        title={'回复'}
        open={displayReplyModal}
        okText={'提交'}
        onCancel={() => setDisplayModal(() => false)}
        onOk={() => submit()}>
        <TextArea onChange={e => setComment(pre => ({...pre, content: e.target.value}))} rows={10} />
      </Modal>
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
        // toolBarRender={toolBar}
      ></ProTable>
    </PageContainer>
  );
}

export default Index;
