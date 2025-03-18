const app = getApp();
Page({
  data: {
    userData: {}
  },
  onLoad() {
    app.wxRequest("GET", "/qa/getUserScore", null, res => {
      const { code, message, content } = res.data
      switch (code) {
        case 200:
          this.setData({ userData: content })
          break;

        default:
          break;
      }
    })
  },
  gotoRanking: function() {
    const token = wx.getStorageSync('token')
    if(!token){
      wx.reLaunch({
        url: '/pages/index/index' // 刷新首页
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/rankingPage/rankingPage'
    });
  }

});