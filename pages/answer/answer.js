const app = getApp();
Page({
  data: {
    questions: [],
    selectItems: []
  },
  onLoad: function () {
    let data = {};
    app.wxRequest('GET', '/qa/getQuestion', data, (res) => {
      const { code, message, content } = res.data
      switch (code) {
        case 200:
          this.setData({ questions: content })
          break;
        case 401:
          wx.removeStorageSync('token')
          wx.removeStorageSync('joinGroup')
          wx.showToast({
            title: message,
            icon: 'error',
            duration: 2000
          });
          setTimeout(() => { wx.navigateBack() }, 2000)
          break;
        case 500:
          wx.showModal({
            title: "抱歉",
            content: message,
            confirmText: "返回首页",
            showCancel: false,
            success() { wx.navigateTo({ url: '/pages/index/index' }) }
          })
          break;
        default:
          wx.showToast({
            title: message,
            icon: 'error',
            duration: 2000
          });
          setTimeout(() => { wx.navigateBack() }, 2000)
          break;
      }
    }, (err) => {
      console.log(err.errMsg)
    })
  },
  /**
   * 提交答案
   */
  submitAnswers() {
    // 提交答案
    if (Object.keys(this.data.selectItems).length === 10) {
      let data = this.data.selectItems;
      app.wxRequest('POST', '/qa/answer', data, (res) => {
        const { code, message, content } = res.data
        switch (code) {
          case 200:
            wx.navigateTo({
              url: '/pages/resultPage/resultPage',
              success: res => { res.eventChannel.emit('results', content) }
            });
            break;

          default:
            break;
        }
      }, (err) => {
      })
    } else {
      wx.showToast({
        title: "请全部答完再提交",
        icon: 'none',
        duration: 2000
      })
    }
  },
  radioChange(e) {
    const arr = e.detail.value.split(",");
    const index = Number(arr[0]);
    const id = Number(arr[1]);
    const value = arr[2];

    // 创建数组的副本，避免直接修改 this.data
    const newSelectItems = [...this.data.selectItems];

    // 检查是否存在匹配项
    const existingItem = newSelectItems.find(item => item.id === id);

    if (existingItem) {
      // 更新已存在项的 value
      existingItem.value = value;
    } else {
      // 不存在则添加新项
      newSelectItems.push({ index, id, value });
    }

    // 使用 setData 更新数据
    this.setData({ selectItems: newSelectItems });
  }
})