import Request from '../utils/request';

function getAllTag() {
  return Request({
    url: '/tag/list',
    method: 'get',
  });
}

function updateTag(data) {
  return Request({
    url: '/tag/',
    method: 'put',
    data,
    successTip: true,
  });
}

function addTag(data) {
  return Request({
    url: '/tag/',
    method: 'post',
    data,
    successTip: true,
  });
}

function deleteTag(id) {
  return Request({
    url: '/tag/',
    method: 'delete',
    params: { id },
    successTip: true,
  });
}

export { getAllTag, updateTag, addTag, deleteTag };
