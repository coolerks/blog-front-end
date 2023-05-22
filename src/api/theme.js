import Request from '../utils/request';

function getThemeList() {
  return Request({
    url: '/theme/',
    method: "get"
  })
}
function getNowTheme() {
  return Request({
    url: '/theme/use/',
    method: "get"
  })
}

function changeTheme(name) {
  return Request({
    url: `/setting/change/${name}`,
    method: "put"
  })
}

export {getThemeList, getNowTheme, changeTheme}
