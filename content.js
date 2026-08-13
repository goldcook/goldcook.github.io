// Edit this file to update the repeatable content on the homepage.
window.SITE_CONTENT = {
  facts: [
    {
      index: "01",
      value: "RL",
      label: "目前最常出现的关键词",
    },
    {
      index: "02",
      value: "3",
      label: "个公开仓库，慢慢增加中",
    },
    {
      index: "03",
      value: "∞",
      label: "个还没有答案的问题",
    },
  ],
  focuses: [
    {
      index: "01",
      title: "Reinforcement Learning",
      titleZh: "强化学习",
      question: "奖励能告诉智能体多少，又隐瞒了多少？",
      tags: ["Policy", "Offline RL", "Representation"],
    },
    {
      index: "02",
      title: "Multi-Agent Systems",
      titleZh: "多智能体系统",
      question: "当每个个体都在学习，协作如何真正发生？",
      tags: ["MARL", "Coordination", "Emergence"],
    },
    {
      index: "03",
      title: "Autonomous Agents",
      titleZh: "自主智能体",
      question: "如何让 Agent 不只完成一步，而是可靠地走完整段路？",
      tags: ["Planning", "Memory", "Evaluation"],
    },
  ],
  projects: [
    {
      index: "01",
      title: "v-d4rl",
      description: "在 Visual D4RL 环境里尝试不同算法，记录视觉离线强化学习的实验与实现。",
      language: "Research",
      href: "https://github.com/goldcook/v-d4rl",
      tone: "red",
    },
    {
      index: "02",
      title: "Auto-GPT",
      description: "对自主 GPT-4 实验项目的持续关注：让模型自己拆分目标、调用工具并迭代执行。",
      language: "Python",
      href: "https://github.com/goldcook/Auto-GPT",
      tone: "blue",
    },
    {
      index: "03",
      title: "start",
      description: "第一个 GitHub 练习仓库。所有复杂的系统，都从一次并不完美的开始出发。",
      language: "Python",
      href: "https://github.com/goldcook/start",
      tone: "ink",
    },
  ],
  notes: [
    {
      date: "NOW",
      title: "好的实验不是证明自己是对的。",
      body: "它应该让我们更快发现自己错在哪里，并留下足够清晰的证据让下一次尝试更聪明。",
    },
    {
      date: "NEXT",
      title: "把研究过程公开出来。",
      body: "不只展示最后一次成功运行，也记录选择问题、建立基线、推翻假设的过程。",
    },
    {
      date: "ALWAYS",
      title: "复杂不等于深刻。",
      body: "如果一个概念无法被讲清楚，也许我还没有真正理解它。",
    },
  ],
};
