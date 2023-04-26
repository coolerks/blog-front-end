import request from '../utils/request';

function mkdir(data) {
  return request({
    url: '/file/mkdir/',
    method: 'post',
    data,
  });
}

function getFileList(page, size, parentId) {
  return request({
    url: '/file/',
    method: 'get',
    params: { page, size, parentId },
  });
}

function deleteFiles(id) {
  if (typeof id === 'number') {
    return request({
      url: `/file/`,
      params: { id: id },
      method: 'delete',
      errorTip: true,
    });
  }
  const param = id.reduce(
    (pre, cur, idx) => pre + (idx === 0 ? `id=${cur}` : `&id=${cur}`),
    '?',
  );
  return request({
    url: `/file/${param}`,
    method: 'delete',
    errorTip: true,
  });
}

function downloadFile(id) {
  return request({
    url: `/file/download/id/`,
    method: 'get',
    params: { id },
    responseType: 'blob',
    onDownloadProgress: (e) => console.log(e),
  });
}

export { mkdir, getFileList, deleteFiles, downloadFile };
