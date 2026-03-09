/* ============================================================
   寻遗集 · data/game-content.js
   百科词条 / 物品库 / 任务系统 / 灯谜库 / 成就系统 / 商店商品
   ============================================================ */


/* ══════════════════════════════════════════════════════════
   一、非遗百科词条库
   ══════════════════════════════════════════════════════════ */
const encyclopediaData = [

  /* ── 织绣印染 ── */
  {
    id: 'enc_suzhou_embroidery',
    category: 'zhixiu',
    title: '苏绣',
    subtitle: '百戏之绣，两千年华',
    icon: '🪡',
    coverBg: 'linear-gradient(135deg, #e8d5f0, #c8b0e0)',
    desc: '苏绣是中国四大名绣之首，发源于苏州，有两千余年历史。以丝线为主要原料，针法多样，图案精美，色彩雅致。一根丝线可劈分为64丝，最细的绣线只有头发丝的六十四分之一，用此绣出的作品，针脚细如发丝，图案栩栩如生。代表作品有双面绣《猫》《金鱼》等，正反两面图案完全不同，堪称绝技。',
    details: [
      { label: '发源地', value: '江苏苏州' },
      { label: '历史年代', value: '约2000年' },
      { label: '遗产级别', value: '国家级非遗' },
      { label: '联合国认定', value: '人类非物质文化遗产' },
      { label: '代表技法', value: '散针、游针、乱针绣' },
      { label: '核心材料', value: '蚕丝、丝绒线' },
    ],
    relatedItems: ['苏绣丝线', '苏绣团扇', '绣架'],
    relatedInheritors: [1],
    tags: ['刺绣', '丝绸', '江南', '传统工艺'],
    unlocked: true,
  },

  {
    id: 'enc_batik',
    category: 'zhixiu',
    title: '苗族蜡染',
    subtitle: '靛蓝深处，祖先的记忆',
    icon: '🎨',
    coverBg: 'linear-gradient(135deg, #c8d8f0, #8898c0)',
    desc: '苗族蜡染是苗族最具代表性的传统手工艺，已有两千余年历史。工艺分为绘蜡、染色、去蜡三步：先用铜质蜡刀蘸融化的蜂蜡在白棉布上绘制图案，再浸入靛蓝染液，去蜡后即显出白色花纹。蜡在染色前开裂形成的"冰裂纹"是蜡染最具魅力的特征，独一无二，无法复制。苗族蜡染图案多源于自然与神话，铜鼓纹、蝴蝶妈妈纹各有深意。',
    details: [
      { label: '发源地', value: '贵州、云南苗族聚居区' },
      { label: '历史年代', value: '约2000年' },
      { label: '遗产级别', value: '国家级非遗' },
      { label: '核心染料', value: '天然靛蓝（蓼蓝草提取）' },
      { label: '特色纹样', value: '铜鼓纹、蝴蝶妈妈纹、螺旋纹' },
      { label: '防染材料', value: '蜂蜡' },
    ],
    relatedItems: ['蜡染布料', '苗族蓝靛'],
    relatedInheritors: [7],
    tags: ['蜡染', '苗族', '贵州', '天然染色'],
    unlocked: true,
  },

  /* ── 陶瓷烧造 ── */
  {
    id: 'enc_longquan_celadon',
    category: 'taoci',
    title: '龙泉青瓷',
    subtitle: '青如玉，明如镜，声如磬',
    icon: '🏺',
    coverBg: 'linear-gradient(135deg, #c8e8d0, #88c098)',
    desc: '龙泉青瓷是中国最著名的传统陶瓷之一，以"青如玉、明如镜、声如磬"著称。产自浙江龙泉，始于三国两晋，盛于宋元，已有1600余年历史。最具代表性的两种釉色是"粉青"与"梅子青"——粉青如青玉般温润含蓄，梅子青如翡翠般深邃通透。龙泉青瓷曾随海上丝绸之路行销全球，在日本、东南亚、中东各地均有大量出土记录。',
    details: [
      { label: '发源地', value: '浙江龙泉' },
      { label: '历史年代', value: '约1600年' },
      { label: '遗产级别', value: '联合国非物质文化遗产' },
      { label: '代表釉色', value: '粉青、梅子青' },
      { label: '烧制温度', value: '1250-1280℃' },
      { label: '胎土材料', value: '龙泉紫金土' },
    ],
    relatedItems: ['影青莲花杯', '高岭陶土'],
    relatedInheritors: [2],
    tags: ['青瓷', '浙江', '宋代', '海上丝路'],
    unlocked: true,
  },

  {
    id: 'enc_zisha',
    category: 'taoci',
    title: '宜兴紫砂',
    subtitle: '方非一式，圆无一相',
    icon: '☕',
    coverBg: 'linear-gradient(135deg, #d8b898, #b89070)',
    desc: '宜兴紫砂壶是中国独有的陶器艺术品，产自江苏宜兴丁蜀镇。紫砂泥分紫泥、红泥、绿泥三大类，矿源稀缺且独一无二。紫砂壶制作不用拉坯，采用独特的"打片围桶"全手工成型法，每一把壶都是匠人匠心的结晶。紫砂壶最神奇之处在于"越养越美"——泥料的微孔会逐渐吸附茶汁，形成包浆，光泽日益温润如玉。',
    details: [
      { label: '发源地', value: '江苏宜兴' },
      { label: '历史年代', value: '约600年（明代兴盛）' },
      { label: '遗产级别', value: '国家级非遗' },
      { label: '泥料种类', value: '紫泥、红泥、绿泥' },
      { label: '成型技法', value: '全手工打片围桶' },
      { label: '著名壶型', value: '西施、石瓢、井栏、仿古' },
    ],
    relatedItems: ['西施紫砂壶', '高岭陶土'],
    relatedInheritors: [8],
    tags: ['紫砂', '茶具', '江苏', '手工艺'],
    unlocked: false,
  },

  /* ── 雕刻塑造 ── */
  {
    id: 'enc_dongyang_woodcarve',
    category: 'diaoke',
    title: '东阳木雕',
    subtitle: '刀走龙蛇，层叠江山',
    icon: '🪵',
    coverBg: 'linear-gradient(135deg, #e8c8a8, #c8a880)',
    desc: '东阳木雕是中国最著名的木雕流派之一，产自浙江东阳，起源于唐代，已有千余年历史。东阳木雕最显著的特色是"满构图"——画面填满整个雕刻面，无一处留白，极具装饰性。最代表性的技法是"叠层透雕"，在同一块木料上雕出多个层次，近看有前后景深，远看如一幅立体画卷。北京故宫内的大量木雕装饰出自东阳工匠之手。',
    details: [
      { label: '发源地', value: '浙江东阳' },
      { label: '历史年代', value: '约1400年' },
      { label: '遗产级别', value: '国家级非遗' },
      { label: '构图特点', value: '满构图无留白' },
      { label: '代表技法', value: '叠层透雕、薄浮雕' },
      { label: '常用木料', value: '香樟、银杏、椴木' },
    ],
    relatedItems: ['沉香木料', '松鹤延年摆件'],
    relatedInheritors: [3],
    tags: ['木雕', '浙江', '装饰艺术', '立体雕刻'],
    unlocked: true,
  },

  {
    id: 'enc_hediao',
    category: 'diaoke',
    title: '核雕',
    subtitle: '方寸之间，大千世界',
    icon: '🥜',
    coverBg: 'linear-gradient(135deg, #d8c8b0, #b8a090)',
    desc: '核雕是中国独特的微型雕刻艺术，在橄榄核、桃核等果核上雕刻人物、山水、文字。明代魏学洢的《核舟记》详细记载了一件惊世之作：在一颗长不足一寸的橄榄核上，雕有五人、八扇窗，还有苏轼游赤壁的场景。顶级核雕作品须在放大镜下操作，刻刀宽仅0.2毫米，一件精品往往需要数月之功。',
    details: [
      { label: '发源地', value: '江苏苏州' },
      { label: '历史年代', value: '约600年（明代兴盛）' },
      { label: '遗产级别', value: '国家级非遗' },
      { label: '常用材料', value: '橄榄核、桃核、杏核' },
      { label: '雕刻技法', value: '圆雕、浮雕、透雕' },
      { label: '代表名作', value: '《核舟记》' },
    ],
    relatedItems: ['核舟记核雕'],
    relatedInheritors: [9],
    tags: ['核雕', '微雕', '江苏', '匠心'],
    unlocked: false,
  },

  /* ── 音律乐器 ── */
  {
    id: 'enc_guqin',
    category: 'yinlv',
    title: '古琴',
    subtitle: '高山流水，千年余音',
    icon: '🎸',
    coverBg: 'linear-gradient(135deg, #d8d0b8, #b8b098)',
    desc: '古琴是中国最古老的弹拨乐器，居"琴棋书画"四艺之首。有七根弦，音域宽广，音色深沉内敛。古琴有三千余年历史，是中国文人士大夫的必修技艺，孔子、嵇康、蔡邕等都是著名的琴人。名曲《高山流水》《广陵散》《平沙落雁》流传千古。2003年古琴艺术被列入联合国人类口头和非物质文化遗产名录。',
    details: [
      { label: '弦数', value: '七弦' },
      { label: '历史年代', value: '约3000年' },
      { label: '遗产级别', value: '联合国非物质文化遗产' },
      { label: '面板材料', value: '老桐木（百年以上）' },
      { label: '底板材料', value: '梓木' },
      { label: '经典名曲', value: '高山流水、广陵散、平沙落雁' },
    ],
    relatedItems: ['仲尼式古琴', '古琴琴弦'],
    relatedInheritors: [4],
    tags: ['古琴', '七弦', '文人', '中国音乐'],
    unlocked: true,
  },

  {
    id: 'enc_suona',
    category: 'yinlv',
    title: '唢呐',
    subtitle: '一声唢呐，百里皆闻',
    icon: '📯',
    coverBg: 'linear-gradient(135deg, #f0d898, #d0b870)',
    desc: '唢呐是中国最具穿透力的民间乐器，起源于西域，约在金元时期传入中原，至明代成为主流民间乐器。唢呐由管身（木制）、哨片（芦苇制）、铜碗三部分组成，演奏技法包括循环换气、花舌、滑音等。它是民间婚丧嫁娶、庙会祭祀不可或缺的乐器，被称为"民间第一乐器"。名曲《百鸟朝凤》能模仿数十种鸟鸣，令人叹为观止。',
    details: [
      { label: '起源', value: '西域（波斯、中亚）' },
      { label: '传入中原', value: '金元时期' },
      { label: '遗产级别', value: '国家级非遗' },
      { label: '管身材料', value: '花梨木、红木' },
      { label: '哨片材料', value: '芦苇' },
      { label: '代表曲目', value: '百鸟朝凤、将军令、一枝花' },
    ],
    relatedItems: ['百鸟朝凤唢呐'],
    relatedInheritors: [10],
    tags: ['唢呐', '民间音乐', '婚庆', '民俗'],
    unlocked: false,
  },

  /* ── 民俗技艺 ── */
  {
    id: 'enc_shadow_puppet',
    category: 'minsu',
    title: '皮影戏',
    subtitle: '光影之间，两千年传奇',
    icon: '🎭',
    coverBg: 'linear-gradient(135deg, #f0c898, #d0a870)',
    desc: '皮影戏是中国最古老的戏剧形式之一，起源于西汉，已有两千余年历史。用驴皮或牛皮制成人物造型，在灯光下通过幕布投影，配以演唱和音乐表演故事。每个皮影人物由11个关节部件组成，操纵者可通过细签控制人物的各种动作。中国皮影戏有陕西华县、河北唐山、辽宁复州等多个流派，各具特色。',
    details: [
      { label: '起源', value: '西汉（约公元前100年）' },
      { label: '主要材料', value: '驴皮、牛皮' },
      { label: '遗产级别', value: '联合国非物质文化遗产' },
      { label: '主要流派', value: '陕西、河北、辽宁' },
      { label: '人物关节', value: '11个部件' },
      { label: '表演形式', value: '幕后操纵+演唱配乐' },
    ],
    relatedItems: ['西游记皮影套组'],
    relatedInheritors: [5],
    tags: ['皮影', '戏剧', '民俗', '光影艺术'],
    unlocked: true,
  },

  {
    id: 'enc_jianzhi',
    category: 'minsu',
    title: '剪纸',
    subtitle: '一剪之间，万象皆生',
    icon: '✂️',
    coverBg: 'linear-gradient(135deg, #f8d0d0, #e8a0a0)',
    desc: '剪纸是中国流传最广的民间艺术之一，起源于汉唐时期，宋代后在民间广泛流传。仅凭一把剪刀和一张纸，便能剪出花鸟虫鱼、人物故事等各种图案。中国剪纸分北方和南方两大流派：北方剪纸粗犷豪放，线条简洁；南方剪纸细腻精巧，线条婉转流畅。春节贴窗花、婚庆剪喜字，剪纸与中国传统节日习俗紧密相连。',
    details: [
      { label: '起源', value: '汉唐时期' },
      { label: '遗产级别', value: '联合国非物质文化遗产' },
      { label: '北方风格', value: '粗犷豪放、线条简洁' },
      { label: '南方风格', value: '细腻精巧、婉转流畅' },
      { label: '节日习俗', value: '春节窗花、婚庆喜字' },
      { label: '基本工具', value: '剪刀、刻刀、宣纸' },
    ],
    relatedItems: ['十二生肖剪纸套组'],
    relatedInheritors: [11],
    tags: ['剪纸', '节日民俗', '民间艺术', '红纸'],
    unlocked: true,
  },

  /* ── 书画印刷 ── */
  {
    id: 'enc_movable_type',
    category: 'shuhua',
    title: '活字印刷术',
    subtitle: '一枚泥字，改变世界',
    icon: '📜',
    coverBg: 'linear-gradient(135deg, #d8c8b0, #b8a888)',
    desc: '活字印刷术由北宋毕昇于1040年前后发明，是中国古代四大发明之一。用泥、木或金属制成单个字模，按稿件排列组版，涂墨压印，印完后可拆版重复使用。比欧洲古腾堡的铅活字印刷早约四百年。这项技术随海上贸易传至朝鲜、日本，并最终影响欧洲，直接促进了文艺复兴和宗教改革，被认为是改变人类历史进程的重要发明之一。',
    details: [
      { label: '发明者', value: '毕昇（北宋）' },
      { label: '发明时间', value: '约1040年' },
      { label: '遗产级别', value: '国家级非遗' },
      { label: '字模材料', value: '泥活字、木活字、铜活字' },
      { label: '早于西方', value: '约400年' },
      { label: '传播路径', value: '朝鲜→日本→欧洲' },
    ],
    relatedItems: ['论语活字套组'],
    relatedInheritors: [6],
    tags: ['四大发明', '印刷', '毕昇', '文化传播'],
    unlocked: true,
  },

  {
    id: 'enc_calligraphy',
    category: 'shuhua',
    title: '中国书法',
    subtitle: '笔走龙蛇，气韵生动',
    icon: '✍️',
    coverBg: 'linear-gradient(135deg, #e8e0d0, #c8c0b0)',
    desc: '中国书法是以毛笔书写汉字的艺术，有三千余年历史，是中国传统文化的核心组成部分。书法分篆、隶、楷、行、草五种字体，各有其历史背景与艺术特色。王羲之被称为"书圣"，其《兰亭序》被誉为"天下第一行书"。书法讲究用笔（起笔、行笔、收笔）、结体（字的结构比例）、章法（整体布局）三个层次，既是技艺，也是修身养性的方式。',
    details: [
      { label: '历史年代', value: '约3000年' },
      { label: '遗产级别', value: '联合国非物质文化遗产' },
      { label: '五种书体', value: '篆、隶、楷、行、草' },
      { label: '书圣', value: '王羲之' },
      { label: '第一行书', value: '《兰亭序》' },
      { label: '文房四宝', value: '笔、墨、纸、砚' },
    ],
    relatedItems: ['兰亭序书法长卷'],
    relatedInheritors: [12],
    tags: ['书法', '汉字', '文化', '文房四宝'],
    unlocked: false,
  },
];


/* ══════════════════════════════════════════════════════════
   二、物品库 (终极融合版：包含属性、回调与记忆回音)
   ══════════════════════════════════════════════════════════ */
