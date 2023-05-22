import request from '../utils/request';

function getComment(params) {
  return request({
    url: '/comment/',
    method: 'get',
    params,
  });
}

function removeComment(id) {
  if (typeof id === 'number') {
    return request({
      url: `/comment/`,
      params: {id: id},
      method: 'delete',
      errorTip: false,
    });
  }
  const param = id.reduce(
    (pre, cur, idx) => pre + (idx === 0 ? `id=${cur}` : `&id=${cur}`),
    '?',
  );
  return request({
    url: `/comment/${param}`,
    method: 'delete',
    errorTip: false,
  });
}

function addComment(data) {
  return request({
    url: '/comment/admin/',
    method: 'post',
    data,
    successTip: true
  });
}

export {getComment, removeComment, addComment};
