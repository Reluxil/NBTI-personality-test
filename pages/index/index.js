const app = getApp();

Page({
  data: {
    currentTab: 'nbti',
    totalTests: 8888,
    hasHistory: false,
    latestResult: null
  },

  onLoad() {
    this.loadHistory();
    this.loadStats();
  },

  // 首页顶部 Tab 切换：牛马版 / 赛博版
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab !== this.data.currentTab) {
      this.setData({ currentTab: tab });
    }
  },

  onShow() {
    this.loadHistory();
    // 确保加载最新数据
    app.loadHistory();
  },

  loadHistory() {
    const history = app.globalData.history;
    if (history && history.length > 0) {
      this.setData({
        hasHistory: true,
        latestResult: history[0]
      });
    }
  },

  loadStats() {
    // 模拟加载统计数据
    // 实际应该从服务器获取
    const baseCount = 8888;
    const randomAdd = Math.floor(Math.random() * 100);
    this.setData({
      totalTests: baseCount + randomAdd
    });
  },

  onStartTest() {
    wx.navigateTo({
      url: '/pages/skin/skin'
    });
  },

  // 进入 AITI 赛博版测试（独立于 NBTI）
  onStartAiti() {
    wx.navigateTo({
      url: '/pages/aiti-test/aiti-test'
    });
  },

  onViewResult() {
    const latest = this.data.latestResult;
    if (latest && latest.testType === 'aiti') {
      wx.redirectTo({
        url: '/pages/aiti-result/aiti-result'
      });
    } else {
      wx.navigateTo({
        url: '/pages/result/result'
      });
    }
  },

  // 查看图鉴
  onViewCollection() {
    wx.navigateTo({
      url: '/pages/collection/collection'
    });
  },

  // 牛马组合
  onViewCombination() {
    wx.navigateTo({
      url: '/pages/combination/combination'
    });
  },

  onShareAppMessage() {
    return {
      title: '你的职场面具掉了！速来领取你的专属牛马标签🏷️',
      path: '/pages/index/index'
    };
  },

  onShareTimeline() {
    return {
      title: '你的职场面具掉了！速来领取你的专属牛马标签🏷️',
      query: ''
    };
  }
});
