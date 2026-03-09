/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║         寻遗集 · 天工造物系统 · 统一终极版                      ║
 * ║  crafting-system.js                                          ║
 * ║                                                              ║
 * ║  整合来源：                                                    ║
 * ║    · game-content.js  — CRAFTING_STATIONS / CRAFTING_RECIPES ║
 * ║                         / ADVANCED_RECIPES                   ║
 * ║    · core.js          — openCrafting / startWorking /        ║
 * ║                         _resolveCraftingMutation / 图鉴系统    ║
 * ║    · crafting-upgrade.js — 旧补丁，现已废弃                    ║
 * ║                                                              ║
 * ║  架构：                                                        ║
 * ║    CRAFT_DATA      — 所有设备 + 配方 + 工序的数据库             ║
 * ║    CraftEngine     — 状态机：选台 → 选方 → 步进工序 → 结算      ║
 * ║    CraftRenderer   — 全屏沉浸 UI（设备大厅 / 工序界面 / 结算页） ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

'use strict';

/* ════════════════════════════════════════════════════════════════
   一、数据层：设备 × 配方 × 工序
   ════════════════════════════════════════════════════════════════ */

/**
 * CRAFT_DATA  全局造物数据库
 *
 * 每条 station：
 *   id, name, icon, region, level, desc, atmosphere
 *   bgColor        — 沉浸界面专属背景渐变
 *   recipes[]      — 本设备配方列表
 *
 * 每条 recipe：
 *   id, name, icon, type, desc
 *   reqs{}         — 材料需求
 *   steps[]        — 真实非遗工序（按顺序推进）
 *   mutations[]    — 变异分支（环境/额外材料触发稀有产出）
 *   compendium{}   — 解锁图鉴记录
 *   defaultUnlocked — 是否默认解锁
 *
 * 每条 step：
 *   id, name, icon, desc        — 工序名称与图示说明
 *   detail                      — 匠师口诀（小字提示）
 *   duration                    — 毫秒，动画时长
 *   interactionType             — 'confirm' / 'rhythm' / 'timing' / 'select' / 'observe'
 *   interactionConfig{}         — 对应交互所需参数
 */

