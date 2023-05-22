import {message} from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie'

// create an axios instance
const service = axios.create({
  baseURL: '/api', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
});

let successTip = false,
  errorTip = true;

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    successTip = config.successTip || false;
    if (config.errorTip !== undefined) {
      errorTip = config.errorTip;
    }
    if (Cookies.get('token')) {
      config.headers['token'] = Cookies.get('token');
    }
    return config;
  },
  (error) => {
    // do something with request error
    console.log('网络错误'); // for debug
    return Promise.reject(error);
  },
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data;
    if (res.code === 200) {
      if (successTip) {
        message.success(res.message);
      }
    } else if (res.code === 300) {
      Cookies.remove("token");
      message.info("请先登录。")
      window.location.hash = '/login'
    } else {
      if (errorTip) {
        if (res.data === res.message) {
          message.error(res.message);
        } else {
          if (res.data !== undefined && res.data !== null && res.data.length !== undefined) {
            for (let i = 0; i < res.data.length; i++) {
              message.error(res.data[i]);
            }
          } else {
            message.error(res.data);
          }
        }
      }
    }

    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    //
    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(new Error(res.message || 'Error'))
    // } else {
    //   return res
    // }
    return res;
  },
  (error) => {
    console.log('err' + error); // for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error);
  },
);

export default service;
