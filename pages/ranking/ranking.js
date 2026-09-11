const { CHARACTERS } = require('../../data/characters');
const { IDENTITIES } = require('../../data/aiti/characters');

Page({
  data: {
    currentTab: 'nbti',
    rankings: [],
    nbtiRankings: [],
    aitiRankings: [],
    totalPeople: 12847
  },

  onLoad() {
    this.generateRankings();
  },

  generateRankings() {
    const nbtiRankings = CHARACTERS
      .map((char, index) => ({
        id: char.id,
        name: char.name,
        alias: char.alias,
        level: char.level,
        badges: char.badges || [],
        count: Math.floor(Math.random() * 3000) + 500,
        rank: index + 1
      }))
      .sort((a, b) => b.count - a.count)
      .map((item, index) => ({ ...item, rank: index + 1 }));

    const aitiRankings = IDENTITIES
      .map((char, index) => ({
        id: char.id,
        name: char.name,
        alias: char.alias,
        level: char.level,
        badges: char.badges || [],
        count: Math.floor(Math.random() * 2000) + 300,
        rank: index + 1
      }))
      .sort((a, b) => b.count - a.count)
      .map((item, index) => ({ ...item, rank: index + 1 }));

    this.setData({
      nbtiRankings,
      aitiRankings,
      rankings: nbtiRankings
    });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab !== this.data.currentTab) {
      this.setData({
        currentTab: tab,
        rankings: tab === 'aiti' ? this.data.aitiRankings : this.data.nbtiRankings
      });
    }
  },

  onItemTap(e) {
    const charId = e.currentTarget.dataset.id;
    const list = this.data.currentTab === 'aiti' ? this.data.aitiRankings : this.data.nbtiRankings;
    const item = list.find(c => c.id === charId);
    if (item) {
      wx.showModal({
        title: item.name,
        content: `${item.alias}\n\n${item.description || ''}\n\n"${item.quote || ''}"`,
        showCancel: false,
        confirmText: '知道了'
      });
    }
  },

  onShareAppMessage() {
    return {
      title: 'NBTI 牛马排行榜 - 看看大家都是什么牛马',
      path: '/pages/index/index'
    };
  }
});
