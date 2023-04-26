import {
  DeleteOutlined,
  FolderAddOutlined,
  HomeOutlined,
  InboxOutlined,
  ReloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { CheckCard } from '@ant-design/pro-components';
import {
  List as AntList,
  Avatar,
  Breadcrumb,
  Button,
  Divider,
  Dropdown,
  Input,
  Modal,
  Progress,
  Tooltip,
  message,
} from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { deleteFiles, getFileList, mkdir } from '../../../api/file';
import folder from '../../../assets/image/folder.png';
import { getImage } from '../../../utils/imageSuffixMapping';

let clickCount = 0;
let lastClick = 0;
let globalParentId = 0;

function List(props) {
  const [parentId, setParentId] = useState(0);
  const [displayMkdir, setDisplayMkdir] = useState(false);
  const [displayUpload, setDisplayUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [filesCount, setFilesCount] = useState(0);
  const [nowPage, setNowPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fileChecked, setFileChecked] = useState([]);
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState({
    name: '',
    progress: 0,
    status: false,
    total: 0,
    loaded: 0,
  });
  const [displayDownloadModal, setDisplayDownloadModal] = useState(false);
  const [pathList, setPathList] = useState([
    {
      title: (
        <a onClick={() => changePath(0)}>
          <HomeOutlined />
        </a>
      ),
      id: 0,
    },
  ]);
  const folderInput = useRef();
  const uploadProps = {
    name: 'multipartFiles',
    multiple: true,
    action: `http://localhost:29000/api/file/upload/?parentId=${parentId}`,
    onChange(info) {
      const { status } = info.file;
      if (status === 'uploading') {
        setUploading(() => true);
      }
      if (status === 'done') {
        setUploading(() => false);
        const { response } = info.file;
        if (response.code === 200) {
          const { data } = response;
          if (data.success.length === 1) {
            message.success(`${info.file.name} 上传完成.`);
          } else {
            if (data.fail.length === 1) {
              message.error(`${info.file.name} 上传失败.`);
            }
          }
          refreshFile();
        }
      } else if (status === 'error') {
        setUploading(() => false);
        message.error(`${info.file.name} 上传失败.`);
      }
      if (status === 'removed') {
        setUploading(() => false);
        message.info(`${info.file.name} 已在列表中移除.`);
      }
    },
    onDrop(e) {},
  };
  const rightClick = [
    {
      label: (
        <span onClick={() => refreshFile()}>
          <ReloadOutlined /> 刷新
        </span>
      ),
      key: 'reload',
    },
    {
      label: (
        <span onClick={() => setDisplayUpload(() => true)}>
          <UploadOutlined /> 上传文件
        </span>
      ),
      key: 'upload',
    },
    {
      label: (
        <span onClick={() => setDisplayMkdir(() => true)}>
          <FolderAddOutlined /> 创建文件夹
        </span>
      ),
      key: 'mkdir',
    },
    {
      label: (
        <span onClick={deleteCheckedFiles}>
          <DeleteOutlined /> 删除所选内容
        </span>
      ),
      key: 'delete',
      disabled: fileChecked.length === 0,
    },
  ];

  useEffect(() => {
    refreshFile();
  }, []);

  async function deleteCheckedFiles() {
    message.loading('正在删除');
    const result = await deleteFiles(fileChecked);
    if (result.code === 200) {
      message.success('删除成功！');
    }
    setTimeout(() => {
      refreshFile();
    }, 300);
  }

  async function changePath(id, title) {
    // if (id === globalParentId) {
    //   message.info("当前已在此目录下.")
    //   return;
    // }
    await refreshFile(id);

    setPathList(() => {
      if (id === undefined || title === undefined) {
        return [...pathList];
      }
      return [
        ...pathList,
        {
          title: <a onClick={() => changePath(id, title)}>{title}</a>,
          id,
        },
      ];
    });
  }

  async function appendFile() {
    const result = await getFileList(nowPage, 50, parentId);
    if (result.code === 200) {
      const { data } = result;
      setFileList((pre) => [...pre, ...data.records]);
      setFilesCount(() => data.total);
      setNowPage((pre) => pre + 1);
    }
  }

  async function refreshFile(id) {
    if (id !== null && id !== undefined) {
      setParentId(() => id);
      globalParentId = id;
    }
    const result = await getFileList(
      1,
      50,
      id === null || id === undefined ? parentId : id,
    );
    if (result.code === 200) {
      const { data } = result;
      setFileList(() => [...data.records]);
      setFilesCount(() => data.total);
      setNowPage(() => 2);
    }
  }

  async function handleMkdir() {
    const { value } = folderInput.current.input;
    if (value.trim().length > 0 && value.trim().length < 64) {
      const result = await mkdir({
        parentId,
        name: value.trim(),
      });
      const { data } = result;
      if (result.code === 200) {
        message.success(data);
        setDisplayMkdir(() => false);
        await refreshFile();
      }
    } else {
      message.error('文件夹名称不能为空，长度需要小于64个字符');
    }
  }

  function mkdirModal() {
    return (
      <Modal
        title="创建文件夹"
        width={340}
        onOk={handleMkdir}
        onCancel={() => setDisplayMkdir(() => false)}
        open={displayMkdir}
      >
        <div
          style={{
            height: 180,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <img style={{ width: 119 }} src={folder} alt="" />
          <Input ref={folderInput} placeholder="文件夹名称" />
        </div>
      </Modal>
    );
  }

  function uploadModal() {
    return (
      <Modal
        title="上传文件"
        cancelText={'隐藏'}
        closable={false}
        keyboard={false}
        open={displayUpload}
        footer={[
          <Button
            onClick={() => setDisplayUpload(() => false)}
            loading={uploading}
            type={'primary'}
            key={'ok'}
          >
            确定
          </Button>,
        ]}
      >
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">支持单个或批量上传。</p>
        </Dragger>
      </Modal>
    );
  }

  function downloadModal() {
    return (
      <Modal
        title="下载"
        closable={false}
        width={340}
        footer={[]}
        open={displayDownloadModal}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <Progress
            type="circle"
            percent={downloading.progress}
            format={() => (
              <img
                src={getImage(downloading.name, false)}
                style={{ width: 50 }}
                alt=""
              />
            )}
          />
          <p>{downloading.name}</p>
          <p>进度：{downloading.progress.toFixed(2)}%</p>
          <p>
            {(downloading.loaded / 1024 / 1024).toFixed(2)}MB/
            {(downloading.total / 1024 / 1024).toFixed(2)}MB
          </p>
          <p>
            如果您使用的是迅雷、IDM等第三方下载工具，上方的文件大小将显示为NAN的字样，请不必担心。
          </p>
        </div>
      </Modal>
    );
  }

  async function handleClickFiles(id, folder, name) {
    clickCount++;
    lastClick = setTimeout(async () => {
      clearTimeout(lastClick);
      if (clickCount === 1) {
      } else {
        if (folder) {
          setFileChecked([]);
          setPathList((pre) => [
            ...pre,
            {
              title: <a onClick={() => changePath(id, name)}>{name}</a>,
              id,
            },
          ]);
          setParentId(() => id);
          globalParentId = id;
          refreshFile(id);
        } else {
          // const result = await downloadFile(id);
          // console.log(result);
          setDisplayDownloadModal(() => true);
          setDownloading(() => ({ name, progress: 0, status: true }));
          axios({
            url: `http://localhost:29000/api/file/download/id/`,
            method: 'get',
            params: { id },
            responseType: 'blob',
            onDownloadProgress: (e) =>
              setDownloading((pre) => {
                // if (e.total )
                return {
                  ...pre,
                  progress: (e.loaded / e.total) * 100,
                  total: e.total,
                  loaded: e.loaded,
                };
              }),
            timeout: 3600000000,
          })
            .then((res) => {
              console.log('res===', res);
              let disposition = decodeURI(res.headers['content-disposition']);
              let fileName = disposition.substring(
                disposition.indexOf("''") + 2,
              );
              console.log(fileName);
              const elink = document.createElement('a');
              elink.download = fileName;
              elink.style.display = 'none';
              elink.href = URL.createObjectURL(res.data);
              document.body.appendChild(elink);
              elink.click();
              URL.revokeObjectURL(elink.href); // 释放URL 对象
              document.body.removeChild(elink);
              message.success('下载完成');
              setTimeout(() => {
                setDisplayDownloadModal(() => false);
              }, 3000);
            })
            .catch((e) => {
              message.info(
                '检测到文件没有通过内置的下载器下载，您可能使用了第三方的下载工具。',
                15,
              );
              setTimeout(() => {
                setDisplayDownloadModal(() => false);
              }, 6000);
            });
        }
      }
      clickCount = 0;
    }, 300);
  }

  function showFileList() {
    return (
      <CheckCard.Group onChange={(c) => setFileChecked(() => c)} multiple>
        <InfiniteScroll
          next={appendFile}
          scrollableTarget="scrollableDiv"
          hasMore={fileList.length < filesCount}
          endMessage={<Divider plain>已全部加载完毕</Divider>}
          dataLength={fileList.length}
        >
          <AntList
            style={{ margin: 'auto' }}
            grid={{
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 5,
              xxl: 5,
            }}
            dataSource={fileList}
            renderItem={(item) => (
              <Tooltip placement="bottom" title={item.name}>
                <AntList.Item style={{ margin: '0' }}>
                  <CheckCard
                    title={item.name}
                    value={item.id}
                    style={{
                      width: 200,
                    }}
                    onClick={() =>
                      handleClickFiles(item.id, item.folder, item.name)
                    }
                    avatar={
                      <Avatar
                        src={getImage(item.name, item.folder)}
                        shape="square"
                        size="large"
                      />
                    }
                  />
                </AntList.Item>
              </Tooltip>
            )}
          />
        </InfiniteScroll>
      </CheckCard.Group>
    );
  }

  return (
    <>
      <Breadcrumb items={pathList} />
      <br />
      {mkdirModal()}
      {uploadModal()}
      {downloadModal()}
      <Dropdown
        menu={{
          items: rightClick,
        }}
        trigger={['contextMenu']}
      >
        <div
          id="scrollableDiv"
          style={{
            height: '90vh',
            overflow: 'auto',
            userSelect: 'none',
          }}
        >
          {showFileList()}
        </div>
      </Dropdown>
    </>
  );
}

export default List;
