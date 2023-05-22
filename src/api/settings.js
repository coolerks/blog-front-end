import request from "../utils/request";

function getCommentSettings() {
  return request({
    url: '/setting/comment',
    method: "get"
  })
}

function getBlogSettings() {
  return request({
    url: '/setting/blog',
    method: "get"
  })
}

function getUserSettings() {
  return request({
    url: '/setting/user',
    method: "get"
  })
}

function getSeoSettings() {
  return request({
    url: '/setting/seo',
    method: "get"
  })
}

function getGlobalSettings() {
  return request({
    url: '/setting/global',
    method: "get"
  })
}

function updateSettings(data) {
  return request({
    url: '/setting/',
    method: "put",
    data,
    successTip: true
  })
}

function getMenuSettings() {
  return request({
    url: '/setting/menu/',
    method: 'get'
  })
}

function updateMenuSettings(data) {
  return request({
    url: '/setting/menu/',
    method: 'put',
    data,
    successTip: true
  })
}

function getSecuritySettings() {
  return request({
    url: '/setting/security',
    method: "get"
  })
}

function modifyUsername(params) {
  return request({
    url: '/admin/username/',
    method: "put",
    params,
    successTip: true
  })
}
function modifyPassword(params) {
  return request({
    url: '/admin/password/',
    method: "put",
    params,
    successTip: true
  })
}

export {
  getCommentSettings,
  getBlogSettings,
  getUserSettings,
  getSeoSettings,
  getGlobalSettings,
  getSecuritySettings,
  updateSettings,
  getMenuSettings,
  updateMenuSettings,
  modifyUsername,
  modifyPassword
}
