import { ReloadOutlined } from '@ant-design/icons';
import { CheckCard } from '@ant-design/pro-components';
import { List as AntList, Divider, FloatButton, Tooltip, message } from 'antd';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getFileList } from '../api/file';

function CoverPicture(props) {
  const [fileList, setFileList] = useState([]);
  const [filesCount, setFilesCount] = useState(0);
  const [nowPage, setNowPage] = useState(1);

  useEffect(() => {
    appendFile();
  }, []);

  async function refresh() {
    const result = await getFileList(1, 50, 1);
    if (result.code === 200) {
      const { data } = result;
      setFileList((pre) => [...data.records]);
      setFilesCount(() => data.total);
      setNowPage((pre) => 2);
      message.loading('加载中');
    }
  }

  async function appendFile() {
    const result = await getFileList(nowPage, 50, 1);
    if (result.code === 200) {
      const { data } = result;
      setFileList((pre) => [...pre, ...data.records]);
      setFilesCount(() => data.total);
      setNowPage((pre) => pre + 1);
      message.loading('加载中');
    }
  }

  function showFileList() {
    return (
      <CheckCard.Group>
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
                    onClick={() => props.selectImage(item.name)}
                    style={{
                      width: 200,
                      height: 200,
                      overflow: 'hidden',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                    // onClick={() => handleClickFiles(item.id, item.folder, item.name)}

                    cover={
                      <img
                        height={200}
                        src={`/api/file/download/url?url=${encodeURI(
                          'file://local.img/' + item.name,
                        )}&compression=true`}
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
      <FloatButton
        icon={<ReloadOutlined />}
        onClick={refresh}
        type="primary"
        style={{ right: 24 }}
      />
      <div
        id="scrollableDivImages"
        style={{
          height: '90vh',
          overflow: 'auto',
          userSelect: 'none',
        }}
      >
        {showFileList()}
      </div>
    </>
  );
}

export default CoverPicture;
