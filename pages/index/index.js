const app = getApp();
Page({
  data: {
    buttons: [
      { icon: '/static/images/1.png', text: '每周问答' },
      { icon: '/static/images/2.png', text: '排行榜' },
      { icon: '/static/images/3.png', text: '我的积分' },
      { icon: '/static/images/4.png', text: '报名参加\n截至日期：2025年10月01日' }
    ],
    tipText: '',
    nowSelect: null,
    nickName: null,
    avatarUrl: null,
    loginSate: wx.getStorageSync('loginSate')
  },
  onLoad() { 
    if(wx.getStorageSync('loginSate')){
      this.setData({ loginSate: wx.getStorageSync('loginSate') }) 
    }else{
      wx.login({
        success: (res) => {
          if (res.code) {
            const obj = { register:false,code: res.code }
            // 将用户信息和code发送到后端
            app.wxRequest('POST', '/auth/login', obj, (res) => {
              console.log(res.data)
              const { code, content } = res.data
              const { token,groupName } = content
              if(token&&code==200){
                wx.setStorageSync('loginSate', true)
                wx.setStorageSync('token', token)
                if(groupName){
                 wx.setStorageSync('joinGroup', true)
                  wx.setStorageSync('groupName', groupName)
                }else{
                  wx.setStorageSync('joinGroup', false)
                }
                wx.hideLoading()
                this.setData({ 
                  loginSate: true 
                })
                wx.showToast({ title: '登录成功', icon: 'success', duration: 2000 });
              }
            })
          }
        }
      });

    }
  },
  chechAuth(url, index) {
    const joinGroup = wx.getStorageSync('joinGroup')
     if (!joinGroup) {
      this.setData({ tipText: '请报名参加', nowSelect: index })
    } else {
      wx.navigateTo({
        url: url
      });
    }
    setTimeout(() => { this.setData({ tipText: '', nowSelect: null }) }, 1000)
  },
  navigateToPage(event) {
    const index = event.currentTarget.dataset.index;
    const token = wx.getStorageSync('token')
    if(!token){
      wx.reLaunch({
        url: '/pages/index/index' // 刷新首页
      });
    }
    switch (index) {
      case 0:
        const joinGroup = wx.getStorageSync('joinGroup')
     if (!joinGroup) {
      this.setData({ tipText: '请报名参加', nowSelect: index })
      setTimeout(() => { this.setData({ tipText: '', nowSelect: null }) }, 1000)
      return;
       }
        app.wxRequest("GET", "/qa/homeStatus", null, res => {
          const { code, content } = res.data
          switch (code) {
            case 200:
              if (content.code !== 0) {
                this.setData({ tipText: content.message, nowSelect: index })
                setTimeout(() => { this.setData({ tipText: '', nowSelect: null }) }, 1000)
              } else { 
                this.chechAuth('/pages/answer/answer', index) }
              break;
            case 401:
              this.chechAuth('/pages/index/index', index)
              break;

            default:
              break;
          }
        })
        break;
      case 1:
        this.chechAuth('/pages/rankingPage/rankingPage', index)
        break;
      case 2:
        this.chechAuth('/pages/myQuestions/myQuestions', index)
        break;
      case 3:
        wx.navigateTo({
          url: '/pages/signupPage/signupPage'
        });
        break;
      default:
        break;
    }
  },
  getName(e) {
    this.setData({ nickName: e.detail.value })
    console.log(e.detail);
  },
  getAvatar(e) {
    this.setData({ avatarUrl: e.detail.avatarUrl })
  },
  onLogin() {
    wx.showLoading({ title: '正在请求授权' })
    wx.login({
      success: (res) => {
        const { nickName, avatarUrl } = this.data
        if (res.code && nickName) {
          const obj = { register:true, nickName, avatarUrl, code: res.code }
          // 将用户信息和code发送到后端
          app.wxRequest('POST', '/auth/login', obj, (res) => {
            const { code, message, content } = res.data
            switch (code) {
              case 200:
                const { token } = content
                wx.setStorageSync('loginSate', true)
                wx.setStorageSync('token', token)
                wx.hideLoading()
                wx.showToast({ title: '登录成功', icon: 'success', duration: 2000 });
                setTimeout(() => { this.setData({ loginSate: true }) }, 2000)
                break;

              default:
                break;
            }
          })
        }
        else {
          wx.showToast({
            title: '用户信息获取失败：' + res.errMsg,
            icon: 'none',
            duration: 2000
          });
        }
      }
    });
  }
})