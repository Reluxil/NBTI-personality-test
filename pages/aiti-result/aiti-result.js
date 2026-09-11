const aitiEngine = require('../../utils/aiti-engine');

Page({
  data: {
    identity: null,
    routes: null,
    routePercents: null,
    levelLabels: { SS: '顶', S: '高', A: '中' }
  },

  onLoad() {
    const result = wx.getStorageSync('nbti_current_result');
    if (!result || result.testType !== 'aiti' || !result.identity) {
      wx.showToast({ title: '请先完成测试', icon: 'none' });
      setTimeout(() => wx.redirectTo({ url: '/pages/index/index' }), 1500);
      return;
    }
    this.setData({
      identity: result.identity,
      routes: result.routes,
      routePercents: result.routePercents
    });
  },

  onRetest() {
    wx.redirectTo({ url: '/pages/aiti-test/aiti-test' });
  },

  onBackHome() {
    wx.switchTab({ url: '/pages/index/index' });
  },

  onShareAppMessage() {
    const name = this.data.identity ? this.data.identity.name : '人机';
    return {
      title: '我居然是「' + name + '」！你是哪种AI赛博人格？来测一把 🤖',
      path: '/pages/index/index'
    };
  },

  onShareTimeline() {
    const name = this.data.identity ? this.data.identity.name : '人机';
    return {
      title: '我居然是「' + name + '」！你是哪种AI赛博人格？来测一把 🤖',
      query: ''
    };
  }
});