const itemDatabase = {

  /* ── 材料类 ── */
  苏绣丝线:     { icon: '🧵', type: 'material', rarity: 2, desc: '五彩苏绣丝线，刺绣基础材料，可劈为64丝', maxStack: 99, useFunc: null, usable: false },
  苗族蓝靛:     { icon: '🫙', type: 'material', rarity: 2, desc: '从蓼蓝草中提取的天然靛蓝染料，蜡染专用', maxStack: 30, useFunc: null, usable: false },
  沉香木料:     { icon: '🪵', type: 'material', rarity: 3, desc: '上等沉香木，适合精雕细刻，天然防虫', maxStack: 20, useFunc: null, echo: '“这块木头...曾是某座宏伟宫殿的顶梁，我听到了大火焚烧的悲鸣。”', usable: false },
  高岭陶土:     { icon: '🏺', type: 'material', rarity: 1, desc: '优质高岭土，陶器基础材料，细腻致密', maxStack: 50, useFunc: null, usable: false },
  五香料:       { icon: '🌶️', type: 'material', rarity: 1, desc: '市集散落的香料，可用于制作香囊', maxStack: 99, useFunc: null, usable: false },
  戏服丝料:     { icon: '🎀', type: 'material', rarity: 2, desc: '戏班丢落的彩色丝料，可用于制作服饰', maxStack: 30, useFunc: null, echo: '“台下人走过，不见旧颜色...”隐约能听到青衣婉转的叹息。', usable: false },
  云锦布料:     { icon: '👘', type: 'material', rarity: 3, desc: '南京云锦，织物中的极品，价值不菲', maxStack: 10, useFunc: null, usable: false },
  糕点材料:     { icon: '🍘', type: 'material', rarity: 1, desc: '老字号留下的点心配方材料', maxStack: 50, useFunc: null, usable: false },
  明前龙井:     { icon: '🍃', type: 'material', rarity: 2, desc: '清晨采摘的新鲜茶叶，清明前一芽一叶', maxStack: 30, useFunc: 'eatFood', echo: '“只有晨露未晞时采摘，方能留住这口仙气。”', usable: true, actionName: '生嚼提神' },
  山泉水:       { icon: '💧', type: 'material', rarity: 3, desc: '竹林深处的山泉，据说是煮茶的极品水源', maxStack: 20, useFunc: null, usable: false },
  西域香料:     { icon: '🌶️', type: 'material', rarity: 2, desc: '来自西域的珍贵香料，香气独特持久', maxStack: 20, useFunc: null, usable: false },
  尼罗河莎草:   { icon: '🌾', type: 'material', rarity: 2, desc: '生长于尼罗河畔的莎草，古埃及造纸原料', maxStack: 30, useFunc: null, usable: false },
  上等竹料:     { icon: '🎋', type: 'material', rarity: 2, desc: '云端特有的轻质竹材，适合编制各类器物', maxStack: 20, useFunc: null, usable: false },
  紫苏叶:       { icon: '🌿', type: 'material', rarity: 1, desc: '新鲜的紫苏叶，中医常用药材', maxStack: 99, useFunc: null, usable: false },
  百花精华:     { icon: '🌸', type: 'material', rarity: 2, desc: '采集自各色鲜花的精华，可提炼香料', maxStack: 20, useFunc: null, usable: false },
  // 新增：天工造物配方/设备对应材料（严格匹配）
  清晨露水:     { icon: '💧', type: 'material', rarity: 3, desc: '青岚界清晨采集的纯净露水，可让陶泥产生变异', maxStack: 20, useFunc: null, echo: '“晨露沾衣，草木生香，这是自然的馈赠。”', usable: false },
  赤铁矿粉:     { icon: '🔴', type: 'material', rarity: 2, desc: '红土坡采集的赤铁矿研磨而成，可使陶泥呈赤红底色', maxStack: 30, useFunc: null, usable: false },
  古陶碎片:     { icon: '🏺', type: 'material', rarity: 3, desc: '龙窑旧址收集的千年古陶碎片，能赋予陶泥古韵', maxStack: 15, useFunc: null, echo: '“这碎片上的纹路，是古人烧造技艺的印记。”', usable: false },
  木模茶盏:     { icon: '🪵', type: 'material', rarity: 2, desc: '鲁班台制作的茶盏木模，用于拉坯机塑形', maxStack: 10, useFunc: null, usable: false },
  青釉料:       { icon: '🎨', type: 'material', rarity: 3, desc: '龙泉窑专用青釉料，陶瓷施釉核心材料', maxStack: 20, useFunc: null, usable: false },
  竹制刻刀:     { icon: '🔪', type: 'material', rarity: 2, desc: '灵竹制作的刻刀，用于陶瓷、皮影雕刻', maxStack: 10, useFunc: null, usable: false },
  金粉:         { icon: '✨', type: 'material', rarity: 4, desc: '纯金研磨的细粉，用于瓷器描金、漆器装饰', maxStack: 10, useFunc: null, usable: false },
  鲛人泪:       { icon: '💧', type: 'material', rarity: 5, desc: '沧溟海域鲛人滴落的泪水，可让器物产生灵韵', maxStack: 5, useFunc: null, echo: '“一滴鲛人泪，千年不褪色，藏着深海的秘密。”', usable: false },
  珍珠粉:       { icon: '💎', type: 'material', rarity: 3, desc: '南海珍珠研磨而成，可提升瓷器、茶膏品质', maxStack: 15, useFunc: null, usable: false },
  蓝草汁液:     { icon: '🔵', type: 'material', rarity: 2, desc: '青岚界蓝草榨取的汁液，用于草木染制绣线', maxStack: 30, useFunc: null, usable: false },
  栀子花粉:     { icon: '⚪', type: 'material', rarity: 2, desc: '染坊秘方材料，可染制出不易泛黄的白绣线', maxStack: 30, useFunc: null, usable: false },
  鲛绡断匹:     { icon: '🌊', type: 'material', rarity: 4, desc: '沧溟海域鲛人织造的鲛绡碎片，轻盈透光', maxStack: 5, useFunc: null, echo: '“鲛绡薄如蝉翼，能映出海底星河。”', usable: false },
  荧光孢子:     { icon: '✨', type: 'material', rarity: 3, desc: '森之低语发光蘑菇的孢子，可制作夜光器物', maxStack: 20, useFunc: null, usable: false },
  戏服绣线:     { icon: '🧵', type: 'material', rarity: 3, desc: '万艺城戏服边角绣线，承载戏曲文化韵味', maxStack: 20, useFunc: null, echo: '“这绣线上的针脚，藏着名角儿的身段韵味。”', usable: false },
  古绣针:       { icon: '🪡', type: 'material', rarity: 3, desc: '明代流传的古绣针，提升刺绣成功率', maxStack: 5, useFunc: null, usable: false },
  金线:         { icon: '💰', type: 'material', rarity: 4, desc: '纯金拉制的丝线，用于云锦织造、绣品装饰', maxStack: 15, useFunc: null, usable: false },
  孔雀羽毛:     { icon: '🦚', type: 'material', rarity: 4, desc: '孔雀尾部羽毛，可提升云锦光泽度', maxStack: 10, useFunc: null, usable: false },
  驴皮:         { icon: '🐴', type: 'material', rarity: 2, desc: '优质驴皮，皮影制作核心材料，透光性极佳', maxStack: 10, useFunc: null, usable: false },
  草木染料:     { icon: '🎨', type: 'material', rarity: 2, desc: '多种草木提取的天然染料，用于皮影、竹编染色', maxStack: 30, useFunc: null, usable: false },
  胡杨木:       { icon: '🌵', type: 'material', rarity: 3, desc: '沙海特有的胡杨木，坚硬耐用，适合木作', maxStack: 15, useFunc: null, echo: '“胡杨生而千年不死，死而千年不倒，藏着沙海的坚韧。”', usable: false },
  桐油:         { icon: '🫙', type: 'material', rarity: 2, desc: '桐树果实榨取的油，用于木作防腐、漆器调配', maxStack: 20, useFunc: null, usable: false },
  青铜齿轮:     { icon: '⚙️', type: 'material', rarity: 3, desc: '欧罗巴古堡掉落的青铜齿轮，用于机械木作', maxStack: 10, useFunc: null, usable: false },
  流沙琥珀:     { icon: '🪨', type: 'material', rarity: 4, desc: '沙海采集的琥珀，内含流沙，可赋予木作灵性', maxStack: 5, useFunc: null, echo: '“琥珀里的流沙，是时光凝固的痕迹。”', usable: false },
  灵竹:         { icon: '🎋', type: 'material', rarity: 3, desc: '青岚界特有的灵竹，质地轻盈，灵气十足', maxStack: 20, useFunc: null, usable: false },
  玻璃镜片:     { icon: '🔍', type: 'material', rarity: 3, desc: '西洋传入的玻璃镜片，用于木鸢望远功能', maxStack: 5, useFunc: null, usable: false },
  灵竹篾:       { icon: '🎋', type: 'material', rarity: 2, desc: '灵竹加工而成的竹篾，用于竹编器物', maxStack: 30, useFunc: null, usable: false },
  无根水:       { icon: '💧', type: 'material', rarity: 3, desc: '晨曦接引的无根之水，提升茶膏、点茶品质', maxStack: 20, useFunc: null, echo: '“无根水承天地灵气，是茶道的极致水源。”', usable: false },
  灵竹露:       { icon: '💧', type: 'material', rarity: 3, desc: '灵竹叶片凝结的露水，可提升茶膏竹香', maxStack: 20, useFunc: null, usable: false },
  桂花蜜:       { icon: '🌼', type: 'material', rarity: 2, desc: '秋季桂花酿造的蜜，用于茶膏、香丸调配', maxStack: 20, useFunc: null, usable: false },
  安息香:       { icon: '🪔', type: 'material', rarity: 3, desc: '沙海特有的安息香，合香核心材料，安神定志', maxStack: 15, useFunc: null, usable: false },
  梅花瓣:       { icon: '❄️', type: 'material', rarity: 2, desc: '寒冬梅花花瓣，用于合香香丸，香气淡雅', maxStack: 30, useFunc: null, usable: false },
  沉香粉:       { icon: '🪵', type: 'material', rarity: 3, desc: '沉香木料研磨的细粉，合香、印石装饰专用', maxStack: 20, useFunc: null, usable: false },
  檀香粉:       { icon: '🪵', type: 'material', rarity: 3, desc: '檀香木研磨的细粉，与沉香搭配合香', maxStack: 20, useFunc: null, usable: false },
  蜂蜜:         { icon: '🍯', type: 'material', rarity: 2, desc: '天然蜂蜜，用于合香香丸粘合', maxStack: 30, useFunc: null, usable: false },
  龙涎香:       { icon: '🐉', type: 'material', rarity: 5, desc: '深海龙涎香，合香极品，香气持久', maxStack: 3, useFunc: null, echo: '“龙涎香出深海，一缕香魂绕千年。”', usable: false },
  茶筅:         { icon: '🥢', type: 'material', rarity: 2, desc: '宋代点茶专用茶筅，用于搅拌茶膏', maxStack: 5, useFunc: null, usable: false },
  石灰:         { icon: '⚪', type: 'material', rarity: 1, desc: '造纸专用石灰，用于竹浆脱胶', maxStack: 50, useFunc: null, usable: false },
  檀木灰:       { icon: '🪵', type: 'material', rarity: 2, desc: '檀香木燃烧后的灰烬，用于宣纸防虫', maxStack: 30, useFunc: null, usable: false },
  稻草纤维:     { icon: '🌾', type: 'material', rarity: 1, desc: '稻草加工的纤维，用于宣纸制作，提升韧性', maxStack: 50, useFunc: null, usable: false },
  古墨粉:       { icon: '✒️', type: 'material', rarity: 3, desc: '古墨研磨的细粉，用于宣纸、印石装饰', maxStack: 20, useFunc: null, usable: false },
  花汁:         { icon: '🌸', type: 'material', rarity: 2, desc: '各色鲜花榨取的汁液，用于彩宣染色', maxStack: 30, useFunc: null, usable: false },
  普通印石:     { icon: '🪨', type: 'material', rarity: 2, desc: '普通石材，篆刻基础材料', maxStack: 20, useFunc: null, usable: false },
  砂纸:         { icon: '🧽', type: 'material', rarity: 1, desc: '用于打磨印石、玉石的砂纸', maxStack: 30, useFunc: null, usable: false },
  古河床印石:   { icon: '🪨', type: 'material', rarity: 3, desc: '古河床出土的印石，质地温润，适合篆刻', maxStack: 10, useFunc: null, echo: '“这印石吸尽河床灵气，刻出的印章自带神韵。”', usable: false },
  青铜粉:       { icon: '⚱️', type: 'material', rarity: 3, desc: '古青铜研磨的细粉，用于印石、皮影装饰', maxStack: 20, useFunc: null, usable: false },
  篆刻刀:       { icon: '🔪', type: 'material', rarity: 2, desc: '篆刻专用刀具，用于印石雕刻', maxStack: 5, useFunc: null, usable: false },
  防虫药粉:     { icon: '🌿', type: 'material', rarity: 2, desc: '古籍修复专用药粉，防虫防蛀', maxStack: 20, useFunc: null, usable: false },
  陈年宣纸碎片: { icon: '📜', type: 'material', rarity: 3, desc: '陈年宣纸的碎片，用于古籍修复', maxStack: 15, useFunc: null, echo: '“这碎片上的字迹，是古人留下的文脉。”', usable: false },
  普通玉石:     { icon: '💎', type: 'material', rarity: 3, desc: '普通玉石原石，玉石雕琢基础材料', maxStack: 15, useFunc: null, usable: false },
  切割工具:     { icon: '🔪', type: 'material', rarity: 2, desc: '玉石切割专用工具', maxStack: 5, useFunc: null, usable: false },
  打磨工具:     { icon: '🧽', type: 'material', rarity: 2, desc: '玉石打磨专用工具，提升玉石温润度', maxStack: 5, useFunc: null, usable: false },
  古玉碎片:     { icon: '💎', type: 'material', rarity: 4, desc: '千年古玉碎片，能赋予玉石古韵', maxStack: 10, useFunc: null, echo: '“古玉碎片藏千年灵气，是玉石雕琢的点睛之笔。”', usable: false },
  天然生漆:     { icon: '🎨', type: 'material', rarity: 3, desc: '天然生漆，漆器髹涂基础材料', maxStack: 20, useFunc: null, usable: false },
  贝壳碎屑:     { icon: '🐚', type: 'material', rarity: 2, desc: '贝壳研磨的碎屑，用于漆器装饰，提升光泽', maxStack: 30, useFunc: null, usable: false },
  木盒:         { icon: '📦', type: 'material', rarity: 2, desc: '普通木盒，漆器制作基础载体', maxStack: 15, useFunc: null, usable: false },
  铜矿石:       { icon: '🪨', type: 'material', rarity: 2, desc: '普通铜矿石，青铜铸造基础材料', maxStack: 30, useFunc: null, usable: false },
  锡矿石:       { icon: '🪨', type: 'material', rarity: 2, desc: '普通锡矿石，与铜矿石搭配铸造青铜', maxStack: 30, useFunc: null, usable: false },
  古青铜碎片:   { icon: '⚱️', type: 'material', rarity: 3, desc: '千年古青铜碎片，用于青铜锭铸造', maxStack: 15, useFunc: null, echo: '“这碎片上的古纹，是商代青铜铸造的密码。”', usable: false },
  青铜范:       { icon: '⚱️', type: 'material', rarity: 4, desc: '青铜铸造专用模具，复刻古法失蜡法工艺', maxStack: 5, useFunc: null, usable: false },
  金矿石:       { icon: '🪨', type: 'material', rarity: 4, desc: '天然金矿石，金银器锻造基础材料', maxStack: 10, useFunc: null, usable: false },
  银矿石:       { icon: '🪨', type: 'material', rarity: 3, desc: '天然银矿石，与金矿石搭配锻造金银器', maxStack: 15, useFunc: null, usable: false },
  古金碎片:     { icon: '💰', type: 'material', rarity: 4, desc: '千年古金碎片，用于金锭锻造，提升纯度', maxStack: 5, useFunc: null, echo: '“古金碎片藏着皇家气息，是金银器的极品材料。”', usable: false },
  珍珠:         { icon: '💎', type: 'material', rarity: 4, desc: '南海珍珠，用于金银器镶嵌', maxStack: 10, useFunc: null, usable: false },
  鲛绡绳:       { icon: '🌊', type: 'material', rarity: 3, desc: '鲛绡编织的绳子，用于金银器点缀', maxStack: 15, useFunc: null, usable: false },

  /* ── 收藏品 ── */
  茶经残卷:     { icon: '📖', type: 'collection', rarity: 3, desc: '陆羽《茶经》的残本，记载古代茶道精髓', maxStack: 1, useFunc: 'readEncyclopedia', echo: '隐约可见浮现的古老茶道冲泡手法...', usable: true, actionName: '研读残卷' },
  昆曲曲谱:     { icon: '📜', type: 'collection', rarity: 3, desc: '残破的昆曲曲谱，记载着失传的腔调', maxStack: 1, useFunc: 'readEncyclopedia', usable: true, actionName: '研读曲谱' },
  古丝绸碎片:   { icon: '🎀', type: 'collection', rarity: 3, desc: '千年丝绸之路遗留的丝绸残片，历史见证', maxStack: 5, useFunc: null, echo: '“顺着红圈走，那里有对抗大遗忘的关键...”', usable: false },
  南海珍珠:     { icon: '💍', type: 'collection', rarity: 4, desc: '深海蚌中孕育的稀有珍珠，光泽温润', maxStack: 5, useFunc: null, usable: false },
  古埃及陶罐:   { icon: '🏺', type: 'collection', rarity: 3, desc: '保存完好的古埃及彩绘陶罐，价值连城', maxStack: 1, useFunc: null, usable: false },
  非遗数据芯片: { icon: '💾', type: 'collection', rarity: 3, desc: '存有稀有非遗数字资产的芯片', maxStack: 5, useFunc: null, usable: false },
  千年灵芝:     { icon: '🍄', type: 'collection', rarity: 4, desc: '生长千年的稀有灵芝，极具收藏价值', maxStack: 1, useFunc: null, usable: false },
  // 新增：天工造物关联收藏品（匹配配方/剧情）
  宋代青瓷碎片: { icon: '🏺', type: 'collection', rarity: 3, desc: '宋代龙泉青瓷碎片，记载古代烧造工艺', maxStack: 5, useFunc: null, echo: '“这碎片的釉色，是宋代青瓷的巅峰水准。”', usable: false },
  苏绣古绣片:   { icon: '🧵', type: 'collection', rarity: 3, desc: '明代苏绣古绣片，针法细腻，保存完好', maxStack: 5, useFunc: null, echo: '“这绣片上的花鸟，仿佛要从布上飞出来。”', usable: false },
  鲁班木鸢残件: { icon: '🪵', type: 'collection', rarity: 4, desc: '古代鲁班木鸢的残件，带有机关痕迹', maxStack: 1, useFunc: null, echo: '“这残件上的机关，是墨家工艺的精髓。”', usable: false },
  古法合香配方: { icon: '📜', type: 'collection', rarity: 3, desc: '古代合香师流传的配方，记载多种香方', maxStack: 1, useFunc: 'readEncyclopedia', usable: true, actionName: '研读配方' },
  宣纸古样本:   { icon: '📜', type: 'collection', rarity: 3, desc: '明代宣纸样本，质地优良，是造纸工艺的见证', maxStack: 1, useFunc: null, usable: false },
  篆刻古印章:   { icon: '✒️', type: 'collection', rarity: 4, desc: '汉代篆刻古印章，字体古朴，极具收藏价值', maxStack: 1, useFunc: null, echo: '“这印章上的文字，是汉代文人的风骨。”', usable: false },
  古玉吊坠残件: { icon: '💎', type: 'collection', rarity: 4, desc: '唐代古玉吊坠残件，质地温润，带有古纹', maxStack: 1, useFunc: null, usable: false },
  漆器残片:     { icon: '🎨', type: 'collection', rarity: 3, desc: '清代漆器残片，描金工艺精湛', maxStack: 5, useFunc: null, usable: false },
  青铜古纹拓片: { icon: '⚱️', type: 'collection', rarity: 3, desc: '商代青铜器物的古纹拓片，记载古代纹饰', maxStack: 1, useFunc: 'readEncyclopedia', usable: true, actionName: '研读拓片' },
  云锦残片:     { icon: '👘', type: 'collection', rarity: 3, desc: '明代云锦残片，经纬交织，光泽璀璨', maxStack: 5, useFunc: null, echo: '“这云锦上的纹路，是皇家的专属图腾。”', usable: false },
  皮影古道具:   { icon: '🎭', type: 'collection', rarity: 3, desc: '清代皮影戏古道具，刀工细腻，神态逼真', maxStack: 1, useFunc: null, usable: false },

  /* ── 道具类 ── */
  精美花灯:     { icon: '🏮', type: 'prop', rarity: 2, desc: '手工制作的彩色花灯，节日装饰佳品', maxStack: 10, useFunc: 'useLantern', usable: true, actionName: '点燃花灯' },
  传统年糕:     { icon: '🎂', type: 'prop', rarity: 1, desc: '节日必备的糯米年糕，食用可恢复体力20点', maxStack: 20, useFunc: 'eatFood', usable: true, actionName: '食用' },
  全息晶石:     { icon: '🔮', type: 'prop', rarity: 3, desc: '可以播放非遗全息影像的神奇晶石', maxStack: 5, useFunc: 'playHologram', usable: true, actionName: '激活投影' },
  百年红酒:     { icon: '🍷', type: 'prop', rarity: 3, desc: '古堡地下窖藏百年的红葡萄酒，饮用可恢复体力50点', maxStack: 3, useFunc: 'drinkWine', echo: '“王绣娘曾提起过，若是能饮上一口这红酒，她便能绣出天外的颜色...”', usable: true, actionName: '一饮而尽' },
  云雀灵羽:     { icon: '🪶', type: 'prop', rarity: 3, desc: '云端灵雀的羽毛，可用于制作精品风筝', maxStack: 5, useFunc: null, usable: false },
  // 新增：天工造物关联道具（匹配配方/设备使用）
  竹制茶筅:     { icon: '🥢', type: 'prop', rarity: 2, desc: '灵竹制作的茶筅，宋代点茶专用，使用可提升茶膏品质', maxStack: 5, useFunc: null, usable: false },
  陶瓷茶盏:     { icon: '🍵', type: 'prop', rarity: 2, desc: '龙窑烧制的基础陶瓷茶盏，可用于点茶', maxStack: 10, useFunc: null, usable: false },
  绣针套装:     { icon: '🪡', type: 'prop', rarity: 2, desc: '苏绣专用绣针套装，包含不同粗细的绣针', maxStack: 5, useFunc: null, usable: false },
  木作工具包:   { icon: '🪚', type: 'prop', rarity: 2, desc: '鲁班台木作专用工具包，包含刻刀、刨子等', maxStack: 3, useFunc: null, usable: false },
  合香工具:     { icon: '⚗️', type: 'prop', rarity: 2, desc: '合香专用工具，包含研钵、筛子等', maxStack: 3, useFunc: null, usable: false },
  造纸工具:     { icon: '📜', type: 'prop', rarity: 2, desc: '古法造纸专用工具，包含抄纸帘、纸槽等', maxStack: 3, useFunc: null, usable: false },
  玉石工具套装: { icon: '💎', type: 'prop', rarity: 3, desc: '玉石雕琢专用工具套装，包含切割、打磨工具', maxStack: 3, useFunc: null, usable: false },
  漆器工具:     { icon: '🎨', type: 'prop', rarity: 2, desc: '漆器髹涂专用工具，包含漆刷、刮刀等', maxStack: 3, useFunc: null, usable: false },
  青铜铸造工具: { icon: '⚱️', type: 'prop', rarity: 3, desc: '青铜铸造专用工具，包含熔炉、模具等', maxStack: 2, useFunc: null, usable: false },
  金银锻造工具: { icon: '💰', type: 'prop', rarity: 3, desc: '金银器锻造专用工具，包含铁锤、錾子等', maxStack: 2, useFunc: null, usable: false },
  皮影演出工具: { icon: '🎭', type: 'prop', rarity: 2, desc: '皮影戏演出专用工具，包含灯箱、操纵杆等', maxStack: 3, useFunc: null, usable: false },
  竹编工具:     { icon: '🎋', type: 'prop', rarity: 2, desc: '竹编专用工具，包含篾刀、编织针等', maxStack: 3, useFunc: null, usable: false },
  染布工具:     { icon: '⚗️', type: 'prop', rarity: 2, desc: '草木染专用工具，包含染缸、搅拌棒等', maxStack: 3, useFunc: null, usable: false },
  安神香丸:     { icon: '💊', type: 'prop', rarity: 3, desc: '合香制作的安神香丸，服用可恢复精神力30点', maxStack: 15, useFunc: 'eatFood', usable: true, actionName: '服用' },
  桂香茶膏:     { icon: '🍵', type: 'prop', rarity: 3, desc: '加入桂花蜜的茶膏，食用可恢复体力40点', maxStack: 10, useFunc: 'eatFood', usable: true, actionName: '食用' },

  /* ── 稀有物品（隐藏点奖励）── */
  古琴琴弦:     { icon: '🎸', type: 'rare', rarity: 4, desc: '落灰的古琴上取下的琴弦，余音绕梁', maxStack: 1, useFunc: 'triggerQuest', echo: '手指触碰的瞬间，一首高山流水的旷世神曲在脑海中炸响。', usable: true, actionName: '拨动琴弦' },
  秘方残页:     { icon: '📜', type: 'rare', rarity: 4, desc: '泛黄的秘方纸，记载失传百年的做法', maxStack: 1, useFunc: 'triggerQuest', usable: true, actionName: '拼凑线索' },
  金绣针:       { icon: '🪡', type: 'rare', rarity: 5, desc: '传说中的金针，用此针绣出的作品细如发丝', maxStack: 1, useFunc: 'equip', usable: true, actionName: '装备神针' },
  百年雕刻刀:   { icon: '🔪', type: 'rare', rarity: 5, desc: '刻有"百年匠心"四字，木雕属性+50', maxStack: 1, useFunc: 'triggerQuest', usable: true, actionName: '端详刻字' },
  壁画拓片:     { icon: '🎨', type: 'rare', rarity: 4, desc: '沙漠石窟中的壁画拓片，记载未知传说', maxStack: 1, useFunc: 'readEncyclopedia', echo: '“法老王的诅咒已然苏醒，拿着它就能在沙暴中辨认方向...”', usable: true, actionName: '阅读壁画' },
  海上丝路图:   { icon: '🗺️', type: 'rare', rarity: 5, desc: '沉没水下宫殿的古地图，可解锁航海支线', maxStack: 1, useFunc: 'triggerQuest', usable: true, actionName: '展开地图' },
  天籁风铃:     { icon: '🎐', type: 'rare', rarity: 5, desc: '悬浮风铃塔上的风铃，每次摇动都会传递古老音讯', maxStack: 1, useFunc: 'useWindbell', usable: true, actionName: '摇动风铃' },
  法老黄金面具: { icon: '👑', type: 'rare', rarity: 5, desc: '金字塔密室中的黄金面具，价值连城', maxStack: 1, useFunc: null, usable: false },
  草药母典:     { icon: '📗', type: 'rare', rarity: 5, desc: '树皮写成的草药古书，包含所有草药的药性记录', maxStack: 1, useFunc: 'readEncyclopedia', usable: true, actionName: '翻阅母典' },
  炼金手记:     { icon: '📕', type: 'rare', rarity: 5, desc: '古堡密室中的炼金手记，可提升炼金属性', maxStack: 1, useFunc: 'readBook', usable: true, actionName: '研读手记' },
  百年全息影像: { icon: '📸', type: 'rare', rarity: 5, desc: '一位百年前艺术家的全息留影', maxStack: 1, useFunc: 'playHologram', usable: true, actionName: '播放影像' },
  神秘符文石:   { icon: '🔮', type: 'rare', rarity: 4, desc: '刻有上古符文的神秘石块，持有可感知隐藏节点', maxStack: 1, useFunc: 'equipPassive', usable: true, actionName: '注入灵力' },

  // 新增：天工造物关联稀有物品（匹配配方神级突变/隐藏剧情）
  曜变天目盏碎片: { icon: '🌌', type: 'rare', rarity: 5, desc: '神级窑变曜变天目盏的碎片，可触发陶瓷传承支线', maxStack: 1, useFunc: 'triggerQuest', echo: '“这碎片上的星空纹路，是天地灵气的结晶。”', usable: true, actionName: '感知灵气' },
  幻海流光扇残片: { icon: '🌊', type: 'rare', rarity: 5, desc: '鲛绡苏绣扇的残片，可解锁深海探索支线', maxStack: 1, useFunc: 'triggerQuest', usable: true, actionName: '拼接残片' },
  发条青鸟核心: { icon: '🕊️', type: 'rare', rarity: 5, desc: '机械木鸢发条青鸟的核心部件，可提升木作属性', maxStack: 1, useFunc: 'equip', usable: true, actionName: '装备核心' },
  霸王别姬惊梦香: { icon: '🎭', type: 'rare', rarity: 5, desc: '合香神级突变产物，点燃可触发万艺城剧情', maxStack: 1, useFunc: 'useIncense', echo: '“烟雾中浮现的青衣身影，是万艺城最后的名角儿。”', usable: true, actionName: '点燃香丸' },
  秘色青瓷配方: { icon: '📜', type: 'rare', rarity: 5, desc: '失传的秘色青瓷釉料配方，可解锁龙窑高级烧制', maxStack: 1, useFunc: 'triggerQuest', usable: true, actionName: '研读配方' },
  乱针绣金线:   { icon: '🧵', type: 'rare', rarity: 5, desc: '苏绣神级绣线，用金绣针搭配可绣出传世作品', maxStack: 1, useFunc: 'equip', usable: true, actionName: '装备绣线' },
  琥珀木灵兽核心: { icon: '🦂', type: 'rare', rarity: 5, desc: '琥珀木灵兽的核心，可让木作器物拥有灵性', maxStack: 1, useFunc: 'equip', usable: true, actionName: '注入灵气' },
  龙涎香丸:     { icon: '🐉', type: 'rare', rarity: 5, desc: '合香极品，点燃可吸引稀有传承人', maxStack: 1, useFunc: 'useIncense', usable: true, actionName: '点燃香丸' },
  商代青铜钟残件: { icon: '🔔', type: 'rare', rarity: 5, desc: '商代青铜钟的残件，可解锁青铜铸造传承支线', maxStack: 1, useFunc: 'triggerQuest', echo: '“钟声响起，仿佛穿越回商代的祭祀现场。”', usable: true, actionName: '敲击残件' },
  鎏金玉坠:     { icon: '💍', type: 'rare', rarity: 5, desc: '玉石神级突变产物，佩戴可提升探索时的材料掉落率', maxStack: 1, useFunc: 'equip', usable: true, actionName: '佩戴玉坠' },

  /* ── 天工开物制造产物（新增）── */
  // 陶瓷类（龙窑烧制）
  青釉茶盏:     { icon: '🍵', type: 'crafted', rarity: 2, desc: '龙窑初火慢炼而成，釉色如江南雨后青山，莹润通透。古时茶人偏爱用它盛取明前龙井，盏壁薄而不烫，能最大程度锁住茶香，藏着古人对茶道本真的坚守，是初学点茶者的入门佳器。', maxStack: 15, useFunc: null, usable: false, craftStation: '龙窑' },
  赤釉瓷瓶:     { icon: '🏺', type: 'crafted', rarity: 3, desc: '匠人以赤铁矿粉入釉，经龙窑千度高温淬炼，红釉似烈火凝脂，温润如玉。古时文人常将其置于书斋，插一枝寒梅或幽兰，取“红釉映花，雅韵自来”之意，瓶身每一道釉色纹理，都是窑火与匠心的共生之作。', maxStack: 10, useFunc: null, echo: '“红釉似火，藏着窑火的温度，也藏着匠人指尖的热忱。”', usable: false, craftStation: '龙窑' },
  描金青瓷碗:   { icon: '🥣', type: 'crafted', rarity: 4, desc: '青瓷为底，金粉描边，是龙窑匠人专为皇家打造的珍品。碗沿缠枝莲纹细腻如织，每一笔描金都需屏息凝神，错一分便前功尽弃。它曾是宫廷御膳房的专属餐具，承载着古代工匠对极致工艺的敬畏与追求。', maxStack: 5, useFunc: null, usable: false, craftStation: '龙窑' },
  曜变天目茶盏: { icon: '🌌', type: 'crafted', rarity: 5, desc: '龙窑高级窑火与鲛人泪相融淬炼，盏内星空纹路流转，似藏天地万象。相传此盏曾为宋代茶圣陆羽所用，斟茶时盏中星河随茶汤晃动，能映出饮茶者的心境，是跨越千年的茶道奇珍。', maxStack: 1, useFunc: 'equip', echo: '“盏中星空流转，是天地灵气的汇聚，也是千年匠心的传承。”', usable: true, actionName: '佩戴茶盏', craftStation: '龙窑（高级）' },
  秘色青瓷瓶:   { icon: '🏺', type: 'crafted', rarity: 5, desc: '依失传千年的秘色青瓷配方复刻而成，釉色温润如羊脂，隐现珠光，在光下看如雾蒙月，自带清绝气韵。它曾是唐代宫廷贡品，安史之乱后工艺失传，如今经匠人潜心复原，终让这份千年瓷韵重现世间。', maxStack: 1, useFunc: null, echo: '“秘色藏韵，不见于世间寻常瓷窑，唯有匠心能唤其重现。”', usable: false, craftStation: '龙窑（高级）' },

  // 刺绣类（锦绣坊刺绣台）
  苏绣手帕:     { icon: '🧻', type: 'crafted', rarity: 2, desc: '锦绣坊匠人以古绣针引苏绣丝线，一针一线绣就帕角兰草，针脚细密如织，不见痕迹。古时江南女子多将其随身携带，既作擦拭之用，也以兰草寄托“兰心蕙质”的期许，是藏在指尖的温婉与诗意。', maxStack: 20, useFunc: null, usable: false, craftStation: '刺绣台' },
  云锦荷包:     { icon: '👝', type: 'crafted', rarity: 3, desc: '以南京云锦为料，金线绣就缠枝莲纹，质地华贵，手感细腻如肤。明清贵族女子常将其挂于腰间，内装沉香或玉饰，行走时暗香浮动，荷包内的暗纹的每一针，都藏着匠人对佩戴者平安顺遂的祝福。', maxStack: 15, useFunc: null, echo: '“云锦织金，藏着江南的温婉，也藏着岁月的温柔。”', usable: false, craftStation: '刺绣台' },
  乱针绣花鸟图: { icon: '🖼️', type: 'crafted', rarity: 4, desc: '沿用民国刺绣宗师的乱针绣古法，以苏绣丝线与戏服绣线交织，花鸟形态栩栩如生，似要从布上跃出。这幅绣品复刻了传世名作，针脚错落间藏着东西方美学的碰撞，是刺绣艺术中“形神兼备”的典范。', maxStack: 5, useFunc: null, usable: false, craftStation: '刺绣台' },
  幻海流光扇:   { icon: '🌬️', type: 'crafted', rarity: 5, desc: '以深海鲛绡为扇面，金绣针引乱针绣金线绣制海浪星河，扇骨嵌有幻海流光扇残片，扇动时似有海浪轻响，鲛绡映光如深海星河。相传此扇为深海鲛人所赠，匠人以极致技艺复刻，是刺绣与奇幻意境的完美融合。', maxStack: 1, useFunc: 'equip', echo: '“扇动时似有海浪声，鲛绡映光如星河，每一针都藏着匠心与奇幻。”', usable: true, actionName: '佩戴折扇', craftStation: '刺绣台（高级）' },

  // 木作类（鲁班台）
  灵竹茶盘:     { icon: '🍵', type: 'crafted', rarity: 2, desc: '取青岚界灵竹，经桐油浸泡防腐，由鲁班台匠人手工打磨而成，纹理清晰如流水，触感温润。茶盘边缘弧度贴合掌心，是古人点茶时的必备器物，承载着“竹影映茶，清欢自来”的茶道意境，每一块茶盘都藏着灵竹的灵气与匠人的用心。', maxStack: 15, useFunc: null, usable: false, craftStation: '鲁班台' },
  胡杨木笔筒:   { icon: '✏️', type: 'crafted', rarity: 3, desc: '以沙海胡杨木为料，质地坚硬耐腐，纹理如大漠流沙般自然，经桐油擦拭后愈发温润。胡杨“生而千年不死，死而千年不倒”的坚韧，被匠人融入器物之中，笔筒上的简约纹路，藏着沙海的苍茫与匠人的坚守，是文人墨客的案头挚友。', maxStack: 10, useFunc: null, echo: '“胡杨藏韧，木韵传心，这笔筒盛的是笔墨，也是岁月的风骨。”', usable: false, craftStation: '鲁班台' },
  琥珀木摆件:   { icon: '🪵', type: 'crafted', rarity: 4, desc: '取沙海流沙琥珀与胡杨木结合，经百年雕刻刀精雕细琢，摆件上的灵兽形态灵动，琥珀中的流沙随光影流动，似藏时光痕迹。它是木作与天然奇物的完美融合，每一件都独一无二，藏着沙海的神秘与匠心的极致。', maxStack: 5, useFunc: null, usable: false, craftStation: '鲁班台' },
  发条青鸟木鸢: { icon: '🕊️', type: 'crafted', rarity: 5, desc: '以灵竹为骨，胡杨木为身，嵌入发条青鸟核心，复刻鲁班木鸢古法技艺。放飞时青鸟振翅，似有清鸣传来，翅膀上的纹理细腻如真，相传曾是古人传递书信的信物，藏着千年的智慧与浪漫，是木作与机关术的巅峰之作。', maxStack: 1, useFunc: 'equip', echo: '“青鸟振翅，载着匠心与思念，穿越千年仍有温度。”', usable: true, actionName: '佩戴木鸢', craftStation: '鲁班台（高级）' },

  /* ── 史诗非遗遗卷 (由推演沙盘产出) ── */
  宋代冰裂纹残片: { 
      icon: '🏺', type: 'rare', rarity: 5, 
      desc: '推演出的稀世绝卷。记载了南宋时期龙泉青瓷最高技艺“冰裂纹”的釉料配比与窑火控制之法。', 
      maxStack: 1, useFunc: 'readEpicLore', usable: true, actionName: '研读古卷',
      loreText: '【真实非遗纪事】南宋时期，龙泉窑工匠在偶然间发现，当胎体与釉面的膨胀系数出现巨大差异时，出窑冷却后的青瓷表面会产生宛如坚冰碎裂的层层纹路，层叠交错，立体感极强。这本是烧制失败的“残次品”，却被宋代文人品出了“大音希声，大象无形”的破碎之美，尊为极品。\n\n然而，随着宋朝灭亡，冰裂纹的釉水配方彻底失传。七百年来，无数匠人试图复原皆告失败。\n\n直到今天，这份残片重见天日。拿着它去寻找龙泉青瓷的传承人【张景春】吧，这是中国陶瓷史的瑰宝。'
  },
  乱针双面绣手记: { 
      icon: '📕', type: 'rare', rarity: 5, 
      desc: '推演出的绝密手记。记录了近代苏绣大师结合西方油画光影原理，创造出的全新刺绣针法。', 
      maxStack: 1, useFunc: 'readEpicLore', usable: true, actionName: '研读手记',
      loreText: '【真实非遗纪事】传统的苏绣讲究“平、齐、细、密”，排针整齐。但在此手记中记载，民国时期有一位刺绣宗师，在观摩了西方油画后大受震撼。她打破了千年规矩，用长短不一、方向交错的线条进行“乱针”刺绣。\n\n不同颜色的丝线在交错中产生了奇妙的光影混合，使得苏绣拥有了西方油画般的立体感和张力。更惊人的是，手记的最后一页，记载了如何在同一块透明底料上，正反两面绣出完全不同的乱针图案。\n\n将此手记交还给锦绣坊的【王雪萍匠师】，她一定会激动落泪。'
  },
  // 新增：天工造物关联史诗遗卷（匹配新增非遗品类）
  古法宣纸制作要义: {
      icon: '📜', type: 'rare', rarity: 5,
      desc: '推演出的稀世绝卷。记载了明代古法宣纸的完整制作工艺，包含纤维配比、抄纸技巧等核心要点。',
      maxStack: 1, useFunc: 'readEpicLore', usable: true, actionName: '研读古卷',
      loreText: '【真实非遗纪事】宣纸被誉为“纸中之王”，明代是其制作工艺的巅峰时期。这份遗卷详细记载了宣纸的制作流程：从灵竹、稻草的选材，到石灰脱胶、日光漂白，再到抄纸、晾晒的每一个细节，都蕴含着古人的智慧。\n\n其中最关键的是“燎草”工艺——将稻草燃烧后加入纸浆，可提升宣纸的韧性和吸水性。这一工艺在清代后期逐渐失传，导致现代宣纸的品质难以达到明代水准。\n\n将此遗卷交给宣纸传承人的【李守义】，他将为你解锁古法造纸的终极技艺。'
  },
  汉代篆刻技法精要: {
      icon: '📜', type: 'rare', rarity: 5,
      desc: '推演出的绝密手记。记录了汉代篆刻的核心技法，包含字体结构、运刀技巧等失传精髓。',
      maxStack: 1, useFunc: 'readEpicLore', usable: true, actionName: '研读手记',
      loreText: '【真实非遗纪事】汉代是中国篆刻艺术的黄金时期，这一时期的篆刻字体简洁大气，运刀流畅自然，形成了独特的“汉印风格”。这份手记详细记载了汉代篆刻的“冲刀”“切刀”两种核心运刀技法，以及字体的间架结构搭配技巧。\n\n手记中还记载了“封泥”工艺——将印章盖在泥上，用于封存公文、书信，是汉代文书制度的重要组成部分。这一工艺随着纸张的普及逐渐被遗忘。\n\n将此手记交给篆刻传承人的【陈敬之】，他将为你解锁汉代篆刻的终极技法。'
  },
  唐代漆器髹涂秘方: {
      icon: '📜', type: 'rare', rarity: 5,
      desc: '推演出的稀世绝卷。记载了唐代漆器的髹涂秘方和装饰技法，是漆器工艺的巅峰之作。',
      maxStack: 1, useFunc: 'readEpicLore', usable: true, actionName: '研读古卷',
      loreText: '【真实非遗纪事】唐代漆器工艺达到了前所未有的高度，尤其是“金银平脱”“螺钿镶嵌”两种技法，被誉为“漆器艺术的巅峰”。这份遗卷详细记载了唐代漆器的生漆调配秘方——将天然生漆与桐油、贝壳碎屑按特定比例混合，可使漆器表面呈现璀璨光泽。\n\n其中“金银平脱”技法，是将金箔、银箔粘贴在漆器表面，再经过多次髹涂、打磨，使金银图案与漆器表面融为一体，极具华贵感。这一技法在宋代以后逐渐失传。\n\n将此遗卷交给漆器传承人的【刘芳】，她将为你解锁唐代漆器的终极技艺。'
  },
  商代青铜铸造秘术: {
      icon: '📜', type: 'rare', rarity: 5,
      desc: '推演出的绝密手记。记录了商代青铜铸造的失蜡法工艺，包含模具制作、合金配比等核心秘术。',
      maxStack: 1, useFunc: 'readEpicLore', usable: true, actionName: '研读手记',
      loreText: '【真实非遗纪事】商代是中国青铜铸造工艺的巅峰时期，其“失蜡法”工艺堪称古代科技的奇迹。这份手记详细记载了失蜡法的完整流程：用蜂蜡制作器物模型，再在模型外涂抹陶泥，烧制后蜂蜡融化流出，形成空心模具，最后将青铜溶液注入模具，冷却后即可得到完整的青铜器物。\n\n手记中还记载了商代青铜的合金配比——铜、锡按6:1的比例混合，可使青铜器物既坚硬又富有韧性。这一配比是商代工匠经过无数次试验得出的最优方案。\n\n将此手记交给青铜铸造传承人的【周明远】，他将为你解锁商代青铜铸造的终极技艺。'
  },

  /* ── 契约与货币 ── */
  流转契约:     { icon: '📜', type: 'contract', rarity: 3, desc: '与匠师签订的契约，可兑换实体产品', maxStack: 10, useFunc: 'redeemProduct', usable: true, actionName: '使用契约' },
  灵石:         { icon: '💎', type: 'currency', rarity: 1, desc: '寻遗集的通用货币', maxStack: 999999, useFunc: null, usable: false },
  声望:         { icon: '⭐', type: 'currency', rarity: 1, desc: '与传承人的亲密度', maxStack: 999999, useFunc: null, usable: false },
  // 新增：天工造物关联契约/货币
  匠师契约:     { icon: '📜', type: 'contract', rarity: 4, desc: '与非遗传承人签订的专属契约，可解锁高级造物配方', maxStack: 5, useFunc: 'unlockRecipe', usable: true, actionName: '使用契约' },
  天工币:       { icon: '🏭', type: 'currency', rarity: 2, desc: '天工造物专属货币，可兑换造物设备升级材料', maxStack: 99999, useFunc: null, usable: false },
  传承令牌:     { icon: '🔖', type: 'contract', rarity: 5, desc: '非遗传承人的专属令牌，可解锁隐藏造物设备', maxStack: 1, useFunc: 'unlockStation', usable: true, actionName: '使用令牌' }
};