const CRAFT_DATA = {

  /* ──────────────────────────────────────────
     设备 1：碾洗池  · 百作镇
     基础提纯设备，几乎所有半成品的起点
  ────────────────────────────────────────── */
  wash_pool: {
    id: 'wash_pool',
    name: '碾洗池',
    icon: '🚰',
    region: '百作镇',
    level: '一阶',
    desc: '以山泉漂洗原料，剔除杂质。这里是所有造物的起点。',
    atmosphere: '流水潺潺，空气里漂浮着淡淡的泥土与草木香气。',
    bgColor: 'linear-gradient(160deg, #1a2a1a 0%, #0f1a10 60%, #0a100b 100%)',
    accentColor: '#7eb6a1',

    recipes: [
      {
        id: 'recipe_refined_clay',
        name: '精制陶泥',
        icon: '🟤',
        type: '半成品 · 陶瓷线',
        desc: '剔除杂质、反复揉练的细腻陶泥，是一切陶瓷造物的根基。',
        reqs: { '高岭陶土': 2 },
        defaultUnlocked: true,
        steps: [
          {
            id: 's1', name: '淘洗原土', icon: '💧',
            desc: '将高岭陶土倒入碾洗池，引山泉水反复淘洗，去除砂石与杂质。',
            detail: '口诀：水清则泥净，急冲不如慢淘。',
            duration: 2000,
            interactionType: 'rhythm',
            interactionConfig: { label: '轻柔搅动', targetCount: 6, hint: '匀速搅拌，勿急勿躁' }
          },
          {
            id: 's2', name: '沉淀分层', icon: '⏳',
            desc: '静置泥浆，等待粗细颗粒自然沉淀分层，取上层细腻陶浆。',
            detail: '口诀：急火难得好泥，静候方知真味。',
            duration: 2500,
            interactionType: 'timing',
            interactionConfig: { label: '静候沉淀', holdSeconds: 3, hint: '保持耐心，等待泥浆完全澄清' }
          },
          {
            id: 's3', name: '揉练成泥', icon: '🤲',
            desc: '双手交替揉练陶泥，排出气泡，使泥质均匀细腻，富有韧性。',
            detail: '口诀：百揉方能去气泡，顺纹揉练不可逆。',
            duration: 2000,
            interactionType: 'rhythm',
            interactionConfig: { label: '反复揉练', targetCount: 10, hint: '有节律地揉压，感受泥的韧劲' }
          }
        ],
        mutations: [
          { reqExtra: '清晨露水', resultName: '冰霜陶泥', icon: '🧊',
            desc: '融合了晨露的变异陶泥，触手生凉，烧制后釉色清冽。' },
          { reqExtra: '赤铁矿粉', resultName: '赤焰陶泥', icon: '🔥',
            desc: '混入赤铁矿的陶泥，烧制后呈赤红底色，炉火之色。' },
          { reqExtra: '古陶碎片', resultName: '古韵陶泥', icon: '🏺',
            desc: '融合古陶灵气的陶泥，自带古朴纹路，隐有窑神庇佑。' }
        ],
        compendium: { history: '高岭陶土得名自江西景德镇高岭村，是世界上最早被发现和使用的优质制瓷原料。', reward: 50 }
      },
      {
        id: 'recipe_paper_pulp',
        name: '竹浆纸浆',
        icon: '📜',
        type: '半成品 · 造纸线',
        desc: '灵竹捣制的纸浆，纤维细腻，是古法造纸的关键原料。',
        reqs: { '灵竹': 2, '石灰': 1 },
        defaultUnlocked: true,
        steps: [
          {
            id: 's1', name: '沤竹软化', icon: '🌿',
            desc: '将灵竹截段，加入石灰水浸沤，使竹纤维软化分离，去除木质素。',
            detail: '口诀：石灰沤竹须三日，心急出不了好纸。',
            duration: 2500,
            interactionType: 'timing',
            interactionConfig: { label: '静候沤竹', holdSeconds: 4, hint: '石灰水充分浸透，竹纤维方能软化' }
          },
          {
            id: 's2', name: '捣浆成糊', icon: '🔨',
            desc: '将软化的竹料取出，放入石臼反复捣打，直至成为均匀细腻的纸浆。',
            detail: '口诀：捣浆如捣心，力均则浆匀。',
            duration: 2000,
            interactionType: 'rhythm',
            interactionConfig: { label: '石臼捣浆', targetCount: 12, hint: '有力而均匀，将竹纤维彻底打散' }
          },
          {
            id: 's3', name: '漂洗净化', icon: '💧',
            desc: '将粗浆入池漂洗，反复换水清除杂质，使浆料洁白纯净。',
            detail: '口诀：洗去黄浆留白魂，换水三次见真颜。',
            duration: 2000,
            interactionType: 'rhythm',
            interactionConfig: { label: '漂洗净化', targetCount: 6, hint: '换水至浆水清澈，纸浆呈白色' }
          }
        ],
        mutations: [
          { reqExtra: '檀木灰', resultName: '檀香纸浆', icon: '🪵',
            desc: '加入檀木灰的纸浆，抄出的纸张带有淡淡的檀香，防虫防蛀。' },
          { conditionEnv: 0, resultName: '晨露纸浆', icon: '💧',
            desc: '晨曦时分取山泉水调制，纸浆分外洁白，韧性更佳。' }
        ],
        compendium: { history: '竹纸是中国造纸史上的重要发明，宋代已普遍使用，竹料丰富，纸质优良。', reward: 50 }
      },
      {
        id: 'recipe_silk_thread',
        name: '五彩绣线',
        icon: '🧶',
        type: '半成品 · 织绣线',
        desc: '经过草木染色的上等绣线，是苏绣与云锦的核心材料。',
        reqs: { '苏绣丝线': 2 },
        defaultUnlocked: true,
        steps: [
          {
            id: 's1', name: '选料理丝', icon: '🪡',
            desc: '从原料中挑选光泽均匀、粗细一致的蚕丝，去除疵点，理顺丝纹。',
            detail: '口诀：丝如人心，乱则不可用。',
            duration: 1800,
            interactionType: 'select',
            interactionConfig: {
              question: '以下哪种蚕丝最适合做绣线？',
              options: ['光泽均匀、柔软细腻的天然蚕丝', '粗细不一的混纺丝线', '表面起毛的旧丝线', '捻度过高的化纤丝'],
              correct: 0,
              feedback: ['正确！天然蚕丝光泽柔和，韧性好，是苏绣最佳原料。', '捻度不均的丝线绣出的图案会凹凸不平。', '旧丝线张力不足，绣品易变形。', '化纤丝光泽生硬，缺少真丝的温润感。']
            }
          },
          {
            id: 's2', name: '草木染色', icon: '🌿',
            desc: '将理好的丝线放入草木染液中浸染，按需调配颜色深浅，反复浸染固色。',
            detail: '口诀：午时日正染色佳，阳气助发色泽浓。',
            duration: 2500,
            interactionType: 'timing',
            interactionConfig: { label: '浸染定色', holdSeconds: 4, hint: '保持浸泡时间充足，颜色才能均匀渗透' }
          },
          {
            id: 's3', name: '晾晒固色', icon: '☀️',
            desc: '将染好的丝线悬挂晾晒，让染料与丝纤维完全结合，色彩持久不褪。',
            detail: '口诀：日晒方能固真色，阴干易褪不长久。',
            duration: 1500,
            interactionType: 'confirm',
            interactionConfig: { label: '完成晾晒', message: '丝线在阳光下闪着美丽的光泽，染色均匀，色彩饱满。' }
          }
        ],
        mutations: [
          { conditionEnv: 1, resultName: '大红朱砂线', icon: '🩸',
            desc: '午时烈阳下染就的正红色绣线，百年不褪，是苏绣最难得的用线。' },
          { reqExtra: '蓝草汁液', resultName: '青岚蓝绣线', icon: '🔵',
            desc: '青岚界蓝草染制，颜色如青山绿水，清新淡雅，极难复制。' },
          { reqExtra: '栀子花粉', resultName: '栀子白绣线', icon: '⚪',
            desc: '栀子花粉染制的白绣线，自带清香，不易泛黄，绣白描最为传神。' }
        ],
        compendium: { history: '草木染是中国最古老的染色工艺，天然植物提取的染料色泽温润、环保持久。', reward: 50 }
      }
    ]
  },

  /* ──────────────────────────────────────────
     设备 2：草木染缸  · 锦绣坊
     织物上色专用设备
  ────────────────────────────────────────── */
  dye_vat: {
    id: 'dye_vat',
    name: '草木染缸',
    icon: '⚗️',
    region: '锦绣坊',
    level: '一阶',
    desc: '以天然草木提炼染料，为织物赋予永不褪色的自然之色。',
    atmosphere: '缸边热气腾腾，空气里弥漫着草木清香与淡淡的酸涩味。',
    bgColor: 'linear-gradient(160deg, #1a1a2a 0%, #10101a 60%, #080810 100%)',
    accentColor: '#8a6da8',

    recipes: [
      {
        id: 'recipe_shadow_puppet_fabric',
        name: '皮影面料',
        icon: '🎭',
        type: '半成品 · 织绣线',
        desc: '经特殊工序处理的驴皮面料，透光性极佳，是皮影的专用材料。',
        reqs: { '驴皮': 1, '草木染料': 2 },
        defaultUnlocked: true,
        steps: [
          {
            id: 's1', name: '刮皮除毛', icon: '🗡️',
            desc: '将驴皮铺平，用刮刀从皮中间向四周刮展，去除毛根，反复刮至皮面光洁透亮。',
            detail: '口诀：刮皮要从中向外，力道均匀不留毛根。',
            duration: 2000,
            interactionType: 'rhythm',
            interactionConfig: { label: '刮皮展平', targetCount: 10, hint: '匀速向外刮，皮面要光滑如镜' }
          },
          {
            id: 's2', name: '草木浸染', icon: '⚗️',
            desc: '将刮好的驴皮放入草木染缸，用石榴皮、黄连等天然染料浸染，使皮面均匀上色。',
            detail: '口诀：染色入骨需浸透，半染之皮不成影。',
            duration: 2500,
            interactionType: 'timing',
            interactionConfig: { label: '浸染入色', holdSeconds: 5, hint: '充分浸泡，染料渗透至皮料内部' }
          },
          {
            id: 's3', name: '绷架晾干', icon: '🔆',
            desc: '将染色后的驴皮绷在木架上自然晾干，保持张力使皮面平整，不起皱折。',
            detail: '口诀：绷紧四角，中心拉平，待干后皮影方能透光显形。',
            duration: 1800,
            interactionType: 'confirm',
            interactionConfig: { label: '绷架定型', message: '驴皮在阳光下呈现出美丽的透明感，是制作皮影的上好材料。' }
          }
        ],
        mutations: [
          { reqExtra: '荧光孢子', resultName: '夜光皮影面料', icon: '✨',
            desc: '融入荧光孢子的皮影面料，夜间能发出幽蓝光芒，演出效果震撼人心。' }
        ],
        compendium: { history: '皮影制作选用驴皮为主，以其薄而均匀、透光性好著称，陕西皮影多用牛皮，各地用料不同。', reward: 60 }
      }
    ]
  },

  /* ──────────────────────────────────────────
     设备 3：拉坯机  · 青岚界陶坊
     陶瓷塑形核心设备
  ────────────────────────────────────────── */
  pottery_wheel: {
    id: 'pottery_wheel',
    name: '拉坯机',
    icon: '💿',
    region: '青岚界',
    level: '二阶',
    desc: '双手驾驭旋转的泥土，在离心力与掌力之间塑造出器物的生命。',
    atmosphere: '泥香弥漫，轮盘低吟，每一件器物都在匠师的双手间诞生。',
    bgColor: 'linear-gradient(160deg, #2a1a10 0%, #1a0e08 60%, #100a04 100%)',
    accentColor: '#c87020',

    recipes: [
      {
        id: 'recipe_clay_cup',
        name: '茶盏素坯',
        icon: '🥣',
        type: '半成品 · 陶瓷线',
        desc: '在拉坯机上初步成型的茶盏，尚未施釉，等待入窑的毛坯。',
        reqs: { '精制陶泥': 1 },
        defaultUnlocked: true,
        steps: [
          {
            id: 's1', name: '揉泥定心', icon: '🤲',
            desc: '将陶泥放上转盘中心，双手紧压，随着转盘旋转，将泥料聚中定心，这是拉坯的基础。',
            detail: '口诀：泥不居中，器必歪斜。两掌合力，稳住泥心。',
            duration: 2500,
            interactionType: 'rhythm',
            interactionConfig: { label: '聚泥定心', targetCount: 8, hint: '双手均匀施压，将泥料推向转盘中心' }
          },
          {
            id: 's2', name: '开孔立壁', icon: '🕳️',
            desc: '拇指从泥料顶端向下压开孔穴，同时双手配合，将器壁向上提拉，茶盏雏形渐渐显现。',
            detail: '口诀：开孔不可过深，留底厚薄均匀，提壁须随轮转，力聚指尖入泥。',
            duration: 3000,
            interactionType: 'timing',
            interactionConfig: { label: '提壁成形', holdSeconds: 4, hint: '慢慢向上提拉，感受泥土在指间延伸的力量' }
          },
          {
            id: 's3', name: '修整定型', icon: '✂️',
            desc: '用修坯刀修整内外壁，使厚薄均匀，口沿平整，底部平稳，完成素坯定型。',
            detail: '口诀：厚薄均匀方显功力，一刀定胜败。',
            duration: 2000,
            interactionType: 'select',
            interactionConfig: {
              question: '修整茶盏口沿时，最重要的是？',
              options: ['保持水平，厚薄均匀', '越薄越好，显示技艺', '越厚越好，经久耐用', '形状不规则，彰显个性'],
              correct: 0,
              feedback: [
                '完美！口沿均匀水平，才能保证成品的品质和使用体验。',
                '过薄的口沿烧制时易变形开裂。',
                '过厚的口沿会影响饮茶时的口感体验。',
                '传统茶盏讲究形制规整，不规则反而是瑕疵。'
              ]
            }
          }
        ],
        mutations: [
          { reqExtra: '木模茶盏', resultName: '雕花茶盏素坯', icon: '🪵',
            desc: '借助木模辅助塑形的茶盏素坯，器壁浮现精美雕花纹路，无需后期雕刻。' },
          { conditionQuest: 'potter_wish', resultName: '如意茶盏素坯', icon: '☁️',
            desc: '造型圆润饱满，自带如意纹路的素坯，据说窑变成功率大幅提升。' }
        ],
        compendium: { history: '拉坯是陶瓷成型的核心工艺，需要匠师用双手感知泥土的变化，是一门沟通人与土地的艺术。', reward: 80 }
      },
      {
        id: 'recipe_porcelain_vase',
        name: '青瓷梅瓶素坯',
        icon: '🏺',
        type: '半成品 · 陶瓷线',
        desc: '仿宋代梅瓶造型的精致素坯，瓶身修长，线条流畅，需要极高的拉坯技艺。',
        reqs: { '精制陶泥': 2, '雕花木模': 1 },
        defaultUnlocked: false,
        steps: [
          {
            id: 's1', name: '泥料揉练', icon: '🤲',
            desc: '梅瓶需要更多用料，将两份陶泥充分揉练至无气泡、质地均一。',
            detail: '口诀：大器所用泥更厚，揉练更需耐心足。',
            duration: 2500,
            interactionType: 'rhythm',
            interactionConfig: { label: '揉练泥料', targetCount: 15, hint: '充分揉练，排尽所有气泡，泥质要细腻均匀' }
          },
          {
            id: 's2', name: '拉坯成形', icon: '💿',
            desc: '参照木模比例，在转盘上将泥料拉制成梅瓶雏形：小口、短颈、宽肩、收腰。',
            detail: '口诀：梅瓶要口小颈短，肩宽腰收，线条流转如梅枝。',
            duration: 3500,
            interactionType: 'timing',
            interactionConfig: { label: '拉坯定形', holdSeconds: 5, hint: '慢慢调整，梅瓶的线条美感全在这一步' }
          },
          {
            id: 's3', name: '木模校准', icon: '📐',
            desc: '用雕花木模对照修整瓶身比例，确保造型符合宋代梅瓶的经典样式。',
            detail: '口诀：古法器型有标准，木模校准不差毫。',
            duration: 2000,
            interactionType: 'confirm',
            interactionConfig: { label: '校准完成', message: '梅瓶素坯造型端庄，线条流畅，完美复现了宋代器型的神韵。' }
          }
        ],
        mutations: [
          { reqExtra: '古瓷粉', resultName: '宋韵梅瓶素坯', icon: '🕰️',
            desc: '融合了宋代古瓷粉的素坯，入窑烧制后自带古瓷特有的含蓄光泽。' }
        ],
        compendium: { history: '梅瓶是中国最具代表性的瓷器造型之一，因口小如梅花蕊而得名，宋代已广泛流行。', reward: 100 }
      }
    ]
  },

  /* ──────────────────────────────────────────
     设备 4：龙窑  · 青岚界
     终极高温烧制设备，时辰决定命运
  ────────────────────────────────────────── */
  kiln: {
    id: 'kiln',
    name: '龙窑',
    icon: '🔥',
    region: '青岚界',
    level: '三阶',
    desc: '沿山坡蜿蜒而上的龙形窑炉，烈焰中诞生千年不朽的瓷器。时辰决定窑变。',
    atmosphere: '烈焰升腾，窑口赤红，远处传来古老的窑神祭词，空气里漂浮着木炭与土的气息。',
    bgColor: 'linear-gradient(160deg, #2a0e00 0%, #1a0800 60%, #100400 100%)',
    accentColor: '#e85020',
    envHint: {
      0: '晨曦时分，窑温温和，适合烧制基础器型。',
      1: '午时阳气鼎盛，窑火正旺，产出稳定。',
      2: '黄昏逢魔，窑温难控，需格外谨慎。',
      3: '子夜星汉灿烂，阴阳交汇，是触发【窑变】的绝佳时机！'
    },

    recipes: [
      {
        id: 'recipe_base_cup',
        name: '素面青瓷',
        icon: '🍵',
        type: '陶瓷造物',
        desc: '最基础的龙泉青瓷，釉色青翠，温润如玉，是龙泉窑的经典器型。',
        reqs: { '茶盏素坯': 1, '沉香木料': 1 },
        defaultUnlocked: true,
        steps: [
          {
            id: 's1', name: '调配青釉', icon: '🎨',
            desc: '将草木灰与长石粉按比例调配成青釉，稀稠要恰到好处，过稀则釉面薄，过稠则起皱。',
            detail: '口诀：釉如鸡蛋清，稠稀有定数，差之毫厘，色差千里。',
            duration: 2500,
            interactionType: 'select',
            interactionConfig: {
              question: '龙泉青釉的颜色来自哪种化学成分？',
              options: ['氧化铁（Fe₂O₃）在还原焰中显青绿色', '氧化铜在高温中显蓝色', '氧化锰显褐色', '纯石英砂显白色'],
              correct: 0,
              feedback: [
                '正确！龙泉青瓷的釉色来自铁元素在还原焰中的变化，这是中国瓷器工艺的智慧结晶。',
                '铜红釉是另一种名贵釉色，但那是铜，不是铁。',
                '锰料多用于黑釉，是建盏的主要着色剂。',
                '纯石英会形成透明釉，不会出现青绿色。'
              ]
            }
          },
          {
            id: 's2', name: '施釉入窑', icon: '🏺',
            desc: '将素坯浸入釉液或用吹釉法均匀施釉，厚薄要一致，然后小心放入窑位。',
            detail: '口诀：施釉如施妆，厚薄要均匀，轻拿轻放，勿碰釉面。',
            duration: 2000,
            interactionType: 'timing',
            interactionConfig: { label: '浸釉入窑', holdSeconds: 3, hint: '稳定地控制浸釉速度，釉层厚薄均匀才能烧出好颜色' }
          },
          {
            id: 's3', name: '封窑燃火', icon: '🔥',
            desc: '封好窑门，用沉香木料点火，按照龙泉窑传统烧法，从低温慢慢升至1300度，控制气氛。',
            detail: '口诀：低温驱水气，中温排有机物，高温方成瓷。龙泉窑需还原焰，烟色定青翠。',
            duration: 3000,
            interactionType: 'rhythm',
            interactionConfig: { label: '控火加薪', targetCount: 8, hint: '有节奏地投柴，保持窑内温度均匀上升' }
          },
          {
            id: 's4', name: '察火出窑', icon: '👁️',
            desc: '透过窥火孔观察窑内火色，从橙红→橙黄→亮白，判断最佳出窑时机。',
            detail: '口诀：火色亮白如月，方是出窑时。急出则生，迟出则过火。',
            duration: 3500,
            interactionType: 'observe',
            interactionConfig: {
              stages: ['窑内火色橙红（温度不足）', '窑内火色橙黄（温度上升）', '窑内火色亮白（最佳时机！）', '窑内火色略带蓝（稍过）'],
              correctStage: 2,
              hint: '耐心等待，亮白色火焰是出窑的最佳信号'
            }
          }
        ],
        mutations: [
          {
            conditionEnv: 3,
            resultName: '曜变天目盏',
            icon: '🌌',
            desc: '碗中仿佛藏着整片星空，子夜阴阳交汇产生的绝对窑变奇迹，世间罕见。',
            compendium: { history: '曜变天目是世界上最神秘的瓷器，现存世仅三件完整器，皆为日本国宝，均来自中国宋代建窑。', reward: 800 }
          },
          {
            reqExtra: '西域香料',
            resultName: '异香波斯陶杯',
            icon: '🏺',
            desc: '青瓷工艺与西域风情的完美碰撞，器身永久散发奇异香气。',
            compendium: { history: '丝绸之路上的文化交融见证，中国瓷器随商队抵达波斯，工艺与材料融合诞生了这件独特器物。', reward: 500 }
          },
          {
            reqExtra: '珍珠粉',
            resultName: '珍珠青瓷盏',
            icon: '💎',
            desc: '釉面泛着珍珠光泽，温润细腻，是明代御窑秘方的复刻。',
            compendium: { history: '明代御窑将珍珠粉混入釉料，烧制后釉面莹润如珠，为皇室专属制法。', reward: 650 }
          },
          {
            conditionEnv: 1,
            conditionQuest: 'celadon_heritage',
            resultName: '秘色青瓷盏',
            icon: '✨',
            desc: '釉色青如雨后湖水，隐现神秘光泽，是龙泉窑失传千年的巅峰之作。',
            compendium: { history: '秘色瓷是唐代越窑的极品，专供宫廷使用，其配方失传逾千年，此为传承人复刻版本。', reward: 700 }
          }
        ],
        compendium: { history: '龙泉窑是中国历史上最著名的青瓷产地，位于浙江龙泉，烧造历史逾千年，产品远销海内外。', reward: 200 }
      },
      {
        id: 'recipe_celadon_vase',
        name: '刻花青瓷梅瓶',
        icon: '🏺',
        type: '陶瓷造物',
        desc: '瓶身刻有缠枝莲纹的龙泉青瓷梅瓶，造型典雅，是龙泉窑的代表器型。',
        reqs: { '青瓷梅瓶素坯': 1, '青釉料': 1, '竹制刻刀': 1 },
        defaultUnlocked: false,
        steps: [
          {
            id: 's1', name: '阴干修坯', icon: '⏳',
            desc: '将素坯置于通风处慢慢阴干至半干状态，此时最适合雕刻，既不会太软，也不会开裂。',
            detail: '口诀：半干如皮革，刀入不粘，纹路清晰。',
            duration: 2000,
            interactionType: 'timing',
            interactionConfig: { label: '静候阴干', holdSeconds: 3, hint: '等待坯体达到合适的干燥度，不可急于求成' }
          },
          {
            id: 's2', name: '刻缠枝莲纹', icon: '✒️',
            desc: '用竹制刻刀在梅瓶肩部刻出流畅的缠枝莲纹，线条要连贯流畅，深浅一致。',
            detail: '口诀：刻纹如写字，起收有法，线条连贯，深浅一气。',
            duration: 3500,
            interactionType: 'rhythm',
            interactionConfig: { label: '刻绘纹路', targetCount: 12, hint: '有节奏地运刀，每一道纹路都是匠心的体现' }
          },
          {
            id: 's3', name: '施釉烧制', icon: '🔥',
            desc: '在刻纹处施以青釉，经龙窑高温烧制，釉料积聚在刻纹凹处，形成深浅变化的立体美感。',
            detail: '口诀：刻纹处釉厚，平面处釉薄，层次分明，立体感强。',
            duration: 3000,
            interactionType: 'timing',
            interactionConfig: { label: '施釉入窑', holdSeconds: 4, hint: '均匀施釉后入窑，高温中刻纹处的釉色会更深翠' }
          }
        ],
        mutations: [
          {
            conditionEnv: 2, reqExtra: '金粉',
            resultName: '描金青瓷梅瓶', icon: '✨',
            desc: '刻纹处描以金粉，青翠与赤金相映成辉，是宫廷御用级器物。',
            compendium: { history: '清代康熙年间御窑首创，刻花与描金结合，工艺精湛，现为一级文物。', reward: 900 }
          },
          {
            reqExtra: '鲛人泪',
            resultName: '海韵青瓷梅瓶', icon: '🌊',
            desc: '釉面融入鲛人泪，烧制后瓶身涌现海浪纹路，触之微凉如海风。',
            compendium: { history: '传说鲛人泪入釉，能让瓷器永藏海洋灵气，此物极为罕见，是传说与工艺的完美结合。', reward: 1000 }
          }
        ],
        compendium: { history: '龙泉刻花瓷是在拉坯成型后用竹刀在坯体上刻出纹饰，施釉后纹路处釉色更深，立体感强烈。', reward: 350 }
      }
    ]
  },

  /* ──────────────────────────────────────────
     设备 5：苏绣绷架  · 锦绣坊
     丝线穿梭，在布绷上绣出东方美学
  ────────────────────────────────────────── */
  embroidery_frame: {
    id: 'embroidery_frame',
    name: '苏绣绷架',
    icon: '🪡',
    region: '锦绣坊',
    level: '二阶',
    desc: '绷起底布，穿针引线，在方寸之间绣出山川万物，一针一线皆是匠心。',
    atmosphere: '光线柔和，针线轻响，绣娘的手指在绣布间飞舞，岁月静好。',
    bgColor: 'linear-gradient(160deg, #2a1a1a 0%, #1a0f0f 60%, #100808 100%)',
    accentColor: '#d46090',

    recipes: [
      {
        id: 'recipe_base_fan',
        name: '苏绣青皮团扇',
        icon: '🪭',
        type: '织绣造物',
        desc: '以竹青为骨，苏绣为面，精致的江南风情团扇，一面藏着姑苏的夏日时光。',
        reqs: { '五彩绣线': 1, '云锦残片': 1 },
        defaultUnlocked: true,
        steps: [
          {
            id: 's1', name: '裁绷底布', icon: '✂️',
            desc: '将云锦残片裁成圆形，绷在竹制扇骨上，绷紧四边，确保布面平整无皱。',
            detail: '口诀：底布要绷紧，松弛则针法乱；绷布如绷心，端正是根本。',
            duration: 1800,
            interactionType: 'confirm',
            interactionConfig: { label: '绷布完成', message: '底布绷紧平整，扇面如一张等待作画的宣纸。' }
          },
          {
            id: 's2', name: '描稿定样', icon: '📝',
            desc: '用细毛笔在底布上轻描图案轮廓，江南常见题材：荷花、鸳鸯、竹枝。',
            detail: '口诀：描稿要淡，绣完后自然消失；线条要准，方向与绣线走向一致。',
            duration: 2000,
            interactionType: 'select',
            interactionConfig: {
              question: '苏绣最著名的"乱针绣"的主要特点是？',
              options: ['线条交叉叠加，表现光影层次与立体感', '全部用直线绣制，整齐划一', '只用一种颜色的线，通过疏密表现明暗', '模仿油画笔触，完全随机排列'],
              correct: 0,
              feedback: [
                '正确！乱针绣是苏绣的革新技法，通过不同方向的线条交叉来表现光影，能绣出极为逼真的效果。',
                '全直线绣制是"平绣"，乱针绣的精髓在于"乱中有序"。',
                '单色绣是"白描绣"，乱针绣通常需要多种颜色叠加。',
                '乱针绣的线条看似随机，实则有严格的规律，需要极高的控制力。'
              ]
            }
          },
          {
            id: 's3', name: '平绣填色', icon: '🪡',
            desc: '穿入五彩绣线，以苏绣基本针法"平针"沿轮廓填绣，针迹细密整齐，如行云流水。',
            detail: '口诀：平、齐、和、光、顺、匀 — 这是苏绣六字真诀，每一针都要做到。',
            duration: 3000,
            interactionType: 'rhythm',
            interactionConfig: { label: '穿针走线', targetCount: 16, hint: '每一针都要细密均匀，绣出平、齐、光的苏绣真谛' }
          },
          {
            id: 's4', name: '收尾整理', icon: '✨',
            desc: '完成主体图案后，收针固线，用熨斗轻烫整平，装上竹骨，团扇大功告成。',
            detail: '口诀：收针藏于底布之间，线头不可外露，方显绣品之精致。',
            duration: 1500,
            interactionType: 'confirm',
            interactionConfig: { label: '装骨完成', message: '苏绣团扇完成！绣面平整光洁，色彩鲜艳，散发着江南丝绸特有的温润光泽。' }
          }
        ],
        mutations: [
          {
            reqExtra: '鲛绡断匹',
            resultName: '幻海流光扇', icon: '🌊',
            desc: '扇面如水波流动，挥舞时有海潮之音，是苏绣工艺与深海传说的奇异结合。',
            compendium: { history: '结合了江南苏绣与传说中鲛人织造技艺，扇面随光线角度呈现不同波纹，令人叹为观止。', reward: 600 }
          },
          {
            reqExtra: '荧光孢子',
            resultName: '夜光幽梦扇', icon: '✨',
            desc: '白天看似平淡无奇，夜晚扇面上浮现出发光图腾，如梦似幻。',
            compendium: { history: '融合了森林秘境荧光生物材料的先锋非遗创作，白昼与夜晚呈现完全不同的面貌。', reward: 550 }
          },
          {
            reqExtra: '戏服绣线',
            resultName: '梨园雅韵扇', icon: '🎭',
            desc: '扇面绣有昆曲人物纹样，每一根绣线都来自万艺城名旦的戏服，挥舞间隐有唱腔萦绕。',
            compendium: { history: '采用万艺城戏服的边角绣线，绣以昆曲人物，将两种非遗艺术融于一扇，文化底蕴深厚。', reward: 650 }
          },
          {
            conditionEnv: 0, reqExtra: '古绣针',
            resultName: '古绣流云扇', icon: '☁️',
            desc: '晨曦时分以明代古绣针绣制，针法细腻如古代绣娘，绣纹如流云般舒展飘逸。',
            compendium: { history: '使用明代传世古绣针，针法沿袭古法，在晨光中绣制，还原了明代苏绣巅峰水准。', reward: 700 }
          }
        ],
        compendium: { history: '苏绣是中国四大名绣之首，发源于苏州，有两千余年历史，以"平、齐、和、光、顺、匀"为技艺标准。', reward: 250 }
      },
      {
        id: 'recipe_brocade_robe',
        name: '云锦霞帔',
        icon: '👘',
        type: '织绣造物',
        desc: '仿明代霞帔造型的云锦服饰，绣有缠枝莲纹，华贵典雅，是皇家织造的代表。',
        reqs: { '云锦面料': 2, '珍珠绣线': 1, '古绣针': 1 },
        defaultUnlocked: false,
        steps: [
          {
            id: 's1', name: '裁料定版', icon: '📐',
            desc: '按照明代霞帔的标准版型裁剪云锦，分为前后身和两袖，比例严格遵照古制。',
            detail: '口诀：古制不可违，裁料差一寸，礼法失于身。',
            duration: 2000,
            interactionType: 'confirm',
            interactionConfig: { label: '裁料完成', message: '云锦在阳光下流光溢彩，每一寸都是织机上经纬交织的匠心。' }
          },
          {
            id: 's2', name: '绣缠枝纹', icon: '🪡',
            desc: '以古绣针穿珍珠绣线，在霞帔边缘绣制缠枝莲纹装饰，线条连绵不断，象征吉祥长寿。',
            detail: '口诀：缠枝莲纹要一气呵成，枝蔓连绵象征绵延富贵，不可有断点。',
            duration: 3500,
            interactionType: 'rhythm',
            interactionConfig: { label: '绣制纹饰', targetCount: 20, hint: '20针完成完整的缠枝纹路，每一针都要均匀细密' }
          },
          {
            id: 's3', name: '缀饰收尾', icon: '💎',
            desc: '在关键纹样处缀上珍珠，缝合各部件，整烫成形，使霞帔挺括飘逸。',
            detail: '口诀：珍珠要缀于吉祥纹样，缝合要密，整烫要轻，方显霞帔之气质。',
            duration: 2500,
            interactionType: 'timing',
            interactionConfig: { label: '缀珠收尾', holdSeconds: 4, hint: '仔细缝合每一处接缝，珍珠位置要对称美观' }
          }
        ],
        mutations: [
          {
            reqExtra: '鲛绡镶边',
            resultName: '鲛绡云锦霞帔', icon: '🌊',
            desc: '边缘镶有鲛绡，轻盈飘逸如仙女羽衣，水火不侵，入海如归。',
            compendium: { history: '明代贵妃专属款式，将云锦与鲛绡缝合，尽显皇家气派，是两种极品织物的完美融合。', reward: 1200 }
          },
          {
            reqExtra: '戏服碎布', conditionQuest: 'opera_robe_secret',
            resultName: '梨园云锦霞帔', icon: '🎭',
            desc: '融入戏服碎布，绣有戏曲人物，万艺城名角儿定制款，极具文化底蕴。',
            compendium: { history: '将戏曲文化与云锦工艺完美融合，是当代非遗创新的代表作，万艺城首演后一时洛阳纸贵。', reward: 1000 }
          }
        ],
        compendium: { history: '南京云锦是中国四大名锦之一，被誉为"锦中之王"，织造工艺极为复杂，是皇家御用面料。', reward: 450 }
      }
    ]
  },

  /* ──────────────────────────────────────────
     设备 6：皮影雕台  · 万艺城
     雕刻、上色皮影的专用操作台
  ────────────────────────────────────────── */
  shadow_puppet_carving: {
    id: 'shadow_puppet_carving',
    name: '皮影雕台',
    icon: '🎭',
    region: '万艺城',
    level: '二阶',
    desc: '在驴皮上雕刻出戏曲人物，每一刀都是对传统戏曲文化的敬意。',
    atmosphere: '灯光昏黄，皮革香气弥漫，远处传来秦腔的高亢唱腔。',
    bgColor: 'linear-gradient(160deg, #1a1020 0%, #100a15 60%, #080510 100%)',
    accentColor: '#9a4ab0',

    recipes: [
      {
        id: 'recipe_shadow_puppet',
        name: '关羽皮影',
        icon: '⚔️',
        type: '皮影造物',
        desc: '刻有关羽造型的皮影，红脸、长髯、青龙偃月刀，神态威严，刀工精细，栩栩如生。',
        reqs: { '皮影面料': 1, '五彩绣线': 1, '竹制刻刀': 1 },
        defaultUnlocked: true,
        steps: [
          {
            id: 's1', name: '描样勾线', icon: '✏️',
            desc: '将关羽样稿覆于皮影面料上，用锥针沿轮廓扎孔描样，再用墨线勾出完整轮廓。',
            detail: '口诀：扎孔要密，线条要流畅，关羽的神韵全在眉宇之间。',
            duration: 2000,
            interactionType: 'confirm',
            interactionConfig: { label: '描样完成', message: '关羽的威严轮廓跃然皮上，细细的墨线勾勒出那份凛然正气。' }
          },
          {
            id: 's2', name: '刀刻镂空', icon: '🗡️',
            desc: '以竹制刻刀沿线雕刻，刻出铠甲纹路、须发、兵器等细节，需要镂空的部分完全刻透。',
            detail: '口诀：关羽铠甲用直刀，胡须用弧刀，镂空处要干净利落，不留毛刺。',
            duration: 3500,
            interactionType: 'rhythm',
            interactionConfig: { label: '雕刻细节', targetCount: 18, hint: '控制刻刀力度，每一刀都要准确，镂空纹路决定透光效果' }
          },
          {
            id: 's3', name: '手绘上色', icon: '🎨',
            desc: '以五彩绣线染料调色，用细笔为皮影上色：红脸、黑髯、金甲、绿袍，颜色鲜明饱和。',
            detail: '口诀：皮影用色要纯正，关羽脸色正红，不可偏橙；金甲要亮，不可暗沉。',
            duration: 2500,
            interactionType: 'select',
            interactionConfig: {
              question: '关羽皮影的脸色应该是什么颜色，代表什么含义？',
              options: ['枣红色，代表忠义勇猛', '白色，代表奸诈阴险', '黑色，代表刚正铁面', '蓝色，代表威武勇猛'],
              correct: 0,
              feedback: [
                '正确！关羽在戏曲中以枣红脸为标志，代表忠义、勇猛，是正面英雄的象征颜色。',
                '白脸在戏曲中代表曹操等奸诈人物，与关羽的形象完全相反。',
                '黑脸代表包拯、张飞等刚正不阿的人物，关羽是红脸。',
                '蓝脸较少见，代表猛将或鬼神，如窦尔敦。'
              ]
            }
          },
          {
            id: 's4', name: '装杆完成', icon: '🎋',
            desc: '将上好色的皮影连接关节部位，装上竹杆，皮影操作杆的位置决定演出时的灵活程度。',
            detail: '口诀：主杆控头身，辅杆控双臂，关节连接要灵活，演出时方能千变万化。',
            duration: 1800,
            interactionType: 'confirm',
            interactionConfig: { label: '装杆完成', message: '关羽皮影完成！在灯光下，那威严的身影跃然幕布，仿佛穿越千年而来。' }
          }
        ],
        mutations: [
          {
            reqExtra: '古青铜粉',
            resultName: '青铜皮影', icon: '🪨',
            desc: '皮影表面涂抹古青铜粉，灯光下泛出青铜器特有的光晕，仿佛出土文物。',
            compendium: { history: '将皮影艺术与青铜工艺结合，赋予传统民间艺术以宫廷文物的厚重感，是当代非遗创新之作。', reward: 750 }
          },
          {
            conditionQuest: 'shadow_puppet_heritage',
            resultName: '古法皮影', icon: '🕰️',
            desc: '严格复刻唐代皮影工艺，造型古朴简洁，是皮影艺术一千多年传承的活化石。',
            compendium: { history: '唐代是皮影戏的黄金时期，造型简洁大气，此作品完整复原了当时的制作工艺，极为珍贵。', reward: 800 }
          }
        ],
        compendium: { history: '皮影戏起源于汉代，在陕西、甘肃、山西等地广泛流传，被誉为中国民间的"电影鼻祖"。', reward: 300 }
      }
    ]
  },

  /* ──────────────────────────────────────────
     设备 7：鲁班台  · 百作镇
     木作与机关拼装
  ────────────────────────────────────────── */
  wood_bench: {
    id: 'wood_bench',
    name: '鲁班台',
    icon: '🪚',
    region: '百作镇',
    level: '二阶',
    desc: '百作镇最古老的木作台，传说鲁班本人曾在此施展技艺。榫卯之间藏着中国建筑的智慧。',
    atmosphere: '木香馥郁，锯末飘飞，叮叮当当的凿击声是这里永恒的背景音乐。',
    bgColor: 'linear-gradient(160deg, #1a1505 0%, #10100a 60%, #080805 100%)',
    accentColor: '#c8a030',

    recipes: [
      {
        id: 'recipe_wood_base',
        name: '机扩木骨',
        icon: '🧩',
        type: '半成品 · 木作线',
        desc: '用鲁班榫卯工艺拼接的木制核心结构，无需一颗钉子，靠榫卯咬合屹立不倒。',
        reqs: { '沉香木料': 2 },
        defaultUnlocked: true,
        steps: [
          {
            id: 's1', name: '选木辨纹', icon: '🌲',
            desc: '仔细检视沉香木料的纹路走向，顺纹理方向下锯，使木骨结构更加稳固。',
            detail: '口诀：木有纹，纹有理；顺纹锯，力不虚；逆纹切，易开裂。',
            duration: 1800,
            interactionType: 'select',
            interactionConfig: {
              question: '制作榫卯结构时，为何要选用纹路顺直的木材？',
              options: ['顺纹木材强度高，不易开裂，榫卯更耐用', '美观，纹路好看', '顺纹木料更软，容易加工', '逆纹木料太贵'],
              correct: 0,
              feedback: [
                '正确！顺纹木材的纤维方向一致，抗拉强度高，制成榫卯后更加牢固耐用，千年不朽。',
                '美观确实重要，但功能性是首要考量。',
                '顺纹木料并不更软，但加工时更省力且不易起毛。',
                '选材是技艺，与价格无关。'
              ]
            }
          },
          {
            id: 's2', name: '开榫凿卯', icon: '🔨',
            desc: '精确标记榫卯位置，用锯开出榫头，用凿打出卯眼，尺寸要严丝合缝。',
            detail: '口诀：榫头宁小勿大，卯眼宁紧勿松，差之毫厘，失之千里。',
            duration: 3000,
            interactionType: 'rhythm',
            interactionConfig: { label: '凿击开榫', targetCount: 12, hint: '有节奏地凿击，感受木纤维在刃口处整齐分离' }
          },
          {
            id: 's3', name: '拼合固定', icon: '🧩',
            desc: '将各部件按照设计图纸拼合，用木槌轻击到位，不用一颗铁钉，全靠榫卯咬合固定。',
            detail: '口诀：轻敲慢插，不可蛮力；听声辨紧，入位有声。',
            duration: 2000,
            interactionType: 'timing',
            interactionConfig: { label: '咬合到位', holdSeconds: 3, hint: '慢慢压入，听到"咔哒"声意味着榫卯完美咬合' }
          }
        ],
        mutations: [
          { reqExtra: '胡杨木', resultName: '胡杨木骨', icon: '🌵',
            desc: '千年不倒的胡杨木制成的木骨，极度耐腐，是沙漠探险的绝佳材料。' },
          { reqExtra: '桐油', conditionQuest: 'luban_heritage', resultName: '防腐木骨', icon: '🛡️',
            desc: '桐油反复浸渍的木骨，防腐防虫，可保存数百年，是鲁班后人的秘传工艺。' }
        ],
        compendium: { history: '榫卯结构是中国木作技艺的核心，不用一颗铁钉，依靠木件之间的咬合实现稳固连接，是人类建筑史上的奇迹。', reward: 80 }
      },
      {
        id: 'recipe_base_bird',
        name: '木鸢',
        icon: '🦅',
        type: '木作造物',
        desc: '仿造古代鲁班木鸟制作的精巧工艺品，可乘风飞翔，凝聚了墨家机关术的精髓。',
        reqs: { '机扩木骨': 1, '百炼精铁': 1 },
        defaultUnlocked: true,
        steps: [
          {
            id: 's1', name: '雕翅塑形', icon: '🪚',
            desc: '依照鸟翼的流体力学原理，雕刻出弧度精准的木翼，翼面要光滑，翼缘要薄。',
            detail: '口诀：翼面如刀，弧度定飞；翼缘越薄，乘风越远。',
            duration: 2500,
            interactionType: 'rhythm',
            interactionConfig: { label: '雕刻翅翼', targetCount: 10, hint: '仔细打磨翼面弧度，鸟翼的精准度决定飞行能力' }
          },
          {
            id: 's2', name: '机关组装', icon: '⚙️',
            desc: '将百炼精铁制成的轴心与木骨咬合，安装控制飞翔的联动机关，测试各部件是否灵活。',
            detail: '口诀：机关之妙在连动，一处动，处处应；轴心稳，万事宁。',
            duration: 3000,
            interactionType: 'timing',
            interactionConfig: { label: '组装机关', holdSeconds: 4, hint: '仔细调整各联动部件，确保机关运转流畅' }
          },
          {
            id: 's3', name: '平衡调试', icon: '⚖️',
            desc: '手持木鸢测试重心平衡，微调配重，使其在飞翔时保持稳定的姿态。',
            detail: '口诀：重心须居正中，偏左则左旋，偏右则右转，重心是飞行之魂。',
            duration: 2000,
            interactionType: 'confirm',
            interactionConfig: { label: '平衡完成', message: '木鸢重心精准，在手中轻轻一抛，便能乘风而起，令人心旷神怡。' }
          }
        ],
        mutations: [
          {
            reqExtra: '青铜齿轮',
            resultName: '发条青鸟', icon: '🕊️',
            desc: '装入欧洲发条齿轮，不仅能飞，还会发出清脆的机械八音盒声音，是中西技艺的巅峰融合。',
            compendium: { history: '墨家机关术与中世纪欧洲钟表发条技术的碰撞产物，被誉为"古代机器人"的雏形。', reward: 1000 }
          },
          {
            reqExtra: '流沙琥珀',
            resultName: '琥珀木灵兽', icon: '🦂',
            desc: '木雕核心嵌入沙漠琥珀，仿佛注入了沙漠巨兽的灵魂，神秘莫测。',
            compendium: { history: '沙海传来的远古琥珀中封印着未知生灵的残影，与木鸢结合后产生了意料之外的奇异效果。', reward: 700 }
          },
          {
            reqExtra: '灵竹',
            resultName: '灵竹木鸢', icon: '🎋',
            desc: '青岚界灵竹制翼，飞翔时发出竹笛般悠扬声音，是灵竹之气与机关术的完美融合。',
            compendium: { history: '青岚界特有的灵竹质地轻盈，共鸣音色极美，以灵竹制翼的木鸢声震九州。', reward: 850 }
          },
          {
            reqExtra: '玻璃镜片',
            resultName: '望远木鸢', icon: '🔍',
            desc: '头部装有西洋玻璃镜片，可在高空观察地面，是古代"无人侦察机"的概念实现。',
            compendium: { history: '墨家机关术与西洋光学技术的跨界结合，将千里镜概念整合到飞行器中，超前于时代数百年。', reward: 900 }
          }
        ],
        compendium: { history: '《韩非子》记载墨子费三年时间制成会飞的木鸟，《墨子》中也有详细记载，是中国早期工程学的代表。', reward: 300 }
      },
      {
        id: 'recipe_luban_lock',
        name: '基础鲁班锁',
        icon: '🔒',
        type: '木作造物',
        desc: '六根木条相互咬合的传统益智玩具，不用钉子，依靠榫卯结构严密咬合，只有按特定顺序才能拆开。',
        reqs: { '沉香木料': 3, '竹制刻刀': 1 },
        defaultUnlocked: true,
        steps: [
          {
            id: 's1', name: '精确划线', icon: '📏',
            desc: '在六根木条上精确划出榫卯切口的位置，误差不能超过0.1毫米，否则无法咬合。',
            detail: '口诀：差之毫厘，锁则不成；精准划线，是鲁班锁的命脉。',
            duration: 2000,
            interactionType: 'timing',
            interactionConfig: { label: '精准划线', holdSeconds: 3, hint: '沉住气，精确标记每一个切口位置' }
          },
          {
            id: 's2', name: '切割榫卯', icon: '🪚',
            desc: '按照标记精确锯开切口，用凿子清理切口内部，保证每个榫卯面光滑垂直。',
            detail: '口诀：锯到线边停，凿要立正身；面要平，角要直，方成鲁班之锁。',
            duration: 3000,
            interactionType: 'rhythm',
            interactionConfig: { label: '切制榫卯', targetCount: 12, hint: '6根木条×2个切口=12刀，每一刀都要精准' }
          },
          {
            id: 's3', name: '试咬组合', icon: '🧩',
            desc: '按照设计顺序将六根木条依次咬合，检验是否能顺利组合又无法随意拆开。',
            detail: '口诀：组合有序，拆卸有法；看似无解，实则一线牵。',
            duration: 2000,
            interactionType: 'confirm',
            interactionConfig: { label: '咬合成功', message: '六根木条严密咬合，鲁班锁完成！没有钉子，没有胶水，纯靠榫卯的力量屹立不倒。' }
          }
        ],
        mutations: [
          {
            reqExtra: '百炼精铁',
            resultName: '铁骨鲁班锁', icon: '⚒️',
            desc: '木条中嵌入精铁加固，更加坚固沉重，拆解难度大幅提升，是进阶版本。',
            compendium: { history: '在传统鲁班锁中加入金属嵌件，增加了重量与强度，对玩家的力量和精准度要求更高。', reward: 550 }
          },
          {
            reqExtra: '夜光木',
            resultName: '夜光鲁班锁', icon: '✨',
            desc: '采用夜光木制作，夜间散发柔和光芒，在黑暗中依然可以尝试破解，极具观赏性。',
            compendium: { history: '现代非遗创新，将传统鲁班锁与新型夜光木料结合，使这一益智玩具更具趣味性。', reward: 600 }
          }
        ],
        compendium: { history: '鲁班锁相传由春秋时期鲁班发明，是中国传统的益智玩具，体现了中国人对几何与力学的深刻理解。', reward: 250 }
      }
    ]
  },

  /* ──────────────────────────────────────────
     设备 8：抄纸槽  · 百作镇造纸坊
     古法造纸核心设备
  ────────────────────────────────────────── */
  paper_making_trough: {
    id: 'paper_making_trough',
    name: '抄纸槽',
    icon: '📜',
    region: '百作镇',
    level: '一阶',
    desc: '水光潋滟的抄纸槽，竹帘捞起的每一张纸都承载着千年造纸术的智慧。',
    atmosphere: '水声潺潺，竹帘飘香，晾晒中的纸张在阳光下泛出温润的光晕。',
    bgColor: 'linear-gradient(160deg, #1a1a0a 0%, #101008 60%, #080805 100%)',
    accentColor: '#c8b060',

    recipes: [
      {
        id: 'recipe_ancient_paper',
        name: '古法宣纸',
        icon: '📜',
        type: '造纸造物',
        desc: '复刻古法造纸工艺，纸张洁白细腻，吸水性强，是书法绘画的最佳材料，被誉为"纸中之王"。',
        reqs: { '竹浆纸浆': 2, '稻草纤维': 1 },
        defaultUnlocked: true,
        steps: [
          {
            id: 's1', name: '配料调浆', icon: '🧪',
            desc: '将竹浆纸浆与稻草纤维按比例混合，加入适量清水调成均匀的造纸浆液，稀稠要恰当。',
            detail: '口诀：竹浆为骨，稻草为韧；浆液如米汤，过稀则纸薄，过稠则纸厚。',
            duration: 2000,
            interactionType: 'select',
            interactionConfig: {
              question: '宣纸的主要原料是？',
              options: ['青檀树皮和沙田稻草', '竹子和棉花', '松木和麻布', '桑皮和龙须草'],
              correct: 0,
              feedback: [
                '正确！正宗宣纸以青檀树皮和沙田稻草为原料，这一组合赋予了宣纸独特的质感和耐久性。',
                '竹子和棉花用于制作其他类型的纸，不是传统宣纸的原料。',
                '松木纸浆偏酸性，不耐久，棉浆用于制造绘图纸。',
                '桑皮纸是另一种传统纸，龙须草纸产于华南，与宣纸不同。'
              ]
            }
          },
          {
            id: 's2', name: '竹帘抄纸', icon: '🪣',
            desc: '双手持竹帘伸入浆槽，倾斜入水后水平捞起，均匀捞取纸浆，动作要一气呵成。',
            detail: '口诀：入水要斜，出水要平；抄纸一手抬，一手压，帘上纸浆须均匀。',
            duration: 3000,
            interactionType: 'timing',
            interactionConfig: { label: '竹帘捞纸', holdSeconds: 4, hint: '慢慢平稳地抬起竹帘，感受纸浆在帘上均匀铺开' }
          },
          {
            id: 's3', name: '覆帘压榨', icon: '🗜️',
            desc: '将帘上湿纸反覆至纸板，轻轻揭去竹帘，叠放多张后用重物压榨，去除多余水分。',
            detail: '口诀：揭帘要轻，不可用力；湿纸最脆，一碰便破。',
            duration: 2000,
            interactionType: 'rhythm',
            interactionConfig: { label: '压榨去水', targetCount: 6, hint: '均匀施压，将多余水分榨出，纸张密度更高' }
          },
          {
            id: 's4', name: '晾晒烘干', icon: '☀️',
            desc: '将湿纸贴于烘焙墙上，用毛刷从中心向外轻刷，排出气泡，自然晾干后揭纸即成。',
            detail: '口诀：贴纸要由上向下，刷子要从中向外；纸干后自然卷边，是揭纸的信号。',
            duration: 2500,
            interactionType: 'confirm',
            interactionConfig: { label: '揭纸完成', message: '宣纸完成！洁白如雪，纸面细腻，迎光透视可见均匀的纤维，是书画创作的绝佳材料。' }
          }
        ],
        mutations: [
          {
            reqExtra: '古墨粉',
            resultName: '古墨宣纸', icon: '✒️',
            desc: '纸浆中加入极微量古墨粉，宣纸自带淡淡墨香，书写时墨色分外浓郁沉稳。',
            compendium: { history: '古代文人书斋的秘制宣纸，加入古墨的制法已失传多年，此为传承人所复刻。', reward: 500 }
          },
          {
            reqExtra: '花汁',
            resultName: '彩宣', icon: '🎨',
            desc: '以天然花汁染色的宣纸，呈现温柔的花色，适合创作彩色诗画，古雅而不失活泼。',
            compendium: { history: '传统彩宣工艺，以山花、茜草等植物汁液染色，无化学添加，色泽自然，是书画珍品。', reward: 450 }
          }
        ],
        compendium: { history: '宣纸源于唐代安徽泾县，以青檀皮和稻草为原料，历经百道工序，被誉为"纸中之王"，是中国书画艺术的载体。', reward: 250 }
      }
    ]
  },

  /* ──────────────────────────────────────────
     设备 9：风雅案  · 茶园
     点茶与合香的风雅之所
  ────────────────────────────────────────── */
  tea_table: {
    id: 'tea_table',
    name: '风雅案',
    icon: '🍵',
    region: '青岚界茶园',
    level: '一阶',
    desc: '一案一炉，一壶一盏，点茶与合香皆是修身养性的雅事，晨曦时分灵力最纯。',
    atmosphere: '茶香弥漫，炉烟袅袅，远处山峦在晨雾中若隐若现，时间在这里流得极慢。',
    bgColor: 'linear-gradient(160deg, #0a1a10 0%, #061008 60%, #030804 100%)',
    accentColor: '#7eb6a1',
    envHint: {
      0: '晨曦时分！香气最纯，晨露入茶，灵力最佳。',
      1: '午时阳气充足，茶汤更显香浓。',
      2: '黄昏暮色，适合静心合香。',
      3: '子夜清冷，香气在夜风中更显神秘。'
    },

    recipes: [
      {
        id: 'recipe_incense_base',
        name: '古法醒神香',
        icon: '🪔',
        type: '合香造物',
        desc: '传统合香工艺，以沉香为君，配以群香，点燃后安神醒脑，香气持续数小时。',
        reqs: { '清心茶膏': 1, '沉香木料': 1 },
        defaultUnlocked: true,
        steps: [
          {
            id: 's1', name: '研磨香料', icon: '⚗️',
            desc: '将沉香木料放入香臼，用石杵反复研磨至细粉，力度要均匀，粗细决定燃烧速度。',
            detail: '口诀：研磨如练心，急则粗，缓则细；细如面粉方得香气纯正。',
            duration: 2500,
            interactionType: 'rhythm',
            interactionConfig: { label: '研磨沉香', targetCount: 10, hint: '有节律地研磨，将沉香磨成细腻均匀的粉末' }
          },
          {
            id: 's2', name: '调配香方', icon: '🧪',
            desc: '将沉香粉与茶膏按古法配方比例混合，加入适量蜂蜜作为粘合剂，搅拌至均匀膏状。',
            detail: '口诀：君料（沉香）占六分，茶膏为臣占三分，蜜为使占一分；比例失，香则散。',
            duration: 2500,
            interactionType: 'select',
            interactionConfig: {
              question: '中国传统合香讲究"君臣佐使"，沉香在香方中通常担任什么角色？',
              options: ['君料，定主香方向，用量最大', '臣料，辅助君料，增加层次', '佐料，调和诸香，减少刺激', '使料，引导香气扩散，用量最少'],
              correct: 0,
              feedback: [
                '正确！沉香是中国香文化中最名贵的君料，决定整个香方的主要香型，是不可替代的核心。',
                '臣料通常是檀香等辅助香材，用于丰富香气层次。',
                '佐料多为龙脑、甘草等，起到调和诸香的作用。',
                '使料是少量的引子，如麝香，让香气更容易扩散。'
              ]
            }
          },
          {
            id: 's3', name: '制成线香', icon: '🪔',
            desc: '将香膏装入模具，反复压实，用细针挤出成线，晾干定型，切成等长的线香。',
            detail: '口诀：压实无气泡，线条要笔直；晾干须三日，心急出不了好香。',
            duration: 2000,
            interactionType: 'timing',
            interactionConfig: { label: '压制成型', holdSeconds: 4, hint: '均匀施压，将香膏压入模具，密实无气泡' }
          }
        ],
        mutations: [
          {
            reqExtra: '戏服碎布',
            resultName: '霸王别姬惊梦香', icon: '🎭',
            desc: '烟雾缭绕时，隐约能听到青衣婉转的叹息，闻之令人泪下，是万艺城名角儿的秘传。',
            compendium: { history: '以戏服的脂粉香入药的合香秘方，混合了岁月与情感的气息，是艺术与香道跨界的极品。', reward: 600 }
          },
          {
            reqExtra: '安息香',
            resultName: '安神静心香', icon: '🌙',
            desc: '安息香与沉香的绝妙搭配，香气醇厚安抚，是助眠安神的千年秘方。',
            compendium: { history: '安息香源自波斯，经丝绸之路传入中国后与沉香结合，成为中国香文化史上的跨文化经典。', reward: 500 }
          },
          {
            conditionEnv: 0, reqExtra: '梅花瓣',
            resultName: '寒梅暗香', icon: '❄️',
            desc: '晨曦时分以梅花瓣入香，清冽而幽深，香气如梅影横斜，是宋代文人最爱的冬日之香。',
            compendium: { history: '宋代梅香是文人雅士的首选，苏轼、黄庭坚皆有相关诗文，晨曦制成者香气尤为纯粹。', reward: 550 }
          }
        ],
        compendium: { history: '中国香文化有三千年历史，合香讲究"君臣佐使"的哲学理念，是一门融合中医、美学与哲学的综合艺术。', reward: 200 }
      }
    ]
  },

  /* ──────────────────────────────────────────
     设备 10：篆刻台  · 百作镇
     金石篆刻，方寸之间见天地
  ────────────────────────────────────────── */
  carving_board: {
    id: 'carving_board',
    name: '篆刻台',
    icon: '✒️',
    region: '百作镇',
    level: '一阶',
    desc: '方寸印石，千年文脉。一刀一石，书法与雕刻在此合二为一。',
    atmosphere: '石粉微扬，刀声清脆，桌上散落着印泥与习作，空气里带着石头特有的冷香。',
    bgColor: 'linear-gradient(160deg, #1a1a1a 0%, #101010 60%, #080808 100%)',
    accentColor: '#a09060',

    recipes: [
      {
        id: 'recipe_seal',
        name: '普通印章',
        icon: '✒️',
        type: '篆刻造物',
        desc: '刻有篆书文字的印章，可用于书画落款，是文人身份的象征。',
        reqs: { '基础印石': 1, '篆刻刀': 1 },
        defaultUnlocked: true,
        steps: [
          {
            id: 's1', name: '磨石开面', icon: '⬜',
            desc: '将印石在细砂纸上打磨，使印面平整光洁，消除细微的坑洼，为篆刻打好基础。',
            detail: '口诀：先粗后细，由重到轻；印面如镜，方可施刀。',
            duration: 1800,
            interactionType: 'rhythm',
            interactionConfig: { label: '打磨印面', targetCount: 8, hint: '先用粗砂纸磨平，再换细砂纸抛光，直至印面光洁如镜' }
          },
          {
            id: 's2', name: '上稿印墨', icon: '📝',
            desc: '用毛笔在印面写上反字（镜像篆书），确保盖印后文字方向正确，构图要饱满匀称。',
            detail: '口诀：篆刻写反字，左右镜像颠倒；构图要疏密有致，不可过于拥挤。',
            duration: 2000,
            interactionType: 'select',
            interactionConfig: {
              question: '篆刻时为何要将文字写成"反字"（镜像）？',
              options: ['因为盖印时图案会再次翻转，反字盖出来才是正字', '古代篆书就是从右往左写的', '反字更难刻，体现技艺水平', '这样印章更美观'],
              correct: 0,
              feedback: [
                '正确！篆刻是将图案刻在印面上，盖印时图案翻转，所以刻反字才能盖出正字，这是基本原理。',
                '古代虽然从右往左读，但篆刻的反字原理与此不同，是几何翻转。',
                '难度不是目的，功能性才是。',
                '反字盖出正字是功能需求，不是美观考量。'
              ]
            }
          },
          {
            id: 's3', name: '执刀篆刻', icon: '🗡️',
            desc: '执刀如执笔，以冲刀法或切刀法刻出笔画，线条要有力度感，刀起刀落皆见功力。',
            detail: '口诀：冲刀一气呵成，线条爽利；切刀短促有力，线条古朴。初学宜切刀，熟练后用冲刀。',
            duration: 3500,
            interactionType: 'rhythm',
            interactionConfig: { label: '执刀篆刻', targetCount: 14, hint: '每一刀都要有书法的笔意，刀法即笔法' }
          },
          {
            id: 's4', name: '修边钤印', icon: '🔴',
            desc: '用细刀修整笔画边缘，去除毛刺，最后蘸印泥试钤，检验效果是否满意。',
            detail: '口诀：修边宜轻不宜重，宁留不足，不可过切；钤印见真容，此乃验收之时。',
            duration: 1800,
            interactionType: 'confirm',
            interactionConfig: { label: '钤印验收', message: '印章完成！朱砂印泥映出的篆文，字字苍劲，疏密有致，方寸间自有乾坤。' }
          }
        ],
        mutations: [
          {
            reqExtra: '古墨粉',
            resultName: '古墨印章', icon: '🕰️',
            desc: '以古墨粉涂抹印面，使印章散发古朴气息，钤印时墨色更显历史感，不易褪色。',
            compendium: { history: '以古墨研制印泥是古代文人雅士的风雅之举，古墨含有特殊矿物，钤印效果独特。', reward: 400 }
          },
          {
            conditionQuest: 'seal_carver_heritage',
            resultName: '古法印章', icon: '📜',
            desc: '严格复刻汉代篆刻风格，字体古朴苍劲，线条如屋漏痕、锥划沙，是篆刻艺术的教科书。',
            compendium: { history: '汉印是中国篆刻艺术的黄金标准，笔画粗壮平直，构图方正庄重，历代篆刻家奉为圭臬。', reward: 550 }
          }
        ],
        compendium: { history: '篆刻是中国特有的艺术形式，将书法与雕刻融为一体，明清以降成为文人必备的修身技艺。', reward: 200 }
      }
    ]
  }
};

