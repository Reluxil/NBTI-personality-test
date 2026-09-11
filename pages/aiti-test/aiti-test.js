const aitiEngine = require('../../utils/aiti-engine');
const app = getApp();

Page({
  data: {
    questions: [],
    currentIndex: 0,
    answers: {},
    currentQuestion: null,
    progress: 0,
    isComplete: false,
    totalQuestions: 0,
    selectedLevel: '',
    selectedSide: '',
    scenarioAnswer: { scene1: '', scene2: '', factor: '' }
  },

  onLoad() {
    const questions = aitiEngine.getQuestions();
    this.setData({ questions, totalQuestions: questions.length });
    this.loadQuestion(0);
  },

  // 加载某一题（恢复之前的作答）
  loadQuestion(index) {
    const q = this.data.questions[index];
    if (!q) return;
    const prev = this.data.answers[q.id];
    let selectedLevel = '';
    let selectedSide = '';
    let scenarioAnswer = { scene1: '', scene2: '', factor: '' };
    if (prev) {
      if (q.type === 'likert') {
        selectedLevel = prev.level || '';
        if (selectedLevel === 'va' || selectedLevel === 'a') selectedSide = 'A';
        else if (selectedLevel === 'b' || selectedLevel === 'vb') selectedSide = 'B';
      } else if (q.type === 'scenario') {
        scenarioAnswer = { scene1: prev.scene1, scene2: prev.scene2, factor: prev.factor };
      }
    }
    this.setData({
      currentIndex: index,
      currentQuestion: q,
      progress: Math.round((index / this.data.totalQuestions) * 100),
      selectedLevel,
      selectedSide,
      scenarioAnswer
    });
  },

  // Likert：只更新选中态，不自动前进
  onSelectLikert(e) {
    const level = e.currentTarget.dataset.level;
    let side = '';
    if (level === 'va' || level === 'a') side = 'A';
    else if (level === 'b' || level === 'vb') side = 'B';
    this.setData({ selectedLevel: level, selectedSide: side });
  },

  // 场景题：逐部分选择
  onScenarioChoice(e) {
    const part = e.currentTarget.dataset.part;
    const val = e.currentTarget.dataset.val;
    const scenarioAnswer = { ...this.data.scenarioAnswer, [part]: val };
    this.setData({ scenarioAnswer });
  },

  // 后一道：校验 + 保存 + 前进
  onNextQuestion() {
    const q = this.data.currentQuestion;
    if (!q) return;
    if (q.type === 'likert') {
      if (!this.data.selectedLevel) {
        wx.showToast({ title: '先选一个选项', icon: 'none' });
        return;
      }
      const answers = { ...this.data.answers, [q.id]: { level: this.data.selectedLevel } };
      this.advance(answers);
    } else {
      const sa = this.data.scenarioAnswer;
      if (!sa.scene1 || !sa.scene2 || !sa.factor) {
        wx.showToast({ title: '三个都要选哦', icon: 'none' });
        return;
      }
      const answers = { ...this.data.answers, [q.id]: { scene1: sa.scene1, scene2: sa.scene2, factor: sa.factor } };
      this.advance(answers);
    }
  },

  // 前一道
  onPrevQuestion() {
    if (this.data.currentIndex > 0) this.loadQuestion(this.data.currentIndex - 1);
  },

  advance(answers) {
    const nextIndex = this.data.currentIndex + 1;
    if (nextIndex >= this.data.totalQuestions) {
      this.setData({ answers, progress: 100, isComplete: true });
      this.calculateAndNavigate(answers);
    } else {
      this.setData({ answers });
      this.loadQuestion(nextIndex);
    }
  },

  calculateAndNavigate(answers) {
    wx.showLoading({ title: '分析中...', mask: true });
    setTimeout(() => {
      try {
        const result = aitiEngine.calculateResult(answers);
        app.saveHistory(result);
        wx.setStorageSync('nbti_current_result', result);
        wx.hideLoading();
        wx.redirectTo({ url: '/pages/aiti-result/aiti-result' });
      } catch (err) {
        wx.hideLoading();
        console.error('AITI calculate error:', err);
        wx.showToast({ title: '分析失败，请重试', icon: 'none', duration: 2000 });
      }
    }, 800);
  }
});