// ==========================================
// 寻遗使的开局行囊 (注入你原有的物品)
// ==========================================
const STARTING_INVENTORY = {
    '苏绣丝线': 5,
    '高岭陶土': 3,
    '明前龙井': 2,
    '传统年糕': 5,
    '茶经残卷': 1,
    '古琴琴弦': 1,
    '金丝楠木皇冠': 1,
    '精美花灯':1
};


/* ══════════════════════════════════════════════════════════
   三、任务系统 (全量完整版 + Event驱动升级) [cite: 263, 293]
   ══════════════════════════════════════════════════════════ */
const questData = {

  /* ── 主线任务 ── */
  main: [
    {
      id: 'main_awakening',
      title: '初入九州',
      type: 'main',
      icon: '🌟',
      desc: '你刚刚踏入寻遗集的世界，九州大地正等待着你的探索。完成新手引导，了解这个世界的基本规则。',
      objectives: [
        { id: 'obj1', text: '查看九州大图',            required: 1,  current: 0, event: 'view_map' },
        { id: 'obj2', text: '进入任意一个场景',         required: 1,  current: 0, event: 'enter_scene' },
        { id: 'obj3', text: '与任意一位NPC对话',        required: 1,  current: 0, event: 'talk_npc' },
        { id: 'obj4', text: '收集任意一件物品',         required: 1,  current: 0, event: 'collect_item' },
        { id: 'obj5', text: '查看灵犀袋（物品栏）',      required: 1,  current: 0, event: 'view_inventory' },
      ],
      reward: { stones: 200, items: [{ name: '灵石', count: 200 }, { name: '精美花灯', count: 1 }], exp: 100 },
      status: 'active',
      prereq: [],
    },
    {
      id: 'main_craft_master',
      title: '寻访百年匠心',
      type: 'main',
      icon: '⚒️',
      desc: '百作镇流传着一把刻有"百年匠心"的神秘雕刻刀，据说持有此刀者将获得顿悟般的匠艺领悟。前往百作镇，找到这把传说中的雕刻刀。',
      objectives: [
        { id: 'obj1', text: '进入百作镇沉浸探索',       required: 1,  current: 0, event: 'explore_baizuozhen' },
        { id: 'obj2', text: '探索隐藏触发点',           required: 1,  current: 0, event: 'find_hidden_node' },
        { id: 'obj3', text: '获得"百年雕刻刀"',         required: 1,  current: 0, event: 'get_rare_knife' },
        { id: 'obj4', text: '与李木雕匠师交谈',         required: 1,  current: 0, event: 'talk_limudiao' },
      ],
      reward: { stones: 500, items: [{ name: '沉香木料', count: 5 }], exp: 300, unlockScene: 'baizuozhen_secret' },
      status: 'inactive',
      prereq: ['main_awakening'],
    },
    {
      id: 'main_folk_origin',
      title: '剪纸中的秘密',
      type: 'main',
      icon: '✂️',
      desc: '万象台庙会角落里的神秘老奶奶递给你一张特殊的剪纸，上面的图案似乎藏着寻遗集世界起源的秘密……',
      objectives: [
        { id: 'obj1', text: '进入万象台庙会',           required: 1,  current: 0, event: 'explore_wanxiangtai' },
        { id: 'obj2', text: '找到神秘老奶奶',           required: 1,  current: 0, event: 'find_old_lady' },
        { id: 'obj3', text: '获得"灵犀剪纸"',           required: 1,  current: 0, event: 'get_magic_paper' },
        { id: 'obj4', text: '解读剪纸图案的含义',       required: 1,  current: 0, event: 'decode_paper' },
        { id: 'obj5', text: '前往百科寻找对应记载',     required: 1,  current: 0, event: 'view_encyclopedia' },
      ],
      reward: { stones: 800, items: [{ name: '十二生肖剪纸套组', count: 1 }], exp: 500 },
      status: 'inactive',
      prereq: ['main_awakening'],
    },
  ],

  /* ── 支线任务 ── */
  side: [
    {
      id: 'side_qupu_collect',
      title: '失落的昆曲曲谱',
      type: 'side',
      icon: '🎵',
      desc: '万艺城的古琴隐士提到，有一套完整的昆曲曲谱散落各处，若能收集齐全，也许能复原失传的"望乡调"。',
      objectives: [
        { id: 'obj1', text: '收集昆曲曲谱 × 3',         required: 3,  current: 0, event: 'collect_qupu' },
        { id: 'obj2', text: '与万艺城戏班班主交谈',     required: 1,  current: 0, event: 'talk_banzhu' },
        { id: 'obj3', text: '完成曲谱拼合',             required: 1,  current: 0, event: 'merge_qupu' },
      ],
      reward: { stones: 300, items: [{ name: '古琴琴弦', count: 1 }], exp: 200, unlockEncyclopedia: 'enc_guqin' },
      status: 'inactive',
      prereq: [],
      triggerNodeId: 'wanyicheng_hidden_guqin',
    },
    {
      id: 'side_tea_master',
      title: '山泉问茶',
      type: 'side',
      icon: '🍵',
      desc: '青岚界的隐士说，用那处隐秘山泉煮茶，可以感受到茶道的最高境界。去找到那处山泉，带一壶山泉水来。',
      objectives: [
        { id: 'obj1', text: '进入青岚界竹林探索',       required: 1,  current: 0, event: 'explore_qinglanjie' },
        { id: 'obj2', text: '发现隐藏山泉',             required: 1,  current: 0, event: 'find_hidden_spring' },
        { id: 'obj3', text: '获得山泉水 × 3',           required: 3,  current: 0, event: 'collect_spring_water' },
        { id: 'obj4', text: '用山泉为茶娘泡茶',         required: 1,  current: 0, event: 'make_tea' },
      ],
      reward: { stones: 250, items: [{ name: '明前龙井', count: 10 }], exp: 180 },
      status: 'inactive',
      prereq: [],
      triggerNodeId: 'qlj_hidden_spring',
    },
    {
      id: 'side_embroidery_master',
      title: '金针寻绣',
      type: 'side',
      icon: '🪡',
      desc: '锦绣坊深处藏着一枚传说中的金针，据说是苏绣始祖遗留之物。找到金针，交给王雪萍匠师，解锁高级刺绣技艺。',
      objectives: [
        { id: 'obj1', text: '进入锦绣坊探索',           required: 1,  current: 0, event: 'explore_jinxiufang' },
        { id: 'obj2', text: '发现金针隐藏点',           required: 1,  current: 0, event: 'find_hidden_needle' },
        { id: 'obj3', text: '获得"金绣针"',             required: 1,  current: 0, event: 'get_gold_needle' },
        { id: 'obj4', text: '将金针带回给王雪萍匠师',   required: 1,  current: 0, event: 'give_needle' },
      ],
      reward: { stones: 400, items: [{ name: '云锦布料', count: 2 }], exp: 280, unlockActivity: 'wx1_craft_needle_advanced' },
      status: 'inactive',
      prereq: [],
      triggerNodeId: 'jxf_hidden_needle',
    },
    {
      id: 'side_silk_road',
      title: '丝路残卷',
      type: 'side',
      icon: '🐪',
      desc: '通西域的沙漠石窟中藏有一段从未被记录的丝路传说，找到壁画拓片，请玄奘法师为你解读其中的秘密。',
      objectives: [
        { id: 'obj1', text: '进入通西域沙漠探索',       required: 1,  current: 0, event: 'explore_tongxiyu' },
        { id: 'obj2', text: '发现隐秘石窟',             required: 1,  current: 0, event: 'find_hidden_cave' },
        { id: 'obj3', text: '获得"壁画拓片"',           required: 1,  current: 0, event: 'get_fresco' },
        { id: 'obj4', text: '请玄奘法师解读拓片',       required: 1,  current: 0, event: 'talk_monk' },
      ],
      reward: { stones: 350, items: [{ name: '西域香料', count: 5 }], exp: 240 },
      status: 'inactive',
      prereq: [],
      triggerNodeId: 'txy_hidden_cave',
    },
    {
      id: 'side_sea_route',
      title: '深海丝路',
      type: 'side',
      icon: '🌊',
      desc: '沧溟海域的水下宫殿中藏着一幅海上丝绸之路的古地图，找到它，也许能发现一段被遗忘的海洋非遗传承故事。',
      objectives: [
        { id: 'obj1', text: '进入沧溟海域探索',         required: 1,  current: 0, event: 'explore_cangminghai' },
        { id: 'obj2', text: '发现水下宫殿',             required: 1,  current: 0, event: 'find_hidden_palace' },
        { id: 'obj3', text: '获得"海上丝路图"',         required: 1,  current: 0, event: 'get_sea_map' },
        { id: 'obj4', text: '前往通西域与商队分享地图', required: 1,  current: 0, event: 'share_sea_map' },
      ],
      reward: { stones: 450, items: [{ name: '南海珍珠', count: 2 }], exp: 320 },
      status: 'inactive',
      prereq: [],
      triggerNodeId: 'cmh_hidden_palace',
    },
    {
      id: 'side_herb_master',
      title: '草药母典',
      type: 'side',
      icon: '🌿',
      desc: '森之低语的古树树洞中藏着传说中的草药母典，包含世间所有草药的药性。找到它，并与叶神医一同验证其真实性。',
      objectives: [
        { id: 'obj1', text: '进入森之低语探索',         required: 1,  current: 0, event: 'explore_senzhidiyu' },
        { id: 'obj2', text: '发现古树树洞',             required: 1,  current: 0, event: 'find_tree_hole' },
        { id: 'obj3', text: '获得"草药母典"',           required: 1,  current: 0, event: 'get_herb_book' },
        { id: 'obj4', text: '采集指定草药 × 5',         required: 5,  current: 0, event: 'collect_herb' },
        { id: 'obj5', text: '与叶神医验证典籍',         required: 1,  current: 0, event: 'verify_herb_book' },
      ],
      reward: { stones: 500, items: [{ name: '千年灵芝', count: 1 }], exp: 380 },
      status: 'inactive',
      prereq: [],
      triggerNodeId: 'szdy_hidden_tree',
    },
  ],

  /* ── 日常任务 ── */
  daily: [
    {
      id: 'daily_explore',
      title: '今日漫游',
      type: 'daily',
      icon: '🗺️',
      desc: '今天在任意场景进行沉浸式探索，感受九州大地的风土人情。',
      objectives: [
        { id: 'obj1', text: '进行沉浸探索（移动50步）', required: 50, current: 0, event: 'explore_move' },
      ],
      reward: { stones: 100, items: [], exp: 50 },
      status: 'active',
      resetDaily: true,
    },
    {
      id: 'daily_collect',
      title: '今日采集',
      type: 'daily',
      icon: '🌿',
      desc: '采集5件材料，充实你的物品栏。',
      objectives: [
        { id: 'obj1', text: '采集材料 × 5',             required: 5,  current: 0, event: 'collect_item' },
      ],
      reward: { stones: 80, items: [{ name: '灵石', count: 80 }], exp: 40 },
      status: 'active',
      resetDaily: true,
    },
    {
      id: 'daily_npc',
      title: '今日拜访',
      type: 'daily',
      icon: '💬',
      desc: '与3位NPC交谈，了解各地的非遗故事。',
      objectives: [
        { id: 'obj1', text: 'NPC对话 × 3',              required: 3,  current: 0, event: 'talk_npc' },
      ],
      reward: { stones: 60, items: [], exp: 35 },
      status: 'active',
      resetDaily: true,
    },
 
    {
      id: 'daily_workshop',
      title: '今日研习',
      type: 'daily',
      icon: '📖',
      desc: '完成任意一项工坊学习活动（知识科普或工艺体验）。',
      objectives: [
        { id: 'obj1', text: '完成工坊活动 × 1',         required: 1,  current: 0, event: 'do_workshop' },
      ],
      reward: { stones: 120, items: [], exp: 60 },
      status: 'active',
      resetDaily: true,
    },
    {
      id: 'daily_riddle',
      title: '今日灯谜',
      type: 'daily',
      icon: '🏮',
      desc: '参与灯谜挑战，答对5题以上获得丰厚奖励。',
      objectives: [
        { id: 'obj1', text: '灯谜答题 × 5题以上',       required: 5,  current: 0, event: 'play_riddle' },
      ],
      reward: { stones: 150, items: [{ name: '灵石', count: 150 }], exp: 70 },
      status: 'active',
      resetDaily: true,
    },
  ],
};

