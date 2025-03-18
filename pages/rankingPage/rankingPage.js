const app = getApp();
Page({
  data: {
    activeTab: 'personal',
    personalRankings: [],
    teamRankings: []
  },
  onLoad(){
    app.wxRequest("GET", "/qa/getUserRank", null, res => {
      const { code, message, content } = res.data
      switch (code) {
        case 200:
          this.setData({personalRankings: content})
          break;

        default:
          break;
      }
    })
    app.wxRequest("GET", "/qa/getGroupRank", null, res => {
      const { code, message, content } = res.data
      switch (code) {
        case 200:
          this.setData({teamRankings: content})
          break;

        default:
          break;
      }
    })
  },
  switchTab(event) {
    const tab = event.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  }
})