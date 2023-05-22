import request from "../utils/request";

function getFriendList(params) {
  return request({
    url: '/friend/',
    params
  })
}

function addFriend(data) {
  return request({
    url: '/friend/',
    method: "post",
    data,
    successTip: false
  })
}

function updateFriend(data) {
  return request({
    url: '/friend/',
    method: "put",
    data,
    successTip: true
  })
}

function removeFriendLink(id) {
  if (typeof id === 'number') {
    return request({
      url: `/friend/`,
      params: { id: id },
      method: 'delete',
      errorTip: false
    });
  }
  const param = id.reduce(
    (pre, cur, idx) => pre + (idx === 0 ? `id=${cur}` : `&id=${cur}`),
    '?',
  );
  return request({
    url: `/friend/${param}`,
    method: 'delete',
    errorTip: false
  });
}
export {getFriendList, removeFriendLink, addFriend, updateFriend}