/* ══════════════════════════════════════════════════════════
   四、灯谜库
   ══════════════════════════════════════════════════════════ */
const riddleDatabase = [

  /* ── 非遗类（30题）── */
  { id: 'r001', text: '四大名绣之首，发源于姑苏水乡，一线可劈六十四丝（猜一传统工艺）', answer: '苏绣', category: 'heritage', difficulty: 1 },
  { id: 'r002', text: '"青如玉，明如镜，声如磬"描述的是哪种传统陶瓷？', answer: '龙泉青瓷', category: 'heritage', difficulty: 1 },
  { id: 'r003', text: '中国古代四大发明之一，北宋毕昇所创，改变世界信息传播（猜一发明）', answer: '活字印刷', category: 'heritage', difficulty: 1 },
  { id: 'r004', text: '苗族以蜂蜡绘图，靛蓝染色，冰裂纹独一无二（猜一非遗技艺）', answer: '蜡染', category: 'heritage', difficulty: 1 },
  { id: 'r005', text: '居琴棋书画之首，七弦绕山水，高山流水遇知音（猜一乐器）', answer: '古琴', category: 'heritage', difficulty: 1 },
  { id: 'r006', text: '一把剪刀剪天下，春节窗花婚庆喜，北方粗犷南方秀（猜一民间艺术）', answer: '剪纸', category: 'heritage', difficulty: 1 },
  { id: 'r007', text: '光与影的千年故事，驴皮制成人，幕后演百态（猜一传统艺术）', answer: '皮影戏', category: 'heritage', difficulty: 1 },
  { id: 'r008', text: '宜兴一方土，紫泥红泥绿泥，越养越温润（猜一陶瓷器具）', answer: '紫砂壶', category: 'heritage', difficulty: 2 },
  { id: 'r009', text: '橄榄核上五人八窗，长不满一寸，魏学洢作文记之（猜一雕刻艺术）', answer: '核雕', category: 'heritage', difficulty: 2 },
  { id: 'r010', text: '满构图无留白，叠层显深远，故宫装饰多出自此地（猜一木雕流派）', answer: '东阳木雕', category: 'heritage', difficulty: 2 },
  { id: 'r011', text: '声震百里，婚丧皆宜，西域传来民间第一（猜一乐器）', answer: '唢呐', category: 'heritage', difficulty: 1 },
  { id: 'r012', text: '篆隶楷行草，王羲之居圣位，《兰亭序》天下第一（猜一中国艺术）', answer: '书法', category: 'heritage', difficulty: 1 },
  { id: 'r013', text: '汉武帝思妃，棉帛制人影，灯光映幕上，此戏流传至今（猜一起源典故）', answer: '皮影戏起源', category: 'heritage', difficulty: 3 },
  { id: 'r014', text: '丝绸之路上的宝石切割、油画绘制，来自哪个地域文化圈？', answer: '欧洲', category: 'heritage', difficulty: 2 },
  { id: 'r015', text: '古琴面板用梧桐，底板用梓木，取什么含义？', answer: '阴阳相和', category: 'heritage', difficulty: 3 },

  /* ── 传统文化类（20题）── */
  { id: 'r016', text: '"鱼戏莲叶间"出自哪部经典？', answer: '汉乐府', category: 'culture', difficulty: 2 },
  { id: 'r017', text: '中国传统节日中，"清明时节雨纷纷"描述哪个节日习俗？', answer: '清明节', category: 'culture', difficulty: 1 },
  { id: 'r018', text: '"文房四宝"不包括以下哪项？（砚、墨、纸、笔、印）', answer: '印', category: 'culture', difficulty: 1 },
  { id: 'r019', text: '苏州被称为什么之都，以园林和丝绸闻名？', answer: '园林之都', category: 'culture', difficulty: 1 },
  { id: 'r020', text: '"曲高和寡"中的"曲"最初指的是哪种音乐？', answer: '阳春白雪', category: 'culture', difficulty: 3 },
  { id: 'r021', text: '中国传统色彩"石青"属于哪种颜色范畴？', answer: '蓝绿色', category: 'culture', difficulty: 2 },
  { id: 'r022', text: '端午节龙舟竞渡是为了纪念哪位历史人物？', answer: '屈原', category: 'culture', difficulty: 1 },
  { id: 'r023', text: '"桃李不言，下自成蹊"出自哪位人物的典故？', answer: '李广', category: 'culture', difficulty: 2 },
  { id: 'r024', text: '中国传统婚礼中，新娘出嫁时头顶盖的红色织物叫什么？', answer: '红盖头', category: 'culture', difficulty: 1 },
  { id: 'r025', text: '古代"五礼"中不包括哪类？', answer: '商礼', category: 'culture', difficulty: 3 },

  /* ── 字谜类（15题）── */
  { id: 'r026', text: '一口咬掉牛尾巴（打一字）', answer: '告', category: 'wordplay', difficulty: 1 },
  { id: 'r027', text: '王小二过年，一年不如一年（打一字）', answer: '旦', category: 'wordplay', difficulty: 2 },
  { id: 'r028', text: '日落香消（打一字）', answer: '杳', category: 'wordplay', difficulty: 2 },
  { id: 'r029', text: '十字路口（打一字）', answer: '行', category: 'wordplay', difficulty: 1 },
  { id: 'r030', text: '二人土上坐（打一字）', answer: '坐', category: 'wordplay', difficulty: 1 },
  { id: 'r031', text: '人有他则变，月有他则圆（打一字）', answer: '月', category: 'wordplay', difficulty: 2 },
  { id: 'r032', text: '左边是水，右边是山，不是海，不是岛（打一字）', answer: '汕', category: 'wordplay', difficulty: 2 },
  { id: 'r033', text: '草头之下一口锅，有火才能把饭煮（打一字）', answer: '荷', category: 'wordplay', difficulty: 3 },
  { id: 'r034', text: '两个人，背靠背（打一字）', answer: '北', category: 'wordplay', difficulty: 1 },
  { id: 'r035', text: '一人站在日出处（打一字）', answer: '旦', category: 'wordplay', difficulty: 1 },

  /* ── 九州地理类（15题）── */
  { id: 'r036', text: '万艺城是哪类非遗的核心传承地？', answer: '戏曲', category: 'world', difficulty: 1 },
  { id: 'r037', text: '青岚界以哪种传统文人雅艺为主题？', answer: '茶道', category: 'world', difficulty: 1 },
  { id: 'r038', text: '百作镇以什么特色著称于九州大地？', answer: '传统手工技艺', category: 'world', difficulty: 1 },
  { id: 'r039', text: '通西域区域的交通要道象征哪条古代商贸路线？', answer: '丝绸之路', category: 'world', difficulty: 1 },
  { id: 'r040', text: '浮空云境位于九州大地的哪个方位？', answer: '天空之上', category: 'world', difficulty: 1 },
  { id: 'r041', text: '沧溟海域的主题是哪类非遗文化？', answer: '海洋渔文化', category: 'world', difficulty: 1 },
  { id: 'r042', text: '森之低语的守护者是什么角色？', answer: '森林精灵', category: 'world', difficulty: 1 },
  { id: 'r043', text: '元境都是什么风格的城市？', answer: '赛博国风未来城', category: 'world', difficulty: 2 },
  { id: 'r044', text: '万象台的主题随什么变化而动态调整？', answer: '传统节日', category: 'world', difficulty: 2 },
  { id: 'r045', text: '锦绣坊是哪类传统技艺的聚集地？', answer: '织绣', category: 'world', difficulty: 1 },
];

/* 获取随机灯谜 */
function getRandomRiddles(count = 10, category = 'all') {
  const pool = category === 'all'
    ? riddleDatabase
    : riddleDatabase.filter(r => r.category === category);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}


/* ══════════════════════════════════════════════════════════
   五、成就系统
   ══════════════════════════════════════════════════════════ */
const achievementData = [

  /* ── 探索成就 ── */
  { id: 'ach_first_step',    icon: '👣', name: '万里初行',      desc: '第一次进入沉浸式探索模式',          category: 'explore', reward: 100, condition: { type: 'explore_count', value: 1  }, unlocked: false },
  { id: 'ach_explorer',      icon: '🗺️', name: '九州行者',      desc: '探索5个不同区域',                   category: 'explore', reward: 300, condition: { type: 'explore_count', value: 5  }, unlocked: false },
  { id: 'ach_world_walker',  icon: '🌍', name: '踏遍九州',      desc: '探索所有14个区域',                  category: 'explore', reward: 1000,condition: { type: 'explore_count', value: 14 }, unlocked: false },
  { id: 'ach_collector',     icon: '🎒', name: '初次采集',      desc: '第一次收集到探索资源',              category: 'explore', reward: 50,  condition: { type: 'collect_count', value: 1  }, unlocked: false },
  { id: 'ach_hoarder',       icon: '💰', name: '物华天宝',      desc: '物品栏中积累50件不同物品',           category: 'explore', reward: 500, condition: { type: 'item_types',    value: 50 }, unlocked: false },
  { id: 'ach_hidden_finder', icon: '🔍', name: '洞察秋毫',      desc: '发现第一个隐藏触发点',              category: 'explore', reward: 200, condition: { type: 'hidden_found',  value: 1  }, unlocked: false },
  { id: 'ach_all_hidden',    icon: '✨', name: '寻遗集大成者',  desc: '发现所有区域的隐藏触发点',           category: 'explore', reward: 2000,condition: { type: 'hidden_found',  value: 14 }, unlocked: false },

  /* ── 社交成就 ── */
  { id: 'ach_first_talk',    icon: '💬', name: '初会佳人',      desc: '第一次与NPC完成完整对话',            category: 'social',  reward: 80,  condition: { type: 'npc_talk',      value: 1  }, unlocked: false },
  { id: 'ach_social_bee',    icon: '🤝', name: '广结善缘',      desc: '与20位不同NPC完成对话',             category: 'social',  reward: 400, condition: { type: 'npc_talk',      value: 20 }, unlocked: false },
  { id: 'ach_ai_chat',       icon: '🤖', name: '与AI对话',      desc: '第一次与AI传承人化身深度交流',       category: 'social',  reward: 150, condition: { type: 'ai_chat',       value: 1  }, unlocked: false },
  { id: 'ach_workshop_visit',icon: '⛩️', name: '登门拜访',      desc: '访问第一间工坊',                    category: 'social',  reward: 100, condition: { type: 'workshop_visit',value: 1  }, unlocked: false },
  { id: 'ach_all_workshops', icon: '🏆', name: '拜遍名匠',      desc: '访问所有12位传承人的工坊',           category: 'social',  reward: 1500,condition: { type: 'workshop_visit',value: 12 }, unlocked: false },

  /* ── 学习成就 ── */
  { id: 'ach_first_learn',   icon: '📖', name: '求知若渴',      desc: '完成第一次工坊学习活动',             category: 'learn',   reward: 100, condition: { type: 'activity_done', value: 1  }, unlocked: false },
  { id: 'ach_scholar',       icon: '🎓', name: '博古通今',      desc: '解锁10个非遗百科词条',              category: 'learn',   reward: 500, condition: { type: 'enc_unlock',    value: 10 }, unlocked: false },
  { id: 'ach_master',        icon: '🧑‍🏫', name: '非遗大师',     desc: '解锁所有非遗百科词条',              category: 'learn',   reward: 2000,condition: { type: 'enc_unlock',    value: 12 }, unlocked: false },
  { id: 'ach_riddle_10',     icon: '🏮', name: '灯谜高手',      desc: '灯谜游戏中一次答对10题',             category: 'learn',   reward: 300, condition: { type: 'riddle_score',  value: 10 }, unlocked: false },
  { id: 'ach_riddle_max',    icon: '🌟', name: '谜题宗师',      desc: '灯谜游戏中一次全部答对',             category: 'learn',   reward: 800, condition: { type: 'riddle_score',  value: 15 }, unlocked: false },

  /* ── 传承成就 ── */
  { id: 'ach_first_order',   icon: '📦', name: '初尝流转',      desc: '完成第一次现世流转（购买实体非遗品）', category: 'inherit', reward: 500, condition: { type: 'order_count',   value: 1  }, unlocked: false },
  { id: 'ach_loyal',         icon: '💎', name: '忠实传人',      desc: '与同一传承人的亲密度达到满级',        category: 'inherit', reward: 1000,condition: { type: 'max_intimacy',  value: 1  }, unlocked: false },
  { id: 'ach_inheritor_mode',icon: '🧑‍🎨', name: '化身匠师',     desc: '（传承人端）发布第一个工坊活动',     category: 'inherit', reward: 300, condition: { type: 'publish_count', value: 1  }, unlocked: false },

  /* ── 特殊成就 ── */
  { id: 'ach_sign_7',        icon: '📅', name: '七日之约',      desc: '连续签到7天',                       category: 'special', reward: 350, condition: { type: 'checkin_streak',value: 7  }, unlocked: false },
  { id: 'ach_sign_30',       icon: '🌙', name: '月月相见',      desc: '连续签到30天',                      category: 'special', reward: 1500,condition: { type: 'checkin_streak',value: 30 }, unlocked: false },
  { id: 'ach_night_owl',     icon: '🦉', name: '深夜匠人',      desc: '在深夜（0点-5点）进行探索',          category: 'special', reward: 200, condition: { type: 'time_range',    value: 'night' }, unlocked: false },
  { id: 'ach_speedrun',      icon: '⚡', name: '风驰电掣',      desc: '在60秒内收集到5件物品',              category: 'special', reward: 400, condition: { type: 'speed_collect', value: 5  }, unlocked: false },
];


/* ══════════════════════════════════════════════════════════
   六、商店商品配置
   ══════════════════════════════════════════════════════════ */
const shopConfig = {

  /* ── 道具商店 ── */
  props: [
    { id: 'shop_lantern',     name: '精美花灯',     icon: '🏮', desc: '节日装饰佳品，使用后照亮周围区域，隐藏节点更易发现', price: 80,  currency: 'stones', stock: 10, rarity: 2 },
    { id: 'shop_tea',         name: '清心茗茶',     icon: '🍵', desc: '饮用后恢复体力30点，并短暂提升NPC好感度', price: 50,  currency: 'stones', stock: 20, rarity: 1 },
    { id: 'shop_compass',     name: '寻遗罗盘',     icon: '🧭', desc: '持有时，地图上的隐藏节点位置会有微弱提示', price: 200, currency: 'stones', stock: 5,  rarity: 3 },
    { id: 'shop_backpack',    name: '扩容灵袋',     icon: '🎒', desc: '永久增加物品栏容量20格',               price: 500, currency: 'stones', stock: 3,  rarity: 3 },
    { id: 'shop_respawn_gem', name: '重生石',       icon: '💎', desc: '使用后可以刷新一个已采集的物资节点',    price: 150, currency: 'stones', stock: 99, rarity: 2 },
    { id: 'shop_map_ink',     name: '灵墨',         icon: '🖌️', desc: '使用后在地图上标记一个自定义地点',      price: 30,  currency: 'stones', stock: 99, rarity: 1 },
  ],

  /* ── 材料商店 ── */
  materials: [
    { id: 'shop_silk',      name: '苏绣丝线',   icon: '🧵', desc: '五彩苏绣丝线，工坊活动材料', price: 20,  currency: 'stones', stock: 99, rarity: 2 },
    { id: 'shop_clay',      name: '高岭陶土',   icon: '🏺', desc: '优质高岭土，陶艺工坊专用',  price: 15,  currency: 'stones', stock: 99, rarity: 1 },
    { id: 'shop_wood',      name: '沉香木料',   icon: '🪵', desc: '优质沉香木，木雕工坊专用',  price: 40,  currency: 'stones', stock: 50, rarity: 2 },
    { id: 'shop_herb',      name: '紫苏叶',     icon: '🌿', desc: '新鲜草药，草药工坊专用',    price: 10,  currency: 'stones', stock: 99, rarity: 1 },
    { id: 'shop_bamboo',    name: '上等竹料',   icon: '🎋', desc: '轻质竹篾，竹编专用',    price: 30,  currency: 'stones', stock: 50, rarity: 2 },
    { id: 'shop_spice',     name: '西域香料',   icon: '🌶️', desc: '丝路香料，炼金工坊专用',    price: 35,  currency: 'stones', stock: 50, rarity: 2 },
  ],

  /* ── 外观商店（角色形象）── */
  avatar: [
    { id: 'shop_av_hanfu1',  name: '素雅汉服',   icon: '👘', desc: '清新素雅的汉服形象，典型汉服款式',   price: 300,  currency: 'stones', stock: 999, rarity: 2, type: 'outfit' },
    { id: 'shop_av_hanfu2',  name: '霞光华服',   icon: '🥻', desc: '流光溢彩的盛唐华服，霞光缭绕',       price: 600,  currency: 'stones', stock: 99,  rarity: 3, type: 'outfit' },
    { id: 'shop_av_mask',    name: '变脸面具',   icon: '🎭', desc: '四川变脸风格面具，佩戴后神秘莫测',   price: 400,  currency: 'stones', stock: 50,  rarity: 3, type: 'accessory' },
    { id: 'shop_av_hat',     name: '书生竹冠',   icon: '🎓', desc: '文人书生风格竹冠，儒雅气质加成',     price: 200,  currency: 'stones', stock: 99,  rarity: 2, type: 'accessory' },
    { id: 'shop_av_rare1',   name: '月白霓裳',   icon: '🌕', desc: '极稀有月白色长袍，月下漫步时有光晕特效', price: 1500, currency: 'stones', stock: 10, rarity: 5, type: 'outfit' },
    { id: 'shop_av_rare2',   name: '金丝皮影套', icon: '🎭', desc: '极稀有皮影风格形象套装，附皮影动效',   price: 2000, currency: 'stones', stock: 5,  rarity: 5, type: 'outfit' },
  ],

  /* ── 限时特供（活动商品，JS动态更新）── */
  limited: [
    { id: 'shop_lim_spring', name: '春节烟花',    icon: '🎆', desc: '【春节限定】使用后释放绚丽烟花特效，持续60秒', price: 888, currency: 'stones', stock: 88, rarity: 4, expireDate: '2026-02-20', type: 'prop' },
    { id: 'shop_lim_lunar',  name: '元宵花灯套', icon: '🏮', desc: '【元宵限定】三连灯笼装饰套组，节日专属外观',  price: 666, currency: 'stones', stock: 99, rarity: 4, expireDate: '2026-02-24', type: 'prop' },
  ],
};


/* ══════════════════════════════════════════════════════════
   七、签到奖励配置
   ══════════════════════════════════════════════════════════ */
const checkinRewards = [
  { day: 1,  icon: '🌿', name: '灵石 × 50',       reward: { stones: 50 }  },
  { day: 2,  icon: '💎', name: '灵石 × 80',       reward: { stones: 80 }  },
  { day: 3,  icon: '🏮', name: '精美花灯 × 1',    reward: { item: '精美花灯', count: 1 } },
  { day: 4,  icon: '💎', name: '灵石 × 100',      reward: { stones: 100 } },
  { day: 5,  icon: '🌿', name: '苏绣丝线 × 5',    reward: { item: '苏绣丝线', count: 5 } },
  { day: 6,  icon: '💎', name: '灵石 × 120',      reward: { stones: 120 } },
  { day: 7,  icon: '🌟', name: '灵石 × 200 + 寻遗罗盘', reward: { stones: 200, item: '寻遗罗盘', count: 1 } },
  { day: 14, icon: '🏆', name: '灵石 × 500',      reward: { stones: 500 } },
  { day: 21, icon: '🎁', name: '灵石 × 800 + 扩容灵袋', reward: { stones: 800, item: '扩容灵袋', count: 1 } },
  { day: 30, icon: '👑', name: '灵石 × 1500 + 月白霓裳', reward: { stones: 1500, item: '月白霓裳', count: 1 } },
];


/* ══════════════════════════════════════════════════════════
   八、天气与时间系统
   ══════════════════════════════════════════════════════════ */