/* ════════════════════════════════════════════════════════════════
   二、引擎层：CraftEngine  状态机
   ════════════════════════════════════════════════════════════════ */

const CraftEngine = (function() {
  let _station = null;   // 当前选中的设备数据
  let _recipe  = null;   // 当前选中的配方
  let _stepIdx = 0;      // 当前工序序号
  let _stepResults = []; // 每步质量分（0~1）
  let _running = false;

  /* 初始化 gameState 中与造物有关的字段 */
  function _initState() {
    if (!gameState.unlockedRecipes) gameState.unlockedRecipes = [];
    if (!gameState.unlockedCompendium) gameState.unlockedCompendium = [];
    if (!gameState.inventory) gameState.inventory = {};

    // 遍历所有配方，将 defaultUnlocked 的加入已解锁列表
    for (const stData of Object.values(CRAFT_DATA)) {
      for (const r of stData.recipes) {
        if (r.defaultUnlocked && !gameState.unlockedRecipes.includes(r.id)) {
          gameState.unlockedRecipes.push(r.id);
        }
      }
    }

    // 特殊解锁：持有天工绝密图纸
    if ((gameState.inventory['天工绝密图纸'] || 0) > 0 &&
        !gameState.unlockedRecipes.includes('recipe_qingniao')) {
      gameState.unlockedRecipes.push('recipe_qingniao');
      if (typeof showNotification === 'function')
        showNotification('检测到【天工绝密图纸】，已解锁隐藏配方《发条青鸟》！', '🕊️');
    }
  }

  /* 检查背包材料是否足够 */
  function _canCraft(recipe) {
    for (const [mat, need] of Object.entries(recipe.reqs)) {
      if ((gameState.inventory[mat] || 0) < need) return false;
    }
    return true;
  }

  /* 扣除材料 */
  function _deductMaterials(recipe) {
    for (const [mat, need] of Object.entries(recipe.reqs)) {
      gameState.inventory[mat] = (gameState.inventory[mat] || 0) - need;
    }
    if (typeof updateInventory === 'function') updateInventory();
  }

  /* 根据变异条件决定最终产物 */
  function _resolveMutation(recipe) {
    const env = (typeof gameState !== 'undefined') ? (gameState.worldState || 1) : 1;
    const inv  = gameState.inventory || {};
    const quests = gameState.quests || {};

    if (!recipe.mutations) return null;

    for (const mut of recipe.mutations) {
      let triggered = false;

      if (mut.conditionEnv !== undefined && mut.conditionEnv === env) triggered = true;
      if (mut.conditionQuest && quests[mut.conditionQuest]) triggered = true;
      if (mut.reqExtra && (inv[mut.reqExtra] || 0) > 0) {
        inv[mut.reqExtra] -= 1;
        triggered = true;
      }
      if (mut.conditionEnv !== undefined && mut.conditionEnv !== env) triggered = false;

      if (triggered) return mut;
    }
    return null;
  }

  /* 计算综合品质（基于各步分数） */
  function _calcQuality() {
    if (_stepResults.length === 0) return 3;
    const avg = _stepResults.reduce((a, b) => a + b, 0) / _stepResults.length;
    if (avg >= 0.9) return 5;
    if (avg >= 0.75) return 4;
    if (avg >= 0.55) return 3;
    if (avg >= 0.35) return 2;
    return 1;
  }

  /* 发放物品、记录传习录、保存 */
  /* 发放物品、记录传习录、保存、并联动图鉴与成就 */
  function _deliverResult(finalName, finalIcon, quality) {
    // 1. 发放物品
    if (typeof addItem === 'function') addItem(finalName, 1);
    else gameState.inventory[finalName] = (gameState.inventory[finalName] || 0) + 1;

    // 2. 兼容万物鉴的发现记录 (核心修复)
    if (!gameState.discoveredItems) gameState.discoveredItems = [];
    if (!gameState.discoveredItems.includes(finalName)) {
        gameState.discoveredItems.push(finalName);
    }

    // 3. 图鉴百科与奖励
    if (_recipe.compendium && !gameState.unlockedCompendium.includes(finalName)) {
      gameState.unlockedCompendium.push(finalName);
      if (typeof earnStones === 'function') earnStones(_recipe.compendium.reward || 0);
      
      // 动态将新配方物品注入全局物品库
      if (typeof itemDatabase !== 'undefined' && !itemDatabase[finalName]) {
        itemDatabase[finalName] = { icon: finalIcon, desc: _recipe.compendium.history, type: 'crafted', rarity: quality };
      }

      // 延迟弹出图鉴扩充通知，防止与造物成功的通知重叠
      if (typeof showNotification === 'function') {
          setTimeout(() => {
              showNotification(`【图鉴扩充】《万物鉴》收录新造物【${finalName}】，奖励 ${_recipe.compendium.reward} 灵石！`, '📖', 6000);
          }, 2000); 
      }
    }

    // 4. 触发成就：只要完成一次造物，即可解锁“天工开物”成就
    if (typeof unlockAchievement === 'function') {
        unlockAchievement('craft_first', '天工开物', '在造物台成功完成一次沉浸式造物', 300, '🔨');
    }

    // 5. 传习录记录
    if (typeof _appendXiulilu === 'function') {
      _appendXiulilu({
        type: 'craft', icon: finalIcon,
        title: `造物成功：【${finalName}】`,
        desc: `于${_station.name}沉浸完成，品质 ${'★'.repeat(quality)}`
      });
    }

    if (typeof playSound === 'function') playSound('achievement');
    if (typeof SaveManager !== 'undefined') SaveManager.save();
  }

  return {
    init: _initState,
    canCraft: _canCraft,

    /* 选择设备 */
    selectStation(stationId) {
      _station = CRAFT_DATA[stationId] || null;
      _recipe = null;
      _stepIdx = 0;
      _stepResults = [];
      _running = false;
    },

    /* 选择配方 */
    selectRecipe(recipeId) {
      if (!_station) return false;
      _recipe = _station.recipes.find(r => r.id === recipeId) || null;
      _stepIdx = 0;
      _stepResults = [];
      _running = false;
      return !!_recipe;
    },

    /* 开始造物：扣料 → 进入工序 */
    start() {
      if (!_recipe || !_canCraft(_recipe)) return false;
      _deductMaterials(_recipe);
      _stepIdx = 0;
      _stepResults = [];
      _running = true;
      return true;
    },

    /* 完成某步工序，传入得分 0~1 */
    completeStep(score) {
      _stepResults.push(Math.max(0, Math.min(1, score)));
      _stepIdx++;
    },

    /* 是否还有下一步 */
    hasNextStep() {
      return _running && _recipe && _stepIdx < _recipe.steps.length;
    },

    /* 当前步骤数据 */
    currentStep() {
      if (!_recipe) return null;
      return _recipe.steps[_stepIdx] || null;
    },

    /* 当前进度 */
    progress() {
      if (!_recipe) return { current: 0, total: 0 };
      return { current: _stepIdx, total: _recipe.steps.length };
    },

    /* 结算：返回最终产物信息 */
    finalize() {
      if (!_recipe) return null;
      _running = false;
      const quality = _calcQuality();
      const mutation = _resolveMutation(_recipe);
      const finalName = mutation ? mutation.resultName : _recipe.name;
      const finalIcon = mutation ? mutation.icon : _recipe.icon;
      _deliverResult(finalName, finalIcon, quality);
      return {
        name: finalName, icon: finalIcon, quality,
        isMutation: !!mutation,
        mutationDesc: mutation ? mutation.desc : null,
        compendiumHistory: (mutation && mutation.compendium)
          ? mutation.compendium.history
          : (_recipe.compendium ? _recipe.compendium.history : null),
        station: _station.name,
        recipe: _recipe
      };
    },

    /* 取消中途退出 */
    abort() {
      _running = false;
    },

    getStation: () => _station,
    getRecipe: () => _recipe,
    getStepIdx: () => _stepIdx
  };
})();

