import request from '../utils/request';

function getCategoryByParentId(parentId) {
  return request({
    url: '/category/list',
    method: 'get',
    params: { parentId },
  });
}

function getCategoryById(id) {
  return request({
    url: '/category/',
    method: 'get',
    params: { id },
  });
}

function insertCategory(data) {
  return request({
    url: '/category/',
    method: 'post',
    data,
    successTip: true,
  });
}

function updateCategory(data) {
  return request({
    url: '/category/',
    method: 'put',
    data,
    successTip: true,
  });
}

function deleteCategory(id) {
  const param = id.reduce(
    (pre, cur, idx) => pre + (idx === 0 ? `id=${cur}` : `&id=${cur}`),
    '?',
  );
  return request({
    url: `/category/${param}`,
    method: 'delete',
    successTip: true,
  });
}

function getAllCategory() {
  return request({
    url: '/category/list',
    method: 'post',
  });
}

export {
  getCategoryByParentId,
  getCategoryById,
  insertCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
};