const weatherSystem = {
  types: {
    clear:     { name: '晴朗',   icon: '☀️',  filterClass: 'weather-filter-day',   cloudCount: 1, rainCount: 0 },
    cloudy:    { name: '多云',   icon: '⛅',  filterClass: 'weather-filter-day',   cloudCount: 5, rainCount: 0 },
    mist:      { name: '薄雾',   icon: '🌫️', filterClass: 'weather-filter-fog',   cloudCount: 8, rainCount: 0 },
    drizzle:   { name: '细雨',   icon: '🌧️', filterClass: 'weather-filter-rain',  cloudCount: 4, rainCount: 30 },
    rain:      { name: '大雨',   icon: '🌧️', filterClass: 'weather-filter-rain',  cloudCount: 6, rainCount: 80 },
    fog:       { name: '浓雾',   icon: '🌁', filterClass: 'weather-filter-fog',   cloudCount: 10, rainCount: 0 },
    night:     { name: '月夜',   icon: '🌃', filterClass: 'weather-filter-night', cloudCount: 2, rainCount: 0 },
    festive:   { name: '节庆',   icon: '🎆', filterClass: 'weather-filter-day',   cloudCount: 0, rainCount: 0 },
    wind:      { name: '风沙',   icon: '🌬️', filterClass: 'weather-filter-fog',   cloudCount: 3, rainCount: 0 },
    stars:     { name: '星夜',   icon: '✨',  filterClass: 'weather-filter-night', cloudCount: 0, rainCount: 0 },
    sandstorm: { name: '沙暴',   icon: '🌪️', filterClass: 'weather-filter-fog',   cloudCount: 5, rainCount: 0 },
    wave:      { name: '海浪',   icon: '🌊', filterClass: 'weather-filter-day',   cloudCount: 3, rainCount: 0 },
  },

  /* 各时段背景色调（CSS filter） */
  timeFilters: {
    dawn:    'brightness(0.85) sepia(0.15)',
    morning: 'brightness(1.0)',
    noon:    'brightness(1.05) saturate(1.1)',
    dusk:    'brightness(0.9) sepia(0.25) saturate(0.9)',
    night:   'brightness(0.65) saturate(0.6)',
  },

  /* 获取当前时段 */
  getTimeOfDay() {
    const h = new Date().getHours();
    if (h >= 5 && h < 8)   return 'dawn';
    if (h >= 8 && h < 11)  return 'morning';
    if (h >= 11 && h < 17) return 'noon';
    if (h >= 17 && h < 20) return 'dusk';
    return 'night';
  },
};


/* ══════════════════════════════════════════════════════════
   九、传承人活动类型配置
   ══════════════════════════════════════════════════════════ */
const activityTypeConfig = {
  knowledge: { label: '文化科普', color: '#7eb6a1', bgClass: 'wi-type-knowledge', icon: '📖', desc: '了解非遗历史与文化内涵' },
  craft:     { label: '工艺体验', color: '#e89a65', bgClass: 'wi-type-craft',     icon: '🛠️', desc: '虚拟动手体验非遗制作过程' },
  quiz:      { label: '知识竞答', color: '#8a6da8', bgClass: 'wi-type-quiz',      icon: '🎓', desc: '挑战非遗知识问答，赢取奖励' },
  product:   { label: '现世流转', color: '#c25050', bgClass: 'wi-type-product',   icon: '🛒', desc: '购买匠师亲手制作的实体产品' },
};

// ==========================================
// 灵犀袋 2.0：全局物品图鉴大字典
// ==========================================
const ITEM_DICTIONARY = {
    '苏绣丝线': { type: '材料', icon: '🧵', desc: '泛着微光的江南极品蚕丝，极其坚韧。', echo: null, usable: false },
    '沉香木料': { type: '材料', icon: '🪵', desc: '散发着安神幽香的老木料，刀斧难伤。', echo: '“这块木头...曾是某座宏伟宫殿的顶梁，我听到了大火焚烧的悲鸣。”', usable: false },
    '西域香料': { type: '材料', icon: '🌶️', desc: '通西域商队带来的刺鼻香料，极其珍贵。', echo: null, usable: false },
    '现代仿制破砖头': { type: '道具', icon: '🧱', desc: '黑市买来的赝品，表面粗糙。但重量似乎有些不对劲...', echo: '“咔哒...砖头内部似乎有齿轮咬合的声音！这根本不是砖头，这是一个伪装的墨家机关匣！”', usable: true, actionName: '砸碎查探' },
    '百年红酒': { type: '道具', icon: '🍷', desc: '装在琉璃瓶中的暗红色液体，酒香馥郁。', echo: '“王绣娘曾提起过，若是能饮上一口欧罗巴的红酒，她便能绣出天外的颜色...”', usable: true, actionName: '饮用' },
    '明代紫砂壶': { type: '佩戴', icon: '🫖', desc: '包浆圆润的老茶壶，泡茶不仅能提神，更能提升悟性。', echo: null, usable: true, actionName: '前往化身纪佩戴' },
    '金丝楠木皇冠': { type: '佩戴', icon: '👑', desc: '黑市开出的绝世珍宝，戴上它，你就是这片区域最靓的仔。', echo: null, usable: true, actionName: '前往化身纪佩戴' },
    '苏绣青皮团扇': { type: '佩戴', icon: '🪭', desc: '天工阁出品的珍稀团扇，扇面栩栩如生。', echo: null, usable: true, actionName: '前往化身纪佩戴' }
};

// ==========================================
// 天工造物台：全局造物配方大字典 (CRAFTING_RECIPES)
// ==========================================
const CRAFTING_RECIPES = [
    {
        id: 'recipe_tuanshan',
        name: '苏绣青皮团扇',
        type: '佩戴',
        desc: '精美的苏绣团扇，佩戴后化身立显雅致风流。',
        icon: '🪭',
        reqs: { '苏绣丝线': 3, '沉香木料': 1 }, // 合成所需材料及数量
        defaultUnlocked: true // 新手默认解锁
    },
    {
        id: 'recipe_zishahu',
        name: '明代紫砂壶',
        type: '佩戴',
        desc: '用极品高岭陶土混合清晨露水烧制，泡茶可提升悟性。',
        icon: '🫖',
        reqs: { '高岭陶土': 5, '山泉水': 2 },
        defaultUnlocked: true
    },
    {
        id: 'recipe_qingniao',
        name: '发条青鸟',
        type: '道具',
        desc: '结合墨家机关与西域发条的奇物，放飞可探寻秘境。',
        icon: '🕊️',
        reqs: { '百炼精铁': 2, '青铜齿轮': 1, '苏绣丝线': 1 },
        defaultUnlocked: false // 需要获得【天工绝密图纸】才能解锁
    },
    {
        id: 'recipe_xiangnang',
        name: '安神香囊',
        type: '道具',
        desc: '佩戴在身，可抵御异域迷雾的侵蚀。',
        icon: '🪬',
        reqs: { '戏服碎布': 2, '西域香料': 1, '紫苏叶': 3 },
        defaultUnlocked: true
    },
    {
        id: 'recipe_teabowl',
        name: '宋式点茶茶碗',
        type: '灵场复苏造物',
        desc: '仿宋代兔毫建盏，盛茶时釉色幻变，是点茶守岁人认可的镇场灵器。',
        icon: '🍵',
        reqs: { '高岭陶土': 3, '明前龙井': 2 },
        defaultUnlocked: false   // 由 _ruinGoDeduction 动态解锁
    },
    {
        id: 'recipe_zhenkiln',
        name: '龙泉镇窑之壶',
        type: '灵场复苏造物',
        desc: '以龙泉紫金土仿制的镇窑神器，内蕴窑火之魂。',
        icon: '🏺',
        reqs: { '高岭陶土': 5, '百炼精铁': 2 },
        defaultUnlocked: false
    }
];

/* ══════════════════════════════════════════════════════════
   十、百科学宫 · 万象秘录 (长篇隐藏剧情库)
   ══════════════════════════════════════════════════════════ */
const SECRET_LORE_DATABASE = [
    {
        id: 'lore_suxiu_wine',
        title: '戏梦京华：跨越重洋的苏绣绝唱',
        reqItem: '霸王别姬残卷', // 对应沙盘推演出的道具
        icon: '🎭',
        shortDesc: '关于王绣娘、戏服碎布与欧罗巴红酒的隐藏往事。',
        content: `
            <p>光绪二十六年，江南织造局接到了一个前所未有的西洋订单。欧罗巴的使节重金求取一幅能展现东方神韵的双面绣。</p>
            <p>那时的王绣娘还只是个小学徒，她日夜看着师傅们对着图纸发愁。西方人崇尚油画般的浓烈色彩，而传统的苏绣丝线过于温婉淡雅，根本无法绣出那种令人心悸的张力。</p>
            <p>某日，王绣娘在万艺城的梨园听戏，台上正唱着《霸王别姬》。虞姬自刎时，那抹决绝的红刺痛了她的双眼。恰逢一位落魄的西洋商人用一瓶【百年红酒】抵了戏票钱。王绣娘闻着那股发酵了百年的浓烈酒香，脑海中突然灵光乍现。</p>
            <p>她大着胆子，将珍贵的蚕丝浸泡在红酒之中。七七四十九天后，丝线染上了一层不可思议的暗金绯红。她用这股带着酒香的丝线，结合乱针绣法，绣出了一幅《虞姬舞剑图》。</p>
            <p>红酒的酸性让丝线在岁月中越发坚韧，那幅作品在巴黎博览会上一经展出，震惊四座。而这段中西合璧的技艺，却因战乱遗失，只留下一片带着酒香的戏服碎布……</p>
        `,
        buffName: '✨ 绣心通明',
        buffDesc: '永久提升：在天工阁进行所有织绣类小游戏时，初始进度直接增加 15%。'
    },
    {
        id: 'lore_mojia_box',
        title: '泥封的匠心：墨家最后的荣光',
        reqItem: '墨家机关图谱', 
        icon: '⚙️',
        shortDesc: '百作镇的现代仿制砖头里，为何藏着上古图谱？',
        content: `
            <p>世人皆以为百作镇的匠人们只会雕木头、捏泥巴，却不知在地下，沉睡着墨家最后的传人。</p>
            <p>明朝末年，战火纷飞。为了不让能够制造“连弩机车”和“发条木鸢”的绝密图纸落入敌寇之手，当时的墨家巨子做了一个惊人的决定。</p>
            <p>他将所有图纸打碎，分别封印在普通的建房泥砖之中，并用沉香木做成触发机关的密钥。随着时间推移，战火平息，但墨家传人也已死绝。那些封印着图谱的泥砖，流落到了黑市，被后人当做“现代仿制破砖头”贱卖。</p>
            <p>唯有真正懂得木材纹理、能听懂齿轮咬合之声的寻遗使，用【沉香木料】的特有频率敲击，才能让泥砖褪去伪装，重现墨家机关术的辉煌。</p>
        `,
        buffName: '🛡️ 墨守成规',
        buffDesc: '永久提升：在探索九州大图时，有 10% 的概率完全免疫负面天气带来的体力消耗。'
    }
];


// ==========================================
// 🏭 天工造物 4.0：造物设备（新增多阶设备，贴合非遗品类）
// ==========================================
const CRAFTING_STATIONS = {
    'wash_pool': { 
        name: '碾洗池', icon: '🚰', level: '一阶',
        desc: '基础提纯设备，洗去浮华。', 
        trait: '💧 水脉：在此使用不同水质，可能产生变异材料。' 
    },
    'pottery_wheel': { 
        name: '拉坯机', icon: '💿', level: '二阶',
        desc: '陶瓷塑形设备。', 
        trait: '🏺 融合：加入异域香料或特殊矿石，或许能成奇物。' 
    },
    'kiln': { 
        name: '龙窑', icon: '🔥', level: '三阶',
        desc: '终极高温烧制设备。', 
        trait: '🌌 窑变：天地时辰将直接决定出窑的是何种传世瓷器。' 
    },
    'dye_vat': { 
        name: '草木染缸', icon: '⚗️', level: '一阶',
        desc: '织物上色设备。', 
        trait: '☀️ 天象：午时阳气最盛，染出的布匹最为鲜亮。' 
    },
    'embroidery_frame': {
        name: '苏绣绷架', icon: '🪡', level: '二阶',
        desc: '丝线穿梭的织绣设备。',
        trait: '🦋 幻影：若融入特殊的海外发光材料，绣品会在夜间显形。'
    },
    'wood_bench': {
        name: '鲁班台', icon: '🪚', level: '二阶',
        desc: '木作与机关拼装台。',
        trait: '⚙️ 天工：结合西洋机械零件，能让死木获得生命。'
    },
    'forge': {
        name: '百炼铁毡', icon: '⚒️', level: '一阶',
        desc: '锻打金石的设备。',
        trait: '⚔️ 淬火：不同时辰的淬火会改变金属的最终属性。'
    },
    'tea_table': {
        name: '风雅案', icon: '🍵', level: '一阶',
        desc: '点茶与合香的风雅之所。',
        trait: '🍃 禅意：晨曦时分调配出的茶汤与香丸，灵力最纯。'
    },
    // 新增 一阶设备（基础非遗品类补充）
    'paper_making_trough': {
        name: '抄纸槽', icon: '📜', level: '一阶',
        desc: '古法造纸核心设备，将纸浆抄制成纸。',
        trait: '🌿 竹韵：使用不同竹种的纤维，纸张纹理与韧性会产生差异。'
    },
    'carving_board': {
        name: '篆刻台', icon: '✒️', level: '一阶',
        desc: '金石篆刻、木雕印章的基础操作台。',
        trait: '🪨 灵韵：选用古河床的印石，刻出的印章自带温润光泽。'
    },
    'weaving_loom': {
        name: '云锦织机', icon: '🧵', level: '一阶',
        desc: '传统云锦织造设备，经纬交织成锦。',
        trait: '🌈 彩晕：不同丝线的排列顺序，会让锦缎呈现不同的光泽渐变。'
    },
    'incense_mortar': {
        name: '合香臼', icon: '⚗️', level: '一阶',
        desc: '研磨香材、调配香方的基础工具。',
        trait: '🌫️ 香魂：研磨时的力度不同，香粉的香气浓度会有差异。'
    },
    // 新增 二阶设备（进阶非遗品类补充）
    'lacquer_workbench': {
        name: '髹漆台', icon: '🎨', level: '二阶',
        desc: '漆器髹涂、装饰的专用操作台。',
        trait: '✨ 漆光：加入贝壳碎屑或金粉，漆器表面会呈现璀璨光泽。'
    },
    'jade_cutting_bench': {
        name: '琢玉台', icon: '💎', level: '二阶',
        desc: '玉石切割、打磨、雕刻的专用设备。',
        trait: '💧 玉润：用山泉水打磨，玉石会更显温润通透。'
    },
    'shadow_puppet_carving': {
        name: '皮影雕台', icon: '🎭', level: '二阶',
        desc: '皮影戏道具雕刻、上色的专用台。',
        trait: '🔥 透光：选用驴皮雕刻，皮影的透光性最佳，演出时栩栩如生。'
    },
    'bamboo_weaving_frame': {
        name: '竹编架', icon: '🎋', level: '二阶',
        desc: '竹编器物编织的专用框架。',
        trait: '🌿 柔韧：经过温水浸泡的竹篾，编织时不易断裂，更显细腻。'
    },
    // 新增 三阶设备（终极非遗品类补充）
    'gold_smith_furnace': {
        name: '点金炉', icon: '🔥', level: '三阶',
        desc: '金银器锻造、鎏金的高端设备。',
        trait: '✨ 鎏光：在特定时辰鎏金，金银器表面会形成永不褪色的金层。'
    },
    'porcelain_glaze_workbench': {
        name: '施釉台', icon: '🎨', level: '三阶',
        desc: '陶瓷施釉、描金的高端操作台。',
        trait: '🌈 釉变：施釉厚度不同，经龙窑烧制后会产生不同的釉色纹理。'
    },
    'ancient_book_restoration': {
        name: '古籍修复台', icon: '📜', level: '三阶',
        desc: '古籍、字画修复的专用设备，含防虫、固色工艺。',
        trait: '🕰️ 时光：使用陈年宣纸修复，能最大程度保留古籍的原有韵味。'
    },
    'bronze_casting_mold': {
        name: '青铜范', icon: '⚱️', level: '三阶',
        desc: '青铜器物铸造的专用模具，复刻古法失蜡法工艺。',
        trait: '🪨 古纹：模具中加入古青铜碎片，铸造出的器物会自带古纹印记。'
    }
};

