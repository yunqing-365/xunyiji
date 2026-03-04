/* ============================================================
   寻遗集 · data/scenes.js
   14 个区域完整配置
   包含：基础信息 / 场景枢纽动作 / 沉浸式探索地图配置
   ============================================================ */

const sceneConfig = {

  /* ════════════════════════════════════════
     国风核心区（8个）
     ════════════════════════════════════════ */

  /* ── 1. 万艺城 ── */
  wanyicheng: {
    /* 基础信息 */
    key:      'wanyicheng',
    title:    '万艺城',
    subtitle: '古典戏曲中枢',
    desc:     '国风元宇宙的核心之地，亭台楼阁错落有致，戏班锣鼓喧天。这里是昆曲、京剧、越剧等非遗戏曲的传承之地。你可以在此定制戏曲形象，绘制脸谱，聆听百年唱腔，或是在茶馆里看一折热闹的折子戏。',
    bgColor:  '#5b4033',
    bgImage:  'assets/unnamed (2).jpg',
    anchorPos: { top: '48%', left: '50%' },
    anchorIcon: '🏮',
    anchorTheme: 'anchor-red',
    mapTheme: 'theme-ancient',
    weather: { type: 'clear', icon: '🌤️' },

    /* 场景枢纽动作按钮 */
    actions: [
      { icon: '🎭', name: '脸谱绘制',   desc: '亲手绘制戏曲脸谱',         func: 'handleAction("minigame","lianlv")' },
      { icon: '🎤', name: '戏台听曲',   desc: '聆听经典戏曲选段',         func: 'handleAction("listen","wanyicheng")' },
      { icon: '👘', name: '戏服换装',   desc: '定制专属戏曲形象',         func: 'switchMainView("view-profile")' },
      { icon: '🔍', name: '街巷漫游',   desc: '进入万艺城街巷沉浸探索',   func: 'startExploration("wanyicheng")' },
      { icon: '⛩️', name: '拜访工坊',   desc: '前往天工阁拜师研习',       func: 'goToWorkshop()' },
      { icon: '🏪', name: '梨园商铺',   desc: '购买戏曲相关道具材料',     func: 'openShop()' },
    ],

    /* 沉浸式探索地图配置 */
    exploration: {
      /* 地图尺寸（虚拟坐标系，单位px） */
      mapWidth:  2400,
      mapHeight: 1600,

      /* 背景图层（远→近，三层视差） */
      layers: [
        { z: 1, parallax: 0.15, bg: '#8b6348', texture: 'https://www.transparenttextures.com/patterns/old-paper.png', opacity: 0.5 },
        { z: 2, parallax: 0.4,  bg: '#7a5030', texture: 'https://www.transparenttextures.com/patterns/wood-pattern.png', opacity: 0.6 },
        { z: 3, parallax: 1.0,  bg: '#6b4020', texture: 'https://www.transparenttextures.com/patterns/natural-paper.png', opacity: 0.8 },
      ],

      /* 玩家出生点 */
      spawnPoint: { x: 600, y: 800 },

      /* 交互节点列表 */
      nodes: [
        {
          id: 'wanyicheng_npc_laoban',
          type: 'npc',
          icon: '🧑‍🎤',
          label: '戏班班主',
          pos: { x: 900,  y: 500 },
          floatDelay: '0s',
          data: {
            name: '陈老板',
            role: '梨园戏班班主',
            avatar: '🧑‍🎤',
            isAI: false,
            dialog: [
              { text: '客官，这是我们梨园班的老规矩——想进场听戏，先得对上一段！你可曾听过昆曲《牡丹亭》？', options: ['听过，太美了！', '第一次来，请介绍', '我想拜师学习'] },
              { text: '好眼力！昆曲被称为"百戏之祖"，起源于600年前的江南。一腔一调，皆是千年的积淀……', options: ['继续听', '我想看演出', '告辞'] },
            ],
          },
        },
        {
          id: 'wanyicheng_npc_hualian',
          type: 'npc',
          icon: '🎭',
          label: '花脸艺人',
          pos: { x: 1400, y: 700 },
          floatDelay: '1s',
          data: {
            name: '张花脸',
            role: '脸谱非遗传承人',
            avatar: '🎭',
            isAI: true,
            aiPersonality: '博学的非遗传承人，热爱分享脸谱文化，语气温文儒雅，偶尔引用戏曲台词',
            bindInheritorId: 5,
            dialog: [
              { text: '这位游侠，老夫的脸谱已绘了四十载。每一道色彩都有其含义——红表忠义，黑表刚正，白表奸诈。你想了解哪一色？', options: ['红色脸谱', '黑色脸谱', '白色脸谱', '都想了解'] },
            ],
          },
        },
        {
          id: 'wanyicheng_workshop_xiqushop',
          type: 'workshop',
          icon: '⛩️',
          label: '梨园工坊',
          pos: { x: 500,  y: 350 },
          floatDelay: '0.5s',
          data: {
            bindInheritorId: 5,  /* 张皮影匠师 */
            name: '梨园工坊',
            desc: '皮影戏 · 脸谱 · 戏服定制',
          },
        },
        {
          id: 'wanyicheng_collect_qupu',
          type: 'collect',
          icon: '📜',
          label: '曲谱残页',
          pos: { x: 1700, y: 400 },
          floatDelay: '1.5s',
          data: {
            itemName: '昆曲曲谱',
            itemIcon: '📜',
            itemType: 'collection',
            count: 1,
            rarity: 3,
            desc: '残破的昆曲曲谱，记载着失传的腔调',
            respawnSecs: 600,
          },
        },
        {
          id: 'wanyicheng_collect_sifu',
          type: 'collect',
          icon: '🧵',
          label: '丝服碎布',
          pos: { x: 300,  y: 1100 },
          floatDelay: '2s',
          data: {
            itemName: '戏服丝料',
            itemIcon: '🧵',
            itemType: 'material',
            count: 3,
            rarity: 2,
            desc: '戏班丢落的彩色丝料',
            respawnSecs: 300,
          },
        },
        {
          id: 'wanyicheng_hidden_guqin',
          type: 'hidden',
          icon: '✨',
          label: '???',
          pos: { x: 2100, y: 300 },
          floatDelay: '0.3s',
          data: {
            triggerDesc: '你在戏台后场的角落发现了一把落灰的古琴，轻轻拨弦，竟发出余音绕梁的声响……',
            rewardItem: '古琴琴弦',
            rewardIcon: '🎸',
            rewardCount: 1,
            rarity: 4,
            questTrigger: 'side_qupu_collect',
          },
        },
        {
          id: 'wanyicheng_rest_chaguan',
          type: 'rest',
          icon: '🍵',
          label: '茶馆',
          pos: { x: 1100, y: 1200 },
          floatDelay: '2.5s',
          data: {
            name: '清韵茶馆',
            desc: '在此休憩可恢复体力，偶尔听到说书人讲九州奇闻',
            healAmount: 30,
            randomEvent: true,
          },
        },
        {
          id: 'wanyicheng_game_toupot',
          type: 'game',
          icon: '🎯',
          label: '投壶摊',
          pos: { x: 1900, y: 1100 },
          floatDelay: '1.8s',
          data: {
            gameType: 'toupot',
            name: '投壶游戏',
            desc: '传统民俗小游戏，赢取灵石奖励',
          }
        }, 
        {
          id: 'wyc_ghost_market',
          type: 'shop',
          icon: '🏮',
          label: '子夜鬼市',
          pos: { x: 1900,  y: 400 },
          spawnTime: 'night', // 🌟 限定只有子夜 (night) 才会出现
          floatDelay: '0s'
        },

        // ... (万艺城原有的节点)
        // 🌟 新增：大遗忘废墟节点
        {
          id: 'wyc_ruin_stage',
          type: 'ruin',
          icon: '🏚️',
          label: '破败的古戏台',
          pos: { x: 500, y: 1000 },
          floatDelay: '0.2s',
          data: {
            requireItem: '苏绣青皮团扇', // 修复需要的关键灵物
            hint: '耳畔隐约传来幽咽的戏腔，戏台四周被灰败的迷雾笼罩，似乎已经被世人遗忘了百年。若有一件雅致风流的【苏绣青皮团扇】作为镇物，或许能唤醒当年的戏魂...',
            
            // 修复后蜕变成的新节点信息
            restoredType: 'npc',
            restoredIcon: '💃',
            restoredLabel: '全息青衣幻影',
            restoredData: {
              name: '绝代青衣',
              role: '万艺城地缚灵',
              avatar: '💃',
              dialog: [
                { text: '"多谢寻遗使点亮此地...百年的迷雾终于散去。从今往后，这戏台便为你一人而开。"', options: ['原来你一直在这里', '请为我唱一曲'] },
                { text: '"原来姹紫嫣红开遍，似这般都付与断井颓垣... 幸好，你来了。"', options: ['离开'] }
              ]
            }
          }
        }
      ],

      /* 不可进入区域（碰撞区，虚拟坐标） */
      blockedZones: [
        { x: 0,    y: 0,    w: 2400, h: 80  }, /* 上边界 */
        { x: 0,    y: 1520, w: 2400, h: 80  }, /* 下边界 */
        { x: 700,  y: 200,  w: 400,  h: 300 }, /* 戏台主台 */
        { x: 400,  y: 250,  w: 200,  h: 150 }, /* 戏台侧台 */
      ],
    },
  },

  /* ── 2. 百味巷 ── */
  baiweixiang: {
    key:      'baiweixiang',
    title:    '百味巷',
    subtitle: '市井烟火美食街',
    desc:     '千年不熄的市井烟火，汇聚了全国各地的非遗美食与老字号。从江南糕点到北方面食，从川渝卤味到闽粤茶点，在这里你可以体验传统美食制作，收集食材，解锁非遗美食图鉴。',
    bgColor:  '#8b5a2b',
    bgImage:  "assets/unnamed (3).jpg",
    anchorPos:  { top: '42%', left: '45%' },
    anchorIcon: '🍡',
    anchorTheme: '',
    mapTheme: 'theme-ancient',
    weather: { type: 'clear', icon: '☀️' },

    actions: [
      { icon: '🍘', name: '美食制作',   desc: '体验非遗美食制作小游戏', func: 'handleAction("minigame","food")' },
      { icon: '🥟', name: '百味图鉴',   desc: '解锁美食收集图鉴',       func: 'switchMainView("view-inventory")' },
      { icon: '🔍', name: '街巷漫游',   desc: '进入百味巷市井沉浸探索', func: 'startExploration("baiweixiang")' },
      { icon: '🏪', name: '食材商铺',   desc: '购买各类食材原料',       func: 'openShop()' },
      { icon: '👨‍🍳', name: '拜师名厨',  desc: '学习非遗烹饪技艺',       func: 'goToWorkshop()' },
      { icon: '🍻', name: '酒肆听书',   desc: '酒肆中听江湖故事',       func: 'handleAction("listen","baiweixiang")' },
    ],

    exploration: {
      mapWidth: 2200, mapHeight: 1500,
      layers: [
        { z: 1, parallax: 0.15, bg: '#aa7a40', texture: 'https://www.transparenttextures.com/patterns/wood-pattern.png', opacity: 0.45 },
        { z: 2, parallax: 0.4,  bg: '#8b5a28', texture: 'https://www.transparenttextures.com/patterns/old-paper.png',   opacity: 0.6 },
        { z: 3, parallax: 1.0,  bg: '#6b3a18', texture: 'https://www.transparenttextures.com/patterns/natural-paper.png', opacity: 0.85 },
      ],
      spawnPoint: { x: 500, y: 750 },
      nodes: [
        { id: 'bwx_npc_chef',       type: 'npc',      icon: '👨‍🍳', label: '老字号掌柜', pos: { x: 900,  y: 550 }, floatDelay: '0s',   data: { name: '李掌柜', role: '百年老字号传人', avatar: '👨‍🍳', isAI: true,  aiPersonality: '热情豪爽的美食家，满口美食典故，喜欢考验顾客对传统美食的了解',  bindInheritorId: null, dialog: [] } },
        { id: 'bwx_npc_shuoshu',    type: 'npc',      icon: '🎙️', label: '说书人',    pos: { x: 1600, y: 400 }, floatDelay: '1s',   data: { name: '王说书', role: '评书艺人',    avatar: '🎙️', isAI: false, bindInheritorId: null, dialog: [{ text: '话说那年烟花三月，九州大地上突然出现了一位身怀绝技的游侠……你想听哪段？', options: ['九州奇闻', '非遗传说', '下次再听'] }] } },
        { id: 'bwx_workshop_mian',  type: 'workshop', icon: '⛩️', label: '面点工坊', pos: { x: 400,  y: 350 }, floatDelay: '0.5s', data: { bindInheritorId: null, name: '面点工坊', desc: '传统面点制作体验' } },
        { id: 'bwx_collect_spice',  type: 'collect',  icon: '🌶️', label: '香料堆',   pos: { x: 1300, y: 800 }, floatDelay: '1.5s', data: { itemName: '五香料', itemIcon: '🌶️', itemType: 'material', count: 5, rarity: 1, desc: '市集散落的香料', respawnSecs: 180 } },
        { id: 'bwx_collect_cake',   type: 'collect',  icon: '🍘', label: '点心盒',   pos: { x: 700,  y: 1100 }, floatDelay: '2s',  data: { itemName: '糕点材料', itemIcon: '🍘', itemType: 'material', count: 3, rarity: 1, desc: '老字号留下的点心配方材料', respawnSecs: 240 } },
        { id: 'bwx_hidden_recipe',  type: 'hidden',   icon: '✨', label: '???',       pos: { x: 2000, y: 600 }, floatDelay: '0.8s', data: { triggerDesc: '你在老灶台后发现了一张泛黄的秘方纸，上面记载着失传百年的"九层糕"做法……', rewardItem: '秘方残页', rewardIcon: '📜', rewardCount: 1, rarity: 4, questTrigger: null } },
        { id: 'bwx_rest_jiuzhan',   type: 'rest',     icon: '🍻', label: '酒肆',     pos: { x: 1800, y: 1100 }, floatDelay: '2.5s', data: { name: '醉仙楼', desc: '一碗老酒，听说书人讲九州奇闻', healAmount: 25, randomEvent: true } },
      ],
      blockedZones: [
        { x: 0, y: 0, w: 2200, h: 80 },
        { x: 0, y: 1420, w: 2200, h: 80 },
      ],
    },
  },

  /* ── 3. 青岚界 ── */
  qinglanjie: {
    key:      'qinglanjie',
    title:    '青岚界',
    subtitle: '山水茶道隐修地',
    desc:     '竹林深处的隐世之地，青山环抱，流水潺潺。这里是茶道、香道、古琴、书法等文人四艺的传承之所，你可以在此品茗听琴，焚香静坐，远离尘世喧嚣，感受东方文人的雅致生活。',
    bgColor:  '#2d4a41',
    bgImage:  "assets/unnamed (4).jpg",
    anchorPos:  { top: '38%', left: '55%' },
    anchorIcon: '🍵',
    anchorTheme: 'anchor-jade',
    mapTheme: 'theme-forest',
    weather: { type: 'mist', icon: '🌫️' },

    actions: [
      { icon: '🍵', name: '茶道研习',   desc: '体验宋代点茶技艺',         func: 'handleAction("minigame","tea")' },
      { icon: '🎐', name: '香道体验',   desc: '学习传统合香技艺',         func: 'handleAction("minigame","incense")' },
      { icon: '🎸', name: '古琴弹奏',   desc: '聆听千年古琴名曲',         func: 'handleAction("listen","qinglanjie")' },
      { icon: '🔍', name: '竹林漫游',   desc: '进入青岚界山水沉浸探索',   func: 'startExploration("qinglanjie")' },
      { icon: '⛩️', name: '拜访茶寮',   desc: '前往天工阁研习茶道',       func: 'goToWorkshop()' },
      { icon: '📖', name: '藏书阁',     desc: '查阅古籍善本',             func: 'handleAction("read","qinglanjie")' },
    ],

    exploration: {
      mapWidth: 2600, mapHeight: 1800,
      layers: [
        { z: 1, parallax: 0.1,  bg: '#1a3a2a', texture: 'https://www.transparenttextures.com/patterns/subtle-grass.png', opacity: 0.4 },
        { z: 2, parallax: 0.35, bg: '#2d4a38', texture: 'https://www.transparenttextures.com/patterns/grass.png',       opacity: 0.65 },
        { z: 3, parallax: 1.0,  bg: '#3a5a42', texture: 'https://www.transparenttextures.com/patterns/natural-paper.png', opacity: 0.8 },
      ],
      spawnPoint: { x: 700, y: 900 },
      nodes: [
        { id: 'qlj_npc_yinshi',    type: 'npc',      icon: '🧙‍♂️', label: '抚琴隐士', pos: { x: 1200, y: 500 }, floatDelay: '0s',   data: { name: '无名隐士', role: '古琴传承者', avatar: '🧙‍♂️', isAI: true, aiPersonality: '超脱世外的隐者，言语禅意十足，以古琴为载体传递人生哲学', bindInheritorId: 4, dialog: [] } },
        { id: 'qlj_npc_charen',    type: 'npc',      icon: '🍵', label: '茶艺人',   pos: { x: 600,  y: 700 }, floatDelay: '0.8s', data: { name: '周茶娘', role: '茶道传承人', avatar: '🍵', isAI: false, bindInheritorId: null, dialog: [{ text: '这位游侠，老身的普洱已经醒了三年。喝一盏？', options: ['谢谢，好茶！', '请赐教茶道', '我想学泡茶'] }] } },
        { id: 'qlj_workshop_tea',  type: 'workshop', icon: '⛩️', label: '清和茶寮', pos: { x: 350,  y: 400 }, floatDelay: '0.3s', data: { bindInheritorId: 4, name: '清和茶寮', desc: '茶道 · 古琴 · 书法研习' } },
        { id: 'qlj_collect_tea',   type: 'collect',  icon: '🌿', label: '采茶',     pos: { x: 1600, y: 350 }, floatDelay: '1s',   data: { itemName: '明前龙井', itemIcon: '🍃', itemType: 'material', count: 5, rarity: 2, desc: '清晨采摘的新鲜茶叶', respawnSecs: 360 } },
        { id: 'qlj_collect_guji',  type: 'collect',  icon: '📖', label: '古籍',     pos: { x: 2200, y: 800 }, floatDelay: '2s',   data: { itemName: '茶经残卷', itemIcon: '📖', itemType: 'collection', count: 1, rarity: 3, desc: '陆羽《茶经》的残本',  respawnSecs: 900 } },
        { id: 'qlj_hidden_spring', type: 'hidden',   icon: '✨', label: '???',       pos: { x: 2400, y: 1400 }, floatDelay: '0.5s', data: { triggerDesc: '竹林深处，一股清泉自岩缝间流出。泉水清冽甘甜，据说是煮茶的极品水源……', rewardItem: '山泉水', rewardIcon: '💧', rewardCount: 3, rarity: 3, questTrigger: 'side_tea_master' } },
        { id: 'qlj_rest_tingyu',   type: 'rest',     icon: '☔', label: '听雨亭',   pos: { x: 900,  y: 1400 }, floatDelay: '2.2s', data: { name: '听雨亭', desc: '在此静坐，可聆听雨打芭蕉之声，心神宁静', healAmount: 50, randomEvent: false } },
        { 
          id: 'qlj_collect_dew',   
          type: 'collect',  
          icon: '💧', 
          label: '采集晨露',     
          pos: { x: 1900, y: 1100 }, 
          spawnTime: 'dawn', // 🌟 限定只有晨曦 (dawn) 才会出现！
          floatDelay: '1s',   
          data: { itemName: '清晨露水', itemIcon: '💧', itemType: 'material', count: 3, rarity: 4, desc: '只在破晓时分凝结的无根之水', respawnSecs: 360 } 
        },

// 📍 1. 替换青岚界的废墟节点
{
  id: 'qlj_ruin_teafarm',
  type: 'ruin',
  icon: '🌫️',
  label: '迷雾茶园废墟',
  pos: { x: 1400, y: 700 }, // 🌟 修复：必须包裹在 pos 对象中！
  floatDelay:'1.2s',
  data: {
    hint: '这片茶园曾是青岚界最负盛名的点茶圣地，被大遗忘吞噬后，连茶香也消散了……元神低语：缺少一件能镇压水土灵气的造物。',
    requireItem: '宋式点茶茶碗',       
    aiHint_mojiaziju: '机关分析：茶园灌溉的地脉阵眼已堵塞，需以茶道灵器重新激活水脉。',
    requireClues: ['枯萎的茶芽', '残破的茶筅'],  
    restoredType: 'npc',
    restoredIcon: '🍵',
    restoredLabel: '点茶守岁人·周茶娘',
    restoredData: {
      name: '周茶娘',
      dialog: [{ // 🌟 修复：改为引擎标准对话结构
        text: '茶香又回来了……多谢寻遗使。来，我教你宋代七汤点茶之法。',
        options: ['太好了', '暂且告辞']
      }]
    }
  }
},

      ],
      blockedZones: [
        { x: 0, y: 0, w: 2600, h: 80 },
        { x: 0, y: 1720, w: 2600, h: 80 },
        { x: 1000, y: 200, w: 600, h: 400 }, /* 山石区 */
      ],
    },
  },

  /* ── 4. 百作镇 ── （修复原 Bug：键名统一为 baizuozhen）*/
  baizuozhen: {
    key:      'baizuozhen',
    title:    '百作镇',
    subtitle: '匠心工坊聚集地',
    desc:     '叮叮当当的敲击声千年不绝，这里是木雕、陶艺、金工、竹编等传统手工技艺的核心产地。全镇遍布大小工坊，你可以在此亲手体验各类手工技艺，收集原材料，解锁专属造物图纸。',
    bgColor:  '#5d3a29',
    bgImage:  "assets/unnamed (17).jpg",
    anchorPos:  { top: '58%', left: '46%' },
    anchorIcon: '⚒️',
    anchorTheme: '',
    mapTheme: 'theme-ancient',
    weather: { type: 'clear', icon: '☀️' },

    actions: [
      { icon: '🪵', name: '木雕体验',   desc: '亲手雕刻木质摆件',         func: 'handleAction("minigame","woodcarve")' },
      { icon: '🏺', name: '陶艺拉坯',   desc: '体验陶瓷拉坯技艺',         func: 'handleAction("minigame","pottery")' },
      { icon: '⚒️', name: '银饰锻造',   desc: '学习传统银饰制作技艺',     func: 'handleAction("minigame","silver")' },
      { icon: '🔍', name: '工坊漫游',   desc: '进入百作镇街巷沉浸探索',   func: 'startExploration("baizuozhen")' },
      { icon: '⛩️', name: '匠人驻地',   desc: '前往天工阁拜师学艺',       func: 'goToWorkshop()' },
      { icon: '🏪', name: '材料行',     desc: '购买各类手工材料',         func: 'openShop()' },
    ],

    exploration: {
      mapWidth: 2500, mapHeight: 1700,
      layers: [
        { z: 1, parallax: 0.15, bg: '#4a2e1a', texture: 'https://www.transparenttextures.com/patterns/wood-pattern.png', opacity: 0.5 },
        { z: 2, parallax: 0.4,  bg: '#5d3a22', texture: 'https://www.transparenttextures.com/patterns/old-paper.png',   opacity: 0.65 },
        { z: 3, parallax: 1.0,  bg: '#6b4028', texture: 'https://www.transparenttextures.com/patterns/natural-paper.png', opacity: 0.85 },
      ],
      spawnPoint: { x: 600, y: 850 },
      nodes: [
        { id: 'bzz_npc_mujiang',   type: 'npc',      icon: '👨‍🏭', label: '木雕匠人', pos: { x: 800,  y: 500 }, floatDelay: '0s',   data: { name: '李木雕', role: '东阳木雕传承人', avatar: '👨‍🏭', isAI: true, aiPersonality: '沉稳内敛的木雕大师，话语不多但句句深刻，擅长用木雕故事说明人生道理', bindInheritorId: 3, dialog: [] } },
        { id: 'bzz_npc_taoci',     type: 'npc',      icon: '🏺', label: '陶艺师',   pos: { x: 1500, y: 600 }, floatDelay: '1.2s', data: { name: '张陶娘', role: '龙泉青瓷传承人', avatar: '🏺', isAI: false, bindInheritorId: null, dialog: [{ text: '游侠，这拉坯的手感可讲究了——力道轻重，全在心念之间。来试试？', options: ['我来试试', '请赐教', '只是观看'] }] } },
        { id: 'bzz_workshop_mu',   type: 'workshop', icon: '⛩️', label: '木雕工坊', pos: { x: 350,  y: 350 }, floatDelay: '0.4s', data: { bindInheritorId: 3, name: '木雕工坊', desc: '东阳木雕 · 核雕 · 竹雕' } },
        { id: 'bzz_workshop_tao',  type: 'workshop', icon: '⛩️', label: '陶瓷工坊', pos: { x: 1900, y: 400 }, floatDelay: '0.9s', data: { bindInheritorId: 2, name: '陶瓷工坊', desc: '龙泉青瓷 · 紫砂 · 景德镇彩瓷' } },
        { id: 'bzz_collect_wood',  type: 'collect',  icon: '🪵', label: '木料堆',   pos: { x: 1200, y: 900 }, floatDelay: '1.5s', data: { itemName: '沉香木料', itemIcon: '🪵', itemType: 'material', count: 3, rarity: 2, desc: '上等沉香木，适合精雕细刻', respawnSecs: 420 } },
        { id: 'bzz_collect_clay',  type: 'collect',  icon: '🏺', label: '陶土',     pos: { x: 600,  y: 1300 }, floatDelay: '2s',  data: { itemName: '高岭陶土', itemIcon: '🏺', itemType: 'material', count: 5, rarity: 1, desc: '优质高岭土，陶器基础材料', respawnSecs: 240 } },
        { id: 'bzz_hidden_tool',   type: 'hidden',   icon: '✨', label: '???',       pos: { x: 2300, y: 1200 }, floatDelay: '0.7s', data: { triggerDesc: '老铁匠铺角落里，有一把落满铁锈的雕刻刀。擦拭后，刀刃依然锋利如初，刻有"百年匠心"四字……', rewardItem: '百年雕刻刀', rewardIcon: '🔪', rewardCount: 1, rarity: 5, questTrigger: 'main_craft_master' } },
        { id: 'bzz_game_forge',    type: 'game',     icon: '⚒️', label: '打铁台',   pos: { x: 1100, y: 300 }, floatDelay: '1.8s', data: { gameType: 'forge', name: '锻造小游戏', desc: '节奏感锻造，赢取银饰材料' } },

// 📍 2. 替换百作镇的废墟节点
{
  id: 'bzz_ruin_kiln',
  type: 'ruin',
  icon: '🏗️',
  label: '熄灭的龙窑',
  pos: { x: 800, y: 1100 }, // 🌟 修复：包裹在 pos 对象中
  floatDelay:'1.2s', 
  data: {
    hint: '这座龙窑的窑火已经熄灭了很久。炉膛里，残存着尚未烧透的陶坯……元神感应到，重燃窑火需要一件镇窑神器。',
    requireItem: '龙泉镇窑之壶',
    aiHint_mojiaziju: '热力学分析：窑膛通风管道需要以金属器物重新疏通，触发自然起火。',
    requireClues: ['冷却的窑灰', '残缺的窑变记录'],
    restoredType: 'npc',
    restoredIcon: '🔥',
    restoredLabel: '窑火守岁人·徐老窑匠',
    restoredData: {
      name: '徐老窑匠',
      dialog: [{ // 🌟 修复：改为引擎标准对话结构
        text: '孩子，窑火又活了……老汉守着这座窑三十年，今天终于等到你了。',
        options: ['这是我应该做的', '暂且告辞']
      }]
    }
  }
},

      ],
      blockedZones: [
        { x: 0, y: 0, w: 2500, h: 80 },
        { x: 0, y: 1620, w: 2500, h: 80 },
        { x: 300, y: 200, w: 300, h: 250 }, /* 木雕工坊建筑 */
        { x: 1750, y: 250, w: 350, h: 250 }, /* 陶瓷工坊建筑 */
      ],
    },
  },

  /* ── 5. 锦绣坊 ── */
  jinxiufang: {
    key:      'jinxiufang',
    title:    '锦绣坊',
    subtitle: '华服霓裳绣坊',
    desc:     '丝线穿梭，锦绣生辉，这里是汉服、苏绣、湘绣、缂丝等传统织绣技艺的传承之地。从面料织造到纹样设计，从刺绣针法到成衣制作，你可以在此学习传统服饰形制，定制专属华服。',
    bgColor:  '#6a3e4d',
    bgImage:  "assets/unnamed (16).jpg",
    anchorPos:  { top: '55%', left: '56%' },
    anchorIcon: '👘',
    anchorTheme: 'anchor-red',
    mapTheme: 'theme-folk',
    weather: { type: 'clear', icon: '🌸' },

    actions: [
      { icon: '🧵', name: '苏绣研习',   desc: '学习苏绣基础针法',         func: 'handleAction("minigame","embroidery")' },
      { icon: '👘', name: '汉服定制',   desc: '定制专属汉服形象',         func: 'switchMainView("view-profile")' },
      { icon: '🎨', name: '面料染色',   desc: '体验传统草木染技艺',       func: 'handleAction("minigame","dye")' },
      { icon: '🔍', name: '绣坊漫游',   desc: '进入锦绣坊街巷沉浸探索',   func: 'startExploration("jinxiufang")' },
      { icon: '⛩️', name: '绣娘驻地',   desc: '前往天工阁拜师学习苏绣',   func: 'goToWorkshop()' },
      { icon: '🏪', name: '丝线铺',     desc: '购买绣线与面料材料',       func: 'openShop()' },
    ],

    exploration: {
      mapWidth: 2300, mapHeight: 1600,
      layers: [
        { z: 1, parallax: 0.15, bg: '#5a2e3a', texture: 'https://www.transparenttextures.com/patterns/subtle-white-feathers.png', opacity: 0.5 },
        { z: 2, parallax: 0.4,  bg: '#6a3e4d', texture: 'https://www.transparenttextures.com/patterns/clean-gray-paper.png',      opacity: 0.6 },
        { z: 3, parallax: 1.0,  bg: '#7a4e5d', texture: 'https://www.transparenttextures.com/patterns/natural-paper.png',         opacity: 0.8 },
      ],
      spawnPoint: { x: 550, y: 800 },
      nodes: [
        { id: 'jxf_npc_xiuniag',   type: 'npc',      icon: '👩‍🎨', label: '苏绣绣娘', pos: { x: 900,  y: 500 }, floatDelay: '0s',   data: { name: '王绣娘', role: '苏绣非遗传承人', avatar: '👩‍🎨', isAI: true, aiPersonality: '温婉细腻的苏绣大师，言语如绣线般细腻流畅，对每一针每一线都充满感情', bindInheritorId: 1, dialog: [] } },
        { id: 'jxf_npc_caifu',     type: 'npc',      icon: '🧶', label: '裁缝师',   pos: { x: 1600, y: 700 }, floatDelay: '1s',   data: { name: '赵裁缝', role: '汉服制作人', avatar: '🧶', isAI: false, bindInheritorId: null, dialog: [{ text: '姑娘，这料子摸起来可是今年最新到的云锦！给你裁一件罗裙如何？', options: ['好啊！', '看看图样', '下次再说'] }] } },
        { id: 'jxf_workshop_xiu',  type: 'workshop', icon: '⛩️', label: '苏绣工坊', pos: { x: 350,  y: 350 }, floatDelay: '0.5s', data: { bindInheritorId: 1, name: '苏绣工坊', desc: '苏绣 · 湘绣 · 缂丝 · 扎染' } },
        { id: 'jxf_workshop_lace', type: 'workshop', icon: '⛩️', label: '蜡染工坊', pos: { x: 2000, y: 450 }, floatDelay: '1s',   data: { bindInheritorId: 7, name: '蜡染工坊', desc: '苗族蜡染 · 扎染 · 草木染' } },
        { id: 'jxf_collect_silk',  type: 'collect',  icon: '🧵', label: '丝线架',   pos: { x: 1200, y: 900 }, floatDelay: '1.5s', data: { itemName: '苏绣丝线', itemIcon: '🧵', itemType: 'material', count: 10, rarity: 2, desc: '五彩苏绣丝线，刺绣基础材料', respawnSecs: 300 } },
        { id: 'jxf_collect_cloth', type: 'collect',  icon: '👘', label: '云锦布料', pos: { x: 500,  y: 1200 }, floatDelay: '2s',  data: { itemName: '云锦布料', itemIcon: '🎀', itemType: 'material', count: 2, rarity: 3, desc: '南京云锦，织物中的极品', respawnSecs: 600 } },
        { id: 'jxf_hidden_needle', type: 'hidden',   icon: '✨', label: '???',       pos: { x: 2100, y: 1300 }, floatDelay: '0.6s', data: { triggerDesc: '绣架后面，藏着一枚传说中的"金针"。绣娘说，用此针绣出的作品，针脚细如发丝……', rewardItem: '金绣针', rewardIcon: '🪡', rewardCount: 1, rarity: 5, questTrigger: 'side_embroidery_master' } },
        { id: 'jxf_rest_xiupo',    type: 'rest',     icon: '🪑', label: '绣楼阁',   pos: { x: 1100, y: 1300 }, floatDelay: '2.8s', data: { name: '绣楼阁', desc: '临窗绣花，听江南小调', healAmount: 35, randomEvent: true } },
      ],
      blockedZones: [
        { x: 0, y: 0, w: 2300, h: 80 },
        { x: 0, y: 1520, w: 2300, h: 80 },
      ],
    },
  },

  /* ── 6. 通西域 ── */
  tongxiyu: {
    key:      'tongxiyu',
    title:    '通西域',
    subtitle: '丝绸之路古道',
    desc:     '驼铃声声，黄沙漫漫，这里是丝绸之路的核心节点，东西方文化交汇之地。你可以在此体验壁画修复、香料调配、织物贸易，探寻石窟中的千年秘密，重走丝绸之路。',
    bgColor:  '#7a6438',
    bgImage:  "assets/unnamed (19).jpg",
    anchorPos:  { top: '48%', left: '38%' },
    anchorIcon: '🐪',
    anchorTheme: 'anchor-gold',
    mapTheme: 'theme-desert',
    weather: { type: 'wind', icon: '🌬️' },

    actions: [
      { icon: '🎨', name: '壁画修复',   desc: '修复敦煌壁画残片',         func: 'handleAction("minigame","fresco")' },
      { icon: '🌶️', name: '香料调配',   desc: '学习古方合香技艺',         func: 'handleAction("minigame","incense2")' },
      { icon: '🐪', name: '商队贸易',   desc: '进行东西方货物贸易',       func: 'handleAction("trade","tongxiyu")' },
      { icon: '🔍', name: '沙漠漫游',   desc: '进入丝绸之路沉浸探索',     func: 'startExploration("tongxiyu")' },
      { icon: '🏺', name: '石窟探秘',   desc: '探寻莫高窟秘境',           func: 'handleAction("explore","shiku")' },
      { icon: '🏪', name: '香料铺',     desc: '购买西域香料',             func: 'openShop()' },
    ],

    exploration: {
      mapWidth: 2800, mapHeight: 1600,
      layers: [
        { z: 1, parallax: 0.12, bg: '#8a6020', texture: 'https://www.transparenttextures.com/patterns/sandpaper.png', opacity: 0.5 },
        { z: 2, parallax: 0.35, bg: '#7a5018', texture: 'https://www.transparenttextures.com/patterns/old-paper.png', opacity: 0.6 },
        { z: 3, parallax: 1.0,  bg: '#6a4010', texture: 'https://www.transparenttextures.com/patterns/natural-paper.png', opacity: 0.85 },
      ],
      spawnPoint: { x: 700, y: 800 },
      nodes: [
        { id: 'txy_npc_merchant', type: 'npc',      icon: '👳‍♂️', label: '西域商人', pos: { x: 1000, y: 500 }, floatDelay: '0s',   data: { name: '阿里法德', role: '丝路商队领袖', avatar: '👳‍♂️', isAI: false, bindInheritorId: null, dialog: [{ text: '"朋友！我来自波斯，带来了最好的香料！你有何物可以交换？"', options: ['用茶叶换香料', '用丝绸换宝石', '只是路过'] }] } },
        { id: 'txy_npc_monk',    type: 'npc',      icon: '🧘', label: '取经僧侣',  pos: { x: 2200, y: 600 }, floatDelay: '1.5s', data: { name: '玄奘法师', role: '丝路文化传播者', avatar: '🧘', isAI: true, aiPersonality: '慈悲宽厚的高僧，见识广博，善于讲述东西方文化交流的故事', bindInheritorId: null, dialog: [] } },
        { id: 'txy_workshop_art',type: 'workshop', icon: '⛩️', label: '壁画修复工坊', pos: { x: 400, y: 350 }, floatDelay: '0.4s', data: { bindInheritorId: null, name: '壁画修复工坊', desc: '敦煌壁画 · 丝路文物修复技艺' } },
        { id: 'txy_collect_herb',type: 'collect',  icon: '🌶️', label: '香料采集',  pos: { x: 1500, y: 800 }, floatDelay: '1s',   data: { itemName: '西域香料', itemIcon: '🌶️', itemType: 'material', count: 4, rarity: 2, desc: '来自西域的珍贵香料',  respawnSecs: 360 } },
        { id: 'txy_collect_silk',type: 'collect',  icon: '🎀', label: '丝路遗物',  pos: { x: 700,  y: 1300 }, floatDelay: '1.8s', data: { itemName: '古丝绸碎片', itemIcon: '🎀', itemType: 'collection', count: 1, rarity: 3, desc: '千年丝绸之路遗留的丝绸残片', respawnSecs: 720 } },
        { id: 'txy_hidden_cave', type: 'hidden',   icon: '✨', label: '???',        pos: { x: 2600, y: 400 }, floatDelay: '0.6s', data: { triggerDesc: '沙丘深处，你发现了一处隐秘石窟。窟内壁画完好，记载着一段从未被记录的丝路传说……', rewardItem: '壁画拓片', rewardIcon: '🎨', rewardCount: 1, rarity: 4, questTrigger: 'side_silk_road' } },
        { id: 'txy_rest_oasis',  type: 'rest',     icon: '🌴', label: '绿洲',      pos: { x: 1300, y: 1300 }, floatDelay: '2.5s', data: { name: '沙漠绿洲', desc: '在绿洲边的椰树下休憩，远处驼铃声声', healAmount: 45, randomEvent: true } },
      ],
      blockedZones: [
        { x: 0, y: 0, w: 2800, h: 80 },
        { x: 0, y: 1520, w: 2800, h: 80 },
        { x: 300, y: 200, w: 200, h: 250 }, /* 石窟入口 */
      ],
    },
  },

  /* ── 7. 元境都 ── */
  yuanjingdu: {
    key:      'yuanjingdu',
    title:    '元境都',
    subtitle: '赛博国风未来城',
    desc:     '霓虹闪烁，古意盎然，这里是科技与非遗完美融合的未来之城。全息戏曲、AR皮影、数字非遗、虚拟人直播，你可以在此体验最前沿的数字非遗技术，感受传统文化在元宇宙中的全新生命力。',
    bgColor:  '#1a2a4a',
    bgImage:  "assets/unnamed (18).jpg",
    anchorPos:  { top: '62%', left: '50%' },
    anchorIcon: '🏙️',
    anchorTheme: 'anchor-purple',
    mapTheme: 'theme-city',
    weather: { type: 'night', icon: '🌃' },

    actions: [
      { icon: '🎬', name: '全息戏曲',   desc: '观看全息戏曲演出',         func: 'handleAction("watch","hologram")' },
      { icon: '🎭', name: 'AR皮影',     desc: '体验AR皮影戏互动',         func: 'handleAction("minigame","arpiyinv")' },
      { icon: '🤖', name: '虚拟人定制', desc: '定制非遗虚拟人形象',       func: 'switchMainView("view-profile")' },
      { icon: '🔍', name: '都市漫游',   desc: '进入元境都赛博街道探索',   func: 'startExploration("yuanjingdu")' },
      { icon: '📱', name: '数字展厅',   desc: '参观数字非遗博物馆',       func: 'handleAction("visit","museum")' },
      { icon: '🏪', name: '科技商铺',   desc: '购买数字非遗道具',         func: 'openShop()' },
    ],

    exploration: {
      mapWidth: 2400, mapHeight: 1600,
      layers: [
        { z: 1, parallax: 0.15, bg: '#0a1020', texture: 'https://www.transparenttextures.com/patterns/cubes.png', opacity: 0.6 },
        { z: 2, parallax: 0.4,  bg: '#1a2a4a', texture: 'https://www.transparenttextures.com/patterns/black-paper.png', opacity: 0.7 },
        { z: 3, parallax: 1.0,  bg: '#2a3a5a', texture: 'https://www.transparenttextures.com/patterns/cubes.png', opacity: 0.85 },
      ],
      spawnPoint: { x: 600, y: 800 },
      nodes: [
        { id: 'yjd_npc_engineer', type: 'npc',      icon: '🤖', label: '虚拟人工程师', pos: { x: 900,  y: 500 }, floatDelay: '0s',   data: { name: 'ARIA-01', role: 'AI虚拟传承人', avatar: '🤖', isAI: true, aiPersonality: '来自未来的AI助手，熟悉所有非遗技艺的数字化信息，语气充满科技感', bindInheritorId: null, dialog: [] } },
        { id: 'yjd_npc_artist',   type: 'npc',      icon: '🎨', label: '数字艺术家', pos: { x: 1700, y: 600 }, floatDelay: '1s',   data: { name: '赛博画师', role: '数字非遗创作者', avatar: '🎨', isAI: false, bindInheritorId: null, dialog: [{ text: '"欢迎来到元境都！我正在将苏绣纹样转化为NFT数字藏品，想看看吗？"', options: ['太酷了！', '什么是NFT？', '我更喜欢实体'] }] } },
        { id: 'yjd_workshop_dig', type: 'workshop', icon: '⛩️', label: '数字展厅', pos: { x: 350, y: 350 }, floatDelay: '0.3s', data: { bindInheritorId: null, name: '数字非遗展厅', desc: '全息投影 · AR体验 · 数字藏品' } },
        { id: 'yjd_collect_data', type: 'collect',  icon: '💾', label: '数据碎片', pos: { x: 1400, y: 900 }, floatDelay: '1.5s', data: { itemName: '非遗数据芯片', itemIcon: '💾', itemType: 'collection', count: 1, rarity: 3, desc: '存有稀有非遗数字资产的芯片', respawnSecs: 480 } },
        { id: 'yjd_collect_holo', type: 'collect',  icon: '🔮', label: '全息晶石', pos: { x: 600,  y: 1200 }, floatDelay: '2s',  data: { itemName: '全息晶石', itemIcon: '🔮', itemType: 'prop', count: 2, rarity: 3, desc: '可以播放非遗全息影像的神奇晶石', respawnSecs: 600 } },
        { id: 'yjd_hidden_core',  type: 'hidden',   icon: '✨', label: '???',       pos: { x: 2200, y: 400 }, floatDelay: '0.5s', data: { triggerDesc: '你在服务器角落发现了一段神秘代码。解析后，里面竟然是一位百年前艺术家的全息留影……', rewardItem: '百年全息影像', rewardIcon: '📸', rewardCount: 1, rarity: 5, questTrigger: null } },
        { id: 'yjd_rest_cafe',    type: 'rest',     icon: '☕', label: '赛博茶馆', pos: { x: 1100, y: 1300 }, floatDelay: '2.5s', data: { name: '赛博茶馆', desc: '融合古典与科技的茶饮体验，一杯"数字普洱"', healAmount: 40, randomEvent: false } },
      ],
      blockedZones: [
        { x: 0, y: 0, w: 2400, h: 80 },
        { x: 0, y: 1520, w: 2400, h: 80 },
      ],
    },
  },

  /* ── 8. 万象台 ── */
  wanxiangtai: {
    key:      'wanxiangtai',
    title:    '万象台',
    subtitle: '民俗节庆聚集地',
    desc:     '这里是中华传统民俗的活态传承之地，根据现实节日动态变换场景。春节逛庙会、元宵猜灯谜、端午赛龙舟、中秋放花灯，你可以在此体验各类传统民俗活动，感受节日的热闹与温情。',
    bgColor:  '#8a2b3b',
    bgImage:  "assets/unnamed (8).jpg",
    anchorPos:  { top: '35%', left: '50%' },
    anchorIcon: '🪁',
    anchorTheme: 'anchor-red',
    mapTheme: 'theme-folk',
    weather: { type: 'festive', icon: '🎆' },

    actions: [
      { icon: '🏮', name: '猜灯谜',     desc: '参与元宵猜灯谜活动',       func: 'openRiddleGame()' },
      { icon: '🚣', name: '赛龙舟',     desc: '体验端午赛龙舟',           func: 'handleAction("minigame","dragonboat")' },
      { icon: '🎑', name: '放花灯',     desc: '中秋放河灯祈福',           func: 'handleAction("lantern","zhongqiu")' },
      { icon: '🔍', name: '庙会漫游',   desc: '进入民俗庙会沉浸探索',     func: 'startExploration("wanxiangtai")' },
      { icon: '🎁', name: '年货铺',     desc: '购买节日相关道具',         func: 'openShop()' },
      { icon: '📅', name: '节日黄历',   desc: '查看传统节日日历',         func: 'handleAction("calendar","folk")' },
    ],

    exploration: {
      mapWidth: 2500, mapHeight: 1700,
      layers: [
        { z: 1, parallax: 0.15, bg: '#6a1a20', texture: 'https://www.transparenttextures.com/patterns/bright-squares.png', opacity: 0.4 },
        { z: 2, parallax: 0.4,  bg: '#8a2b3b', texture: 'https://www.transparenttextures.com/patterns/old-paper.png',      opacity: 0.6 },
        { z: 3, parallax: 1.0,  bg: '#aa3b4b', texture: 'https://www.transparenttextures.com/patterns/natural-paper.png',  opacity: 0.8 },
      ],
      spawnPoint: { x: 600, y: 850 },
      nodes: [
        { id: 'wxt_npc_wushi',    type: 'npc',      icon: '🥁', label: '舞狮队长', pos: { x: 1000, y: 500 }, floatDelay: '0s',   data: { name: '阿雄', role: '舞狮非遗传承人', avatar: '🥁', isAI: false, bindInheritorId: null, dialog: [{ text: '"嘿！今日庙会，我们舞狮队要表演大头佛！你来配合锣鼓如何？"', options: ['好啊，我来敲锣！', '能教我舞狮吗？', '先看看'] }] } },
        { id: 'wxt_npc_miyue',    type: 'npc',      icon: '🏮', label: '灯谜出题人', pos: { x: 1800, y: 400 }, floatDelay: '1.2s', data: { name: '蒙面谜师', role: '灯谜文化传承者', avatar: '🏮', isAI: true, aiPersonality: '机智幽默的民俗文化专家，出口成谜，喜欢用传统文化知识挑战游侠', bindInheritorId: null, dialog: [] } },
        { id: 'wxt_workshop_mj',  type: 'workshop', icon: '⛩️', label: '民俗工坊', pos: { x: 350, y: 350 }, floatDelay: '0.4s', data: { bindInheritorId: 11, name: '民俗工坊', desc: '剪纸 · 皮影 · 年画 · 泥塑' } },
        { id: 'wxt_collect_denglong', type: 'collect', icon: '🏮', label: '花灯铺',  pos: { x: 1400, y: 800 }, floatDelay: '1.5s', data: { itemName: '精美花灯', itemIcon: '🏮', itemType: 'prop', count: 2, rarity: 2, desc: '手工制作的彩色花灯', respawnSecs: 300 } },
        { id: 'wxt_collect_niangao', type: 'collect', icon: '🎂', label: '年糕铺',   pos: { x: 600,  y: 1200 }, floatDelay: '2s', data: { itemName: '传统年糕', itemIcon: '🎂', itemType: 'material', count: 3, rarity: 1, desc: '节日必备的糯米年糕', respawnSecs: 200 } },
        { id: 'wxt_hidden_miao',  type: 'hidden',   icon: '✨', label: '???',        pos: { x: 2300, y: 1200 }, floatDelay: '0.7s', data: { triggerDesc: '庙会角落里，一个老奶奶静静地剪着窗花。她抬头看了你一眼："孩子，你像极了当年的那位……"随后递给你一张神秘的剪纸……', rewardItem: '灵犀剪纸', rewardIcon: '✂️', rewardCount: 1, rarity: 4, questTrigger: 'main_folk_origin' } },
        { id: 'wxt_game_riddle',  type: 'game',     icon: '🏮', label: '灯谜摊',    pos: { x: 1100, y: 300 }, floatDelay: '1.8s', data: { gameType: 'riddle', name: '猜灯谜', desc: '答对一题获得 50 灵石' } },
      ],
      blockedZones: [
        { x: 0, y: 0, w: 2500, h: 80 },
        { x: 0, y: 1620, w: 2500, h: 80 },
      ],
    },
  },

  /* ════════════════════════════════════════
     异域探索区（6个）
     ════════════════════════════════════════ */

  /* ── 9. 欧罗巴古堡 ── */
  ouluoba: {
    key:      'ouluoba',
    title:    '欧罗巴古堡',
    subtitle: '中世纪异域风情',
    desc:     '石砌古堡，尖顶教堂，这里是欧洲中世纪文化的缩影。你可以在此体验宝石切割、盔甲锻造、油画绘制、玻璃吹制等西方传统技艺，与异域商人贸易，解锁欧洲非遗技艺图鉴。',
    bgColor:  '#3a3a4a',
    bgImage:  "assets/unnamed (9).jpg",
    anchorPos:  { top: '25%', left: '25%' },
    anchorIcon: '🏰',
    anchorTheme: '',
    mapTheme: 'theme-mystic',
    weather: { type: 'fog', icon: '🌫️' },

    actions: [
      { icon: '💎', name: '宝石切割',   desc: '体验宝石切割技艺',         func: 'handleAction("minigame","gem")' },
      { icon: '⚔️', name: '盔甲锻造',   desc: '学习中世纪盔甲制作',       func: 'handleAction("minigame","armor")' },
      { icon: '🎨', name: '油画绘制',   desc: '体验古典油画技法',         func: 'handleAction("minigame","oilpaint")' },
      { icon: '🔍', name: '古堡漫游',   desc: '进入欧罗巴古堡沉浸探索',   func: 'startExploration("ouluoba")' },
      { icon: '🏪', name: '市集商铺',   desc: '购买异域材料道具',         func: 'openShop()' },
      { icon: '🏰', name: '古堡探秘',   desc: '探寻古堡中的秘密',         func: 'handleAction("explore","castle")' },
    ],

    exploration: {
      mapWidth: 2400, mapHeight: 1600,
      layers: [
        { z: 1, parallax: 0.12, bg: '#1a1a2a', texture: 'https://www.transparenttextures.com/patterns/black-paper.png', opacity: 0.6 },
        { z: 2, parallax: 0.38, bg: '#2a2a3a', texture: 'https://www.transparenttextures.com/patterns/cubes.png',       opacity: 0.65 },
        { z: 3, parallax: 1.0,  bg: '#3a3a4a', texture: 'https://www.transparenttextures.com/patterns/natural-paper.png', opacity: 0.8 },
      ],
      spawnPoint: { x: 600, y: 800 },
      nodes: [
        { id: 'olb_npc_knight',   type: 'npc',      icon: '⚔️', label: '骑士铸造师', pos: { x: 900,  y: 500 }, floatDelay: '0s',   data: { name: 'Sir Roland', role: '古堡铸造师', avatar: '⚔️', isAI: false, bindInheritorId: null, dialog: [{ text: '"Hail, traveler! I forge the finest armor in all the land. Can you handle a blade?"', options: ['教我锻造！', '只是参观', '我来自东方'] }] } },
        { id: 'olb_npc_alchemist',type: 'npc',      icon: '⚗️', label: '炼金术士',  pos: { x: 1700, y: 600 }, floatDelay: '1s',   data: { name: '帕拉塞尔苏斯', role: '炼金术传人', avatar: '⚗️', isAI: true, aiPersonality: '神秘博学的炼金术士，用东西方哲学来诠释传统技艺', bindInheritorId: null, dialog: [] } },
        { id: 'olb_workshop_gem', type: 'workshop', icon: '⛩️', label: '宝石工坊', pos: { x: 350,  y: 350 }, floatDelay: '0.4s', data: { bindInheritorId: null, name: '宝石工坊', desc: '欧洲宝石切割 · 玻璃吹制技艺' } },
        { id: 'olb_collect_gem',  type: 'collect',  icon: '💎', label: '宝石矿',   pos: { x: 1400, y: 900 }, floatDelay: '1.5s', data: { itemName: '炼金草药', itemIcon: '🌿', itemType: 'material', count: 3, rarity: 2, desc: '西域炼金师常用的神秘草药', respawnSecs: 400 } },
        { id: 'olb_collect_wine', type: 'collect',  icon: '🍷', label: '古酒窖',   pos: { x: 600,  y: 1200 }, floatDelay: '2s',  data: { itemName: '百年红酒', itemIcon: '🍷', itemType: 'prop', count: 1, rarity: 3, desc: '古堡地下窖藏百年的红葡萄酒', respawnSecs: 720 } },
        { id: 'olb_hidden_book',  type: 'hidden',   icon: '✨', label: '???',       pos: { x: 2200, y: 350 }, floatDelay: '0.5s', data: { triggerDesc: '密室的书架后，藏着一本手抄的炼金手记，页页金光闪烁……', rewardItem: '炼金手记', rewardIcon: '📕', rewardCount: 1, rarity: 5, questTrigger: null } },
        { id: 'olb_rest_tavern',  type: 'rest',     icon: '🍻', label: '骑士酒馆', pos: { x: 1100, y: 1300 }, floatDelay: '2.5s', data: { name: '金鹰酒馆', desc: '古堡中的小酒馆，听吟游诗人讲异域传说', healAmount: 35, randomEvent: true } },
      ],
      blockedZones: [
        { x: 0, y: 0, w: 2400, h: 80 },
        { x: 0, y: 1520, w: 2400, h: 80 },
        { x: 900, y: 100, w: 600, h: 400 }, /* 古堡主塔 */
      ],
    },
  },

  /* ── 10. 秘典之境 ── */
  midianzhijing: {
    key:      'midianzhijing',
    title:    '秘典之境',
    subtitle: '星象神秘学区',
    desc:     '星图流转，符文闪烁，这里是占星、塔罗、炼金术等神秘学的传承之地。暗金色的星图铺满整个空间，你可以在此学习占星术，绘制星盘，调配炼金药剂，解锁神秘学的隐藏知识。',
    bgColor:  '#1a1030',
    bgImage:  "assets/unnamed (10).jpg",
    anchorPos:  { top: '25%', left: '75%' },
    anchorIcon: '🔮',
    anchorTheme: 'anchor-purple',
    mapTheme: 'theme-mystic',
    weather: { type: 'stars', icon: '✨' },

    actions: [
      { icon: '🔮', name: '占星卜算',   desc: '绘制个人星盘',             func: 'handleAction("astro","birth")' },
      { icon: '⚗️', name: '炼金调配',   desc: '调配炼金药剂',             func: 'handleAction("minigame","alchemy")' },
      { icon: '📜', name: '塔罗占卜',   desc: '体验塔罗牌占卜',           func: 'handleAction("tarot","reading")' },
      { icon: '🔍', name: '星殿漫游',   desc: '进入秘典之境沉浸探索',     func: 'startExploration("midianzhijing")' },
      { icon: '🏪', name: '炼金商铺',   desc: '购买炼金材料道具',         func: 'openShop()' },
      { icon: '📚', name: '秘典馆藏',   desc: '查阅神秘学古籍',           func: 'handleAction("read","midianzang")' },
    ],

    exploration: {
      mapWidth: 2200, mapHeight: 1500,
      layers: [
        { z: 1, parallax: 0.1,  bg: '#0a0820', texture: 'https://www.transparenttextures.com/patterns/stardust.png', opacity: 0.7 },
        { z: 2, parallax: 0.35, bg: '#1a1030', texture: 'https://www.transparenttextures.com/patterns/black-paper.png', opacity: 0.6 },
        { z: 3, parallax: 1.0,  bg: '#2a1a40', texture: 'https://www.transparenttextures.com/patterns/cubes.png', opacity: 0.75 },
      ],
      spawnPoint: { x: 550, y: 750 },
      nodes: [
        { id: 'mdz_npc_astro',    type: 'npc',      icon: '🧙‍♂️', label: '占星师', pos: { x: 900,  y: 450 }, floatDelay: '0s',   data: { name: '墨提斯', role: '星象预言师', avatar: '🧙‍♂️', isAI: true, aiPersonality: '深邃神秘的占星师，擅长用星象比喻人生，语气带有神谕感', bindInheritorId: null, dialog: [] } },
        { id: 'mdz_npc_tarot',    type: 'npc',      icon: '🃏', label: '塔罗占卜师', pos: { x: 1600, y: 600 }, floatDelay: '1.2s', data: { name: '命运之女', role: '塔罗传承者', avatar: '🃏', isAI: false, bindInheritorId: null, dialog: [{ text: '"旅人，命运之牌已经展开。翻开你命中注定的那一张……"', options: ['翻牌！', '我不信命', '只是好奇'] }] } },
        { id: 'mdz_workshop_alc', type: 'workshop', icon: '⛩️', label: '炼金台',   pos: { x: 300,  y: 300 }, floatDelay: '0.3s', data: { bindInheritorId: null, name: '炼金工坊', desc: '炼金术 · 星象图绘制 · 符文刻制' } },
        { id: 'mdz_collect_herb', type: 'collect',  icon: '🌿', label: '炼金草药', pos: { x: 1400, y: 800 }, floatDelay: '1.5s', data: { itemName: '炼金草药', itemIcon: '🌿', itemType: 'material', count: 3, rarity: 2, desc: '炼金常用的神秘草药', respawnSecs: 360 } },
        { id: 'mdz_collect_rune', type: 'collect',  icon: '🔮', label: '符文石',   pos: { x: 700,  y: 1100 }, floatDelay: '2s',  data: { itemName: '神秘符文石', itemIcon: '🔮', itemType: 'collection', count: 1, rarity: 4, desc: '刻有上古符文的神秘石块', respawnSecs: 840 } },
        { id: 'mdz_hidden_lib',   type: 'hidden',   icon: '✨', label: '???',       pos: { x: 2000, y: 400 }, floatDelay: '0.6s', data: { triggerDesc: '书架最深处，藏着一本《死灵之书》残本。页面上的符文随视线流动，似乎在低语……', rewardItem: '死灵之书残页', rewardIcon: '📕', rewardCount: 1, rarity: 5, questTrigger: null } },
      ],
      blockedZones: [
        { x: 0, y: 0, w: 2200, h: 80 },
        { x: 0, y: 1420, w: 2200, h: 80 },
      ],
    },
  },

  /* ── 11. 沧溟海域 ── */
  cangminghai: {
    key:      'cangminghai',
    title:    '沧溟海域',
    subtitle: '深海渔文化秘境',
    desc:     '波光粼粼，珊瑚摇曳，这里是海洋渔文化的传承之地。从渔绳结技艺到贝壳画制作，从船模打造到海洋民俗，你可以在此探索水下世界，体验海洋非遗技艺，感受大海的浩瀚与神秘。',
    bgColor:  '#0a2a4a',
    bgImage:  "assets/unnamed (11).jpg",
    anchorPos:  { top: '75%', left: '75%' },
    anchorIcon: '🧜‍♀️',
    anchorTheme: 'anchor-jade',
    mapTheme: 'theme-ocean',
    weather: { type: 'wave', icon: '🌊' },

    actions: [
      { icon: '🔗', name: '渔绳结技艺', desc: '学习传统渔绳结打法',       func: 'handleAction("minigame","knot")' },
      { icon: '🐚', name: '贝壳画制作', desc: '体验贝壳画非遗技艺',       func: 'handleAction("minigame","shellpaint")' },
      { icon: '⛵', name: '船模打造',   desc: '学习传统木船制作',         func: 'handleAction("minigame","shipmodel")' },
      { icon: '🔍', name: '深海漫游',   desc: '进入沧溟海域沉浸探索',     func: 'startExploration("cangminghai")' },
      { icon: '🏪', name: '渔市商铺',   desc: '购买海洋相关道具',         func: 'openShop()' },
      { icon: '🧜‍♀️', name: '海底宫殿', desc: '探寻深海中的秘境',         func: 'handleAction("explore","seafloor")' },
    ],

    exploration: {
      mapWidth: 2500, mapHeight: 1700,
      layers: [
        { z: 1, parallax: 0.12, bg: '#052030', texture: 'https://www.transparenttextures.com/patterns/water.png', opacity: 0.6 },
        { z: 2, parallax: 0.38, bg: '#0a2a4a', texture: 'https://www.transparenttextures.com/patterns/water.png', opacity: 0.65 },
        { z: 3, parallax: 1.0,  bg: '#153a5a', texture: 'https://www.transparenttextures.com/patterns/natural-paper.png', opacity: 0.75 },
      ],
      spawnPoint: { x: 600, y: 850 },
      nodes: [
        { id: 'cmh_npc_fisherman', type: 'npc',      icon: '👨‍🚤', label: '老渔民',  pos: { x: 900,  y: 500 }, floatDelay: '0s',   data: { name: '海伯', role: '渔绳结传承人', avatar: '👨‍🚤', isAI: false, bindInheritorId: null, dialog: [{ text: '"小友，这一根绳子，我打了六十年。一个结，就是一条命……来，我教你最基本的渔人结。"', options: ['请赐教！', '真厉害', '我在找珍宝'] }] } },
        { id: 'cmh_npc_mermaid',   type: 'npc',      icon: '🧜‍♀️', label: '人鱼',   pos: { x: 1800, y: 700 }, floatDelay: '1.5s', data: { name: '珊瑚', role: '海洋文化守护者', avatar: '🧜‍♀️', isAI: true, aiPersonality: '神秘优雅的人鱼，熟知海洋文化与民俗传说，说话如海浪般流动', bindInheritorId: null, dialog: [] } },
        { id: 'cmh_workshop_sea',  type: 'workshop', icon: '⛩️', label: '渔艺工坊', pos: { x: 350,  y: 350 }, floatDelay: '0.4s', data: { bindInheritorId: null, name: '渔艺工坊', desc: '渔绳结 · 贝壳画 · 船模制作' } },
        { id: 'cmh_collect_shell', type: 'collect',  icon: '🐚', label: '贝壳采集', pos: { x: 1400, y: 900 }, floatDelay: '1.5s', data: { itemName: '彩色贝壳', itemIcon: '🐚', itemType: 'material', count: 5, rarity: 1, desc: '海滩上捡到的彩色贝壳', respawnSecs: 180 } },
        { id: 'cmh_collect_pearl', type: 'collect',  icon: '💍', label: '珍珠',      pos: { x: 700,  y: 1200 }, floatDelay: '2s',  data: { itemName: '南海珍珠', itemIcon: '💍', itemType: 'collection', count: 1, rarity: 4, desc: '深海蚌中孕育的稀有珍珠', respawnSecs: 900 } },
        { id: 'cmh_hidden_palace', type: 'hidden',   icon: '✨', label: '???',        pos: { x: 2300, y: 1300 }, floatDelay: '0.7s', data: { triggerDesc: '珊瑚丛后，隐约可见一座沉没的水下宫殿。宫殿门上刻着一行字："此处藏有失落的海上丝绸之路……"', rewardItem: '海上丝路图', rewardIcon: '🗺️', rewardCount: 1, rarity: 5, questTrigger: 'side_sea_route' } },
      ],
      blockedZones: [
        { x: 0, y: 0, w: 2500, h: 80 },
        { x: 0, y: 1620, w: 2500, h: 80 },
      ],
    },
  },

  /* ── 12. 浮空云境 ── */
  fukongyunjing: {
    key:      'fukongyunjing',
    title:    '浮空云境',
    subtitle: '天空之城秘境',
    desc:     '云海翻腾，风铃清脆，这里是漂浮在云端的天空之城。你可以在此体验风筝制作、风铃锻造、竹编技艺，乘坐飞舟穿梭于云海之间，享受无拘无束的云端飞行，感受风的气息与自由。',
    bgColor:  '#3a6a9a',
    bgImage:  "assets/unnamed (22).jpg",
    anchorPos:  { top: '15%', left: '50%' },
    anchorIcon: '☁️',
    anchorTheme: 'anchor-jade',
    mapTheme: 'theme-sky',
    weather: { type: 'cloudy', icon: '⛅' },

    actions: [
      { icon: '🪁', name: '风筝制作',   desc: '体验传统风筝制作',         func: 'handleAction("minigame","kite")' },
      { icon: '🎐', name: '风铃锻造',   desc: '制作日式和风风铃',         func: 'handleAction("minigame","windbell")' },
      { icon: '🎋', name: '竹编技艺',   desc: '学习传统竹编技法',         func: 'handleAction("minigame","bamboo")' },
      { icon: '🔍', name: '云端漫游',   desc: '进入浮空云境沉浸探索',     func: 'startExploration("fukongyunjing")' },
      { icon: '🏪', name: '云间商铺',   desc: '购买天空相关道具',         func: 'openShop()' },
      { icon: '☁️', name: '飞舟航行',   desc: '乘坐飞舟环游云海',         func: 'handleAction("fly","airship")' },
    ],

    exploration: {
      mapWidth: 2600, mapHeight: 1600,
      layers: [
        { z: 1, parallax: 0.1,  bg: '#2a5a8a', texture: 'https://www.transparenttextures.com/patterns/clouds.png', opacity: 0.5 },
        { z: 2, parallax: 0.35, bg: '#3a6a9a', texture: 'https://www.transparenttextures.com/patterns/clouds.png', opacity: 0.6 },
        { z: 3, parallax: 1.0,  bg: '#4a7aaa', texture: 'https://www.transparenttextures.com/patterns/natural-paper.png', opacity: 0.75 },
      ],
      spawnPoint: { x: 650, y: 800 },
      nodes: [
        { id: 'fkyj_npc_fairy',   type: 'npc',      icon: '🧚', label: '风之精灵', pos: { x: 1000, y: 450 }, floatDelay: '0s',   data: { name: '风精灵', role: '云端守护者', avatar: '🧚', isAI: true, aiPersonality: '活泼灵动的精灵，热爱自由，用诗意的语言介绍云端的一切', bindInheritorId: null, dialog: [] } },
        { id: 'fkyj_npc_weaver',  type: 'npc',      icon: '🎋', label: '竹编匠人', pos: { x: 1700, y: 600 }, floatDelay: '1.2s', data: { name: '云上竹匠', role: '竹编艺术传承者', avatar: '🎋', isAI: false, bindInheritorId: null, dialog: [{ text: '"你看这根竹子，它生于大地，却编出了遮天的凉伞。万物相通，就如你和云端……"', options: ['请教我竹编', '好深刻', '哈哈'] }] } },
        { id: 'fkyj_workshop_kite', type: 'workshop', icon: '⛩️', label: '风筝坊', pos: { x: 350,  y: 300 }, floatDelay: '0.4s', data: { bindInheritorId: null, name: '风筝工坊', desc: '风筝制作 · 竹编 · 风铃锻造' } },
        { id: 'fkyj_collect_bamboo', type: 'collect', icon: '🎋', label: '竹林',   pos: { x: 1400, y: 850 }, floatDelay: '1.5s', data: { itemName: '上等竹料', itemIcon: '🎋', itemType: 'material', count: 4, rarity: 2, desc: '云端特有的轻质竹材', respawnSecs: 360 } },
        { id: 'fkyj_collect_feather', type: 'collect', icon: '🪶', label: '灵羽', pos: { x: 600,  y: 1200 }, floatDelay: '2s',  data: { itemName: '云雀灵羽', itemIcon: '🪶', itemType: 'material', count: 2, rarity: 3, desc: '云端灵雀的羽毛，可用于制作风筝', respawnSecs: 540 } },
        { id: 'fkyj_hidden_tower', type: 'hidden',   icon: '✨', label: '???',      pos: { x: 2400, y: 300 }, floatDelay: '0.5s', data: { triggerDesc: '云雾深处，有一座悬浮的风铃塔。每一声铃响，都像是在传递来自远方的信息……', rewardItem: '天籁风铃', rewardIcon: '🎐', rewardCount: 1, rarity: 5, questTrigger: null } },
        { id: 'fkyj_rest_pavilion', type: 'rest',    icon: '☁️', label: '云亭',    pos: { x: 1200, y: 1300 }, floatDelay: '2.8s', data: { name: '云端亭', desc: '在云中漫步，俯瞰九州大地', healAmount: 60, randomEvent: false } },
      ],
      blockedZones: [
        { x: 0, y: 0, w: 2600, h: 80 },
        { x: 0, y: 1520, w: 2600, h: 80 },
      ],
    },
  },

  /* ── 13. 沙海遗城 ── */
  shahaiyicheng: {
    key:      'shahaiyicheng',
    title:    '沙海遗城',
    subtitle: '古埃及文明秘境',
    desc:     '黄沙漫天，金字塔矗立，这里是古埃及文明的传承之地。你可以在此体验莎草纸画制作、圣符拓印、木乃伊制作、金字塔探秘，解锁古埃及非遗技艺，探寻沙漠中的千年秘密。',
    bgColor:  '#7a5a1a',
    bgImage:  "assets/unnamed (13).jpg",
    anchorPos:  { top: '75%', left: '25%' },
    anchorIcon: '🏜️',
    anchorTheme: 'anchor-gold',
    mapTheme: 'theme-desert',
    weather: { type: 'sandstorm', icon: '🌪️' },

    actions: [
      { icon: '📜', name: '莎草纸画',   desc: '体验莎草纸画技艺',         func: 'handleAction("minigame","papyrus")' },
      { icon: '🔮', name: '圣符拓印',   desc: '学习古埃及圣符拓印',       func: 'handleAction("minigame","hieroglyph")' },
      { icon: '🏺', name: '陶器制作',   desc: '体验古埃及陶器技艺',       func: 'handleAction("minigame","pottery2")' },
      { icon: '🔍', name: '沙漠漫游',   desc: '进入沙海遗城沉浸探索',     func: 'startExploration("shahaiyicheng")' },
      { icon: '🏪', name: '市集商铺',   desc: '购买古埃及相关道具',       func: 'openShop()' },
      { icon: '🏜️', name: '金字塔探秘', desc: '探寻金字塔中的秘密',       func: 'handleAction("explore","pyramid")' },
    ],

    exploration: {
      mapWidth: 2700, mapHeight: 1600,
      layers: [
        { z: 1, parallax: 0.12, bg: '#5a3a08', texture: 'https://www.transparenttextures.com/patterns/sandpaper.png', opacity: 0.55 },
        { z: 2, parallax: 0.38, bg: '#7a5018', texture: 'https://www.transparenttextures.com/patterns/sandpaper.png', opacity: 0.65 },
        { z: 3, parallax: 1.0,  bg: '#8a6020', texture: 'https://www.transparenttextures.com/patterns/natural-paper.png', opacity: 0.8 },
      ],
      spawnPoint: { x: 650, y: 800 },
      nodes: [
        { id: 'shyc_npc_scholar', type: 'npc',      icon: '👳‍♂️', label: '古学者', pos: { x: 900,  y: 500 }, floatDelay: '0s',   data: { name: '伊姆霍特普', role: '古埃及学者', avatar: '👳‍♂️', isAI: true, aiPersonality: '渊博的古埃及文明研究者，擅长讲述古文明与东方文化的交汇之处', bindInheritorId: null, dialog: [] } },
        { id: 'shyc_npc_guard',   type: 'npc',      icon: '⚔️', label: '法老卫士', pos: { x: 1700, y: 600 }, floatDelay: '1s',   data: { name: '卡迪姆', role: '金字塔守卫', avatar: '⚔️', isAI: false, bindInheritorId: null, dialog: [{ text: '"Stranger! These sacred halls are not for the weak. Prove your worth to enter the pyramid."', options: ['我愿接受考验', '我只是参观', '帮我翻译'] }] } },
        { id: 'shyc_workshop_art', type: 'workshop', icon: '⛩️', label: '壁刻工坊', pos: { x: 350, y: 300 }, floatDelay: '0.3s', data: { bindInheritorId: null, name: '壁刻工坊', desc: '莎草纸画 · 圣符拓印 · 古埃及工艺' } },
        { id: 'shyc_collect_reed', type: 'collect',  icon: '🌾', label: '莎草',     pos: { x: 1400, y: 900 }, floatDelay: '1.5s', data: { itemName: '尼罗河莎草', itemIcon: '🌾', itemType: 'material', count: 5, rarity: 2, desc: '生长于尼罗河畔的莎草', respawnSecs: 300 } },
        { id: 'shyc_collect_gold', type: 'collect',  icon: '🏺', label: '古陶罐',   pos: { x: 600,  y: 1200 }, floatDelay: '2s',  data: { itemName: '古埃及陶罐', itemIcon: '🏺', itemType: 'collection', count: 1, rarity: 3, desc: '保存完好的古埃及彩绘陶罐', respawnSecs: 720 } },
        { id: 'shyc_hidden_tomb', type: 'hidden',   icon: '✨', label: '???',        pos: { x: 2500, y: 400 }, floatDelay: '0.6s', data: { triggerDesc: '金字塔密室中，你发现了法老的黄金面具。它与一件苏绣摆在同一个石台上——这意味着什么？', rewardItem: '法老黄金面具', rewardIcon: '👑', rewardCount: 1, rarity: 5, questTrigger: null } },
      ],
      blockedZones: [
        { x: 0, y: 0, w: 2700, h: 80 },
        { x: 0, y: 1520, w: 2700, h: 80 },
        { x: 1100, y: 100, w: 500, h: 500 }, /* 金字塔主体 */
      ],
    },
  },

  /* ── 14. 森之低语 ── */
  senzhidiyu: {
    key:      'senzhidiyu',
    title:    '森之低语',
    subtitle: '奇幻森林秘境',
    desc:     '古树参天，精灵低语，这里是自然崇拜与草药文化的传承之地。你可以在此学习草药辨识、花环制作、树皮画、自然祭祀，与森林精灵交流，收集珍稀草药，感受大自然的生命气息。',
    bgColor:  '#1a3a1a',
    bgImage:  "assets/unnamed (23).jpg",
    anchorPos:  { top: '50%', left: '82%' },
    anchorIcon: '🧚',
    anchorTheme: 'anchor-jade',
    mapTheme: 'theme-forest',
    weather: { type: 'drizzle', icon: '🌧️' },

    actions: [
      { icon: '🌿', name: '草药辨识',   desc: '学习中医药草辨识',         func: 'handleAction("minigame","herb")' },
      { icon: '🌸', name: '花环制作',   desc: '体验传统花环制作',         func: 'handleAction("minigame","wreath")' },
      { icon: '🎨', name: '树皮画制作', desc: '学习树皮画非遗技艺',       func: 'handleAction("minigame","barkpaint")' },
      { icon: '🔍', name: '森林漫游',   desc: '进入森之低语沉浸探索',     func: 'startExploration("senzhidiyu")' },
      { icon: '🏪', name: '草药铺',     desc: '购买草药相关道具',         func: 'openShop()' },
      { icon: '🧚', name: '精灵树屋',   desc: '探寻森林精灵的秘境',       func: 'handleAction("explore","treehouse")' },
    ],

    exploration: {
      mapWidth: 2600, mapHeight: 1800,
      layers: [
        { z: 1, parallax: 0.1,  bg: '#0a2a0a', texture: 'https://www.transparenttextures.com/patterns/grass.png',        opacity: 0.45 },
        { z: 2, parallax: 0.35, bg: '#1a3a1a', texture: 'https://www.transparenttextures.com/patterns/subtle-grass.png', opacity: 0.65 },
        { z: 3, parallax: 1.0,  bg: '#2a4a2a', texture: 'https://www.transparenttextures.com/patterns/natural-paper.png', opacity: 0.8 },
      ],
      spawnPoint: { x: 650, y: 900 },
      nodes: [
        { id: 'szdy_npc_fairy',   type: 'npc',      icon: '🧚', label: '森林精灵', pos: { x: 1000, y: 500 }, floatDelay: '0s',   data: { name: '绿灵', role: '森林守护者', avatar: '🧚', isAI: true, aiPersonality: '温柔神秘的精灵，熟知每一株草药的功效，用自然哲学解读生命意义', bindInheritorId: null, dialog: [] } },
        { id: 'szdy_npc_doctor',  type: 'npc',      icon: '🌿', label: '草药医者', pos: { x: 600,  y: 700 }, floatDelay: '1s',   data: { name: '叶神医', role: '中医草药传承者', avatar: '🌿', isAI: false, bindInheritorId: null, dialog: [{ text: '"这位年轻人，你可知这片紫苏叶的药性？认识草药，是与大自然对话的第一步。"', options: ['请赐教！', '我略知一二', '我来采药'] }] } },
        { id: 'szdy_workshop_herb', type: 'workshop', icon: '⛩️', label: '草药工坊', pos: { x: 350, y: 350 }, floatDelay: '0.4s', data: { bindInheritorId: null, name: '草药工坊', desc: '中医草药 · 花草染色 · 树皮画制作' } },
        { id: 'szdy_collect_herb1', type: 'collect', icon: '🌿', label: '采草药',   pos: { x: 1500, y: 600 }, floatDelay: '1.5s', data: { itemName: '紫苏叶', itemIcon: '🌿', itemType: 'material', count: 5, rarity: 1, desc: '新鲜的紫苏叶，中医常用药材', respawnSecs: 200 } },
        { id: 'szdy_collect_flower', type: 'collect', icon: '🌸', label: '花海',   pos: { x: 900,  y: 1400 }, floatDelay: '2s',  data: { itemName: '百花精华', itemIcon: '🌸', itemType: 'material', count: 3, rarity: 2, desc: '采集自各色鲜花的精华', respawnSecs: 360 } },
        { id: 'szdy_collect_mushroom', type: 'collect', icon: '🍄', label: '灵芝',  pos: { x: 2200, y: 700 }, floatDelay: '2.5s', data: { itemName: '千年灵芝', itemIcon: '🍄', itemType: 'collection', count: 1, rarity: 4, desc: '生长千年的稀有灵芝，极具收藏价值', respawnSecs: 1800 } },
        { id: 'szdy_hidden_tree', type: 'hidden',    icon: '✨', label: '???',       pos: { x: 2400, y: 1500 }, floatDelay: '0.6s', data: { triggerDesc: '古树的树洞里，藏着一本用树皮写成的古书。第一页写道："此乃世间所有草药的母典……"', rewardItem: '草药母典', rewardIcon: '📗', rewardCount: 1, rarity: 5, questTrigger: 'side_herb_master' } },
        { id: 'szdy_rest_treehouse', type: 'rest',   icon: '🌳', label: '精灵树屋', pos: { x: 1300, y: 1300 }, floatDelay: '3s',  data: { name: '精灵树屋', desc: '精灵为你准备的树屋，温暖而神奇', healAmount: 70, randomEvent: true } },
      ],
      blockedZones: [
        { x: 0,    y: 0,    w: 2600, h: 80 },
        { x: 0,    y: 1720, w: 2600, h: 80 },
        { x: 2000, y: 300,  w: 400,  h: 400 }, /* 大古树区域 */
      ],
    },
  },

};  /* end sceneConfig */


/* ============================================================
   辅助：获取所有区域列表（用于大地图渲染）
   ============================================================ */
const sceneList = Object.values(sceneConfig);

/* 区域分组（用于筛选） */
const sceneGroups = {
  china: ['wanyicheng','baiweixiang','qinglanjie','baizuozhen','jinxiufang','tongxiyu','yuanjingdu','wanxiangtai'],
  world: ['ouluoba','midianzhijing','cangminghai','fukongyunjing','shahaiyicheng','senzhidiyu'],
};