import request from '../utils/request';

const api = '/article';
// {
//   return request({
//     url: `${api}/`
//   })
// }
function getArticle(id) {
  return request({
    url: `${api}/`,
    params: {
      id,
    },
  });
}

function listArticle(page, size, content) {
  return request({
    url: `${api}/list/${page}/${size}`,
    params: { content },
  });
}

function deleteArticle(id) {
  // console.log(typeof id);
  if (typeof id === 'number') {
    return request({
      url: `${api}/`,
      params: { id: id },
      method: 'delete',
      errorTip: false,
    });
  }
  const param = id.reduce(
    (pre, cur, idx) => pre + (idx === 0 ? `id=${cur}` : `&id=${cur}`),
    '?',
  );
  return request({
    url: `${api}/${param}`,
    method: 'delete',
    errorTip: false,
  });
}

function addArticle(data) {
  return request({
    url: `${api}/`,
    method: 'post',
    data,
    successTip: true,
  });
}

function updateArticle(data) {
  return request({
    url: `${api}/`,
    method: 'put',
    data,
    successTip: true,
  });
}

function getIdTitleMap() {
  return request({
    url: `${api}/list/all`,
    method: 'get',
  });
}

export {
  getArticle,
  listArticle,
  deleteArticle,
  addArticle,
  updateArticle,
  getIdTitleMap,
};
