// Edit this file to update the repeatable content on the homepage.
window.SITE_CONTENT = {
  siteEdition: {
    label: "第一版",
    date: "2026.09.12",
    isoDate: "2026-09-12",
  },
  mapAreas: [
    { name: "工作城镇", icon: "▣", x: 18, y: 30, target: "work" },
    { name: "学习营地", icon: "↑", x: 42, y: 20, target: "growth" },
    { name: "生活村落", icon: "⌂", x: 80, y: 30, target: "life" },
    { name: "思考高塔", icon: "?", x: 79, y: 70, target: "reflection" },
    { name: "来信驿站", icon: "@", x: 25, y: 70, target: "contact" },
    { name: "杂谈书屋", icon: "▤", x: 52, y: 82, target: "notes" },
  ],
  // These stay invisible until a future update adds public profiles or writing.
  socialLinks: [],
  notes: [],
  lifeStages: [
    { code: "CHAPTER 01", title: "儿时", summary: "在小镇长大。家人在身边，放学后的伙伴、山野和周末游戏，组成了一段快乐的童年。", tags: ["小镇", "家人", "玩乐与阅读"], x: 68, y: 76, accent: "peach", privateId: "childhood" },
    { code: "CHAPTER 02", title: "中学", summary: "离家越来越远，世界也越来越大。初中灿烂顺心，高中则多了一点压力、独处与成长。", tags: ["离乡", "游戏与音乐", "成长"], x: 32, y: 56, accent: "sun", privateId: "middleSchool" },
    { code: "CHAPTER 03", title: "大学", summary: "离开熟悉的环境，去看更大的世界。在人工智能与强化学习中探索，也在校园、科研与实践之间逐渐认识自己、走向现实。", tags: ["离家成长", "强化学习", "走向实践"], x: 68, y: 36, accent: "blue", privateId: "university" },
    { code: "CHAPTER 04 · NOW", title: "进入职场", summary: "刚进入算法工作，正在学习协作、使用 AI、建立专业能力，也在重新理解工作、生活和成年人的责任。", tags: ["算法工作", "AI 协作", "工作与生活"], x: 32, y: 16, accent: "coral", privateId: "career" },
  ],
  growthItems: [
    { code: "QUEST 01", icon: "WK", title: "学会工作", description: "在真实业务里学习协作、表达、判断和解决问题。" },
    { code: "QUEST 02", icon: "AI", title: "学习前沿", description: "关注 AI，继续理解强化学习，也学习怎样真正用好 AI。" },
    { code: "QUEST 03", icon: "+", title: "学会生活", description: "培养运动、理财等通用能力，让生活拥有更稳固的支点。" },
  ],
  sideQuests: [
    { icon: "♫", title: "音乐", subtitle: "MUSIC", description: "歌单很长，曲风很杂。喜欢听，也喜欢自己唱几句。", color: "peach" },
    { icon: "▣", title: "小说短剧", subtitle: "STORIES", description: "不一定深刻，但足够上头。休息有时候就是允许大脑暂时离线。", color: "cream" },
    { icon: "◆", title: "联机游戏", subtitle: "MULTIPLAYER", description: "竞技、合作、闹腾都行。重点不是输赢，而是朋友还在语音里。", color: "green" },
    { icon: "☁", title: "看云", subtitle: "CLOUD WATCHING", description: "没有目标，也没有打卡。只是偶尔抬头，看看今天的天空刷出了什么。", color: "sky" },
  ],
  // QQ_MUSIC_SYNC_START
  recentTracks: [
    { title: "画", artist: "赵雷", url: "https://y.qq.com/n/ryqq/songDetail/003ThnHE0lOP3W" },
    { title: "明明 (深爱着你)", artist: "丁肆Dicey", url: "https://y.qq.com/n/ryqq/songDetail/001quxhi3e5a9V" },
    { title: "All The Time", artist: "Bahamas", url: "https://y.qq.com/n/ryqq/songDetail/000k2wnT1wIw4M" },
  ],
  // QQ_MUSIC_SYNC_END
  bgmTracks: [
    {
      title: "下班后的云",
      subtitle: "舒缓模式",
      tempo: 360,
      lead: "sine",
      duration: 0.58,
      melody: [69, null, 73, null, 76, 73, null, 71, null, 68, null, 71, 74, null, 71, null],
      bass: [45, 42, 38, 40],
      bassEvery: 4,
      bassType: "triangle",
      accentEvery: 8,
    },
    {
      title: "散步练习",
      subtitle: "轻松模式",
      tempo: 235,
      lead: "triangle",
      duration: 0.18,
      melody: [64, 71, 67, 74, 66, 73, 69, 76, 64, 71, 67, 74, 62, 69, 66, 73],
      bass: [40, 47, 42, 45, 40, 47, 38, 45],
      bassEvery: 2,
      bassType: "sine",
      accentEvery: 4,
    },
    {
      title: "周末联机厅",
      subtitle: "欢快模式",
      tempo: 125,
      lead: "sawtooth",
      duration: 0.09,
      melody: [72, 72, 79, 76, 74, 74, 81, 79, 72, 76, 79, 84, 83, 79, 76, 74],
      bass: [36, 36, 43, 43, 41, 41, 38, 43],
      bassEvery: 2,
      bassType: "square",
      accentEvery: 2,
    },
  ],
  reflections: [
    { code: "SIGNAL 01", title: "工作不是全部", description: "认真工作，也要守住生活的边界，不让自己只剩下被消耗的状态。" },
    { code: "SIGNAL 02", title: "接受新的责任", description: "成为成年人，也开始更认真地理解家人、关系、选择和责任。" },
    { code: "SIGNAL 03", title: "想要怎样生活", description: "不只规划下一份工作，也在想更长远、更健康、更自由的生活方式。" },
  ],
};