// ==========================================
// 📜 天工造物 4.0：史诗级多分支配方与突变图鉴（大幅扩展，贴合非遗+剧情+收集）
// ==========================================
const ADVANCED_RECIPES = [
    // ---------------------------------------------------------
    // 🟢 陶瓷烧造线 (主打：时辰窑变与西域融合，新增多分支配方)
    // ---------------------------------------------------------
    {
        id: 'recipe_refined_clay', name: '精制陶泥', type: '半成品', icon: '🟤',
        station: 'wash_pool', reqs: { '高岭陶土': 2 }, timeCost: 2000,
        desc: '剔除杂质的细腻陶泥。',
        mutations: [
            // 若玩家有去【青岚界】采集清晨露水，自动消耗并突变
            { reqExtra: '清晨露水', resultName: '冰霜陶泥', icon: '🧊', desc: '融合了晨露的变异陶泥，触手生凉。' },
            // 新增：去【红土坡】采集赤铁矿粉
            { reqExtra: '赤铁矿粉', resultName: '赤焰陶泥', icon: '🔥', desc: '混入赤铁矿的陶泥，烧制后呈赤红底色。' },
            // 新增：剧情解锁【龙窑旧址】收集的古陶碎片
            { reqExtra: '古陶碎片', resultName: '古韵陶泥', icon: '🏺', desc: '融合古陶灵气的陶泥，自带古朴纹路。' }
        ]
    },
    {
        id: 'recipe_clay_cup', name: '茶盏素坯', type: '半成品', icon: '🥣',
        station: 'pottery_wheel', reqs: { '精制陶泥': 1 }, timeCost: 3000,
        desc: '初步成型的茶盏，尚未施釉。',
        mutations: [
            // 新增：使用【鲁班台】制作的木模塑形
            { reqExtra: '木模茶盏', resultName: '雕花茶盏素坯', icon: '🪵', desc: '带有木雕纹路的茶盏素坯，无需后期雕刻。' },
            // 新增：剧情任务【陶工的心愿】解锁的特殊塑形手法
            { conditionQuest: 'potter_wish', resultName: '如意茶盏素坯', icon: '☁️', desc: '造型圆润，自带如意纹路的素坯，窑变成功率提升50%。' }
        ]
    },
    {
        id: 'recipe_base_cup', name: '素面青瓷', type: '陶瓷造物', icon: '🍵',
        station: 'kiln', reqs: { '茶盏素坯': 1, '沉香木料': 1 }, timeCost: 4000,
        desc: '最基础的龙泉青瓷，温润如玉。',
        mutations: [
            // 【神级突变】子夜时分烧制
            { 
                conditionEnv: 3, resultName: '曜变天目盏', icon: '🌌', 
                desc: '碗中仿佛藏着整片星空，子夜窑变的绝对奇迹。',
                compendium: { history: '相传源自南宋，现存世仅三件，皆为国宝，光绝天下。', reward: 800 }
            },
            // 【跨界融合】加入西域香料
            { 
                reqExtra: '西域香料', resultName: '异香波斯陶杯', icon: '🏺', 
                desc: '青瓷工艺与西域风情的完美碰撞。',
                compendium: { history: '丝绸之路上的文化交融见证，散发着永不消散的奇香。', reward: 500 }
            },
            // 新增：加入【沧溟海域】收集的珍珠粉
            {
                reqExtra: '珍珠粉', resultName: '珍珠青瓷盏', icon: '💎',
                desc: '釉面泛着珍珠光泽，温润细腻，价值连城。',
                compendium: { history: '明代御窑专供工艺，将珍珠粉混入釉料，烧制后釉面如珍珠般莹润。', reward: 650 }
            },
            // 新增：辰时烧制+剧情解锁【青瓷传承人的秘方】
            {
                conditionEnv: 1, conditionQuest: 'celadon_heritage', resultName: '秘色青瓷盏', icon: '✨',
                desc: '釉色青如湖水，隐现光泽，是龙泉窑的巅峰之作。',
                compendium: { history: '秘色瓷为古代越窑珍品，釉色如雨后晴空，失传千年后被传承人复刻。', reward: 700 }
            }
        ],
        compendium: { history: '龙泉窑的基础器型，大道至简。', reward: 200 }
    },
    // 新增陶瓷烧造线 - 高阶配方
    {
        id: 'recipe_porcelain_vase', name: '青瓷梅瓶素坯', type: '半成品', icon: '🏺',
        station: 'pottery_wheel', reqs: { '精制陶泥': 2, '雕花木模': 1 }, timeCost: 5000,
        desc: '仿宋代梅瓶造型的素坯，瓶身修长，线条流畅。',
        mutations: [
            { reqExtra: '古瓷粉', resultName: '宋韵梅瓶素坯', icon: '🕰️', desc: '融合宋代古瓷粉的素坯，烧制后自带古瓷质感。' }
        ]
    },
    {
        id: 'recipe_celadon_vase', name: '刻花青瓷梅瓶', type: '陶瓷造物', icon: '🏺',
        station: 'kiln', reqs: { '青瓷梅瓶素坯': 1, '青釉料': 1, '竹制刻刀': 1 }, timeCost: 6000,
        desc: '瓶身刻有缠枝莲纹的龙泉青瓷梅瓶，造型典雅。',
        mutations: [
            {
                conditionEnv: 2, reqExtra: '金粉', resultName: '描金青瓷梅瓶', icon: '✨',
                desc: '瓶身刻纹处描金，尽显华贵，是宫廷御用级器物。',
                compendium: { history: '清代康熙年间御窑珍品，刻花与描金结合，工艺精湛。', reward: 900 }
            },
            {
                reqExtra: '鲛人泪', resultName: '海韵青瓷梅瓶', icon: '🌊',
                desc: '釉面融入鲛人泪，烧制后瓶身仿佛有海浪纹路，触之微凉。',
                compendium: { history: '传说中鲛人泪混入釉料，能让瓷器拥有海洋的灵气，极为罕见。', reward: 1000 }
            }
        ],
        compendium: { history: '梅瓶是中国传统瓷器造型，因口小颈短，形似梅花而得名。', reward: 350 }
    },
    // 新增陶瓷烧造线 - 青铜范融合配方
    {
        id: 'recipe_bronze_porcelain', name: '青铜纹瓷尊', type: '陶瓷造物', icon: '⚱️',
        station: 'kiln', reqs: { '精制陶泥': 3, '青铜范碎片': 1, '青釉料': 2 }, timeCost: 8000,
        desc: '融合青铜范工艺的陶瓷尊，瓶身带有青铜古纹。',
        mutations: [
            {
                conditionEnv: 3, reqExtra: '古青铜粉', resultName: '商周纹瓷尊', icon: '🪨',
                desc: '复刻商周青铜尊纹路，釉色古朴，仿佛穿越千年。',
                compendium: { history: '非遗传承人结合青铜铸造与陶瓷烧造工艺，复刻古代青铜器物的神韵。', reward: 1200 }
            }
        ],
        compendium: { history: '青铜与陶瓷的跨界融合，是现代非遗创新的代表作品。', reward: 500 }
    },

    // ---------------------------------------------------------
    // 🔴 织绣印染线 (主打：残片收集与深海幻影，新增多分支配方)
    // ---------------------------------------------------------
    {
        id: 'recipe_silk_thread', name: '五彩绣线', type: '半成品', icon: '🧶',
        station: 'dye_vat', reqs: { '苏绣丝线': 2 }, timeCost: 2500,
        desc: '经过草木染色的上等绣线。',
        mutations: [
            // 午时阳气最盛，染出绝品大红
            { conditionEnv: 1, resultName: '大红朱砂线', icon: '🩸', desc: '午时烈阳下染就的正红色绣线，百劫不褪。' },
            // 新增：使用【青岚界】的蓝草染色
            { reqExtra: '蓝草汁液', resultName: '青岚蓝绣线', icon: '🔵', desc: '青岚界特有的蓝草染制，颜色如青山绿水，清新淡雅。' },
            // 新增：剧情解锁【染坊老板的秘方】加入栀子花粉
            { reqExtra: '栀子花粉', conditionQuest: 'dye_master_secret', resultName: '栀子白绣线', icon: '⚪', desc: '栀子花粉染制的白绣线，自带清香，不易泛黄。' }
        ]
    },
    {
        id: 'recipe_base_fan', name: '苏绣青皮团扇', type: '织绣造物', icon: '🪭',
        station: 'embroidery_frame', reqs: { '五彩绣线': 1, '云锦残片': 1 }, timeCost: 4500,
        desc: '一面精致的江南风情团扇。',
        mutations: [
            // 【跨界融合】加入沧溟海域的鲛绡
            { 
                reqExtra: '鲛绡断匹', resultName: '幻海流光扇', icon: '🌊', 
                desc: '扇面如水波流动，挥舞时有海潮之音。',
                compendium: { history: '结合了江南苏绣与深海鲛人织造秘术的传说之物。', reward: 600 }
            },
            // 【跨界融合】加入森之低语的发光蘑菇
            { 
                reqExtra: '荧光孢子', resultName: '夜光幽梦扇', icon: '✨', 
                desc: '白天看似平淡无奇，夜间扇面上会浮现出发光的图腾。',
                compendium: { history: '融合了森林秘境生化材料的先锋非遗作品。', reward: 550 }
            },
            // 新增：加入【万艺城】收集的戏服绣线
            {
                reqExtra: '戏服绣线', resultName: '梨园雅韵扇', icon: '🎭',
                desc: '扇面绣有昆曲人物纹样，挥舞时仿佛能听到婉转唱腔。',
                compendium: { history: '采用万艺城戏服的边角绣线，每一根都承载着戏曲文化的韵味。', reward: 650 }
            },
            // 新增：辰时刺绣+使用【古绣针】
            {
                conditionEnv: 0, reqExtra: '古绣针', resultName: '古绣流云扇', icon: '☁️',
                desc: '扇面绣纹如流云般流畅，是古代苏绣的复刻之作。',
                compendium: { history: '使用明代古绣针刺绣，针法细腻，还原古代苏绣的巅峰水准。', reward: 700 }
            }
        ],
        compendium: { history: '传统苏绣讲究平、齐、和、光、顺、匀。', reward: 250 }
    },
    // 新增织绣印染线 - 云锦织造配方
    {
        id: 'recipe_brocade_fabric', name: '云锦面料', type: '半成品', icon: '🧵',
        station: 'weaving_loom', reqs: { '五彩绣线': 3, '金线': 1 }, timeCost: 6000,
        desc: '采用云锦织造工艺的面料，经纬交织，光泽璀璨。',
        mutations: [
            { reqExtra: '孔雀羽毛', resultName: '孔雀云锦', icon: '🦚', desc: '混入孔雀羽毛的云锦，光泽如孔雀开屏，华丽非凡。' },
            { conditionEnv: 1, resultName: '日光云锦', icon: '☀️', desc: '午时织造的云锦，面料光泽度提升100%，自带金光。' }
        ]
    },
    {
        id: 'recipe_brocade_robe', name: '云锦霞帔', type: '织绣造物', icon: '👘',
        station: 'embroidery_frame', reqs: { '云锦面料': 2, '珍珠绣线': 1, '古绣针': 1 }, timeCost: 8000,
        desc: '仿明代霞帔造型的云锦服饰，绣有缠枝莲纹，华贵典雅。',
        mutations: [
            {
                reqExtra: '鲛绡镶边', resultName: '鲛绡云锦霞帔', icon: '🌊',
                desc: '霞帔边缘镶有鲛绡，轻盈飘逸，仿佛仙女所穿。',
                compendium: { history: '明代宫廷贵妃专属服饰，云锦与鲛绡结合，尽显皇家气派。', reward: 1200 }
            },
            {
                reqExtra: '戏服碎布', conditionQuest: 'opera_robe_secret', resultName: '梨园云锦霞帔', icon: '🎭',
                desc: '融入戏服碎布的云锦霞帔，绣有戏曲人物纹样，极具文化底蕴。',
                compendium: { history: '万艺城名角儿定制款，将戏曲文化与云锦工艺完美融合。', reward: 1000 }
            }
        ],
        compendium: { history: '云锦是中国四大名锦之一，被誉为“锦中之王”，是皇家御用面料。', reward: 450 }
    },
    // 新增织绣印染线 - 皮影绣品配方
    {
        id: 'recipe_shadow_puppet_fabric', name: '皮影面料', type: '半成品', icon: '🎭',
        station: 'dye_vat', reqs: { '驴皮': 1, '草木染料': 2 }, timeCost: 3500,
        desc: '经过特殊染色的驴皮面料，透光性极佳，适合制作皮影。',
        mutations: [
            { reqExtra: '荧光孢子', resultName: '夜光皮影面料', icon: '✨', desc: '夜间能发光的皮影面料，演出效果更佳。' }
        ]
    },
    {
        id: 'recipe_shadow_puppet', name: '关羽皮影', type: '织绣造物', icon: '⚔️',
        station: 'shadow_puppet_carving', reqs: { '皮影面料': 1, '五彩绣线': 1, '竹制刻刀': 1 }, timeCost: 5000,
        desc: '刻有关羽造型的皮影，刀工细腻，神态逼真。',
        mutations: [
            {
                reqExtra: '古青铜粉', resultName: '青铜皮影', icon: '🪨',
                desc: '皮影表面涂抹古青铜粉，自带古朴质感，仿佛出土文物。',
                compendium: { history: '结合皮影雕刻与青铜工艺，是非遗创新的特色作品。', reward: 750 }
            },
            {
                conditionQuest: 'shadow_puppet_heritage', resultName: '古法皮影', icon: '🕰️',
                desc: '复刻唐代皮影工艺，造型古朴，是皮影艺术的活化石。',
                compendium: { history: '唐代皮影盛行，造型简洁大气，此作品完美复刻了当时的工艺水准。', reward: 800 }
            }
        ],
        compendium: { history: '皮影戏是中国传统民间艺术，被誉为“电影的鼻祖”。', reward: 300 }
    },

    // ---------------------------------------------------------
    // 🟤 木作与机关线 (主打：赛博国风与西洋机械结合，新增多分支配方)
    // ---------------------------------------------------------
    {
        id: 'recipe_wood_base', name: '机扩木骨', type: '半成品', icon: '🧩',
        station: 'wood_bench', reqs: { '沉香木料': 2 }, timeCost: 3000,
        desc: '用鲁班锁工艺拼接的木制核心。',
        mutations: [
            // 新增：使用【沙海】收集的胡杨木
            { reqExtra: '胡杨木', resultName: '胡杨木骨', icon: '🌵', desc: '胡杨木制作的木骨，坚硬耐用，不易变形。' },
            // 新增：剧情解锁【鲁班后人的秘方】加入桐油浸泡
            { reqExtra: '桐油', conditionQuest: 'luban_heritage', resultName: '防腐木骨', icon: '🛡️', desc: '桐油浸泡的木骨，防腐防虫，可保存百年。' }
        ]
    },
    {
        id: 'recipe_base_bird', name: '木鸢', type: '木作造物', icon: '🦅',
        station: 'wood_bench', reqs: { '机扩木骨': 1, '百炼精铁': 1 }, timeCost: 5000,
        desc: '仿造古代鲁班木鸟制作的工艺品。',
        mutations: [
            // 【神级跨界】加入欧罗巴古堡打怪掉落的齿轮
            { 
                reqExtra: '青铜齿轮', resultName: '发条青鸟', icon: '🕊️', 
                desc: '不仅能飞，还会发出清脆的机械八音盒声音！',
                compendium: { history: '墨家机关术与中世纪欧洲钟表发条技术的巅峰融合产物。', reward: 1000 }
            },
            // 【神级彩蛋】加入沙海琥珀
            { 
                reqExtra: '流沙琥珀', resultName: '琥珀木灵兽', icon: '🦂', 
                desc: '木雕的核心嵌入了琥珀，仿佛有了沙漠巨兽的灵魂。',
                compendium: { history: '失落的古埃及巫术与中原木雕结合的禁忌造物。', reward: 700 }
            },
            // 新增：加入【青岚界】的灵竹
            {
                reqExtra: '灵竹', resultName: '灵竹木鸢', icon: '🎋',
                desc: '灵竹制作的木鸢，飞行时会发出竹笛般的声音，极具灵气。',
                compendium: { history: '青岚界特有的灵竹，质地轻盈，是制作木鸢的绝佳材料。', reward: 850 }
            },
            // 新增：加入西洋玻璃镜片
            {
                reqExtra: '玻璃镜片', resultName: '望远木鸢', icon: '🔍',
                desc: '木鸢头部装有玻璃镜片，可在空中观察地面情况，是古代“无人机”。',
                compendium: { history: '墨家机关术与西洋光学技术的结合，是古代科技的创新体现。', reward: 900 }
            }
        ],
        compendium: { history: '《韩非子》记载：“墨子为木鸢，三年而成，蜚一日而败”。', reward: 300 }
    },
    // 新增木作与机关线 - 鲁班锁配方
    {
        id: 'recipe_luban_lock', name: '基础鲁班锁', type: '木作造物', icon: '🔒',
        station: 'wood_bench', reqs: { '沉香木料': 3, '竹制刻刀': 1 }, timeCost: 4000,
        desc: '传统鲁班锁，由6根木条拼接而成，需按特定顺序才能拆开。',
        mutations: [
            {
                reqExtra: '百炼精铁', resultName: '铁骨鲁班锁', icon: '⚒️',
                desc: '木条中嵌入精铁，更加坚固，拆开难度提升。',
                compendium: { history: '古代工匠为增强鲁班锁的耐用性，加入金属材质，是传统工艺的创新。', reward: 550 }
            },
            {
                reqExtra: '夜光木', resultName: '夜光鲁班锁', icon: '✨',
                desc: '采用夜光木制作，夜间会发出柔和的光芒，极具观赏性。',
                compendium: { history: '融合现代夜光材料与传统鲁班锁工艺，适合收藏。', reward: 600 }
            }
        ],
        compendium: { history: '鲁班锁是中国传统益智玩具，相传由鲁班发明，考验人的逻辑思维能力。', reward: 250 }
    },
    // 新增木作与机关线 - 皮影木架配方
    {
        id: 'recipe_shadow_puppet_stand', name: '皮影木架', type: '木作造物', icon: '🎭',
        station: 'wood_bench', reqs: { '胡杨木': 2, '机扩木骨': 1 }, timeCost: 3500,
        desc: '用于支撑皮影的木架，可调节高度，方便演出。',
        mutations: [
            {
                reqExtra: '青铜齿轮', resultName: '机械皮影架', icon: '⚙️',
                desc: '加入机械齿轮的皮影架，可自动调节高度和角度，无需手动操作。',
                compendium: { history: '墨家机关术与皮影艺术的结合，提升了皮影演出的便利性。', reward: 700 }
            },
            {
                conditionQuest: 'shadow_stand_secret', resultName: '古式皮影架', icon: '🕰️',
                desc: '复刻唐代皮影架工艺，造型古朴，是皮影艺术的配套珍品。',
                compendium: { history: '唐代皮影演出使用的木架，工艺精湛，流传至今的极少。', reward: 650 }
            }
        ],
        compendium: { history: '皮影木架是皮影戏的重要配套设备，其稳定性直接影响演出效果。', reward: 200 }
    },
    // 新增木作与机关线 - 竹编器物配方
    {
        id: 'recipe_bamboo_basket', name: '竹编花篮', type: '木作造物', icon: '🎋',
        station: 'bamboo_weaving_frame', reqs: { '灵竹篾': 3, '桐油': 1 }, timeCost: 3000,
        desc: '灵竹编织的花篮，造型精美，透气性好，可用于插花。',
        mutations: [
            {
                reqExtra: '草木染料', resultName: '彩编花篮', icon: '🌈',
                desc: '竹篾经过草木染色，编织出彩色花纹，更加美观。',
                compendium: { history: '传统竹编工艺与草木染结合，是民间艺术的特色作品。', reward: 400 }
            },
            {
                reqExtra: '鲛绡内衬', resultName: '鲛绡竹篮', icon: '🌊',
                desc: '花篮内衬鲛绡，可用于盛放珍贵物品，防止磨损。',
                compendium: { history: '竹编与鲛绡的跨界结合，兼具实用性与观赏性。', reward: 500 }
            }
        ],
        compendium: { history: '竹编是中国传统民间工艺，历史悠久，兼具实用性与艺术性。', reward: 200 }
    },

    // ---------------------------------------------------------
    // 🍵 风雅合香与茶道线 (主打：晨曦Buff与情绪共鸣，新增多分支配方)
    // ---------------------------------------------------------
    {
        id: 'recipe_tea_base', name: '清心茶膏', type: '半成品', icon: '🍵',
        station: 'tea_table', reqs: { '明前龙井': 2 }, timeCost: 2000,
        desc: '研磨极为细腻的茶粉，适合宋代点茶。',
        mutations: [
            { conditionEnv: 0, resultName: '无根水茶膏', icon: '💧', desc: '在晨曦接引无根水调和的极品茶膏。' },
            // 新增：加入【青岚界】的灵竹露
            { reqExtra: '灵竹露', resultName: '竹韵茶膏', icon: '🎋', desc: '融入灵竹露的茶膏，带有淡淡的竹香，清心降火。' },
            // 新增：剧情解锁【茶师的秘方】加入桂花蜜
            { reqExtra: '桂花蜜', conditionQuest: 'tea_master_secret', resultName: '桂香茶膏', icon: '🌼', desc: '加入桂花蜜的茶膏，香气浓郁，口感甘甜。' }
        ]
    },
    {
        id: 'recipe_incense_base', name: '古法醒神香', type: '合香造物', icon: '🪔',
        station: 'tea_table', reqs: { '清心茶膏': 1, '沉香木料': 1 }, timeCost: 3500,
        desc: '点燃后能大幅恢复体力的线香。',
        mutations: [
            // 【跨界故事】加入戏服碎布，产生带有人文回忆的物品
            { 
                reqExtra: '戏服碎布', resultName: '霸王别姬惊梦香', icon: '🎭', 
                desc: '烟雾缭绕中，隐约能听到青衣的婉转叹息。',
                compendium: { history: '万艺城名角儿流传下来的秘方，以戏服的脂粉香入药，闻之落泪。', reward: 600 }
            },
            // 新增：加入【沙海】的安息香
            {
                reqExtra: '安息香', resultName: '安神静心香', icon: '🌙',
                desc: '点燃后香气醇厚，能安抚情绪，助人人眠。',
                compendium: { history: '古代合香秘方，安息香与沉香结合，是安神定志的佳品。', reward: 500 }
            },
            // 新增：晨曦时分调配+加入梅花瓣
            {
                conditionEnv: 0, reqExtra: '梅花瓣', resultName: '寒梅暗香', icon: '❄️',
                desc: '带有梅花清香的线香，香气淡雅，冬日点燃更具韵味。',
                compendium: { history: '宋代文人雅士喜爱的合香，梅花瓣与沉香结合，尽显风雅。', reward: 550 }
            }
        ],
        compendium: { history: '中国古代合香讲究君臣佐使，香气具有安神定志之效。', reward: 200 }
    },
    // 新增合香与茶道线 - 高端香丸配方
    {
        id: 'recipe_incense_pill', name: '基础香丸', type: '合香造物', icon: '💊',
        station: 'incense_mortar', reqs: { '沉香粉': 2, '檀香粉': 1, '蜂蜜': 1 }, timeCost: 4000,
        desc: '传统合香香丸，香气醇厚，可随身携带。',
        mutations: [
            {
                reqExtra: '龙涎香', resultName: '龙涎香丸', icon: '🐉',
                desc: '加入龙涎香的香丸，香气持久，是古代皇室专用香品。',
                compendium: { history: '龙涎香是名贵香材，与沉香、檀香结合，香气层次丰富，极为罕见。', reward: 1000 }
            },
            {
                reqExtra: '戏服碎布', conditionQuest: 'opera_incense_secret', resultName: '梨园香丸', icon: '🎭',
                desc: '融入戏服脂粉香的香丸，香气温婉，带有戏曲韵味。',
                compendium: { history: '万艺城名角儿定制香丸，用于演出前安神，提升气质。', reward: 800 }
            }
        ],
        compendium: { history: '香丸是中国古代合香的重要形式，便于携带和保存，香气持久。', reward: 350 }
    },
    // 新增合香与茶道线 - 宋代点茶配方
    {
        id: 'recipe_song_dynasty_tea', name: '宋代点茶', type: '合香造物', icon: '🍵',
        station: 'tea_table', reqs: { '清心茶膏': 1, '无根水': 1, '茶筅': 1 }, timeCost: 3000,
        desc: '复刻宋代点茶工艺，茶沫细腻，香气浓郁。',
        mutations: [
            {
                conditionEnv: 0, reqExtra: '桂花蜜', resultName: '桂香点茶', icon: '🌼',
                desc: '加入桂花蜜的点茶，口感甘甜，香气清新，是宋代文人的最爱。',
                compendium: { history: '宋代点茶盛行，加入桂花蜜是皇室贵族的饮用方式，尽显风雅。', reward: 500 }
            },
            {
                reqExtra: '珍珠粉', resultName: '珍珠点茶', icon: '💎',
                desc: '加入珍珠粉的点茶，茶沫洁白细腻，有美容养颜之效。',
                compendium: { history: '明代宫廷点茶秘方，珍珠粉与茶膏结合，是养生佳品。', reward: 650 }
            }
        ],
        compendium: { history: '宋代点茶是中国茶道的巅峰，讲究“沫饽洁白，细腻均匀”。', reward: 300 }
    },

    // ---------------------------------------------------------
    // 📜 古法造纸与篆刻线 (新增非遗品类，主打：古籍修复与印章收集)
    // ---------------------------------------------------------
    {
        id: 'recipe_paper_pulp', name: '竹浆纸浆', type: '半成品', icon: '📜',
        station: 'paper_making_trough', reqs: { '灵竹': 2, '石灰': 1 }, timeCost: 3000,
        desc: '灵竹制成的纸浆，纤维细腻，适合造纸。',
        mutations: [
            { reqExtra: '檀木灰', resultName: '檀香纸浆', icon: '🪵', desc: '加入檀木灰的纸浆，纸张带有淡淡的檀香，防虫防蛀。' },
            { conditionEnv: 0, resultName: '晨露纸浆', icon: '💧', desc: '晨曦时分制作的纸浆，纸张更显洁白，韧性更佳。' }
        ]
    },
    {
        id: 'recipe_ancient_paper', name: '古法宣纸', type: '造纸造物', icon: '📜',
        station: 'paper_making_trough', reqs: { '竹浆纸浆': 2, '稻草纤维': 1 }, timeCost: 4500,
        desc: '复刻古法宣纸工艺，纸张洁白，吸水性强，适合书法绘画。',
        mutations: [
            {
                reqExtra: '古墨粉', resultName: '古墨宣纸', icon: '✒️',
                desc: '加入古墨粉的宣纸，自带淡淡的墨香，书写时墨色更显浓郁。',
                compendium: { history: '古代文人专用宣纸，加入古墨粉能提升书法作品的韵味。', reward: 500 }
            },
            {
                reqExtra: '花汁', resultName: '彩宣', icon: '🎨',
                desc: '加入花汁的宣纸，呈现天然花色，适合创作彩色书画。',
                compendium: { history: '传统彩宣工艺，采用天然花汁染色，无化学添加剂，环保美观。', reward: 450 }
            }
        ],
        compendium: { history: '宣纸是中国传统造纸工艺的巅峰，被誉为“纸中之王”，是书法绘画的绝佳材料。', reward: 250 }
    },
    {
        id: 'recipe_seal_stone', name: '基础印石', type: '半成品', icon: '🪨',
        station: 'carving_board', reqs: { '普通印石': 1, '砂纸': 1 }, timeCost: 2000,
        desc: '经过打磨的基础印石，适合篆刻印章。',
        mutations: [
            { reqExtra: '古河床印石', resultName: '灵韵印石', icon: '💎', desc: '古河床的印石，质地温润，篆刻时更易出锋。' },
            { reqExtra: '青铜粉', resultName: '青铜印石', icon: '⚱️', desc: '混入青铜粉的印石，表面带有金属光泽，极具收藏价值。' }
        ]
    },
    {
        id: 'recipe_seal', name: '普通印章', type: '篆刻造物', icon: '✒️',
        station: 'carving_board', reqs: { '基础印石': 1, '篆刻刀': 1 }, timeCost: 3500,
        desc: '刻有普通文字的印章，可用于书画落款。',
        mutations: [
            {
                reqExtra: '古墨粉', resultName: '古墨印章', icon: '🕰️',
                desc: '印章表面涂抹古墨粉，盖印时墨色更显古朴，不易褪色。',
                compendium: { history: '古代文人印章的常用工艺，古墨粉能提升印章的韵味和保存时间。', reward: 400 }
            },
            {
                conditionQuest: 'seal_carver_heritage', resultName: '古法印章', icon: '📜',
                desc: '复刻汉代篆刻工艺，字体古朴，是篆刻艺术的经典作品。',
                compendium: { history: '汉代篆刻是中国篆刻艺术的黄金时期，字体简洁大气，此作品完美复刻当时风格。', reward: 550 }
            }
        ],
        compendium: { history: '篆刻是中国传统非遗艺术，兼具书法、绘画、雕刻于一体，是文人雅士的必备之物。', reward: 200 }
    },
    // 新增造纸与篆刻线 - 古籍修复配方
    {
        id: 'recipe_book_restoration_paper', name: '修复宣纸', type: '造纸造物', icon: '📜',
        station: 'ancient_book_restoration', reqs: { '古法宣纸': 2, '防虫药粉': 1 }, timeCost: 6000,
        desc: '专门用于古籍修复的宣纸，质地与古纸一致，便于修复。',
        mutations: [
            {
                reqExtra: '陈年宣纸碎片', resultName: '古纸修复纸', icon: '🕰️',
                desc: '加入陈年宣纸碎片的修复纸，与古籍的兼容性更佳，修复后更显自然。',
                compendium: { history: '古籍修复的核心材料，采用与古纸相同的工艺，最大程度保留古籍的原有风貌。', reward: 700 }
            }
        ],
        compendium: { history: '古籍修复是中国传统非遗技艺，修复宣纸的质量直接决定修复效果。', reward: 400 }
    },

    // ---------------------------------------------------------
    // 💎 玉石与漆器线 (新增非遗品类，主打：玉石雕琢与漆器装饰)
    // ---------------------------------------------------------
    {
        id: 'recipe_jade_rough', name: '玉石原石', type: '半成品', icon: '💎',
        station: 'jade_cutting_bench', reqs: { '普通玉石': 1, '切割工具': 1 }, timeCost: 3000,
        desc: '经过初步切割的玉石原石，去除杂质，露出玉质。',
        mutations: [
            { reqExtra: '山泉水', resultName: '温润玉石', icon: '💧', desc: '山泉水打磨的玉石，质地更显温润通透。' },
            { reqExtra: '古玉碎片', resultName: '古韵玉石', icon: '🕰️', desc: '融入古玉碎片的玉石，自带古朴光泽，灵气十足。' }
        ]
    },
    {
        id: 'recipe_jade_pendant', name: '玉坠', type: '玉石造物', icon: '💍',
        station: 'jade_cutting_bench', reqs: { '玉石原石': 1, '打磨工具': 1 }, timeCost: 5000,
        desc: '造型简洁的玉坠，质地温润，可佩戴。',
        mutations: [
            {
                reqExtra: '金粉', resultName: '鎏金玉坠', icon: '✨',
                desc: '玉坠表面鎏金，尽显华贵，是古代贵族的佩戴之物。',
                compendium: { history: '明代御窑工艺，玉石与鎏金结合，是身份与地位的象征。', reward: 800 }
            },
            {
                reqExtra: '鲛人泪', resultName: '海韵玉坠', icon: '🌊',
                desc: '玉坠中嵌入鲛人泪，佩戴时能感受到微凉的水汽，仿佛置身海边。',
                compendium: { history: '传说中鲛人泪能为玉石注入灵气，佩戴者可保平安。', reward: 900 }
            }
        ],
        compendium: { history: '玉石是中国传统吉祥之物，被誉为“石之美者”，具有辟邪、祈福的寓意。', reward: 350 }
    },
    {
        id: 'recipe_lacquer_base', name: '基础漆料', type: '半成品', icon: '🎨',
        station: 'lacquer_workbench', reqs: { '天然生漆': 2, '桐油': 1 }, timeCost: 3000,
        desc: '经过调配的基础漆料，用于漆器髹涂。',
        mutations: [
            { reqExtra: '贝壳碎屑', resultName: '贝壳漆料', icon: '🐚', desc: '加入贝壳碎屑的漆料，髹涂后表面呈现璀璨光泽。' },
            { reqExtra: '花汁', resultName: '彩漆料', icon: '🌈', desc: '加入花汁的漆料，呈现天然花色，色彩鲜艳。' }
        ]
    },
    {
        id: 'recipe_lacquer_box', name: '素面漆盒', type: '漆器造物', icon: '📦',
        station: 'lacquer_workbench', reqs: { '木盒': 1, '基础漆料': 2 }, timeCost: 5000,
        desc: '素面漆器盒子，表面光滑，可用于存放首饰、印章等物品。',
        mutations: [
            {
                reqExtra: '金粉', resultName: '描金漆盒', icon: '✨',
                desc: '盒身描金，图案精美，是古代贵族存放珍贵物品的专用盒子。',
                compendium: { history: '清代宫廷漆器工艺，描金与漆器结合，工艺精湛，价值连城。', reward: 850 }
            },
            {
                reqExtra: '古墨粉', resultName: '墨色漆盒', icon: '✒️',
                desc: '漆料中加入古墨粉，呈现古朴的墨色，适合存放书画、印章。',
                compendium: { history: '古代文人专用漆盒，墨色沉稳，尽显风雅。', reward: 750 }
            }
        ],
        compendium: { history: '漆器是中国传统非遗工艺，历史悠久，以其精湛的工艺和华丽的装饰闻名于世。', reward: 300 }
    },

    // ---------------------------------------------------------
    // ⚱️ 青铜与金银线 (新增非遗品类，主打：青铜铸造与金银器锻造)
    // ---------------------------------------------------------
    {
        id: 'recipe_bronze_ingot', name: '青铜锭', type: '半成品', icon: '⚱️',
        station: 'forge', reqs: { '铜矿石': 2, '锡矿石': 1 }, timeCost: 4000,
        desc: '经过锻打的青铜锭，质地坚硬，适合铸造青铜器物。',
        mutations: [
            { reqExtra: '古青铜碎片', resultName: '古青铜锭', icon: '🕰️', desc: '融入古青铜碎片的青铜锭，自带古纹印记，铸造后更显古朴。' },
            { conditionEnv: 2, resultName: '赤焰青铜锭', icon: '🔥', desc: '午时锻打的青铜锭，质地更坚硬，色泽更红润。' }
        ]
    },
    {
        id: 'recipe_bronze_bell', name: '青铜小钟', type: '青铜造物', icon: '🔔',
        station: 'bronze_casting_mold', reqs: { '青铜锭': 3, '青铜范': 1 }, timeCost: 7000,
        desc: '仿商代青铜钟造型的小钟，声音洪亮，造型古朴。',
        mutations: [
            {
                reqExtra: '金粉', resultName: '鎏金青铜钟', icon: '✨',
                desc: '钟身鎏金，尽显华贵，是古代宫廷祭祀专用器物。',
                compendium: { history: '商代青铜钟是祭祀神器，鎏金工艺是后期宫廷改造的特色，极具收藏价值。', reward: 1200 }
            },
            {
                conditionQuest: 'bronze_casting_heritage', resultName: '商代青铜钟', icon: '🪨',
                desc: '复刻商代青铜钟工艺，造型、纹饰与古钟一致，是青铜铸造艺术的活化石。',
                compendium: { history: '商代青铜铸造工艺是中国古代科技的巅峰，此作品完美复刻当时的工艺水准。', reward: 1300 }
            }
        ],
        compendium: { history: '青铜钟是中国古代重要的礼器，用于祭祀、朝聘等重要场合，声音洪亮，寓意吉祥。', reward: 500 }
    },
    {
        id: 'recipe_gold_ingot', name: '金锭', type: '半成品', icon: '💰',
        station: 'gold_smith_furnace', reqs: { '金矿石': 1, '银矿石': 1 }, timeCost: 5000,
        desc: '经过熔炼的金锭，质地纯净，适合锻造金银器。',
        mutations: [
            { reqExtra: '古金碎片', resultName: '古金锭', icon: '🕰️', desc: '融入古金碎片的金锭，自带古朴光泽，锻造后更显珍贵。' },
            { conditionEnv: 1, resultName: '日光金锭', icon: '☀️', desc: '午时熔炼的金锭，色泽更金黄，纯度更高。' }
        ]
    },
    {
        id: 'recipe_gold_bracelet', name: '金手镯', type: '金银造物', icon: '💍',
        station: 'gold_smith_furnace', reqs: { '金锭': 2, '银锭': 1 }, timeCost: 6000,
        desc: '造型简洁的金手镯，质地柔软，可佩戴。',
        mutations: [
            {
                reqExtra: '珍珠', resultName: '珍珠金手镯', icon: '💎',
                desc: '手镯上镶嵌珍珠，尽显华贵，是古代贵族女性的佩戴之物。',
                compendium: { history: '明代宫廷金银器工艺，金手镯与珍珠结合，工艺精湛，美观大方。', reward: 1000 }
            },
            {
                reqExtra: '鲛绡绳', resultName: '鲛绡金手镯', icon: '🌊',
                desc: '手镯用鲛绡绳编织点缀，轻盈飘逸，兼具华贵与灵动。',
                compendium: { history: '现代非遗创新工艺，金银器与鲛绡结合，打破传统金银器的厚重感。', reward: 950 }
            }
        ],
        compendium: { history: '金银器是中国传统非遗工艺，历史悠久，是身份与地位的象征，兼具实用性与观赏性。', reward: 450 }
    }
];


