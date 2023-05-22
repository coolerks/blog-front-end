import request from "../utils/request";
function login(params) {
  return request({
    url: '/admin/',
    method: 'post',
    params
  })
}

export {login}
