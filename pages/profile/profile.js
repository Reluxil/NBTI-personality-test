const app = getApp();

// 有趣的随机ID生成器
const FUNNY_PREFIXES = ['爱吃', '喜欢', '沉迷', '热爱', '追逐', '守护', '寻找', '迷失'];
const FUNNY_FOODS = ['紫菜包子', '草莓蛋糕', '抹茶拿铁', '焦糖布丁', '芒果冰沙', '芝士汉堡', '珍珠奶茶', '榴莲披萨'];
const FUNNY_SUFFIXES = ['的音符', '的猫咪', '的星星', '的旅人', '的骑士', '的法师', '的勇者', '的观察者'];
const FUNNY_AVATARS = ['🎭', '🌸', '⭐', '🎪', '🎨', '🎸', '🌙', '☀️', '🍀', '🔥', '💧', '⚡'];

function generateFunnyId() {
  const prefix = FUNNY_PREFIXES[Math.floor(Math.random() * FUNNY_PREFIXES.length)];
  const food = FUNNY_FOODS[Math.floor(Math.random() * FUNNY_FOODS.length)];
  const suffix = FUNNY_SUFFIXES[Math.floor(Math.random() * FUNNY_SUFFIXES.length)];
  return prefix + food + suffix;
}

function getAvatarForId(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash = hash & hash;
  }
  return FUNNY_AVATARS[Math.abs(hash) % FUNNY_AVATARS.length];
}

Page({
  data: {
    history: [],
    hasHistory: false,
    userId: '',
    userAvatar: '🎭'
  },

  onLoad() {
    // 生成或获取用户ID
    let userId = wx.getStorageSync('nbti_user_id');
    if (!userId) {
      userId = generateFunnyId();
      wx.setStorageSync('nbti_user_id', userId);
    }
    
    this.setData({
      userId,
      userAvatar: getAvatarForId(userId)
    });
  },

  onShow() {
    this.loadHistory();
  },

  loadHistory() {
    try {
      // 直接从本地存储读取原始完整数据
      const rawHistory = wx.getStorageSync('nbti_history') || [];
      console.log('Loaded history:', rawHistory.length, 'items');
      
      // 保留原始数据用于导航，同时添加格式化字段用于显示
      const formattedHistory = rawHistory.map(item => {
        var date = new Date(item.completedAt || item.answeredAt);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var mins = date.getMinutes();
        if (mins < 10) mins = '0' + mins;
        var timeStr = month + '月' + day + '日 ' + hours + ':' + mins;
        
        var icon = '🤖';
        if (item.character && item.character.badges && item.character.badges[0]) {
          var badgeStr = item.character.badges[0];
          if (badgeStr && typeof badgeStr === 'string') {
            var first = badgeStr.split(' ')[0] || '';
            // NBTI badge 格式为 "emoji 文字"，首个 token 是 emoji 才采用
            if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(first)) {
              icon = first;
            }
          }
        }
        
        return {
          // 保留原始完整数据（含 dimensionScores/radarData/rawScores 等）
          _raw: item,
          character: item.character || null,
          completedAt: item.completedAt || null,
          answeredAt: item.answeredAt || null,
          formattedTime: timeStr,
          characterIcon: icon
        };
      });
      
      this.setData({
        history: formattedHistory,
        hasHistory: formattedHistory.length > 0
      });
      
      console.log('Formatted history:', formattedHistory.length, 'items');
    } catch (e) {
      console.error('loadHistory error:', e);
      this.setData({
        history: [],
        hasHistory: false
      });
    }
  },

  onClearHistory() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有测试历史吗？',
      success: function(res) {
        if (res.confirm) {
          wx.removeStorageSync('nbti_history');
          if (app.globalData) {
            app.globalData.history = [];
          }
          this.setData({
            history: [],
            hasHistory: false
          });
          wx.showToast({
            title: '已清除',
            icon: 'success'
          });
        }
      }.bind(this)
    });
  },

  onViewHistory(e) {
    var index = e.currentTarget.dataset.index;
    var item = this.data.history[index];
    if (item) {
      // 使用原始完整数据（含 dimensionScores/radarData），而非格式化后的精简版
      var result = item._raw || item;
      wx.setStorageSync('nbti_current_result', result);
      wx.navigateTo({
        url: '/pages/result/result?skin=' + (result.skin || 'workplace')
      });
    }
  },

  onAbout() {
    wx.showModal({
      title: '关于 NBTI 牛马测试',
      content: 'NBTI (Niú Mǎ Type Indicator) 是基于真实职场场景的人格测试。通过30道模拟真实工作决策的题目，分析你的职场人格类型。\n\n四维度：能量(M/D)、做事(P/R)、态度(J/T)、表达(F/L)\n\n灵感来源：NBTI 牛马人格测试',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 查看图鉴
  onViewCollection() {
    wx.navigateTo({
      url: '/pages/collection/collection'
    });
  },

  // 查看组合
  onViewCombination() {
    wx.navigateTo({
      url: '/pages/combination/combination'
    });
  },

  onShareAppMessage: function() {
    return {
      title: 'NBTI 牛马测试 - 测测你是什么牛马',
      path: '/pages/index/index'
    };
  }
});