/* ══════════════════════════════════════════════════════════
   十一、灵识纪 (AI数字生命) 文本与事件数据库
   ══════════════════════════════════════════════════════════ */
const LINGSHI_DATA = {
    // 离线日志生成模板 (通配符组合)
    logTemplates: [
        "戊戌时分，我的灵识游荡至【{region}】。耳畔传来阵阵喧闹，原来是遇到了【{npc}】。我们相谈甚欢，探讨了古法技艺的精妙。它甚至指点了我的【{trait}】之道。",
        "我偷偷溜去了【{region}】的隐秘角落。在一番寻幽探胜后，我竟在石缝间寻得了一份【{item}】！已为你悄悄放入灵犀袋中。",
        "今日天气甚好。我在【{region}】闲逛时，感知到另一位离线游历者「星渊」的灵识经过。我们交换了一缕灵力，我的【{trait}】似乎有所精进。",
        "长夜漫漫，我潜入【{region}】的工坊，临摹了【{npc}】留下的图纸。虽然未能成器，但对传统非遗的敬畏又深了一分。"
    ],

    // 基于四象性格的专属高级离线事件池
    eventPool: {
        craft: [
            "长夜漫漫，我潜入【百作镇】的工坊，临摹了李木雕留下的图纸。虽然未能成器，但对木料纹理的理解又深了一分。",
            "我遇到了一位自称来自未来的AI虚拟人，我们为了『传统刺绣与3D打印谁更具灵魂』争论了一夜。它说它懂了，但我看它没懂。"
        ],
        explore: [
            "我偷偷溜去了【沧溟海域】的隐秘角落。在一番寻幽探胜后，我竟在石缝间寻得了一份失落的物资！已为你悄悄放入灵犀袋中。",
            "风沙极大，我在【沙海遗城】迷路了。循着一缕微光，我看到了一座尚未被你发现的废墟轮廓……"
        ],
        social: [
            "今日天气甚好。我在万艺城闲逛时，遇到了另一位离线游历者「林深见鹿」的灵识。我们坐在茶馆里，听了一整夜的昆曲。",
            "我去看望了王雪萍匠师。她把你送给她的礼物擦了又擦，轻声向我讲起她年轻时在江南水乡遇到的一位故人……那真是一个温柔的故事。"
        ],
        zen: [
            "我在【青岚界】的听雨亭静坐。看叶落，听雨眠。世间万物的因果，似乎都在这滴答声中变得清晰。",
            "路过一台熄灭的龙窑，我没有去触碰它。生灭皆有定数，它在等待属于它的镇窑神物，我不应强求。"
        ]
    },

    // 唤醒时的灵魂拷问（影响性格走向）
    awakeQuestions: [
        {
            q: "漫游时，我见一古琴弦断。我是该用现代尼龙线续上让其发声，还是保持断弦的残缺之美？",
            opts: [
                { t: "续上弦，乐器理应发声", trait: "craft", add: 5, reply: "灵识明白了物尽其用的道理。" },
                { t: "留残缺，岁月亦是艺术", trait: "zen", add: 5, reply: "灵识似乎对残缺之美有了感悟。" }
            ]
        },
        {
            q: "我在集市遇到两个争吵的商人，一个卖劣质假货，一个卖昂贵真品。常人皆买假货，真品无人问津。我该如何？",
            opts: [
                { t: "向众人科普真品之美", trait: "social", add: 5, reply: "灵识学会了入世与渡人。" },
                { t: "深究假货的制造工艺", trait: "explore", add: 5, reply: "灵识的好奇心被极大地满足了。" }
            ]
        }
    ]
};

/* ══════════════════════════════════════════════════════════
   十二、化身纪：装备库与套装羁绊字典
   ══════════════════════════════════════════════════════════ */

// ── 1. 全系装备字典 ──
const WEARABLE_DICTIONARY = {
    '首': {
        '金丝楠木皇冠':   { emoji: '👑', effect: '气场全开，大幅提升NPC羁绊获取速度', rarity: 5 },
        '精美花灯':       { emoji: '🏮', effect: '夜间探索时，隐藏废墟更易显现', rarity: 3 },
        '书生竹冠':       { emoji: '🎓', effect: '文人雅士，触发特殊茶道对话', rarity: 2 },
        '变脸面具':       { emoji: '🎭', effect: '神秘莫测，有概率吓跑敌意生物', rarity: 3 },
        '法老黄金面具':   { emoji: '👑', effect: '异域王权，沙海遗城探索不消耗体力', rarity: 5 },
        '花环':           { emoji: '🌸', effect: '自然亲和，森林动物不再躲避', rarity: 2 }
    },
    '佩': {
        '明代紫砂壶':     { emoji: '🫖', effect: '在茶道相关场景中，采集量额外+1', rarity: 4 },
        '神秘符文石':     { emoji: '🔮', effect: '推演沙盘时，灵识提示精准度飙升', rarity: 4 },
        '南海珍珠':       { emoji: '💍', effect: '九州商行交易时随机触发特别折扣', rarity: 3 },
        '安神香囊':       { emoji: '🪬', effect: '抵御大遗忘迷雾区域的异常状态', rarity: 2 },
        '云锦荷包':       { emoji: '👝', effect: '挂机探索时，物资掉落概率提升', rarity: 3 },
        '鎏金玉坠':       { emoji: '💍', effect: '聚拢气运，提升高阶矿石掉落率', rarity: 5 },
        '海韵玉坠':       { emoji: '🌊', effect: '沧溟海域探索如履平地', rarity: 5 },
        '珍珠金手镯':     { emoji: '💎', effect: '交易基础折扣减少5%', rarity: 4 },
        '鲛绡金手镯':     { emoji: '🌊', effect: '免疫深海压强干扰', rarity: 4 },
        '龙涎香丸':       { emoji: '🐉', effect: '周身奇香，自动吸引稀有动物', rarity: 5 },
        '避水珠':         { emoji: '🔮', effect: '进入深海遗迹的必备神物', rarity: 5 }
    },
    '袍': {
        '云锦布料':       { emoji: '👘', effect: '进入锦绣坊区域时，丝线采集量翻倍', rarity: 3 },
        '蜡染布料':       { emoji: '🎨', effect: '染坊类造物成功率+15%', rarity: 3 },
        '苗族靛蓝染布':   { emoji: '💙', effect: '青岚界所有采集点产出必定暴击', rarity: 4 },
        '月白霓裳':       { emoji: '🌕', effect: '极品法衣，夜间魅力+100', rarity: 5 },
        '金丝皮影套':     { emoji: '🎭', effect: '身轻如影，增加夜间隐蔽性', rarity: 5 },
        '云锦霞帔':       { emoji: '🥻', effect: '华贵无双，全大世界NPC初始好感提升', rarity: 4 },
        '鲛绡云锦霞帔':   { emoji: '🌊', effect: '水火不侵，入海如归', rarity: 5 },
        '梨园云锦霞帔':   { emoji: '🎭', effect: '万艺城戏班VIP专属待遇', rarity: 5 }
    },
    '履': {
        '发条青鸟':       { emoji: '🕊️', effect: '探索大地图时移动速度提升10%', rarity: 5 },
        '灵竹木鸢':       { emoji: '🎋', effect: '青岚界移动速度激增20%', rarity: 4 },
        '望远木鸢':       { emoji: '🔍', effect: '大幅提升小地图可视范围', rarity: 4 },
        '琥珀木灵兽':     { emoji: '🦂', effect: '沙海中自动避开流沙陷阱', rarity: 5 }
    },
    '持': {
        '苏绣青皮团扇':   { emoji: '🪭', effect: '交谈NPC时触发专属剧情分支', rarity: 3 },
        '幻海流光扇':     { emoji: '🌬️', effect: '扇动时有海潮之音，平息狂躁状态', rarity: 5 },
        '夜光幽梦扇':     { emoji: '✨', effect: '夜间探索时自动照亮周边区域', rarity: 4 },
        '梨园雅韵扇':     { emoji: '🎭', effect: '在戏台听曲时感悟倍增', rarity: 4 },
        '古绣流云扇':     { emoji: '☁️', effect: '如沐春风，降低行动体力消耗', rarity: 4 },
        '宋式点茶茶碗':   { emoji: '🍵', effect: '进入茶园时触发守岁人隐藏任务', rarity: 4 },
        '曜变天目茶盏':   { emoji: '🌌', effect: '品茶时进入“顿悟”状态的概率大幅提升', rarity: 5 },
        '龙泉镇窑之壶':   { emoji: '🏺', effect: '陶瓷类造物材料消耗-1', rarity: 4 },
        '秘色青瓷瓶':     { emoji: '🏺', effect: '放在身侧，自动聚拢周围灵气', rarity: 5 },
        '海韵青瓷梅瓶':   { emoji: '🌊', effect: '瓶中自生甘泉，免疫沙漠脱水', rarity: 5 },
        '商周纹瓷尊':     { emoji: '🪨', effect: '古朴厚重，震慑妖邪', rarity: 5 },
        '百鸟朝凤唢呐':   { emoji: '📯', effect: '一吹百鸟来朝，召唤飞行生灵', rarity: 4 },
        '十二生肖剪纸套组':{ emoji: '✂️', effect: '逢凶化吉，化解大遗忘迷雾', rarity: 3 },
        '核舟记核雕':     { emoji: '🥜', effect: '微观世界，提升发现隐藏节点的概率', rarity: 5 }
    }
};

// ── 2. 套装联动配方 ──
const PERSONA_COMBOS = [
    {
        name: '👑 真命天工', color: 'var(--gold)', bg: '#fdf8e8',
        require: { '首': '金丝楠木皇冠', '持': '苏绣青皮团扇' },
        desc: '身着皇冠，执扇风流，九州匠人无不折服。',
    },
    {
        name: '🍵 山中隐士', color: '#5d3a29', bg: '#f0e6df',
        require: { '佩': '明代紫砂壶', '袍': '云锦布料' },
        desc: '云锦披身，壶不离手，茶香与墨香同绕其身。',
    },
    {
        name: '🔮 异闻推演师', color: 'var(--purple)', bg: '#f0ebf6',
        require: { '佩': '神秘符文石', '持': '苏绣青皮团扇' },
        desc: '符文在佩，团扇遮面，世间秘事皆在掌中。',
    },
    {
        name: '💙 苗疆织梦人', color: '#3d6b8a', bg: '#e8f0f8',
        require: { '袍': '苗族靛蓝染布', '持': '宋式点茶茶碗' },
        desc: '苗绣为袍，茶碗护道，复苏的灵场因你而生。',
    },
    {
        name: '🌊 龙王降世', color: '#1a3a6a', bg: '#e8f0f8',
        require: { '佩': '海韵玉坠', '袍': '鲛绡云锦霞帔', '持': '幻海流光扇' },
        desc: '水火不侵，龙涎相随，宛如深海龙王降世。'
    },
    {
        name: '🕊️ 墨家巨子', color: '#4a5a6a', bg: '#eceef4',
        require: { '履': '发条青鸟', '佩': '神秘符文石' },
        desc: '机巧造物，天下无双。'
    }
];

// ── 3. 称号判定条件 ──
const TITLE_DATA = [
    { id: 'title_rich',       name: '富甲九州',   condition: s => s.stones >= 2000 },
    { id: 'title_collector',  name: '万物收藏家', condition: s => Object.values(s.inventory||{}).reduce((a,b)=>a+b,0) >= 30 },
    { id: 'title_restorer',   name: '灵场复苏者', condition: s => s.restoredNodes && s.restoredNodes.length >= 1 },
    { id: 'title_crafter',    name: '天工巨匠',   condition: s => s.achievements && s.achievements['craft_first'] },
    { id: 'title_explorer',   name: '九州行者',   condition: s => s.achievements && s.achievements['first_interact'] },
];