/* ════════════════════════════════════════════════════════════════
   三、渲染层：CraftRenderer  全屏沉浸界面
   ════════════════════════════════════════════════════════════════ */

const CraftRenderer = (function() {

  /* ── CSS ── */
  const CSS = `
<style id="craft-system-style">

#craft-overlay {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: rgba(4, 3, 2, 0.96);
  backdrop-filter: blur(8px);
  flex-direction: column;
  overflow: hidden;
}
#craft-overlay.open { display: flex; }

/* ─ 粒子层 ─ */
#craft-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.cp {
  position: absolute;
  border-radius: 50%;
  animation: cpFloat var(--d, 8s) var(--delay, 0s) ease-in-out infinite alternate;
  opacity: 0.15;
}
@keyframes cpFloat {
  from { transform: translate(0, 0) scale(1); opacity: 0.1; }
  to   { transform: translate(var(--tx, 20px), var(--ty, -30px)) scale(1.3); opacity: 0.25; }
}

/* ─ 通用层级 ─ */
.craft-screen { position: relative; z-index: 1; width: 100%; height: 100%; display: flex; flex-direction: column; }
.craft-screen.hidden { display: none; }

/* ─ 返回按钮 ─ */
.craft-back-btn {
  position: absolute;
  top: 18px; left: 22px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(200,180,120,0.7);
  font-size: 13px;
  padding: 7px 14px;
  border-radius: 8px;
  cursor: pointer;
  letter-spacing: 1px;
  font-family: var(--font-kai, serif);
  transition: all 0.2s;
  z-index: 10;
}
.craft-back-btn:hover { background: rgba(255,255,255,0.12); color: #e8c87a; }

/* ═══════════════════════════════
   屏幕1：设备大厅
═══════════════════════════════ */
#screen-hub {
  align-items: center;
  justify-content: flex-start;
  padding: 60px 40px 30px;
}
.hub-header { text-align: center; margin-bottom: 40px; }
.hub-title {
  font-family: var(--font-kai, serif);
  font-size: 28px;
  color: #e8c87a;
  letter-spacing: 6px;
  text-shadow: 0 0 30px rgba(212,175,55,0.4);
  margin-bottom: 8px;
}
.hub-subtitle {
  font-size: 12px;
  color: rgba(200,160,80,0.45);
  letter-spacing: 3px;
}
.hub-env-bar {
  margin-bottom: 30px;
  padding: 10px 20px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  font-size: 13px;
  color: rgba(200,180,100,0.7);
  text-align: center;
  letter-spacing: 1px;
  max-width: 700px;
  width: 100%;
}
.hub-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  width: 100%;
  max-width: 1000px;
  overflow-y: auto;
  max-height: calc(100vh - 260px);
  padding: 4px;
  scrollbar-width: thin;
  scrollbar-color: rgba(140,80,20,0.4) transparent;
}
.hub-station-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  padding: 20px 16px;
  cursor: pointer;
  transition: all 0.22s;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.hub-station-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: var(--accent);
  opacity: 0;
  transition: opacity 0.2s;
}
.hub-station-card:hover {
  border-color: rgba(212,175,55,0.3);
  background: rgba(255,255,255,0.06);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}
.hub-station-card:hover::before { opacity: 1; }
.hub-station-icon { font-size: 40px; margin-bottom: 12px; }
.hub-station-name {
  font-family: var(--font-kai, serif);
  font-size: 16px;
  color: #d4c090;
  letter-spacing: 2px;
  margin-bottom: 4px;
}
.hub-station-region {
  font-size: 11px;
  color: rgba(180,150,80,0.45);
  margin-bottom: 8px;
}
.hub-station-level {
  display: inline-block;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(140,80,20,0.2);
  border: 1px solid rgba(140,80,20,0.35);
  color: rgba(200,150,70,0.7);
  margin-bottom: 8px;
}
.hub-station-desc {
  font-size: 11px;
  color: rgba(180,150,80,0.4);
  line-height: 1.6;
}
.hub-recipe-count {
  position: absolute;
  top: 10px; right: 10px;
  font-size: 10px;
  color: rgba(200,180,100,0.5);
}

/* ═══════════════════════════════
   屏幕2：配方选择
═══════════════════════════════ */
#screen-recipe {
  padding: 60px 40px 30px;
  align-items: center;
}
.recipe-station-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
  width: 100%;
  max-width: 900px;
}
.recipe-station-icon-lg {
  width: 56px; height: 56px;
  border-radius: 14px;
  background: rgba(140,80,20,0.2);
  border: 1px solid rgba(140,80,20,0.35);
  display: flex; align-items: center; justify-content: center;
  font-size: 30px;
}
.recipe-station-title {
  font-family: var(--font-kai, serif);
  font-size: 22px;
  color: #e8c87a;
  letter-spacing: 3px;
}
.recipe-station-atmo {
  font-size: 12px;
  color: rgba(200,170,100,0.45);
  margin-top: 3px;
  font-style: italic;
  font-family: var(--font-kai, serif);
}

.recipe-env-hint {
  width: 100%;
  max-width: 900px;
  padding: 10px 18px;
  background: rgba(212,175,55,0.06);
  border: 1px solid rgba(212,175,55,0.15);
  border-radius: 8px;
  font-size: 12px;
  color: rgba(212,175,55,0.65);
  margin-bottom: 20px;
  letter-spacing: 0.5px;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
  width: 100%;
  max-width: 900px;
  overflow-y: auto;
  max-height: calc(100vh - 320px);
  padding: 4px;
  scrollbar-width: thin;
  scrollbar-color: rgba(140,80,20,0.4) transparent;
}
.recipe-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  padding: 18px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}
.recipe-card:hover {
  border-color: rgba(212,175,55,0.3);
  background: rgba(255,255,255,0.05);
  transform: translateY(-2px);
}
.recipe-card.locked {
  opacity: 0.35;
  cursor: default;
  filter: grayscale(0.8);
}
.recipe-card.locked:hover { transform: none; border-color: rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); }
.recipe-card-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
.recipe-card-icon {
  width: 44px; height: 44px;
  background: rgba(140,80,20,0.15);
  border: 1px solid rgba(140,80,20,0.25);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}
.recipe-card-name {
  font-family: var(--font-kai, serif);
  font-size: 15px;
  color: #d4c090;
  letter-spacing: 1px;
}
.recipe-card-type {
  font-size: 10px;
  color: rgba(180,150,80,0.5);
  margin-top: 2px;
}
.recipe-card-desc {
  font-size: 11px;
  color: rgba(180,150,80,0.45);
  line-height: 1.6;
  margin-bottom: 10px;
  font-family: var(--font-kai, serif);
}
.recipe-card-mats {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.recipe-mat-chip {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(212,175,55,0.07);
  border: 1px solid rgba(212,175,55,0.2);
  color: rgba(212,175,55,0.6);
}
.recipe-mat-chip.lack {
  background: rgba(180,60,30,0.08);
  border-color: rgba(180,60,30,0.3);
  color: rgba(200,80,60,0.7);
}
.recipe-can-craft-badge {
  position: absolute;
  top: 10px; right: 10px;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #7eb6a1;
  box-shadow: 0 0 6px #7eb6a1;
}
.recipe-craft-btn {
  width: 100%;
  margin-top: 12px;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-family: var(--font-kai, serif);
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s;
}
.recipe-craft-btn.ready {
  background: linear-gradient(135deg, #c87020, #e8a840);
  color: #1a0e00;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(200,120,32,0.3);
}
.recipe-craft-btn.ready:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(200,120,32,0.45); }
.recipe-craft-btn.disabled {
  background: rgba(80,60,40,0.3);
  color: rgba(180,150,100,0.3);
  cursor: not-allowed;
  border: 1px solid rgba(80,60,40,0.25);
}

/* ═══════════════════════════════
   屏幕3：工序沉浸界面
═══════════════════════════════ */
#screen-craft {
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.craft-workspace {
  width: min(780px, 96vw);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 顶部进度轨道 */
.craft-progress-track {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 0 10px;
  position: relative;
}
.craft-progress-track::before {
  content: '';
  position: absolute;
  top: 50%; left: 10%; right: 10%;
  height: 1px;
  background: rgba(140,80,20,0.3);
  z-index: 0;
}
.cp-dot {
  width: 26px; height: 26px;
  border-radius: 50%;
  border: 2px solid rgba(140,80,20,0.35);
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  transition: all 0.3s;
  margin: 0 calc((100% - 26px * var(--total)) / (var(--total) * 2));
}
.cp-dot.done {
  border-color: #7eb6a1;
  background: rgba(126,182,161,0.15);
  color: #7eb6a1;
}
.cp-dot.active {
  border-color: #e8c87a;
  background: rgba(212,175,55,0.15);
  box-shadow: 0 0 10px rgba(212,175,55,0.4);
  color: #e8c87a;
}
.cp-dot.pending { color: rgba(140,100,50,0.4); }

/* 工序卡片 */
.craft-step-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(140,80,20,0.25);
  border-radius: 18px;
  padding: 24px 28px;
  position: relative;
  overflow: hidden;
}
.craft-step-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent-color, #e8c87a), transparent);
}
.craft-step-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}
.craft-step-num {
  font-size: 11px;
  color: rgba(200,160,80,0.4);
  letter-spacing: 1px;
}
.craft-step-icon-wrap {
  width: 48px; height: 48px;
  border-radius: 12px;
  background: rgba(140,80,20,0.15);
  border: 1px solid rgba(140,80,20,0.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 26px;
}
.craft-step-title {
  font-family: var(--font-kai, serif);
  font-size: 18px;
  color: #e8c87a;
  letter-spacing: 2px;
}
.craft-step-desc {
  font-size: 13px;
  color: rgba(200,180,120,0.75);
  line-height: 1.9;
  margin-bottom: 12px;
  font-family: var(--font-kai, serif);
}
.craft-step-detail {
  font-size: 12px;
  color: rgba(126,182,161,0.65);
  background: rgba(126,182,161,0.06);
  border-left: 2px solid rgba(126,182,161,0.3);
  padding: 8px 12px;
  border-radius: 0 8px 8px 0;
  margin-bottom: 20px;
  font-family: var(--font-kai, serif);
  font-style: italic;
}

/* 交互区 */
.craft-interact-zone {
  min-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

/* ── confirm 类型 ── */
.interact-message {
  font-size: 13px;
  color: rgba(200,180,120,0.65);
  text-align: center;
  font-family: var(--font-kai, serif);
  line-height: 1.7;
  padding: 0 20px;
}
.interact-confirm-btn {
  padding: 12px 40px;
  background: linear-gradient(135deg, rgba(140,80,20,0.6), rgba(200,130,30,0.6));
  border: 1px solid rgba(212,175,55,0.4);
  border-radius: 10px;
  color: #e8c87a;
  font-size: 14px;
  font-family: var(--font-kai, serif);
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.2s;
}
.interact-confirm-btn:hover { background: linear-gradient(135deg, rgba(180,100,30,0.7), rgba(240,160,40,0.7)); transform: translateY(-1px); }

/* ── rhythm 类型 ── */
.rhythm-target { font-size: 13px; color: rgba(200,180,100,0.6); letter-spacing: 1px; }
.rhythm-progress {
  width: 100%;
  max-width: 360px;
  height: 6px;
  background: rgba(255,255,255,0.05);
  border-radius: 3px;
  overflow: hidden;
}
.rhythm-fill {
  height: 100%;
  background: linear-gradient(90deg, #7eb6a1, #a0d4c0);
  border-radius: 3px;
  transition: width 0.15s ease;
}
.rhythm-btn {
  padding: 14px 50px;
  background: rgba(126,182,161,0.15);
  border: 2px solid rgba(126,182,161,0.4);
  border-radius: 12px;
  color: #7eb6a1;
  font-size: 16px;
  font-family: var(--font-kai, serif);
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.1s;
  user-select: none;
}
.rhythm-btn:active { transform: scale(0.95); background: rgba(126,182,161,0.25); }

/* ── timing 类型 ── */
.timing-ring-wrap {
  position: relative;
  width: 120px; height: 120px;
}
.timing-ring-wrap svg { position: absolute; top: 0; left: 0; transform: rotate(-90deg); }
.timing-ring-bg { fill: none; stroke: rgba(255,255,255,0.05); stroke-width: 8; }
.timing-ring-fg { fill: none; stroke: #c87020; stroke-width: 8; stroke-linecap: round; transition: stroke-dashoffset 0.1s linear; }
.timing-center-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: bold;
  color: #e8c87a;
  font-family: var(--font-kai, serif);
}
.timing-hold-btn {
  padding: 13px 44px;
  background: rgba(200,112,32,0.15);
  border: 2px solid rgba(200,112,32,0.4);
  border-radius: 12px;
  color: #c87020;
  font-size: 15px;
  font-family: var(--font-kai, serif);
  letter-spacing: 2px;
  cursor: pointer;
  user-select: none;
}
.timing-hint { font-size: 11px; color: rgba(180,150,80,0.45); letter-spacing: 1px; }

/* ── select 类型 ── */
.select-question {
  font-size: 14px;
  color: rgba(220,195,130,0.85);
  text-align: center;
  font-family: var(--font-kai, serif);
  line-height: 1.7;
  margin-bottom: 4px;
}
.select-options { display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 480px; }
.select-option-btn {
  width: 100%;
  padding: 11px 16px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  color: rgba(200,180,120,0.75);
  font-size: 12px;
  font-family: var(--font-kai, serif);
  text-align: left;
  cursor: pointer;
  transition: all 0.18s;
  line-height: 1.5;
}
.select-option-btn:hover { border-color: rgba(212,175,55,0.35); background: rgba(212,175,55,0.06); color: #d4c090; }
.select-option-btn.correct { border-color: #7eb6a1; background: rgba(126,182,161,0.1); color: #7eb6a1; }
.select-option-btn.wrong { border-color: #d46060; background: rgba(212,80,60,0.08); color: #d46060; }
.select-feedback {
  font-size: 12px;
  color: rgba(200,180,120,0.6);
  text-align: center;
  font-family: var(--font-kai, serif);
  line-height: 1.6;
  padding: 8px 16px;
  background: rgba(255,255,255,0.03);
  border-radius: 8px;
  max-width: 480px;
}

/* ── observe 类型 ── */
.observe-stages { display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 420px; }
.observe-stage-btn {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  color: rgba(200,180,120,0.65);
  font-size: 12px;
  font-family: var(--font-kai, serif);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}
.observe-stage-btn:hover { border-color: rgba(212,175,55,0.3); background: rgba(212,175,55,0.06); color: #d4c090; }
.observe-stage-btn.correct { border-color: #e8c87a; background: rgba(212,175,55,0.12); color: #e8c87a; }
.observe-stage-btn.wrong { border-color: rgba(180,60,30,0.5); background: rgba(180,60,30,0.08); color: #d46060; }

/* ═══════════════════════════════
   屏幕4：结算页
═══════════════════════════════ */
#screen-result {
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
}
.result-card {
  width: min(600px, 96vw);
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(140,80,20,0.3);
  border-radius: 20px;
  padding: 36px 32px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.result-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #e8c87a, transparent);
}
.result-title {
  font-family: var(--font-kai, serif);
  font-size: 14px;
  color: rgba(200,160,80,0.45);
  letter-spacing: 4px;
  margin-bottom: 24px;
}
.result-item-orbit {
  position: relative;
  width: 120px; height: 120px;
  margin: 0 auto 20px;
}
.result-item-glow {
  position: absolute;
  inset: -15px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(212,175,55,0.25) 0%, transparent 70%);
  animation: rGlow 2s ease-in-out infinite;
}
@keyframes rGlow { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); } }
.result-item-ring {
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  border: 1px dashed rgba(212,175,55,0.25);
  animation: rSpin 8s linear infinite;
}
@keyframes rSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.result-item-icon {
  position: absolute;
  inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 64px;
  filter: drop-shadow(0 6px 16px rgba(0,0,0,0.5));
  animation: rFloat 3s ease-in-out infinite;
}
@keyframes rFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
.result-item-name {
  font-family: var(--font-kai, serif);
  font-size: 24px;
  color: #e8c87a;
  letter-spacing: 3px;
  margin-bottom: 6px;
}
.result-mutation-badge {
  display: inline-block;
  font-size: 11px;
  padding: 3px 12px;
  border-radius: 20px;
  background: rgba(212,100,30,0.15);
  border: 1px solid rgba(212,100,30,0.4);
  color: #e87830;
  margin-bottom: 12px;
}
.result-quality {
  font-size: 20px;
  letter-spacing: 4px;
  margin-bottom: 16px;
  filter: drop-shadow(0 0 6px rgba(212,175,55,0.5));
}
.result-mutation-desc {
  font-size: 13px;
  color: rgba(200,180,120,0.65);
  font-family: var(--font-kai, serif);
  line-height: 1.8;
  margin-bottom: 16px;
  padding: 10px 14px;
  background: rgba(212,100,30,0.06);
  border-radius: 8px;
  border-left: 2px solid rgba(212,100,30,0.35);
}
.result-history {
  font-size: 12px;
  color: rgba(180,160,100,0.45);
  font-family: var(--font-kai, serif);
  line-height: 1.8;
  margin-bottom: 22px;
  font-style: italic;
}
.result-stats {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 24px;
}
.result-stat {
  text-align: center;
}
.result-stat-val {
  font-size: 18px;
  color: #d4c090;
  font-weight: bold;
}
.result-stat-label {
  font-size: 10px;
  color: rgba(180,150,80,0.45);
  margin-top: 2px;
}
.result-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.result-btn {
  padding: 12px 28px;
  border-radius: 10px;
  font-size: 13px;
  font-family: var(--font-kai, serif);
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}
.result-btn-again {
  background: linear-gradient(135deg, #c87020, #e8a840);
  color: #1a0e00;
  font-weight: bold;
  box-shadow: 0 4px 14px rgba(200,120,32,0.3);
}
.result-btn-again:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(200,120,32,0.45); }
.result-btn-exit {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(200,180,120,0.6);
}
.result-btn-exit:hover { background: rgba(255,255,255,0.09); color: #d4c090; }

/* ── 爆炸特效 ── */
#craft-fx {
  position: fixed;
  inset: 0;
  z-index: 9900;
  display: none;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  background: rgba(4,2,1,0.94);
}
#craft-fx.show { display: flex; animation: fxIn 0.3s ease both; }
@keyframes fxIn { from { opacity: 0; } to { opacity: 1; } }
.fx-burst { font-size: 80px; animation: fxBurst 0.7s cubic-bezier(0.175,0.885,0.32,1.275) both; filter: drop-shadow(0 0 24px rgba(212,175,55,0.7)); }
@keyframes fxBurst { 0% { transform: scale(0) rotate(-20deg); opacity: 0; } 60% { transform: scale(1.25) rotate(5deg); } 100% { transform: scale(1) rotate(0); opacity: 1; } }
.fx-label {
  font-family: var(--font-kai, serif);
  font-size: 20px;
  color: #e8c87a;
  letter-spacing: 4px;
  animation: fxUp 0.5s 0.35s ease both;
}
@keyframes fxUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.fx-particle {
  position: fixed;
  pointer-events: none;
  border-radius: 50%;
  animation: fxParticle var(--d) var(--delay) ease-out both;
}
@keyframes fxParticle {
  0%   { transform: translate(0,0) scale(1); opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
}

</style>`;

  /* ── HTML 骨架 ── */
  const HTML = `
<div id="craft-overlay">
  <div id="craft-particles"></div>

  <!-- 屏幕1：设备大厅 -->
  <div id="screen-hub" class="craft-screen">
    <button class="craft-back-btn" onclick="CraftRenderer.close()">← 离开</button>
    <div class="hub-header">
      <div class="hub-title">⚒ 天工造物</div>
      <div class="hub-subtitle">— 九州工坊，各显神通 —</div>
    </div>
    <div class="hub-env-bar" id="hub-env-bar">⚡ 天地法则感应中...</div>
    <div class="hub-grid" id="hub-grid"></div>
  </div>

  <!-- 屏幕2：配方选择 -->
  <div id="screen-recipe" class="craft-screen hidden">
    <button class="craft-back-btn" onclick="CraftRenderer.showHub()">← 返回大厅</button>
    <div class="recipe-station-header">
      <div class="recipe-station-icon-lg" id="rsh-icon"></div>
      <div>
        <div class="recipe-station-title" id="rsh-name"></div>
        <div class="recipe-station-atmo" id="rsh-atmo"></div>
      </div>
    </div>
    <div class="recipe-env-hint hidden" id="recipe-env-hint"></div>
    <div class="recipe-grid" id="recipe-grid"></div>
  </div>

  <!-- 屏幕3：工序沉浸 -->
  <div id="screen-craft" class="craft-screen hidden">
    <button class="craft-back-btn" id="craft-abort-btn" onclick="CraftRenderer.confirmAbort()">✕ 中止</button>
    <div class="craft-workspace">
      <div class="craft-progress-track" id="craft-progress-track"></div>
      <div class="craft-step-card" id="craft-step-card" style="--accent-color: #e8c87a;">
        <div class="craft-step-header">
          <div>
            <div class="craft-step-num" id="craft-step-num"></div>
            <div class="craft-step-title" id="craft-step-title"></div>
          </div>
          <div class="craft-step-icon-wrap" id="craft-step-icon"></div>
        </div>
        <div class="craft-step-desc" id="craft-step-desc"></div>
        <div class="craft-step-detail" id="craft-step-detail"></div>
        <div class="craft-interact-zone" id="craft-interact-zone"></div>
      </div>
    </div>
  </div>

  <!-- 屏幕4：结算 -->
  <div id="screen-result" class="craft-screen hidden">
    <div class="result-card">
      <div class="result-title">— 天工开物 —</div>
      <div class="result-item-orbit">
        <div class="result-item-glow"></div>
        <div class="result-item-ring"></div>
        <div class="result-item-icon" id="result-icon"></div>
      </div>
      <div class="result-mutation-badge hidden" id="result-mutation-badge">✨ 天生异象</div>
      <div class="result-item-name" id="result-name"></div>
      <div class="result-quality" id="result-quality"></div>
      <div class="result-mutation-desc hidden" id="result-mutation-desc"></div>
      <div class="result-history" id="result-history"></div>
      <div class="result-stats" id="result-stats"></div>
      <div class="result-actions">
        <button class="result-btn result-btn-again" onclick="CraftRenderer.craftAgain()">🔨 再制一件</button>
        <button class="result-btn result-btn-exit" onclick="CraftRenderer.close()">离开工坊</button>
      </div>
    </div>
  </div>
</div>

<!-- 特效层 -->
<div id="craft-fx">
  <div class="fx-burst" id="fx-burst"></div>
  <div class="fx-label" id="fx-label"></div>
</div>
`;

  /* ── 状态 ── */
  let _currentStationId = null;
  let _interactHandlers = {};
  let _timingTimer = null;
  let _timingRunning = false;

  /* ── 工具 ── */
  function _getEnvString() {
    const ws = (typeof gameState !== 'undefined') ? (gameState.worldState || 1) : 1;
    const txts = ['🌅 晨曦 · 万物生发 · 灵气盈盈', '☀️ 午时 · 阳气鼎盛 · 造物正旺', '🌇 黄昏 · 逢魔时刻 · 谨慎为上', '🌌 子夜 · 星汉灿烂 · 窑变绝佳时机'];
    return txts[ws] || txts[1];
  }

  function _getEnvIndex() {
    return (typeof gameState !== 'undefined') ? (gameState.worldState || 1) : 1;
  }

  function _showScreen(id) {
    ['screen-hub', 'screen-recipe', 'screen-craft', 'screen-result'].forEach(s => {
      const el = document.getElementById(s);
      if (el) el.classList.toggle('hidden', s !== id);
    });
  }

  function _spawnParticles(accent) {
    const c = document.getElementById('craft-particles');
    if (!c) return;
    c.innerHTML = '';
    const colors = [accent, '#e8c87a', '#ffffff', 'rgba(200,160,80,0.5)'];
    for (let i = 0; i < 12; i++) {
      const p = document.createElement('div');
      p.className = 'cp';
      const size = 4 + Math.random() * 10;
      const col = colors[Math.floor(Math.random() * colors.length)];
      const tx = (Math.random() - 0.5) * 60;
      const ty = -20 - Math.random() * 50;
      p.style.cssText = `
        width:${size}px; height:${size}px; background:${col};
        left:${Math.random()*100}%; top:${Math.random()*100}%;
        --tx:${tx}px; --ty:${ty}px;
        --d:${5 + Math.random()*8}s; --delay:${Math.random()*4}s;
      `;
      c.appendChild(p);
    }
  }

  /* ══ 屏幕1：大厅 ══ */
  function _renderHub() {
    CraftEngine.init();
    const envBar = document.getElementById('hub-env-bar');
    if (envBar) envBar.textContent = '⚡ ' + _getEnvString();

    const grid = document.getElementById('hub-grid');
    if (!grid) return;

    grid.innerHTML = '';
    for (const [sid, st] of Object.entries(CRAFT_DATA)) {
      const totalRecipes = st.recipes.length;
      const unlockedCount = st.recipes.filter(r =>
        r.defaultUnlocked || gameState.unlockedRecipes.includes(r.id)
      ).length;

      const card = document.createElement('div');
      card.className = 'hub-station-card';
      card.style.setProperty('--accent', st.accentColor || '#e8c87a');
      card.innerHTML = `
        <div class="hub-recipe-count">${unlockedCount}/${totalRecipes}</div>
        <div class="hub-station-icon">${st.icon}</div>
        <div class="hub-station-name">${st.name}</div>
        <div class="hub-station-region">📍 ${st.region}</div>
        <div class="hub-station-level">${st.level}</div>
        <div class="hub-station-desc">${st.desc}</div>
      `;
      card.onclick = () => _showRecipes(sid);
      grid.appendChild(card);
    }
    _showScreen('screen-hub');
  }

  /* ══ 屏幕2：配方 ══ */
  function _showRecipes(stationId) {
    CraftEngine.selectStation(stationId);
    _currentStationId = stationId;
    const st = CRAFT_DATA[stationId];
    if (!st) return;

    _spawnParticles(st.accentColor || '#e8c87a');

    document.getElementById('rsh-icon').textContent = st.icon;
    document.getElementById('rsh-name').textContent = st.name;
    document.getElementById('rsh-atmo').textContent = st.atmosphere;

    // 环境提示
    const envHintEl = document.getElementById('recipe-env-hint');
    if (st.envHint) {
      const envIdx = _getEnvIndex();
      const hint = st.envHint[envIdx];
      if (hint) {
        envHintEl.textContent = '💡 ' + hint;
        envHintEl.classList.remove('hidden');
      } else {
        envHintEl.classList.add('hidden');
      }
    } else {
      envHintEl.classList.add('hidden');
    }

    const grid = document.getElementById('recipe-grid');
    grid.innerHTML = '';

    st.recipes.forEach(r => {
      const isUnlocked = r.defaultUnlocked || gameState.unlockedRecipes.includes(r.id);
      const canCraft = isUnlocked && CraftEngine.canCraft(r);
      const card = document.createElement('div');
      card.className = 'recipe-card' + (isUnlocked ? '' : ' locked');

      let matsHtml = '';
      for (const [mat, need] of Object.entries(r.reqs)) {
        const have = gameState.inventory[mat] || 0;
        matsHtml += `<span class="recipe-mat-chip ${have >= need ? '' : 'lack'}">${mat} ${have}/${need}</span>`;
      }

      card.innerHTML = `
        ${canCraft ? '<div class="recipe-can-craft-badge"></div>' : ''}
        <div class="recipe-card-top">
          <div class="recipe-card-icon">${isUnlocked ? r.icon : '🔒'}</div>
          <div>
            <div class="recipe-card-name">${isUnlocked ? r.name : '未知图谱'}</div>
            <div class="recipe-card-type">${isUnlocked ? r.type : '需机缘解锁'}</div>
          </div>
        </div>
        ${isUnlocked ? `
        <div class="recipe-card-desc">${r.desc}</div>
        <div class="recipe-card-mats">${matsHtml}</div>
        <button class="recipe-craft-btn ${canCraft ? 'ready' : 'disabled'}" ${canCraft ? '' : 'disabled'}
          onclick="CraftRenderer.startCraft('${r.id}')">
          ${canCraft ? '✨ 开始造物' : '材料不足'}
        </button>` : ''}
      `;
      grid.appendChild(card);
    });

    _showScreen('screen-recipe');
  }

  /* ══ 屏幕3：工序 ══ */
  function _showStep() {
    const step = CraftEngine.currentStep();
    const prog = CraftEngine.progress();
    if (!step) return;

    // 进度轨道
    const track = document.getElementById('craft-progress-track');
    if (track) {
      track.style.setProperty('--total', prog.total);
      track.innerHTML = CraftEngine.getRecipe().steps.map((s, i) => {
        let cls = 'pending';
        if (i < prog.current) cls = 'done';
        else if (i === prog.current) cls = 'active';
        return `<div class="cp-dot ${cls}" title="${s.name}">${i < prog.current ? '✓' : i + 1}</div>`;
      }).join('');
    }

    // 工序信息
    document.getElementById('craft-step-num').textContent = `第 ${prog.current + 1} / ${prog.total} 道工序`;
    document.getElementById('craft-step-title').textContent = `${step.icon} ${step.name}`;
    document.getElementById('craft-step-icon').textContent = step.icon;
    document.getElementById('craft-step-desc').textContent = step.desc;
    document.getElementById('craft-step-detail').textContent = step.detail;

    // 设置强调色
    const station = CraftEngine.getStation();
    if (station) document.getElementById('craft-step-card').style.setProperty('--accent-color', station.accentColor || '#e8c87a');

    // 渲染交互
    _renderInteraction(step);
    _showScreen('screen-craft');
  }

  function _renderInteraction(step) {
    const zone = document.getElementById('craft-interact-zone');
    zone.innerHTML = '';
    _interactHandlers = {};
    if (_timingTimer) { clearInterval(_timingTimer); _timingTimer = null; }
    _timingRunning = false;

    switch (step.interactionType) {

      case 'confirm': {
        const cfg = step.interactionConfig;
        zone.innerHTML = `
          <div class="interact-message">${cfg.message}</div>
          <button class="interact-confirm-btn" id="btn-confirm">✅ ${cfg.label}</button>`;
        document.getElementById('btn-confirm').onclick = () => _completeStep(1.0);
        break;
      }

      case 'rhythm': {
        const cfg = step.interactionConfig;
        let count = 0;
        zone.innerHTML = `
          <div class="rhythm-target">目标：点击 <strong style="color:#e8c87a;">${cfg.targetCount}</strong> 次 &nbsp;·&nbsp; <span style="color:rgba(200,180,100,0.5);">${cfg.hint}</span></div>
          <div class="rhythm-progress"><div class="rhythm-fill" id="rhythm-fill" style="width:0%"></div></div>
          <div id="rhythm-count" style="font-size:11px;color:rgba(200,160,80,0.45);">已完成：0 / ${cfg.targetCount}</div>
          <button class="rhythm-btn" id="btn-rhythm">${cfg.label}</button>`;
        const fill = document.getElementById('rhythm-fill');
        const countEl = document.getElementById('rhythm-count');
        let startTime = null;
        const times = [];
        document.getElementById('btn-rhythm').onclick = () => {
          const now = Date.now();
          if (startTime !== null) times.push(now - startTime);
          startTime = now;
          count++;
          const pct = Math.min(count / cfg.targetCount * 100, 100);
          fill.style.width = pct + '%';
          countEl.textContent = `已完成：${count} / ${cfg.targetCount}`;
          if (count >= cfg.targetCount) {
            const avgInterval = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 500;
            const rhythmScore = Math.max(0.3, Math.min(1.0, 1 - Math.abs(avgInterval - 400) / 600));
            _completeStep(rhythmScore);
          }
        };
        break;
      }

      case 'timing': {
        const cfg = step.interactionConfig;
        const target = cfg.holdSeconds;
        const r = 50;
        const circ = 2 * Math.PI * r;
        zone.innerHTML = `
          <div class="timing-ring-wrap">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle class="timing-ring-bg" cx="60" cy="60" r="${r}"/>
              <circle class="timing-ring-fg" id="timing-ring" cx="60" cy="60" r="${r}"
                stroke-dasharray="${circ}" stroke-dashoffset="${circ}"/>
            </svg>
            <div class="timing-center-text" id="timing-text">${target}s</div>
          </div>
          <div class="timing-hint">${cfg.hint}</div>
          <button class="timing-hold-btn" id="btn-timing">长按：${cfg.label}</button>`;

        const ring = document.getElementById('timing-ring');
        const txt = document.getElementById('timing-text');
        const btn = document.getElementById('btn-timing');
        let held = 0;
        let startT = null;
        let raf = null;
        let done = false;

        const update = () => {
          if (!_timingRunning || done) return;
          const now = Date.now();
          held = (now - startT) / 1000;
          const progress = Math.min(held / target, 1);
          ring.style.strokeDashoffset = circ * (1 - progress);
          txt.textContent = Math.max(0, (target - held)).toFixed(1) + 's';
          if (progress >= 1) {
            done = true;
            _timingRunning = false;
            cancelAnimationFrame(raf);
            const accuracy = 1 - Math.min(Math.abs(held - target), target) / target;
            _completeStep(Math.max(0.4, accuracy));
            return;
          }
          raf = requestAnimationFrame(update);
        };

        btn.addEventListener('mousedown', () => { if (done) return; _timingRunning = true; startT = Date.now(); held = 0; raf = requestAnimationFrame(update); });
        btn.addEventListener('touchstart', e => { e.preventDefault(); if (done) return; _timingRunning = true; startT = Date.now(); held = 0; raf = requestAnimationFrame(update); }, { passive: false });

        const release = () => {
          if (done || !_timingRunning) return;
          _timingRunning = false;
          cancelAnimationFrame(raf);
          if (held < target * 0.4) {
            ring.style.strokeDashoffset = circ;
            txt.textContent = target + 's';
            held = 0; startT = null;
          } else {
            done = true;
            const accuracy = 1 - Math.min(Math.abs(held - target), target) / target;
            _completeStep(Math.max(0.4, accuracy));
          }
        };
        btn.addEventListener('mouseup', release);
        btn.addEventListener('touchend', release);
        break;
      }

      case 'select': {
        const cfg = step.interactionConfig;
        let answered = false;
        const optHtml = cfg.options.map((opt, i) =>
          `<button class="select-option-btn" id="opt-${i}" onclick="CraftRenderer._selectAnswer(${i})">${opt}</button>`
        ).join('');
        zone.innerHTML = `
          <div class="select-question">${cfg.question}</div>
          <div class="select-options">${optHtml}</div>
          <div class="select-feedback hidden" id="select-feedback"></div>`;

        CraftRenderer._selectAnswer = (idx) => {
          if (answered) return;
          answered = true;
          const isCorrect = idx === cfg.correct;
          cfg.options.forEach((_, i) => {
            const btn = document.getElementById(`opt-${i}`);
            if (i === cfg.correct) btn.classList.add('correct');
            else if (i === idx && !isCorrect) btn.classList.add('wrong');
            btn.disabled = true;
          });
          const fb = document.getElementById('select-feedback');
          fb.textContent = cfg.feedback[idx];
          fb.classList.remove('hidden');
          setTimeout(() => _completeStep(isCorrect ? 1.0 : 0.4), 1500);
        };
        break;
      }

      case 'observe': {
        const cfg = step.interactionConfig;
        let answered = false;
        zone.innerHTML = `
          <div class="select-question" style="margin-bottom:10px;">观察窑内火色，判断最佳出窑时机：</div>
          <div class="observe-stages">${
            cfg.stages.map((s, i) =>
              `<button class="observe-stage-btn" id="obs-${i}" onclick="CraftRenderer._observeAnswer(${i})">${s}</button>`
            ).join('')
          }</div>`;

        CraftRenderer._observeAnswer = (idx) => {
          if (answered) return;
          answered = true;
          const isCorrect = idx === cfg.correctStage;
          cfg.stages.forEach((_, i) => {
            const btn = document.getElementById(`obs-${i}`);
            if (i === cfg.correctStage) btn.classList.add('correct');
            else if (i === idx && !isCorrect) btn.classList.add('wrong');
            btn.disabled = true;
          });
          setTimeout(() => _completeStep(isCorrect ? 1.0 : 0.3), 1200);
        };
        break;
      }

      default: {
        zone.innerHTML = `<button class="interact-confirm-btn" onclick="CraftRenderer._completeCurrentStep(1.0)">继续</button>`;
        break;
      }
    }
  }

  function _completeStep(score) {
    CraftEngine.completeStep(score);
    if (CraftEngine.hasNextStep()) {
      setTimeout(_showStep, 300);
    } else {
      // 最后一步完成，显示特效然后结算
      setTimeout(() => {
        const recipe = CraftEngine.getRecipe();
        _showFX(recipe ? recipe.icon : '✨', '造物完成');
        setTimeout(() => {
          document.getElementById('craft-fx').classList.remove('show');
          _showResult();
        }, 1800);
      }, 400);
    }
  }

  function _showFX(icon, label) {
    const fxEl = document.getElementById('craft-fx');
    document.getElementById('fx-burst').textContent = icon;
    document.getElementById('fx-label').textContent = label;
    fxEl.classList.add('show');

    // 粒子
    const colors = ['#e8c87a', '#f5d060', '#c87020', '#7eb6a1', '#ffffff'];
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'fx-particle';
      const size = 4 + Math.random() * 8;
      const angle = Math.PI * 2 * i / 20 + Math.random() * 0.3;
      const dist = 80 + Math.random() * 120;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        background:${colors[i % colors.length]};
        left:50%; top:50%;
        margin-left:-${size/2}px; margin-top:-${size/2}px;
        --tx:${Math.cos(angle)*dist}px; --ty:${Math.sin(angle)*dist-40}px;
        --d:${0.8 + Math.random()*0.7}s; --delay:${Math.random()*0.15}s;
      `;
      fxEl.appendChild(p);
    }
    setTimeout(() => fxEl.querySelectorAll('.fx-particle').forEach(p => p.remove()), 2000);
  }

  /* ══ 屏幕4：结算 ══ */
  function _showResult() {
    const res = CraftEngine.finalize();
    if (!res) return;

    document.getElementById('result-icon').textContent = res.icon;
    document.getElementById('result-name').textContent = res.name;
    document.getElementById('result-quality').textContent = '★'.repeat(res.quality) + '☆'.repeat(5 - res.quality);

    const badge = document.getElementById('result-mutation-badge');
    const mutDesc = document.getElementById('result-mutation-desc');
    if (res.isMutation) {
      badge.classList.remove('hidden');
      mutDesc.textContent = res.mutationDesc;
      mutDesc.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
      mutDesc.classList.add('hidden');
    }

    document.getElementById('result-history').textContent = res.compendiumHistory
      ? `「${res.compendiumHistory}」`
      : '';

    document.getElementById('result-stats').innerHTML = `
      <div class="result-stat"><div class="result-stat-val">${res.station}</div><div class="result-stat-label">制作于</div></div>
      <div class="result-stat"><div class="result-stat-val">${res.recipe.steps.length}</div><div class="result-stat-label">道工序</div></div>
      <div class="result-stat"><div class="result-stat-val">${'★'.repeat(res.quality)}</div><div class="result-stat-label">品质</div></div>
    `;

    if (typeof showNotification === 'function') {
      showNotification(
        res.isMutation
          ? `天生异象！获得【${res.name}】！` + (res.mutationDesc ? '' : '')
          : `造物完成！获得【${res.name}】`,
        res.icon,
        4000
      );
    }

    _showScreen('screen-result');
  }

  /* ══ 公开 API ══ */
  return {
    _completeCurrentStep: _completeStep,
    _selectAnswer: null,
    _observeAnswer: null,

    inject() {
      if (document.getElementById('craft-overlay')) return;
      document.head.insertAdjacentHTML('beforeend', CSS);
      document.body.insertAdjacentHTML('beforeend', HTML);
    },

    open() {
      this.inject();
      CraftEngine.init();
      _renderHub();
      document.getElementById('craft-overlay').classList.add('open');
      if (typeof playSound === 'function') playSound('click');
    },

    showHub() {
      CraftEngine.abort();
      _renderHub();
    },

    startCraft(recipeId) {
      if (!CraftEngine.selectRecipe(recipeId)) return;
      const recipe = CraftEngine.getRecipe();
      if (!recipe || !CraftEngine.canCraft(recipe)) return;
      if (!CraftEngine.start()) return;
      if (typeof playSound === 'function') playSound('magic');
      _showStep();
    },

    craftAgain() {
      // 返回同一设备的配方页
      if (_currentStationId) _showRecipes(_currentStationId);
      else _renderHub();
    },

    confirmAbort() {
      if (confirm('确定要中止造物吗？已消耗的材料将不会退回。')) {
        CraftEngine.abort();
        _renderHub();
      }
    },

    close() {
      const overlay = document.getElementById('craft-overlay');
      if (overlay) overlay.classList.remove('open');
      document.getElementById('craft-particles').innerHTML = '';
      CraftEngine.abort();
    }
  };
})();

/* ════════════════════════════════════════════════════════════════
   四、全局接口：覆盖旧入口
   ════════════════════════════════════════════════════════════════ */

/** Dock 底部「🔨 造物」按钮入口 */
window.openCrafting = function() {
  CraftRenderer.open();
};

/** 天工阁旧接口兼容 */
window.openCraftingHub = function() {
  CraftRenderer.open();
};

/** 快速从外部直接进入某设备 */
window.openCraftingStation = function(stationId) {
  CraftRenderer.inject();
  CraftEngine.init();
  document.getElementById('craft-overlay').classList.add('open');
  CraftRenderer._showRecipesPublic = function() {};
  // 延迟一帧确保 DOM 就绪
  setTimeout(() => {
    CraftRenderer.open();
    // 自动进入指定设备
    setTimeout(() => {
      const btn = document.querySelector(`[data-station="${stationId}"]`);
      if (btn) btn.click();
    }, 100);
  }, 50);
};

console.log('✅ 天工造物系统 · 统一终极版 已加载');
