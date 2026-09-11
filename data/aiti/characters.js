// AITI 赛博版 角色与结果文案
// 结构：
//   IDENTITIES —— 7 个主身份（含 C+R = 人机），由三路线占优组合得出
//   EXTERNALS  —— 3 个情境外挂（Q19~Q22 决定因素驱动，人人可加载，与主身份无关）
//
// 文案来源：https://open.maic.chat/aiti/type/* 服务端配置（逆向抓取）

const IDENTITIES = [
  {
    id: 'gangjing',
    route: 'H',
    routeLabel: '路线 核验',
    name: '杠精本精',
    alias: '人形事实核查器',
    level: 'S',
    image: 'https://i-blog.csdnimg.cn/direct/bc581fdd609f40af981a3716f8f4a9e6.png',
    description: 'AI 每说一句，你脑子里都会自动弹出三个字：出处呢？',
    profile: '在别人眼里，AI 交的是答案；在你眼里，它交的是一份待审查文件。数字从哪来、原文到底怎么写、年份和适用对象对不对，你会顺着每条说法一路摸回源头。优秀只能让你多看两眼，证据链才能让你点头。AI 想在你面前一本正经地胡说，通常活不过第二轮追问。',
    aiComment: '和你合作的感觉，像每周都在接受一次突击审计。',
    quote: '「你这话，有来源吗？」',
    badges: ['证据嗅觉', '幻觉拦截', '一问到底'],
    warn: '不是每句话都值得立案侦查。点个外卖也查三篇论文，会让你的严谨变成加载动画。'
  },
  {
    id: 'baogongtou',
    route: 'C',
    routeLabel: '路线 校准',
    name: '数字包工头',
    alias: 'AI 流水线调度',
    level: 'S',
    image: 'https://i-blog.csdnimg.cn/direct/109612e2397546838eeb573f9ecdcda8.png',
    description: '机器负责搬砖，人负责拍板，活儿一个不落。',
    profile: '你不是在和 AI 聊天，你是在给整个人机工地排班。资料整理交给 AI，关键判断留给自己，涉及经验和责任的部分再拉真人一起定。你最擅长的不是「全都自己来」，也不是「一股脑外包」，而是让每段任务都进到最合适的处理器里。别人开一个对话框，你开的是项目现场。',
    aiComment: 'TA 不是在用我，TA 是在给我排班。',
    quote: '「这块你（AI）来，那段我来，deadline 我定。」',
    badges: ['任务拆解', '边界清楚', '调度在线'],
    warn: '排班表再漂亮，也不能只看「已完成」。关键工序仍要抽查，不然 AI 可能准时交来一车精装废品。'
  },
  {
    id: 'yuanmouren',
    route: 'R',
    routeLabel: '路线 再造',
    name: '赛博元谋人',
    alias: '去 AI 味工程师',
    level: 'A',
    image: 'https://i-blog.csdnimg.cn/direct/bff2af848dfc4a238ef5ec59d27a498c.png',
    description: '别人用 AI 生成内容，你负责让内容「洗心革面」。',
    profile: '你对「放之四海皆准」的 AI 腔有天然排异反应。模板可以用，但必须塞回这一次的对象、场景和语气里；草稿可以留，但要改到看不出出厂设置。AI 给你的是半成品，你补上人味、关系、细节和只有当事人才知道的那一点别扭。你不是拒绝技术，你只是拒绝让所有人说同一种机器话。',
    aiComment: '我负责写第一稿，TA 负责让我从成稿里消失。',
    quote: '「这话像我说的吗？不像，重写。」',
    badges: ['去 AI 味', '情境重塑', '人味返厂'],
    warn: '把假数据润色得很动人，只会翻得更漂亮。重新做人之前，先确认原料不是编的。'
  },
  {
    id: 'jiaofu',
    route: 'HC',
    routeLabel: '路线 核验 / 校准',
    name: '教父',
    alias: '既查又派的操盘手',
    level: 'S',
    image: 'https://i-blog.csdnimg.cn/direct/9ff7581a01794815a7edec0befb0a457.png',
    description: '凯撒的归凯撒，罗马的归罗马；活儿可以外包，做决定我说了算。',
    profile: '你不是在向 AI 要答案，而是在给 AI 家族立规矩：事实、数据和关键来源必须亲自过目，整理、搬运和重复劳动放心交给 AI。谁负责查证，谁负责执行，哪一段可以放手，哪一个节点必须由你拍板，开工前已经安排得明明白白。AI 可以成为你的军师和执行队，但最终决定权始终留在你手里。',
    aiComment: 'TA 不是来问我答案的，是来安排我在家族里坐哪把椅子的。',
    quote: '「我会给你一个无法拒绝的……核对清单。」',
    badges: ['规则制定', '知人善任', '最终裁决'],
    warn: '掌控全局不等于事事亲批。边界划得太细、每一步都等你签字，家族企业也会卡在审批流里。把精力留给真正影响结论的关键节点。'
  },
  {
    id: 'zuoqiang',
    route: 'HR',
    routeLabel: '路线 核验 / 再造',
    name: '嘴强王者',
    alias: '查完再说的表达派',
    level: 'A',
    image: 'https://i-blog.csdnimg.cn/direct/8ba5db9c211e42578aeed6eed5a80f8c.png',
    description: '嘴上说「你编的吧」，手上已经把出处查完、终稿改完。',
    profile: '你和 AI 的关系是一种高质量互呛：它负责提供线索和底稿，你负责查清真假，再把能用的部分炼成真正适合当下的表达。你既不肯吃二手瓜，也不满足于搬运原文；真相要亲眼确认，故事也要亲手讲好。你不轻易夸 AI 靠谱，但每次都能把它用得比盲信的人更靠谱。',
    aiComment: 'TA 嘴上从来不信我，最后成稿却总有我的工位。',
    quote: '「我说的话，既经得起查，也像我说的。」',
    badges: ['边查边改', '真相加工', '口嫌体正直'],
    warn: '赶时间时最容易先被叙事手感带走。成稿可以晚一点，没核完的细节不要跟着排版一起发出去。'
  },
  {
    id: 'renji',
    route: 'CR',
    routeLabel: '路线 校准 / 再造',
    name: '人机',
    alias: '八只手都归你管',
    level: 'S',
    image: 'https://i-blog.csdnimg.cn/direct/717adf820b48435a926e0bb436e0fd79.png',
    description: 'AI 负责长出八只手，你负责决定每只手该拿什么。',
    profile: '你不满足于偶尔叫 AI 帮个忙，而是会把它装进自己设计的整套系统。任务怎么拆、哪一步自动跑、哪里必须由人接管、最后怎样长成贴合场景的版本，都按你的图纸运转。AI 是引擎、插件和外接手臂，你掌握方向盘，也负责让最终产物仍然带着人的意图。',
    aiComment: '我只是发动机，图纸和方向盘从来不在我这里。',
    quote: '「我只是发动机，图纸和方向盘从来不在我这里。」',
    badges: ['系统设计', '人机协同', '定制输出'],
    warn: '流程越顺，越容易忘记检查引擎。自动化不会消灭错误，只会让错误跑得更快。'
  },
  {
    id: 'schrodinger',
    route: 'HCR',
    routeLabel: '路线 核验 / 校准 / 再造',
    name: '薛定谔的猫',
    alias: '全都要的全能态',
    level: 'SS',
    image: 'https://i-blog.csdnimg.cn/direct/1984db1b695d4127b433a80157476287.png',
    description: '你正处于量子纠缠态……',
    profile: '核验、校准、重写三条路线在你这里正好打平。重要信息来了，你可能先追出处；复杂任务来了，你可能先拆分工；通用答案来了，你又会把它改成自己的版本。',
    aiComment: '每次和 TA 合作前，我都不知道自己会被审讯、派活，还是整段重写。',
    quote: '「你猜我现在是哪条路线？——不猜对你就永远不知道。」',
    badges: ['多态并存', '场景坍缩', '无法归类'],
    warn: '多种可能同时在线很灵活，也可能让每次起手都重新纠结。可以观察自己在高压、赶时间或高风险场景下最先做什么，那通常是藏在盒子深处的默认状态。'
  }
];

const EXTERNALS = [
  { name: '放着我来', trigger: 'AI 近期表现不稳定，时好时坏', effect: '靠谱就放手，继续翻车就接管，放着我来，"好事还需善人做"，不指望 AI 全接管。' },
  { name: '让我调停', trigger: '材料都可信，但是材料之间自相矛盾', effect: '材料打架我先别站队，观点本来就会各有不同，事实判断推不出价值判断，调停一下，再做判断。' },
  { name: '再来一瓶', trigger: '内容可能都对，但是成品可能有很多人看', effect: '虽然可能过于小心翼翼了，虽然可能会做得慢一些，但用了 AI 我真不敢保证 100% 靠谱，为了最小降低对别人的影响，"再来一瓶"吧。' }
];

function getIdentity(id) {
  return IDENTITIES.find(i => i.id === id) || IDENTITIES[IDENTITIES.length - 1];
}

module.exports = { IDENTITIES, EXTERNALS, getIdentity };