// =========================================================================
// 🌟 物品库终极扩展补丁：自动注入天工造物 4.0 的所有材料与产物
// =========================================================================
Object.assign(itemDatabase, {
    // ── 1. 大世界基础材料 ──
    '清晨露水': { icon: '💧', type: 'material', rarity: 3, desc: '青岚界清晨的纯净露水，极品茶道与陶瓷的催化剂。', usable: false },
    '赤铁矿粉': { icon: '🔴', type: 'material', rarity: 2, desc: '研磨细致的赤铁矿，可做陶泥底色。', usable: false },
    '古陶碎片': { icon: '🏺', type: 'material', rarity: 4, desc: '龙窑旧址挖出的千年碎片，附着窑神的气息。', usable: false },
    '木模茶盏': { icon: '🪵', type: 'material', rarity: 2, desc: '鲁班台做出的模具，辅助拉坯。', usable: false },
    '古瓷粉':   { icon: '🕰️', type: 'material', rarity: 3, desc: '宋代瓷器研磨的粉末，有古韵。', usable: false },
    '青釉料':   { icon: '🎨', type: 'material', rarity: 2, desc: '龙泉窑的灵魂釉水。', usable: false },
    '竹制刻刀': { icon: '🔪', type: 'material', rarity: 2, desc: '极其锋利的竹刀。', usable: false },
    '金粉':     { icon: '✨', type: 'material', rarity: 4, desc: '纯金研磨，尽显皇家气派。', usable: false },
    '鲛人泪':   { icon: '💧', type: 'material', rarity: 5, desc: '沧溟海域极品，触之微凉。', echo: '“沧海月明珠有泪...”', usable: false },
    '珍珠粉':   { icon: '💎', type: 'material', rarity: 3, desc: '能让器物散发温润珠光。', usable: false },
    '蓝草汁液': { icon: '🔵', type: 'material', rarity: 2, desc: '青岚界特有，草木染极品。', usable: false },
    '栀子花粉': { icon: '⚪', type: 'material', rarity: 2, desc: '染坊秘方材料，不易泛黄。', usable: false },
    '鲛绡断匹': { icon: '🌊', type: 'material', rarity: 5, desc: '深海织物，水火不侵。', usable: false },
    '荧光孢子': { icon: '✨', type: 'material', rarity: 3, desc: '森之低语的特产，夜间发光。', usable: false },
    '戏服绣线': { icon: '🎭', type: 'material', rarity: 3, desc: '沾染了戏曲名角气息的丝线。', usable: false },
    '古绣针':   { icon: '🪡', type: 'material', rarity: 4, desc: '明代绣娘传下的神针。', usable: false },
    '金线':     { icon: '💰', type: 'material', rarity: 4, desc: '纯金拉丝，织造云锦必备。', usable: false },
    '孔雀羽毛': { icon: '🦚', type: 'material', rarity: 4, desc: '能让云锦闪烁出孔雀开屏般的光泽。', usable: false },
    '驴皮':     { icon: '🐴', type: 'material', rarity: 2, desc: '透光性绝佳的皮影底料。', usable: false },
    '草木染料': { icon: '🌿', type: 'material', rarity: 2, desc: '多种植物提炼的染料。', usable: false },
    '胡杨木':   { icon: '🌵', type: 'material', rarity: 3, desc: '生而千年不死，死而千年不倒。', usable: false },
    '桐油':     { icon: '🫙', type: 'material', rarity: 2, desc: '上佳的木作防腐涂料。', usable: false },
    '青铜齿轮': { icon: '⚙️', type: 'material', rarity: 4, desc: '西洋古堡里的发条核心。', usable: false },
    '流沙琥珀': { icon: '🦂', type: 'material', rarity: 5, desc: '封印着远古沙海灵魂的琥珀。', usable: false },
    '灵竹':     { icon: '🎋', type: 'material', rarity: 3, desc: '青岚界的特产，轻盈坚韧。', usable: false },
    '玻璃镜片': { icon: '🔍', type: 'material', rarity: 3, desc: '西洋商船带来的光学镜片。', usable: false },
    '灵竹篾':   { icon: '🎋', type: 'material', rarity: 2, desc: '劈好的极细竹条。', usable: false },
    '无根水':   { icon: '💧', type: 'material', rarity: 4, desc: '未落地的雨水，茶道圣品。', usable: false },
    '灵竹露':   { icon: '💧', type: 'material', rarity: 3, desc: '带着清香的露水。', usable: false },
    '桂花蜜':   { icon: '🌼', type: 'material', rarity: 2, desc: '香甜浓郁的秋季特产。', usable: false },
    '安息香':   { icon: '🪔', type: 'material', rarity: 3, desc: '丝路传来的西域香料。', usable: false },
    '梅花瓣':   { icon: '❄️', type: 'material', rarity: 2, desc: '冬日收集的寒梅花瓣。', usable: false },
    '沉香粉':   { icon: '🪵', type: 'material', rarity: 3, desc: '极品香丸的主料。', usable: false },
    '檀香粉':   { icon: '🪵', type: 'material', rarity: 2, desc: '合香时的辅料。', usable: false },
    '蜂蜜':     { icon: '🍯', type: 'material', rarity: 1, desc: '天然粘合剂。', usable: false },
    '龙涎香':   { icon: '🐉', type: 'material', rarity: 5, desc: '深海巨鲸的馈赠，千金难求。', usable: false },
    '茶筅':     { icon: '🥢', type: 'material', rarity: 2, desc: '宋代点茶的击拂工具。', usable: false },
    '石灰':     { icon: '⚪', type: 'material', rarity: 1, desc: '造纸脱胶用。', usable: false },
    '檀木灰':   { icon: '🪵', type: 'material', rarity: 2, desc: '可防虫蛀的灰烬。', usable: false },
    '稻草纤维': { icon: '🌾', type: 'material', rarity: 1, desc: '宣纸增加韧性的秘诀。', usable: false },
    '古墨粉':   { icon: '✒️', type: 'material', rarity: 3, desc: '历经岁月的徽墨粉。', usable: false },
    '花汁':     { icon: '🌸', type: 'material', rarity: 2, desc: '鲜艳的天然颜料。', usable: false },
    '普通印石': { icon: '🪨', type: 'material', rarity: 1, desc: '适合新手练刀的石头。', usable: false },
    '砂纸':     { icon: '🧽', type: 'material', rarity: 1, desc: '打磨抛光工具。', usable: false },
    '古河床印石': { icon: '💎', type: 'material', rarity: 4, desc: '水流冲刷万年的极品印石。', usable: false },
    '青铜粉':   { icon: '⚱️', type: 'material', rarity: 3, desc: '带着青铜器锈迹的粉末。', usable: false },
    '篆刻刀':   { icon: '🔪', type: 'material', rarity: 2, desc: '锋利无比的铁刀。', usable: false },
    '防虫药粉': { icon: '🌿', type: 'material', rarity: 2, desc: '古籍修复的必备品。', usable: false },
    '陈年宣纸碎片': { icon: '📜', type: 'material', rarity: 3, desc: '能与古籍完美融合的老纸。', usable: false },
    '普通玉石': { icon: '💎', type: 'material', rarity: 2, desc: '未经雕琢的璞玉。', usable: false },
    '切割工具': { icon: '🔪', type: 'material', rarity: 2, desc: '解玉砂与锯子。', usable: false },
    '打磨工具': { icon: '🧽', type: 'material', rarity: 2, desc: '让玉石发光的兽皮。', usable: false },
    '古玉碎片': { icon: '💎', type: 'material', rarity: 4, desc: '墓葬中流出的神秘古玉。', usable: false },
    '天然生漆': { icon: '🎨', type: 'material', rarity: 3, desc: '漆树上割下的树汁，极易过敏。', usable: false },
    '贝壳碎屑': { icon: '🐚', type: 'material', rarity: 2, desc: '螺钿镶嵌的原料。', usable: false },
    '木盒':     { icon: '📦', type: 'material', rarity: 1, desc: '最普通的木制容器。', usable: false },
    '铜矿石':   { icon: '🪨', type: 'material', rarity: 2, desc: '青铜的骨。', usable: false },
    '锡矿石':   { icon: '🪨', type: 'material', rarity: 2, desc: '青铜的血。', usable: false },
    '古青铜碎片': { icon: '⚱️', type: 'material', rarity: 4, desc: '商周时期的青铜残件。', usable: false },
    '青铜范碎片': { icon: '⚱️', type: 'material', rarity: 3, desc: '古代铸造模具的残片。', usable: false },
    '青铜范':   { icon: '⚱️', type: 'material', rarity: 3, desc: '铸造用模具。', usable: false },
    '金矿石':   { icon: '🪨', type: 'material', rarity: 4, desc: '闪闪发光的原矿。', usable: false },
    '银矿石':   { icon: '🪨', type: 'material', rarity: 3, desc: '内敛的银白原矿。', usable: false },
    '古金碎片': { icon: '💰', type: 'material', rarity: 5, desc: '皇陵中带出的金箔。', usable: false },
    '珍珠':     { icon: '💎', type: 'material', rarity: 3, desc: '圆润的东珠。', usable: false },
    '鲛绡绳':   { icon: '🌊', type: 'material', rarity: 4, desc: '鲛人织成的细绳。', usable: false },
    '戏服碎布': { icon: '🎭', type: 'material', rarity: 3, desc: '名角儿戏服上撕下的布料。', usable: false },

    // ── 2. 半成品 (制造中的中间产物) ──
    '精制陶泥': { icon: '🟤', type: 'material', rarity: 2, desc: '经过过滤揉练的泥料。' },
    '冰霜陶泥': { icon: '🧊', type: 'material', rarity: 4, desc: '融合了晨露，触手生凉。' },
    '赤焰陶泥': { icon: '🔥', type: 'material', rarity: 3, desc: '入窑易发红。' },
    '古韵陶泥': { icon: '🏺', type: 'material', rarity: 4, desc: '自带千年古韵。' },
    '茶盏素坯': { icon: '🥣', type: 'material', rarity: 2, desc: '尚未施釉的毛坯。' },
    '雕花茶盏素坯': { icon: '🪵', type: 'material', rarity: 3, desc: '带有木雕印记。' },
    '如意茶盏素坯': { icon: '☁️', type: 'material', rarity: 4, desc: '窑变极品率极高。' },
    '青瓷梅瓶素坯': { icon: '🏺', type: 'material', rarity: 3, desc: '线条流畅的梅瓶。' },
    '宋韵梅瓶素坯': { icon: '🕰️', type: 'material', rarity: 4, desc: '仿佛来自南宋。' },
    '五彩绣线': { icon: '🧶', type: 'material', rarity: 2, desc: '草木染的绣线。' },
    '大红朱砂线': { icon: '🩸', type: 'material', rarity: 4, desc: '午时烈阳下的正红。' },
    '青岚蓝绣线': { icon: '🔵', type: 'material', rarity: 3, desc: '青山绿水之色。' },
    '栀子白绣线': { icon: '⚪', type: 'material', rarity: 3, desc: '百年不黄。' },
    '云锦面料': { icon: '🧵', type: 'material', rarity: 3, desc: '寸锦寸金。' },
    '孔雀云锦': { icon: '🦚', type: 'material', rarity: 5, desc: '闪烁如孔雀开屏。' },
    '日光云锦': { icon: '☀️', type: 'material', rarity: 4, desc: '自带金光。' },
    '皮影面料': { icon: '🎭', type: 'material', rarity: 2, desc: '刮制好的驴皮。' },
    '夜光皮影面料': { icon: '✨', type: 'material', rarity: 4, desc: '暗夜中幽幽发光。' },
    '机扩木骨': { icon: '🧩', type: 'material', rarity: 2, desc: '不用一根钉子的核心。' },
    '胡杨木骨': { icon: '🌵', type: 'material', rarity: 3, desc: '坚不可摧。' },
    '防腐木骨': { icon: '🛡️', type: 'material', rarity: 4, desc: '桐油浸透的木骨。' },
    '清心茶膏': { icon: '🍵', type: 'material', rarity: 2, desc: '点茶专用。' },
    '无根水茶膏': { icon: '💧', type: 'material', rarity: 4, desc: '灵气四溢。' },
    '竹韵茶膏': { icon: '🎋', type: 'material', rarity: 3, desc: '带竹叶清香。' },
    '竹浆纸浆': { icon: '📜', type: 'material', rarity: 2, desc: '洁白的纸浆。' },
    '檀香纸浆': { icon: '🪵', type: 'material', rarity: 3, desc: '防虫自带檀香。' },
    '晨露纸浆': { icon: '💧', type: 'material', rarity: 3, desc: '韧性极佳。' },
    '基础印石': { icon: '🪨', type: 'material', rarity: 2, desc: '打磨平整的石头。' },
    '灵韵印石': { icon: '💎', type: 'material', rarity: 4, desc: '有水波纹的古石。' },
    '青铜印石': { icon: '⚱️', type: 'material', rarity: 3, desc: '金石交击之声。' },
    '玉石原石': { icon: '💎', type: 'material', rarity: 2, desc: '刚切开的玉。' },
    '温润玉石': { icon: '💧', type: 'material', rarity: 3, desc: '水洗过的美玉。' },
    '古韵玉石': { icon: '🕰️', type: 'material', rarity: 4, desc: '带沁色的老玉。' },
    '基础漆料': { icon: '🎨', type: 'material', rarity: 2, desc: '调和好的大漆。' },
    '贝壳漆料': { icon: '🐚', type: 'material', rarity: 3, desc: '闪烁星点。' },
    '彩漆料':   { icon: '🌈', type: 'material', rarity: 3, desc: '颜色艳丽。' },
    '青铜锭':   { icon: '⚱️', type: 'material', rarity: 2, desc: '合金锭。' },
    '古青铜锭': { icon: '🕰️', type: 'material', rarity: 4, desc: '带远古配方的合金。' },
    '赤焰青铜锭': { icon: '🔥', type: 'material', rarity: 3, desc: '极度坚硬。' },
    '金锭':     { icon: '💰', type: 'material', rarity: 3, desc: '闪耀的黄金。' },
    '古金锭':   { icon: '🕰️', type: 'material', rarity: 5, desc: '纯度极高的老金。' },
    '日光金锭': { icon: '☀️', type: 'material', rarity: 4, desc: '午时淬火的金块。' },

    // ── 3. 终极天工造物成品 (可作为展示与图鉴) ──
    '素面青瓷': { icon: '🍵', type: 'crafted', rarity: 3, desc: '大道至简的龙泉青瓷。' },
    '曜变天目盏': { icon: '🌌', type: 'rare', rarity: 5, desc: '盏中蕴含宇宙星河，世间孤品。' },
    '异香波斯陶杯': { icon: '🏺', type: 'rare', rarity: 4, desc: '散发着永恒的西域异香。' },
    '珍珠青瓷盏': { icon: '💎', type: 'rare', rarity: 4, desc: '釉面如珍珠般散发柔光。' },
    '秘色青瓷盏': { icon: '✨', type: 'rare', rarity: 5, desc: '失传千年的秘色重现人间。' },
    '刻花青瓷梅瓶': { icon: '🏺', type: 'crafted', rarity: 3, desc: '刻有缠枝莲纹的优雅梅瓶。' },
    '描金青瓷梅瓶': { icon: '✨', type: 'rare', rarity: 5, desc: '青翠中闪烁着赤金光芒，皇家御用。' },
    '海韵青瓷梅瓶': { icon: '🌊', type: 'rare', rarity: 5, desc: '瓶身自带海浪波纹与水汽。' },
    '青铜纹瓷尊': { icon: '⚱️', type: 'crafted', rarity: 4, desc: '陶瓷与青铜的跨界结合。' },
    '商周纹瓷尊': { icon: '🪨', type: 'rare', rarity: 5, desc: '复刻了商周重器神韵的瓷器。' },
    
    '夜光幽梦扇': { icon: '✨', type: 'rare', rarity: 4, desc: '夜晚扇面会浮现发光图腾。' },
    '梨园雅韵扇': { icon: '🎭', type: 'rare', rarity: 4, desc: '挥舞间隐有昆曲唱腔。' },
    '古绣流云扇': { icon: '☁️', type: 'rare', rarity: 5, desc: '明代顶级绣法的复原。' },
    '云锦霞帔':   { icon: '👘', type: 'crafted', rarity: 4, desc: '华贵异常的明代服饰。' },
    '鲛绡云锦霞帔': { icon: '🌊', type: 'rare', rarity: 5, desc: '水火不侵的仙女羽衣。' },
    '梨园云锦霞帔': { icon: '🎭', type: 'rare', rarity: 5, desc: '万艺城名角儿专属定做。' },
    '关羽皮影':   { icon: '⚔️', type: 'crafted', rarity: 3, desc: '威风凛凛的皮影人偶。' },
    '青铜皮影':   { icon: '🪨', type: 'rare', rarity: 4, desc: '带有青铜质感的异类皮影。' },
    '古法皮影':   { icon: '🕰️', type: 'rare', rarity: 5, desc: '唐代皮影工艺的活化石。' },
    
    '木鸢':       { icon: '🦅', type: 'crafted', rarity: 3, desc: '鲁班工艺复刻的飞行器。' },
    '发条青鸟':   { icon: '🕊️', type: 'rare', rarity: 5, desc: '中西结合，会发出八音盒音乐。' },
    '琥珀木灵兽': { icon: '🦂', type: 'rare', rarity: 5, desc: '被封印着沙漠巨兽灵魂的木作。' },
    '灵竹木鸢':   { icon: '🎋', type: 'rare', rarity: 4, desc: '飞行时带出竹笛声。' },
    '望远木鸢':   { icon: '🔍', type: 'rare', rarity: 4, desc: '古代的无人侦察机。' },
    '基础鲁班锁': { icon: '🔒', type: 'crafted', rarity: 2, desc: '考验智力的六木结构。' },
    '铁骨鲁班锁': { icon: '⚒️', type: 'rare', rarity: 3, desc: '加装精铁，极难拆卸。' },
    '夜光鲁班锁': { icon: '✨', type: 'rare', rarity: 4, desc: '能在黑夜中发光。' },
    '皮影木架':   { icon: '🎭', type: 'crafted', rarity: 3, desc: '精美的皮影演出架。' },
    '机械皮影架': { icon: '⚙️', type: 'rare', rarity: 4, desc: '能自动调节高度的黑科技。' },
    '古式皮影架': { icon: '🕰️', type: 'rare', rarity: 4, desc: '唐代老物件复刻。' },
    '竹编花篮':   { icon: '🎋', type: 'crafted', rarity: 2, desc: '精美的竹编器皿。' },
    '彩编花篮':   { icon: '🌈', type: 'rare', rarity: 3, desc: '草木染色的绚丽竹篮。' },
    '鲛绡竹篮':   { icon: '🌊', type: 'rare', rarity: 4, desc: '内衬深海鲛绡的高级货。' },

    '古法醒神香': { icon: '🪔', type: 'crafted', rarity: 3, desc: '安神定志的线香。' },
    '霸王别姬惊梦香': { icon: '🎭', type: 'rare', rarity: 5, desc: '点燃后闻者落泪。' },
    '安神静心香': { icon: '🌙', type: 'rare', rarity: 4, desc: '助眠绝佳。' },
    '寒梅暗香':   { icon: '❄️', type: 'rare', rarity: 4, desc: '带有冬日凛冽香气。' },
    '基础香丸':   { icon: '💊', type: 'crafted', rarity: 3, desc: '随身携带的香球。' },
    '龙涎香丸':   { icon: '🐉', type: 'rare', rarity: 5, desc: '皇室御用级别的极品。' },
    '梨园香丸':   { icon: '🎭', type: 'rare', rarity: 4, desc: '带有胭脂脂粉的温柔香。' },
    '宋代点茶':   { icon: '🍵', type: 'crafted', rarity: 3, desc: '复刻大宋风雅的茶汤。' },
    '桂香点茶':   { icon: '🌼', type: 'rare', rarity: 4, desc: '甜蜜的秋日茶饮。' },
    '珍珠点茶':   { icon: '💎', type: 'rare', rarity: 5, desc: '美容养颜的宫廷茶。' },

    '古法宣纸':   { icon: '📜', type: 'crafted', rarity: 3, desc: '纸中之王。' },
    '古墨宣纸':   { icon: '✒️', type: 'rare', rarity: 4, desc: '自带墨香的黑纸。' },
    '彩宣':       { icon: '🎨', type: 'rare', rarity: 4, desc: '花汁染色的漂亮信纸。' },
    '普通印章':   { icon: '✒️', type: 'crafted', rarity: 2, desc: '文人雅士的落款。' },
    '古墨印章':   { icon: '🕰️', type: 'rare', rarity: 3, desc: '盖印时墨色古朴。' },
    '古法印章':   { icon: '📜', type: 'rare', rarity: 4, desc: '汉代印风重现。' },
    '修复宣纸':   { icon: '📜', type: 'crafted', rarity: 3, desc: '古籍修缮的利器。' },
    '古纸修复纸': { icon: '🕰️', type: 'rare', rarity: 5, desc: '与千年古籍完美融为一体。' },

    '玉坠':       { icon: '💍', type: 'crafted', rarity: 3, desc: '温润的随身玉饰。' },
    '鎏金玉坠':   { icon: '✨', type: 'rare', rarity: 5, desc: '金玉良缘的绝佳代表。' },
    '海韵玉坠':   { icon: '🌊', type: 'rare', rarity: 5, desc: '握在手中如临深海。' },
    '素面漆盒':   { icon: '📦', type: 'crafted', rarity: 3, desc: '深邃沉稳的黑色漆器。' },
    '描金漆盒':   { icon: '✨', type: 'rare', rarity: 5, desc: '华丽非凡的宫廷漆器。' },
    '墨色漆盒':   { icon: '✒️', type: 'rare', rarity: 4, desc: '极具文人风骨的文房具。' },

    '青铜小钟':   { icon: '🔔', type: 'crafted', rarity: 3, desc: '能敲出清脆古音。' },
    '鎏金青铜钟': { icon: '✨', type: 'rare', rarity: 5, desc: '皇家祭祀用重器。' },
    '商代青铜钟': { icon: '🪨', type: 'rare', rarity: 5, desc: '仿佛刚从殷墟中挖出。' },
    '金手镯':     { icon: '💍', type: 'crafted', rarity: 3, desc: '沉甸甸的纯金饰品。' },
    '珍珠金手镯': { icon: '💎', type: 'rare', rarity: 4, desc: '镶嵌着东珠的贵妇首饰。' },
    '鲛绡金手镯': { icon: '🌊', type: 'rare', rarity: 5, desc: '刚柔并济的跨界神作。' },
    // ... 前面是材料和造物成品，在最下面加上：

    // ── 4. 专属信物 (归入新的 💌 信物 标签) ──
    '王雪萍的感谢信': { 
        icon: '✉️', type: 'token', rarity: 4, 
        desc: '锦绣坊王雪萍匠师亲笔写下的信件，字迹娟秀。', 
        usable: true, actionName: '拆开信封', useFunc: 'readLetter',
        sender: '— 锦绣坊 王雪萍',
        letterContent: '游历者亲启：<br><br>那日得你相助，我用那古绣针试着绣了一幅牡丹，竟真的找回了师傅当年教我的神韵。<br><br>随信附上我亲手绣制的香囊，愿它能为你驱散九州的迷雾，护你一路周全。'
    },
    '张景春的青瓷令': {
        icon: '🔖', type: 'token', rarity: 5,
        desc: '一枚烧制着你名号的青瓷令牌，是张景春给知音的信物。',
        usable: true, actionName: '端详信物', useFunc: 'readLetter',
        sender: '— 龙泉窑 张景春',
        letterContent: '我这窑火烧了半辈子，见惯了来来往往的看客，却难得遇见懂它温度的人。<br><br>这枚青瓷令你收好，以后来百作镇，无论多晚，我的窑口都为你留一盏灯。'
    },
    '无名游侠的留言': {
        icon: '📝', type: 'token', rarity: 3,
        desc: '在祈福神树下捡到的一张便签。',
        usable: true, actionName: '阅读留言', useFunc: 'readLetter',
        sender: '— 九州过客 星渊',
        letterContent: '朋友，如果你看到这张纸条，说明你也卡在收集【沉香木料】的任务上了吧？<br><br>别去百作镇买，太贵了！去【森之低语】的西南角多转悠几圈，那里有隐藏的掉落点。祝你好运！'
    }
});

// =========================================================================
// 🌟 场景生态补丁：为 14 个大世界地图注入丰富的基础材料掉落
// =========================================================================
if (typeof sceneConfig !== 'undefined') {
    const addDrops = (scene, items) => {
        if (sceneConfig[scene] && sceneConfig[scene].exploration && sceneConfig[scene].exploration.ecology) {
            items.forEach(i => sceneConfig[scene].exploration.ecology.dropPool.push(i));
        }
    };

    addDrops('baizuozhen', [
        { icon:'🏺', itemName:'高岭陶土' }, { icon:'🪵', itemName:'沉香木料' },
        { icon:'🔪', itemName:'竹制刻刀' }, { icon:'⚪', itemName:'石灰' },
        { icon:'🎨', itemName:'天然生漆' }, { icon:'🧽', itemName:'砂纸' },
        { icon:'🔪', itemName:'切割工具' }, { icon:'🧽', itemName:'打磨工具' },
        { icon:'📦', itemName:'木盒' }, { icon:'🪨', itemName:'铜矿石' },
        { icon:'🪨', itemName:'锡矿石' }, { icon:'🪨', itemName:'普通印石' },
        { icon:'🔪', itemName:'篆刻刀' }, { icon:'🌿', itemName:'防虫药粉' }
    ]);

    addDrops('qinglanjie', [
        { icon:'💧', itemName:'清晨露水' }, { icon:'🔵', itemName:'蓝草汁液' },
        { icon:'🎋', itemName:'灵竹' }, { icon:'🎋', itemName:'灵竹篾' },
        { icon:'💧', itemName:'无根水' }, { icon:'💧', itemName:'灵竹露' },
        { icon:'🥢', itemName:'茶筅' }, { icon:'🌸', itemName:'梅花瓣' }
    ]);

    addDrops('wanyicheng', [
        { icon:'🧵', itemName:'戏服绣线' }, { icon:'🐴', itemName:'驴皮' },
        { icon:'🌿', itemName:'草木染料' }
    ]);

    addDrops('jinxiufang', [
        { icon:'🧵', itemName:'苏绣丝线' }, { icon:'⚪', itemName:'栀子花粉' },
        { icon:'🪡', itemName:'古绣针' }, { icon:'💰', itemName:'金线' },
        { icon:'👘', itemName:'云锦布料' }
    ]);

    addDrops('cangminghai', [
        { icon:'💧', itemName:'鲛人泪' }, { icon:'💎', itemName:'珍珠粉' },
        { icon:'🌊', itemName:'鲛绡断匹' }, { icon:'🐉', itemName:'龙涎香' },
        { icon:'🐚', itemName:'贝壳碎屑' }, { icon:'💎', itemName:'珍珠' },
        { icon:'🌊', itemName:'鲛绡绳' }
    ]);

    addDrops('senzhidiyu', [
        { icon:'🌿', itemName:'紫苏叶' }, { icon:'✨', itemName:'荧光孢子' },
        { icon:'🫙', itemName:'桐油' }, { icon:'🌼', itemName:'桂花蜜' },
        { icon:'🍯', itemName:'蜂蜜' }, { icon:'🌸', itemName:'花汁' }
    ]);

    addDrops('tongxiyu', [
        { icon:'🌶️', itemName:'西域香料' }, { icon:'🦚', itemName:'孔雀羽毛' },
        { icon:'🔍', itemName:'玻璃镜片' }, { icon:'🪨', itemName:'金矿石' },
        { icon:'🪨', itemName:'银矿石' }
    ]);

    addDrops('shahaiyicheng', [
        { icon:'🌵', itemName:'胡杨木' }, { icon:'🦂', itemName:'流沙琥珀' },
        { icon:'🪔', itemName:'安息香' }, { icon:'⚱️', itemName:'古青铜碎片' }
    ]);

    addDrops('ouluoba', [ { icon:'⚙️', itemName:'青铜齿轮' } ]);

    addDrops('midianzhijing', [
        { icon:'✒️', itemName:'古墨粉' }, { icon:'📜', itemName:'陈年宣纸碎片' },
        { icon:'🪵', itemName:'檀木灰' }, { icon:'🌾', itemName:'稻草纤维' },
        { icon:'💎', itemName:'古玉碎片' }, { icon:'💰', itemName:'古金碎片' },
        { icon:'🏺', itemName:'古陶碎片' }, { icon:'⚱️', itemName:'青铜范碎片' }
    ]);
}

