App({
  globalData: {
    url: 'http://172.16.10.135:8090'
  },
  /**
* 封装wx.request请求
* method： 请求方式
* url: 请求地址
* data： 要传递的参数
* callback： 请求成功回调函数
* errFun： 请求失败回调函数
* token: token值
**/
  wxRequest(method, url, data, callback, errFun, token) {
    wx.request({
      url: this.globalData.url + url,
      method: method,
      data: data,
      header: {
        // application/x-www-form-urlencoded
        'content-type': 'application/json;charset=UTF-8',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      dataType: 'json',
      success: function (res) {
        callback(res);
      },
      fail: function (err) {
        console.log(err)
        errFun(err);
      }
    })
  },
})