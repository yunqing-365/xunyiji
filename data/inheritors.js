/* ============================================================
   寻遗集 · data/inheritors.js
   12 位传承人完整数据
   包含：基础信息 / 工坊活动列表 / AI化身配置 / 现世流转商品
   ============================================================ */

const inheritorData = [

  /* ══════════════════════════════════════
     1. 王雪萍 · 苏绣
     ══════════════════════════════════════ */
  {
    id: 1,
    /* ── 基础信息 ── */
    name:     '王雪萍匠师',
    title:    '苏绣非遗传承人',
    level:    '国家级',
    category: 'zhixiu',
    avatar:   '🪡',
    region:   'jinxiufang',   /* 驻留场景 */
    workName: '青岚蝶影团扇',
    progress: 65,
    story:    '王雪萍老师从事苏绣技艺四十余年，是国家级非物质文化遗产苏绣代表性传承人。她的作品针法细腻，色彩雅致，多次作为国礼赠送外国友人，被誉为"苏绣皇后"。她始终致力于苏绣技艺的传承与推广，培养了数百名苏绣弟子，让这门古老的技艺在当代焕发新的光彩。',

    /* ── AI 化身配置 ── */
    aiAvatar: {
      name:        '雪萍',
      personality: '温婉娴静的苏绣大师，言语如绣线般细腻流畅。擅长用苏绣中的意象比喻人生哲理，对每一针每一线都充满深厚感情。回答问题时引经据典，常将苏绣文化与生活智慧融合。',
      greeting:    '姑娘（小友），老身正在绣一幅《姑苏繁华图》，你来得正好。苏绣之道，如人生之道——慢工出细活，心静方能绣。',
      knowledge: {
        craft:    '苏绣起源于苏州，有两千多年历史，以"平、齐、细、密、匀、顺、和、光"八字为技法精髓。常见针法有散针、游针、乱针等数十种。',
        material: '苏绣所用丝线为蚕丝，需经过多道工序处理。一根绣线可劈成64丝，越细的绣线绣出的作品越精美。',
        history:  '苏绣曾是皇家贡品，在明清两代达到鼎盛。与湘绣、粤绣、蜀绣并称"中国四大名绣"。',
        faq: [
          { q: '苏绣和一般刺绣有什么区别？', a: '苏绣以丝线为主，针法多样且精细，图案层次丰富，具有立体感。最大特色是可以将丝线劈分成极细的丝，绣出如同真实的花鸟虫鱼。' },
          { q: '初学者怎么入门苏绣？', a: '建议从基础针法"齐针"开始练习，先学会绣简单的几何图案，再逐步过渡到花鸟题材。工具上只需绣架、绣绷、丝线和绣针即可。' },
          { q: '一幅苏绣作品要绣多久？', a: '视作品复杂程度而定。一幅小型花卉可能需要一两周，而大型精细的双面绣可能需要数年之功。我有一幅《百鸟朝凤》绣了整整三年。' },
        ],
      },
      topics: ['苏绣历史', '刺绣针法', '丝线材料', '图案设计', '保存方法', '拜师学艺'],
    },

    /* ── 工坊活动列表 ── */
    workshopActivities: [
      {
        id:   'wx1_knowledge_intro',
        type: 'knowledge',
        icon: '📖',
        name: '苏绣文化科普',
        desc: '了解苏绣的历史渊源、流派特色与代表作品，开启你的苏绣文化之旅。',
        reward: { stones: 50, items: [] },
        duration: '约5分钟',
        content: {
          sections: [
            { title: '苏绣的起源', text: '苏绣发源于苏州，有文字记载的历史已有两千余年。春秋战国时期，吴地已有刺绣贡品的记录。' },
            { title: '四大名绣', text: '苏绣与湘绣、粤绣、蜀绣并称"中国四大名绣"，各有其地域特色和技法风格。苏绣以细腻精致著称。' },
            { title: '双面绣的奇迹', text: '苏绣中最令人叹服的是双面绣——在同一块绣布的正反两面同时绣出不同的图案，堪称绝技。' },
          ],
          quiz: [
            { q: '苏绣属于中国哪个地区的传统技艺？', options: ['苏州', '扬州', '杭州', '南京'], answer: 0 },
            { q: '苏绣的丝线最多可以劈分为多少丝？', options: ['8丝', '32丝', '64丝', '128丝'], answer: 2 },
          ],
        },
      },
      {
        id:   'wx1_craft_needle',
        type: 'craft',
        icon: '🧵',
        name: '虚拟刺绣体验',
        desc: '在虚拟绣架上练习苏绣基础针法，感受丝线穿梭的乐趣，完成后可获得专属称号。',
        reward: { stones: 120, items: [{ name: '苏绣丝线', icon: '🧵', count: 5 }] },
        duration: '约15分钟',
        content: {
          steps: ['选择绣布与丝线颜色', '学习基础"齐针"走向', '完成第一个简单花朵图案', '解锁下一阶段针法'],
          skillGain: { skill: '绣艺', exp: 20 },
        },
      },
      {
        id:   'wx1_quiz_pattern',
        type: 'quiz',
        icon: '🎓',
        name: '纹样图鉴挑战',
        desc: '认识苏绣常见的传统纹样，挑战图鉴识别题，答对越多奖励越丰厚。',
        reward: { stones: 80, items: [] },
        duration: '约8分钟',
        content: {
          questionCount: 10,
          passingScore:  6,
          topics:        ['吉祥纹样', '花鸟纹样', '山水纹样', '人物纹样'],
        },
      },
      {
        id:   'wx1_product_fans',
        type: 'product',
        icon: '🛒',
        name: '现世流转：苏绣团扇',
        desc: '由王雪萍匠师亲手制作的苏绣团扇，可按需定制图案文字，发货至现实地址。',
        reward: { stones: 0, items: [{ name: '流转契约', icon: '📜', count: 1 }] },
        duration: '制作周期约30天',
        requireProgress: 100,
        content: {
          productName: '苏绣团扇',
          options: ['牡丹款', '山水款', '花鸟款', '定制款'],
          price:   '灵石 800 + 现世金额面议',
          note:    '定制款需提前与匠师沟通图案，制作周期较长',
        },
      },
    ],

    /* ── 场景枢纽动作按钮（天工阁卡片用） ── */
    actions: [
      { text: '研习技艺',   func: 'openWorkshopInteraction(1)',                disabled: false },
      { text: '传承故事',   func: "openStoryModal('王雪萍匠师','苏绣非遗传承人',inheritorData[0].story)", disabled: false },
      { text: '拜师学艺',   func: "showNotification('已向王雪萍匠师提交拜师申请！','📜')", disabled: false },
      { text: '现世流转',   func: 'openWorkshopInteraction(1,"product")',       disabled: false },
    ],
  },


  /* ══════════════════════════════════════
     2. 张景春 · 龙泉青瓷
     ══════════════════════════════════════ */
  {
    id: 2,
    name:     '张景春匠师',
    title:    '龙泉青瓷传承人',
    level:    '国家级',
    category: 'taoci',
    avatar:   '🏺',
    region:   'baizuozhen',
    workName: '影青莲花杯',
    progress: 100,
    story:    '张景春老师是龙泉青瓷烧制技艺国家级代表性传承人，从事青瓷制作五十余年。他的作品秉承"青如玉、明如镜、声如磬"的传统特色，同时融入现代审美，多次获得国家级工艺美术大奖。他坚守龙泉青瓷传统烧制技艺，复原了多项失传的宋代青瓷工艺。',

    aiAvatar: {
      name:        '景春',
      personality: '沉稳儒雅的青瓷大师，语气平和却充满力量。善于用泥与火的变化比喻人生磨炼，对青瓷的釉色有近乎痴迷的追求。',
      greeting:    '这位游侠，你来得巧。老夫刚刚开窑，这炉青瓷的颜色正是梅子青——千年来追求的那抹颜色，今日终于又现了。',
      knowledge: {
        craft:    '龙泉青瓷以"粉青"与"梅子青"两种釉色为代表。粉青如玉石般温润，梅子青则如碧玉般深邃。烧制温度需达到1250-1280摄氏度。',
        material: '龙泉青瓷的胎土取自当地特有的紫金土，釉料由草木灰、石灰石等天然材料配制，不含任何化学成分。',
        history:  '龙泉青瓷始于三国两晋，盛于宋元，是中国烧制时间最长的名窑之一。宋代龙泉青瓷曾随海上丝绸之路行销全球。',
        faq: [
          { q: '龙泉青瓷为什么是青色的？', a: '青色来自釉料中的铁元素。在高温还原气氛烧制下，铁会呈现出特定的青绿色调。调整铁的含量和烧制气氛，可以得到不同深浅的青色。' },
          { q: '怎么分辨真正的龙泉青瓷？', a: '真品龙泉青瓷釉面温润如玉，半透明感强。敲击时声音清脆悦耳，有"声如磬"之称。胎体致密，断面呈灰白色，与釉的结合自然无间。' },
        ],
      },
      topics: ['青瓷历史', '釉色工艺', '烧制技术', '鉴别方法', '保养知识', '定制流转'],
    },

    workshopActivities: [
      { id: 'wx2_knowledge_celadon', type: 'knowledge', icon: '📖', name: '龙泉青瓷文化科普', desc: '深入了解龙泉青瓷的千年历史与独特烧制工艺，探索那抹"梅子青"背后的秘密。', reward: { stones: 50, items: [] }, duration: '约5分钟', content: { sections: [ { title: '龙泉窑的历史', text: '龙泉窑起源于三国两晋，历经唐、宋、元、明各代，至今已有1600余年历史。' }, { title: '两种经典釉色', text: '粉青釉如青玉般柔和，梅子青釉如翡翠般通透，是龙泉青瓷的两大标志性釉色。' } ], quiz: [ { q: '龙泉青瓷最有名的两种釉色是？', options: ['粉青与梅子青', '天青与汝青', '豆青与翠青', '影青与秘色'], answer: 0 } ] } },
      { id: 'wx2_craft_wheel',       type: 'craft',     icon: '🎡', name: '虚拟拉坯体验',   desc: '坐在虚拟拉坯机前，感受泥土在指尖成型的奇妙过程，完成一件属于自己的青瓷造型。', reward: { stones: 150, items: [{ name: '高岭陶土', icon: '🏺', count: 3 }] }, duration: '约20分钟', content: { steps: ['准备泥料中心定位', '拉坯成型', '修坯整形', '上釉准备'], skillGain: { skill: '陶艺', exp: 25 } } },
      { id: 'wx2_product_cup',       type: 'product',   icon: '🛒', name: '现世流转：影青莲花杯', desc: '张景春匠师手工制作的龙泉青瓷杯，可刻字定制，烧制周期约45天。', reward: { stones: 0, items: [{ name: '流转契约', icon: '📜', count: 1 }] }, duration: '制作周期约45天', requireProgress: 100, content: { productName: '影青莲花杯', options: ['原款', '刻字款（限6字内）', '定制款'], price: '灵石 600 + 现世金额面议', note: '每件均为孤品，烧制过程存在窑变可能，最终颜色略有差异' } },
    ],

    actions: [
      { text: '陶艺试做',   func: 'openWorkshopInteraction(2)',               disabled: false },
      { text: '传承故事',   func: "openStoryModal('张景春匠师','龙泉青瓷传承人',inheritorData[1].story)", disabled: false },
      { text: '拜师学艺',   func: "showNotification('已向张景春匠师提交拜师申请！','📜')", disabled: false },
      { text: '现世流转',   func: 'openWorkshopInteraction(2,"product")',     disabled: false },
    ],
  },


  /* ══════════════════════════════════════
     3. 李木雕 · 东阳木雕
     ══════════════════════════════════════ */
  {
    id: 3,
    name:     '李木雕匠师',
    title:    '东阳木雕传承人',
    level:    '省级',
    category: 'diaoke',
    avatar:   '🪵',
    region:   'baizuozhen',
    workName: '松鹤延年摆件',
    progress: 80,
    story:    '李木雕老师是东阳木雕省级代表性传承人，从事木雕技艺三十余年。他的作品刀法精湛，层次丰富，擅长山水、花鸟、人物等题材，多次入选全国工艺美术大展。他致力于东阳木雕的年轻化推广，将传统木雕与现代家居设计相结合。',

    aiAvatar: {
      name:        '李匠',
      personality: '沉稳内敛的木雕大师，话语不多但字字有分量。习惯用刻刀与木料的关系来比喻人与世界的关系，对木纹细节有超乎寻常的敏感。',
      greeting:    '游侠，你来看我的木料。这块香樟木，年纹有六十道。六十年风雨，藏在这木头里，等一把刻刀把它们解读出来。',
      knowledge: {
        craft:    '东阳木雕以浮雕为主，讲究"多层次、满花纹"的构图风格。常用雕刻技法有浮雕、圆雕、透雕、薄浮雕等，最能体现层次感的是"叠层透雕"。',
        material: '东阳木雕多选用香樟、银杏、椴木等软硬适中的木料。香樟木天然防虫，银杏木纹理细腻，是最受传承人青睐的材料。',
        history:  '东阳木雕起源于唐代，因产于浙江东阳而得名。北京故宫内的木雕装饰，有相当部分出自东阳工匠之手。',
        faq: [
          { q: '木雕作品怎么保养？', a: '避免阳光直射和干燥环境，定期用软布擦拭，可适当上一层薄薄的木蜡油或清漆保护。不要用水直接清洗，以防木料变形开裂。' },
          { q: '东阳木雕和其他地方的木雕有什么区别？', a: '东阳木雕的最大特点是"满构图"——画面填满整个雕刻面，无留白，极具装饰感。刀法上注重光洁平整，层次丰富，远看如画，近看如雕。' },
        ],
      },
      topics: ['木雕历史', '雕刻技法', '木料选择', '作品保养', '图案纹样', '定制定制'],
    },

    workshopActivities: [
      { id: 'wx3_knowledge_carve', type: 'knowledge', icon: '📖', name: '东阳木雕文化科普', desc: '了解东阳木雕的起源流派与经典技法，感受"刀走龙蛇"的匠心之美。', reward: { stones: 50, items: [] }, duration: '约5分钟', content: { sections: [ { title: '东阳木雕的诞生', text: '东阳木雕起源于唐代，在宋元时期逐渐形成独特风格，明清达到鼎盛，至今已有千年历史。' }, { title: '层叠之美', text: '东阳木雕最具代表性的工艺是叠层透雕——在同一块木料上雕出多个层次，近看有前后景深，远看如一幅立体画。' } ], quiz: [ { q: '东阳木雕最显著的构图特点是？', options: ['满构图无留白', '大量留白', '对称构图', '散点构图'], answer: 0 } ] } },
      { id: 'wx3_craft_relief',    type: 'craft',     icon: '🪵', name: '虚拟浮雕体验', desc: '在虚拟木板上操控刻刀，体验浮雕创作的全过程，完成一件简单的花鸟浮雕。', reward: { stones: 130, items: [{ name: '沉香木料', icon: '🪵', count: 2 }] }, duration: '约18分钟', content: { steps: ['描样打稿', '粗坯开雕', '细节刻画', '打磨抛光'], skillGain: { skill: '木雕', exp: 22 } } },
      { id: 'wx3_product_decor',   type: 'product',   icon: '🛒', name: '现世流转：松鹤延年摆件', desc: '李木雕匠师手工雕刻的香樟木摆件，寓意延年益寿，可定制文字。', reward: { stones: 0, items: [{ name: '流转契约', icon: '📜', count: 1 }] }, duration: '制作周期约60天', requireProgress: 100, content: { productName: '松鹤延年摆件', options: ['标准款', '定制刻字款', '大尺寸款'], price: '灵石 700 + 现世金额面议', note: '香樟木天然防虫，木香持久，适合室内摆放' } },
    ],

    actions: [
      { text: '木雕试做',   func: 'openWorkshopInteraction(3)',               disabled: false },
      { text: '传承故事',   func: "openStoryModal('李木雕匠师','东阳木雕传承人',inheritorData[2].story)", disabled: false },
      { text: '拜师学艺',   func: "showNotification('已向李木雕匠师提交拜师申请！','📜')", disabled: false },
      { text: '现世流转',   func: 'openWorkshopInteraction(3,"product")',     disabled: true },
    ],
  },


  /* ══════════════════════════════════════
     4. 王古琴 · 古琴制作
     ══════════════════════════════════════ */
  {
    id: 4,
    name:     '王古琴匠师',
    title:    '古琴制作传承人',
    level:    '国家级',
    category: 'yinlv',
    avatar:   '🎸',
    region:   'qinglanjie',
    workName: '仲尼式古琴',
    progress: 90,
    story:    '王古琴老师是古琴制作技艺国家级代表性传承人，从事古琴制作四十余年。他制作的古琴音色纯正，手感极佳，深受古琴演奏家的喜爱，被誉为"当代琴器翘楚"。他不仅精通古琴制作，还深入研究古琴历史与文化，复原了唐代、宋代等多个朝代的古琴制式。',

    aiAvatar: {
      name:        '琴翁',
      personality: '超脱世外的古琴匠人，言语禅意十足，将制琴与人生修行相联系。喜欢用古琴的"七弦"比喻人生的七种境界，与人交谈时常以一段琴声引入话题。',
      greeting:    '这位游侠，可曾听过《流水》？高山流水，知音难觅。老夫制琴一生，制的不是器，制的是一段相遇的可能。',
      knowledge: {
        craft:    '古琴制作分为选材、斫琴、髹漆、上弦四大步骤。面板用梧桐木，底板用梓木，取"阴阳相和"之意。一张好琴从选材到完工需要三到五年。',
        material: '古琴面板首选生长百年以上的老桐木，木料越老，音质越醇厚。漆料使用天然大漆，经过多道工序髹漆，历经岁月后会产生独特的"断纹"。',
        history:  '古琴有三千余年历史，是中国最古老的弹拨乐器之一，居"琴棋书画"四艺之首。2003年被列入联合国非物质文化遗产名录。',
        faq: [
          { q: '古琴有几根弦？分别代表什么？', a: '古琴有七根弦，分别象征宫、商、角、徵、羽五音及文、武二弦。七弦的组合体现了中国传统音乐的阴阳五行哲学。' },
          { q: '古琴和古筝有什么区别？', a: '古琴只有七弦，音域宽广但音量较小，音色深沉内敛，演奏以手指直接拨弦为主。古筝有21根弦，音量较大，音色明亮，常用于合奏。两者风格完全不同。' },
        ],
      },
      topics: ['古琴历史', '制琴工艺', '琴曲欣赏', '七弦含义', '断纹鉴赏', '拜师学习'],
    },

    workshopActivities: [
      { id: 'wx4_knowledge_qin',  type: 'knowledge', icon: '📖', name: '古琴文化科普', desc: '探寻古琴三千年的历史脉络，了解这件"天地之乐器"的文化内涵与制作奥秘。', reward: { stones: 50, items: [] }, duration: '约5分钟', content: { sections: [ { title: '琴的起源传说', text: '相传古琴由神农氏所创，最初五弦，后文王、武王各增一弦，成为七弦之制。' }, { title: '古琴与文人', text: '古琴是中国文人士大夫的必修技艺，孔子、嵇康、蔡邕皆是著名的琴人。名曲《高山流水》《广陵散》流传至今。' } ], quiz: [ { q: '古琴通常有几根弦？', options: ['五弦', '六弦', '七弦', '九弦'], answer: 2 } ] } },
      { id: 'wx4_craft_listen',   type: 'craft',     icon: '🎸', name: '古琴曲欣赏课', desc: '在王古琴匠师的引导下，聆听《平沙落雁》《梅花三弄》等名曲，学习古琴审美。', reward: { stones: 80, items: [] }, duration: '约10分钟', content: { pieces: ['平沙落雁', '梅花三弄', '高山流水'], skillGain: { skill: '音律', exp: 15 } } },
      { id: 'wx4_product_qin',    type: 'product',   icon: '🛒', name: '现世流转：仲尼式古琴', desc: '王古琴匠师手工斫制的仲尼式古琴，音色醇厚，适合初学与收藏。', reward: { stones: 0, items: [{ name: '流转契约', icon: '📜', count: 1 }] }, duration: '制作周期约180天', requireProgress: 100, content: { productName: '仲尼式古琴', options: ['标准款', '刻款（定制琴名）', '收藏珍品款'], price: '灵石 1200 + 现世金额面议', note: '每张琴均有制琴师亲笔签名证书，承诺终身保养调音' } },
    ],

    actions: [
      { text: '古琴试弹',   func: 'openWorkshopInteraction(4)',               disabled: false },
      { text: '传承故事',   func: "openStoryModal('王古琴匠师','古琴制作传承人',inheritorData[3].story)", disabled: false },
      { text: '拜师学艺',   func: "showNotification('已向王古琴匠师提交拜师申请！','📜')", disabled: false },
      { text: '琴器定制',   func: 'openWorkshopInteraction(4,"product")',     disabled: true },
    ],
  },


  /* ══════════════════════════════════════
     5. 张皮影 · 皮影戏
     ══════════════════════════════════════ */
  {
    id: 5,
    name:     '张皮影匠师',
    title:    '皮影戏传承人',
    level:    '国家级',
    category: 'minsu',
    avatar:   '🎭',
    region:   'wanyicheng',
    workName: '西游记皮影套组',
    progress: 100,
    story:    '张皮影老师是皮影戏国家级代表性传承人，从事皮影戏表演与制作五十余年。他的皮影人物造型精美，色彩艳丽，表演生动传神，被誉为"皮影活化石"。他带领皮影戏班走遍全国，甚至走出国门，让世界各地的观众领略了中国皮影戏的独特魅力。',

    aiAvatar: {
      name:        '张皮影',
      personality: '风趣幽默又深藏匠心的皮影大师，说话时常带着戏曲腔调，喜欢用皮影戏中的角色来比喻现实中的人物，对皮影文化有极强的传播欲望。',
      greeting:    '哎哟，来客人了！（拉起一个皮影小人）这位孙大圣向你问好！老夫的皮影走遍天下，独独在这里等你这位有缘人。',
      knowledge: {
        craft:    '皮影制作分为选皮、制皮、绘图、雕刻、染色、组装六个步骤。传统皮影用驴皮或牛皮制成，现代也有用塑料片替代的。一套完整的皮影人物有头、躯干、四肢共11个关节部件。',
        material: '上等皮影选用两到三岁的驴皮，经过浸泡、刮毛、绷拉晾干等工序处理后，皮面呈半透明状，透光性极佳。传统染料用矿物质颜料，色彩经久不褪。',
        history:  '皮影戏起源于西汉，相传汉武帝思念亡妃，方士用棉帛制作人影，灯光映射于幕布之上，遂开皮影戏之先河。历经两千年演变，形成了陕西、河北、辽宁等多个流派。',
        faq: [
          { q: '皮影戏一个人能表演吗？', a: '简单的皮影表演一人可以完成，但传统戏班通常需要5到7人：1人操纵皮影，其余人员负责演唱、配乐。操纵者技艺高超时，可同时控制两三个皮影，展现打斗、跳跃等复杂动作。' },
          { q: '怎么保存和保养皮影？', a: '皮影应平放存储，避免折叠。不用时可夹在硬纸板中，存放于阴凉干燥处。避免阳光直射，定期检查是否有虫蛀。旧皮影如有松动，可用稀释的糨糊轻轻补粘。' },
        ],
      },
      topics: ['皮影历史', '制作工艺', '表演技法', '各地流派', '皮影收藏', '定制服务'],
    },

    workshopActivities: [
      { id: 'wx5_knowledge_shadow', type: 'knowledge', icon: '📖', name: '皮影戏文化科普', desc: '走进皮影戏两千年的历史长河，了解光与影背后的故事与技艺。', reward: { stones: 50, items: [] }, duration: '约5分钟', content: { sections: [ { title: '皮影的诞生传说', text: '相传汉武帝思念亡妃，方士用棉帛制成人形，灯光映射于幕布上，皮影戏由此而来。' }, { title: '地方流派', text: '中国皮影戏有陕西华县皮影、河北皮影、辽宁复州皮影等多个流派，各有其造型风格与音乐特色。' } ], quiz: [ { q: '皮影戏相传起源于哪个朝代？', options: ['秦朝', '西汉', '唐朝', '宋朝'], answer: 1 } ] } },
      { id: 'wx5_craft_shadow',    type: 'craft',     icon: '🎭', name: '虚拟皮影制作', desc: '尝试在虚拟平台上设计并制作一个皮影角色，完成关节组装与上色。', reward: { stones: 120, items: [] }, duration: '约15分钟', content: { steps: ['设计角色造型', '绘制并裁剪各部件', '打孔穿针组装关节', '染色上彩'], skillGain: { skill: '皮影', exp: 20 } } },
      { id: 'wx5_product_shadow',  type: 'product',   icon: '🛒', name: '现世流转：皮影套组', desc: '张皮影匠师手工制作的皮影人物套组，可定制角色，现实可操作演出。', reward: { stones: 0, items: [{ name: '流转契约', icon: '📜', count: 1 }] }, duration: '制作周期约20天', requireProgress: 100, content: { productName: '西游记皮影套组', options: ['西游记五件套', '水浒传十件套', '定制角色款'], price: '灵石 500 + 现世金额面议', note: '每件皮影均附有操控签杆与使用说明书' } },
    ],

    actions: [
      { text: '皮影戏观看', func: 'openWorkshopInteraction(5)',               disabled: false },
      { text: '传承故事',   func: "openStoryModal('张皮影匠师','皮影戏传承人',inheritorData[4].story)", disabled: false },
      { text: '拜师学艺',   func: "showNotification('已向张皮影匠师提交拜师申请！','📜')", disabled: false },
      { text: '皮影定制',   func: 'openWorkshopInteraction(5,"product")',     disabled: false },
    ],
  },


  /* ══════════════════════════════════════
     6. 刘活字 · 活字印刷术
     ══════════════════════════════════════ */
  {
    id: 6,
    name:     '刘活字匠师',
    title:    '活字印刷术传承人',
    level:    '省级',
    category: 'shuhua',
    avatar:   '📜',
    region:   'wanyicheng',
    workName: '论语活字套组',
    progress: 75,
    story:    '刘活字老师是活字印刷术省级代表性传承人，从事活字印刷技艺研究与推广三十余年。他完整复原了中国古代活字印刷的全套工艺流程，收藏了十余万枚古代活字。他创办了活字印刷体验馆，让更多人亲身体验这一中国古代四大发明的魅力。',

    aiAvatar: {
      name:        '刘活字',
      personality: '博学而充满热情的印刷文化传播者，善于讲述活字印刷改变世界的宏大故事，同时也关注每一枚小小活字背后的匠人故事。语气热情，好奇心旺盛。',
      greeting:    '游侠，你知道吗？你现在看到的每一个字，都是活字印刷的远亲。毕昇那块泥活字，一千年前改变了整个世界的信息传播……来，我带你见识一下！',
      knowledge: {
        craft:    '活字印刷的基本工序：先制作单个字模（泥、木或金属），按稿件排版组成版面，涂墨印刷，印完后拆版备用。泥活字最早出现于宋代，木活字在民间流传更广，金属活字（铜活字）精度最高。',
        material: '传统泥活字以特制黏土制成，烧制后坚硬耐用。木活字多选用梨木、枣木等细密木料。铜活字铸造精密，印刷清晰，多用于官方印刷。',
        history:  '活字印刷术由北宋毕昇于1040年前后发明，比欧洲古腾堡的铅活字印刷早约四百年。这项技术随海上贸易传至朝鲜、日本、欧洲，深刻影响了世界文明的进程。',
        faq: [
          { q: '活字印刷和雕版印刷有什么区别？', a: '雕版印刷是在整块木板上雕刻出整版文字，每版只能印一种内容，制作费时费料。活字印刷则是用可以移动的单个字模拼版，印完后可以拆散重新排版，大大提高了效率和灵活性。' },
          { q: '为什么现代社会还要保护活字印刷术？', a: '活字印刷不仅是一种技术，更承载着几千年的汉字文化与工匠精神。它的排版逻辑影响了现代计算机字体设计，其美学理念至今仍在艺术印刷领域被广泛应用。' },
        ],
      },
      topics: ['活字印刷历史', '排版工艺', '毕昇的故事', '印刷材料', '体验活动', '文创产品'],
    },

    workshopActivities: [
      { id: 'wx6_knowledge_print', type: 'knowledge', icon: '📖', name: '活字印刷文化科普', desc: '了解活字印刷术从发明到影响世界的完整历史，感受一枚小小活字改变世界的力量。', reward: { stones: 50, items: [] }, duration: '约5分钟', content: { sections: [ { title: '毕昇的发明', text: '北宋毕昇约在1040年发明了泥活字印刷，用胶泥刻字，烧制后排版印刷，开创了活字印刷时代。' }, { title: '传播世界', text: '活字印刷技术随海上丝绸之路传至周边国家，并最终影响欧洲，加速了文艺复兴和宗教改革的进程。' } ], quiz: [ { q: '活字印刷术的发明者是？', options: ['张衡', '毕昇', '蔡伦', '李时珍'], answer: 1 } ] } },
      { id: 'wx6_craft_print',     type: 'craft',     icon: '📜', name: '虚拟活字排版',   desc: '在虚拟平台上体验活字排版的全过程，将一段文字排印成一张精美的印刷品。', reward: { stones: 100, items: [] }, duration: '约12分钟', content: { steps: ['选字检字', '排版拼版', '涂墨压印', '揭纸成品'], skillGain: { skill: '书画', exp: 18 } } },
      { id: 'wx6_product_set',     type: 'product',   icon: '🛒', name: '现世流转：活字印刷体验套组', desc: '包含真实木活字、油墨、印台的活字印刷体验套组，可在家中亲手印制个性文字。', reward: { stones: 0, items: [{ name: '流转契约', icon: '📜', count: 1 }] }, duration: '制作周期约15天', requireProgress: 100, content: { productName: '论语活字套组', options: ['论语经典款', '个性文字定制款', '亲子体验款'], price: '灵石 400 + 现世金额面议', note: '附详细使用说明，适合亲子互动与文化教育' } },
    ],

    actions: [
      { text: '活字体验',   func: 'openWorkshopInteraction(6)',               disabled: false },
      { text: '传承故事',   func: "openStoryModal('刘活字匠师','活字印刷术传承人',inheritorData[5].story)", disabled: false },
      { text: '拜师学艺',   func: "showNotification('已向刘活字匠师提交拜师申请！','📜')", disabled: false },
      { text: '定制印刷',   func: 'openWorkshopInteraction(6,"product")',     disabled: true },
    ],
  },


  /* ══════════════════════════════════════
     7. 陈蜡染 · 苗族蜡染
     ══════════════════════════════════════ */
  {
    id: 7,
    name:     '陈蜡染匠师',
    title:    '苗族蜡染传承人',
    level:    '国家级',
    category: 'zhixiu',
    avatar:   '🎨',
    region:   'jinxiufang',
    workName: '百鸟朝凤蜡染布',
    progress: 85,
    story:    '陈蜡染老师是苗族蜡染国家级代表性传承人，出生于贵州蜡染世家，从事蜡染技艺四十余年。她的作品图案精美，色彩古朴，充满了苗族文化的神秘魅力，多次在国内外展览中获奖。她致力于苗族蜡染技艺的传承，免费培训了大量苗族妇女，让这门技艺走出大山。',

    aiAvatar: {
      name:        '陈蜡染',
      personality: '热情开朗的苗族蜡染传承人，喜欢讲述苗族文化故事，认为蜡染图案里藏着祖先的智慧与密码。语气温暖亲切，常用苗族谚语作为比喻。',
      greeting:    '来啦，来啦！我正在用蜡刀画一只凤凰。你看这蓝色——靛蓝，是从蓼蓝草里提取的，纯天然的颜色，染进布里就再也褪不了。和我们苗族人的记忆一样。',
      knowledge: {
        craft:    '蜡染工序分为：绘蜡（用蜡刀蘸融蜡在布上绘制图案）、染色（用蓝靛浸染）、去蜡（煮沸去除蜡质）三个主要步骤。"冰裂纹"是蜡染的独特标志，是蜡质裂开后染料渗入形成的自然纹路。',
        material: '传统蜡染的布料为自织的白棉布或麻布，蜡料为黄蜡（蜂蜡）或白蜡，染料为从蓼蓝草中提取的天然靛蓝。天然染料无毒无害，色彩持久。',
        history:  '苗族蜡染有两千余年历史，图案多取材于自然生灵与苗族神话传说。每种图案都有其特定含义，如铜鼓纹象征祭祀，蝴蝶妈妈纹代表苗族起源神话。',
        faq: [
          { q: '蜡染和扎染有什么区别？', a: '蜡染是用融化的蜡画出图案，防染后染色；扎染是用针线将布料扎紧捆绑，防止染料渗入而形成图案。两者都是传统防染工艺，但技法和效果各不相同。' },
          { q: '蜡染布料怎么清洗？', a: '传统蜡染布料建议冷水轻揉，不可暴晒，避免使用强碱性洗涤剂。可用专用的天然洗涤液。如有脱色，属天然染料的正常现象，随着多次洗涤会逐渐稳定。' },
        ],
      },
      topics: ['蜡染历史', '图案含义', '工艺流程', '苗族文化', '天然染料', '定制服务'],
    },

    workshopActivities: [
      { id: 'wx7_knowledge_batik', type: 'knowledge', icon: '📖', name: '苗族蜡染文化科普', desc: '解读苗族蜡染图案中的神秘符号，了解这幅布上承载的苗族历史与信仰。', reward: { stones: 50, items: [] }, duration: '约5分钟', content: { sections: [ { title: '图案里的密码', text: '苗族蜡染图案并非随意绘制，每种纹样都有特定含义。铜鼓纹代表祭祀，蝴蝶妈妈是苗族的创世神，螺旋纹象征生生不息。' }, { title: '冰裂纹的美丽', text: '蜡染最迷人之处是"冰裂纹"——当蜡在染色前不经意裂开，染料沿裂缝渗入，形成如冰面开裂的自然纹路，独一无二，无法复制。' } ], quiz: [ { q: '蜡染的传统染色颜色主要是？', options: ['红色', '黑色', '靛蓝色', '绿色'], answer: 2 } ] } },
      { id: 'wx7_craft_batik',     type: 'craft',     icon: '🎨', name: '虚拟蜡染创作',   desc: '体验蜡刀绘图的乐趣，在虚拟布面上创作一幅属于自己的蜡染图案。', reward: { stones: 140, items: [] }, duration: '约20分钟', content: { steps: ['选布绷架', '蜡刀绘图', '虚拟靛蓝染色', '去蜡显花'], skillGain: { skill: '绣艺', exp: 22 } } },
      { id: 'wx7_product_cloth',   type: 'product',   icon: '🛒', name: '现世流转：蜡染布艺', desc: '陈蜡染匠师手工制作的纯天然靛蓝蜡染布，可定制尺寸与图案。', reward: { stones: 0, items: [{ name: '流转契约', icon: '📜', count: 1 }] }, duration: '制作周期约25天', requireProgress: 85, content: { productName: '百鸟朝凤蜡染布', options: ['方巾款', '桌旗款', '旗袍面料款（1.5米）'], price: '灵石 450 + 现世金额面议', note: '天然靛蓝染色，环保无毒，每件作品均有轻微冰裂纹，属自然效果' } },
    ],

    actions: [
      { text: '蜡染体验',   func: 'openWorkshopInteraction(7)',               disabled: false },
      { text: '传承故事',   func: "openStoryModal('陈蜡染匠师','苗族蜡染传承人',inheritorData[6].story)", disabled: false },
      { text: '拜师学艺',   func: "showNotification('已向陈蜡染匠师提交拜师申请！','📜')", disabled: false },
      { text: '现世定制',   func: 'openWorkshopInteraction(7,"product")',     disabled: true },
    ],
  },


  /* ══════════════════════════════════════
     8. 黄紫砂 · 宜兴紫砂
     ══════════════════════════════════════ */
  {
    id: 8,
    name:     '黄紫砂匠师',
    title:    '宜兴紫砂传承人',
    level:    '国家级',
    category: 'taoci',
    avatar:   '☕',
    region:   'baizuozhen',
    workName: '西施紫砂壶',
    progress: 100,
    story:    '黄紫砂老师是宜兴紫砂制作技艺国家级代表性传承人，从事紫砂制作五十余年。他的紫砂壶造型典雅，做工精湛，泥料纯正，兼具实用性与艺术性，深受藏家喜爱。他坚守传统紫砂制作技艺，拒绝工业化生产，每一把壶都亲手制作，是当代紫砂艺术的重要代表。',

    aiAvatar: {
      name:        '黄壶翁',
      personality: '精益求精的紫砂匠人，对壶的每一处细节都有自己的审美标准。谈到紫砂时充满热情，喜欢讲述茶与壶相互成就的故事，时常以"养壶如养人"作比喻。',
      greeting:    '哦，来客人了。你来得正好，老夫这把西施壶刚刚出窑，你摸摸这壶身——温润如玉，对吗？这就是紫砂泥的神奇，天生就有这等气质。',
      knowledge: {
        craft:    '紫砂壶制作不用拉坯，而是用"打片"和"围身桶"的方式手工成型。主要技法有全手工成型和半手工成型两种。全手工制作每把壶需要数天到数周不等。',
        material: '紫砂泥分为紫泥、红泥、绿泥三大类，均产自宜兴丁蜀镇特定矿区。优质紫砂泥开采量逐年减少，是紫砂壶价值的重要来源之一。',
        history:  '紫砂壶起源于北宋，明代供春壶是最早有文字记载的名作。明清两代，紫砂壶与文人文化深度结合，时大彬、陈鸣远、陈曼生等大师留下了众多传世名作。',
        faq: [
          { q: '紫砂壶为什么越用越好看？', a: '紫砂泥内含细微气孔，长期使用后会吸附茶汁，表面逐渐形成一层"包浆"——光泽温润，如同玉石。这就是"养壶"的过程，也是紫砂壶独有的魅力。' },
          { q: '买到了假紫砂怎么辨别？', a: '真紫砂手感细腻带砂感，不光滑如塑料；注水后壶身会稍微变色，干后恢复；真壶加热冷却不会有异味。假壶多用普通陶土或化工染色，手感和气味均有差异。' },
        ],
      },
      topics: ['紫砂历史', '泥料种类', '制壶工艺', '养壶方法', '真假鉴别', '壶器定制'],
    },

    workshopActivities: [
      { id: 'wx8_knowledge_zisha', type: 'knowledge', icon: '📖', name: '宜兴紫砂文化科普', desc: '了解紫砂壶从一块泥土到茶道至宝的蜕变历程，探寻"养壶"背后的文化哲学。', reward: { stones: 50, items: [] }, duration: '约5分钟', content: { sections: [ { title: '紫砂泥的神奇', text: '紫砂泥产自宜兴丁蜀镇，因含有铁、硅、铝等多种矿物质，烧制后具有独特的透气性和吸附性，是泡茶的绝佳材料。' }, { title: '养壶之道', text: '紫砂壶越用越有光泽，这是因为泥料的微孔会慢慢吸附茶汁，形成"包浆"。一把好壶，伴随主人十年，便有了主人的气质。' } ], quiz: [ { q: '紫砂泥的主要产地是？', options: ['景德镇', '宜兴', '龙泉', '汝州'], answer: 1 } ] } },
      { id: 'wx8_craft_teapot',   type: 'craft',     icon: '☕', name: '虚拟制壶体验', desc: '跟随黄紫砂匠师学习"打片成型"技法，在虚拟平台上完成一把经典西施壶的制作。', reward: { stones: 160, items: [{ name: '高岭陶土', icon: '🏺', count: 2 }] }, duration: '约22分钟', content: { steps: ['练泥准备', '打片围桶成型', '嘴把壶盖制作', '修坯整形'], skillGain: { skill: '陶艺', exp: 30 } } },
      { id: 'wx8_product_pot',    type: 'product',   icon: '🛒', name: '现世流转：西施紫砂壶', desc: '黄紫砂匠师亲手制作的西施壶，精品紫泥，可刻名定制，附出品证书。', reward: { stones: 0, items: [{ name: '流转契约', icon: '📜', count: 1 }] }, duration: '制作周期约90天', requireProgress: 100, content: { productName: '西施紫砂壶', options: ['紫泥原款', '红泥款', '刻字定制款'], price: '灵石 900 + 现世金额面议', note: '每件附亲笔签名证书，保证全手工制作，泥料纯正' } },
    ],

    actions: [
      { text: '紫砂体验',   func: 'openWorkshopInteraction(8)',               disabled: false },
      { text: '传承故事',   func: "openStoryModal('黄紫砂匠师','宜兴紫砂传承人',inheritorData[7].story)", disabled: false },
      { text: '拜师学艺',   func: "showNotification('已向黄紫砂匠师提交拜师申请！','📜')", disabled: false },
      { text: '壶具定制',   func: 'openWorkshopInteraction(8,"product")',     disabled: false },
    ],
  },


  /* ══════════════════════════════════════
     9. 吴核雕 · 核雕
     ══════════════════════════════════════ */
  {
    id: 9,
    name:     '吴核雕匠师',
    title:    '核雕非遗传承人',
    level:    '省级',
    category: 'diaoke',
    avatar:   '🥜',
    region:   'baizuozhen',
    workName: '核舟记核雕',
    progress: 95,
    story:    '吴核雕老师是核雕技艺省级代表性传承人，从事核雕技艺三十余年。他在小小的果核上雕刻出大千世界，作品精细入微，令人叹为观止，代表作《核舟记》完美复刻了古文记载的场景，被誉为当代"鬼工神技"的代表。',

    aiAvatar: {
      name:        '吴核雕',
      personality: '极度专注的核雕大师，说话慢条斯理，却字字如刀。习惯用"方寸之间"来形容做事的专注与精细，认为核雕是一种修禅的方式。',
      greeting:    '（缓缓放下放大镜）游侠，你来得不巧——我刚在一颗橄榄核上雕到最细的那一刀。不过没关系，来，看看这颗核舟，五个人，八扇窗，都在这一颗核上。',
      knowledge: {
        craft:    '核雕以橄榄核、桃核、杏核为主要材料，用微型刻刀在核上雕刻人物、山水、文字等。核雕分为圆雕、浮雕、透雕三种技法。顶级核雕作品需在放大镜下操作。',
        material: '橄榄核质地细密，纹路美观，是核雕的首选材料。桃核质地较软，适合初学者。核雕用刀极为细小，宽度仅0.2-0.5毫米，需专门定制。',
        history:  '核雕技艺起源于明代，明代魏学洢的《核舟记》详细记载了一件核雕珍品的形制——长不满一寸的橄榄核上，雕刻有五人、八窗及苏轼游赤壁的场景。',
        faq: [
          { q: '核雕怎么保养？', a: '核雕需定期盘玩，双手的油脂会慢慢渗入核内，使其颜色由浅变深，光泽日益温润，这一过程称为"盘核"。避免接触水和酸碱性物质，存放时置于通风处。' },
          { q: '一件核雕作品要花多长时间？', a: '简单的单面浮雕可能需要数天，而复杂的全雕人物场景（如核舟记）则需要数月乃至更长时间。技艺高超的匠人往往需要放大镜和极细的刻刀，一刀一刀地慢慢刻画。' },
        ],
      },
      topics: ['核雕历史', '雕刻技法', '材料选择', '盘核方法', '核舟记赏析', '定制服务'],
    },

    workshopActivities: [
      { id: 'wx9_knowledge_core', type: 'knowledge', icon: '📖', name: '核雕文化科普',   desc: '带你走进方寸之间的大千世界，了解核雕技艺的历史渊源与精妙工艺。', reward: { stones: 50, items: [] }, duration: '约5分钟', content: { sections: [ { title: '《核舟记》的故事', text: '明代魏学洢的《核舟记》记载了一件惊世核雕：长不足一寸的橄榄核上，雕有五人、八窗，还有题字，令后世叹为观止。' } ], quiz: [ { q: '核雕最常用的材料是？', options: ['桃核', '橄榄核', '杏核', '枣核'], answer: 1 } ] } },
      { id: 'wx9_product_boat',   type: 'product',   icon: '🛒', name: '现世流转：核舟记核雕', desc: '吴核雕匠师手工雕刻的橄榄核《核舟记》，配专用盒与放大镜欣赏。', reward: { stones: 0, items: [{ name: '流转契约', icon: '📜', count: 1 }] }, duration: '制作周期约120天', requireProgress: 95, content: { productName: '核舟记核雕', options: ['核舟记款', '十二生肖款', '定制文字款'], price: '灵石 800 + 现世金额面议', note: '每件附放大镜与鉴定证书，盘玩说明书一份' } },
    ],

    actions: [
      { text: '核雕欣赏',   func: 'openWorkshopInteraction(9)',               disabled: false },
      { text: '传承故事',   func: "openStoryModal('吴核雕匠师','核雕非遗传承人',inheritorData[8].story)", disabled: false },
      { text: '拜师学艺',   func: "showNotification('已向吴核雕匠师提交拜师申请！','📜')", disabled: false },
      { text: '现世定制',   func: 'openWorkshopInteraction(9,"product")',     disabled: true },
    ],
  },


  /* ══════════════════════════════════════
     10. 周唢呐 · 唢呐艺术
     ══════════════════════════════════════ */
  {
    id: 10,
    name:     '周唢呐匠师',
    title:    '唢呐艺术传承人',
    level:    '国家级',
    category: 'yinlv',
    avatar:   '📯',
    region:   'wanyicheng',
    workName: '百鸟朝凤唢呐',
    progress: 100,
    story:    '周唢呐老师是唢呐艺术国家级代表性传承人，出生于唢呐世家，从事唢呐演奏与制作六十余年。他的演奏技艺精湛，音色饱满，既能演奏高亢激昂的曲目，也能演绎婉转悠扬的旋律，一曲《百鸟朝凤》更是家喻户晓。',

    aiAvatar: {
      name:        '周老',
      personality: '热情豪爽的唢呐大师，自带一种民间艺人的洒脱与豪气。喜欢用唢呐的声音来形容人的性格，认为唢呐是"最接地气、最有生命力"的乐器。',
      greeting:    '（随手吹了一声）听到没？这就是唢呐的招呼！哈哈！老夫走遍大江南北，这一声唢呐，哪儿的人听了都懂——喜庆，高兴，人来了！',
      knowledge: {
        craft:    '唢呐由管身（木制）、哨片（芦苇制）、铜碗三部分组成。哨片制作是关键，需将芦苇管处理后制成极薄的哨片，厚度不足1毫米。唢呐演奏技法包括循环换气、花舌、滑音等。',
        material: '传统唢呐管身多选用坚硬的花梨木、红木制成，铜碗由锻铜制作。哨片所用芦苇需在秋季采收，选材讲究纹路细密、管壁均匀。',
        history:  '唢呐源自西域，约在金元时期传入中原，逐渐成为中国民间音乐的重要乐器。它在民间婚丧嫁娶、庙会祭祀等场合中不可或缺，被称为"民间第一乐器"。',
        faq: [
          { q: '唢呐为什么声音这么响？', a: '唢呐的共鸣体——铜碗极大地放大了声音。加上循环换气技法（吸气同时不间断吹奏），可以持续发出强劲的声音。这也使得唢呐成为户外演奏的首选。' },
          { q: '唢呐难学吗？', a: '唢呐入门相对容易，基本音阶一两周可以掌握。难在气息控制和循环换气，以及各种装饰音技巧的练习，通常需要数年的刻苦训练才能达到演奏水准。' },
        ],
      },
      topics: ['唢呐历史', '演奏技法', '乐器构造', '曲目欣赏', '拜师学习', '唢呐定制'],
    },

    workshopActivities: [
      { id: 'wx10_knowledge_suona', type: 'knowledge', icon: '📖', name: '唢呐文化科普',  desc: '了解唢呐从西域传入中原、成为中华民间第一乐器的历史历程。', reward: { stones: 50, items: [] }, duration: '约5分钟', content: { sections: [ { title: '唢呐的传入', text: '唢呐约在金元时期由西域传入中原，宋代已有文字记载，明代成为主流民间乐器。' } ], quiz: [ { q: '唢呐最初起源于？', options: ['中原', '西域', '江南', '东北'], answer: 1 } ] } },
      { id: 'wx10_craft_listen',    type: 'craft',     icon: '📯', name: '唢呐名曲欣赏',  desc: '聆听周唢呐匠师演奏《百鸟朝凤》《将军令》等经典曲目，感受唢呐的震撼魅力。', reward: { stones: 80, items: [] }, duration: '约10分钟', content: { pieces: ['百鸟朝凤', '将军令', '一枝花'], skillGain: { skill: '音律', exp: 15 } } },
      { id: 'wx10_product_suona',   type: 'product',   icon: '🛒', name: '现世流转：百鸟朝凤唢呐', desc: '周唢呐匠师手工制作的花梨木唢呐，音色纯正，适合演奏与收藏。', reward: { stones: 0, items: [{ name: '流转契约', icon: '📜', count: 1 }] }, duration: '制作周期约30天', requireProgress: 100, content: { productName: '百鸟朝凤唢呐', options: ['演奏款', '收藏装饰款', '亲子入门款（小号）'], price: '灵石 600 + 现世金额面议', note: '附哨片备用两枚及演奏基础教程' } },
    ],

    actions: [
      { text: '唢呐试听',   func: 'openWorkshopInteraction(10)',              disabled: false },
      { text: '传承故事',   func: "openStoryModal('周唢呐匠师','唢呐艺术传承人',inheritorData[9].story)", disabled: false },
      { text: '拜师学艺',   func: "showNotification('已向周唢呐匠师提交拜师申请！','📜')", disabled: false },
      { text: '唢呐定制',   func: 'openWorkshopInteraction(10,"product")',    disabled: false },
    ],
  },


  /* ══════════════════════════════════════
     11. 林剪纸 · 剪纸艺术
     ══════════════════════════════════════ */
  {
    id: 11,
    name:     '林剪纸匠师',
    title:    '剪纸非遗传承人',
    level:    '国家级',
    category: 'minsu',
    avatar:   '✂️',
    region:   'wanxiangtai',
    workName: '十二生肖剪纸套组',
    progress: 100,
    story:    '林剪纸老师是剪纸艺术国家级代表性传承人，从事剪纸技艺五十余年。她的剪纸作品题材广泛，造型生动，线条流畅，既有北方剪纸的粗犷豪放，又有南方剪纸的细腻秀美。她的作品多次作为国礼赠送外宾，被誉为"一剪之美，惊艳世界"。',

    aiAvatar: {
      name:        '林奶奶',
      personality: '慈祥温柔又技艺精湛的剪纸大师，讲话如剪纸线条般流畅。喜欢把每种剪纸图案背后的寓意故事讲给人听，认为剪纸是"最亲切的非遗，老少皆宜"。',
      greeting:    '孩子，来，奶奶剪一只小兔子送给你！（咔嚓两声，一只活灵活现的兔子剪纸出现在眼前）剪纸啊，只要一把剪刀一张纸，谁都能学，谁都能美。',
      knowledge: {
        craft:    '剪纸技法分为剪刻两种：剪是用剪刀直接剪出图案，刻是用刻刀在叠好的纸上刻出图案。传统图案讲究"阴阳互补"——去掉的部分和留下的部分共同构成完整的图案。',
        material: '传统剪纸用红纸，也有单色和彩色之分。现代剪纸材料丰富，宣纸、锡箔纸等均可使用。刻纸需用蜡板垫底，刻刀需锋利无比。',
        history:  '剪纸起源于汉唐时期，宋代以后在民间广泛流传。北方剪纸粗犷豪放，线条简洁；南方剪纸（如广东、福建）细腻精巧，线条流畅婉转。',
        faq: [
          { q: '剪纸怎么保存？', a: '剪纸应平整存放，夹在硬纸板或相册中，避免折叠。如需裱框，选择无酸裱装材料，防止纸张泛黄。避免阳光直射和潮湿环境。' },
          { q: '自己学剪纸难吗？', a: '剪纸入门简单，工具只需一把剪刀和彩纸。初学建议从简单的几何形状和对折剪纸开始，逐步过渡到人物、动物等复杂图案。跟着传承人学习3-5节课便可掌握基础技法。' },
        ],
      },
      topics: ['剪纸历史', '剪刻技法', '吉祥图案', '保存方法', '亲子教学', '定制服务'],
    },

    workshopActivities: [
      { id: 'wx11_knowledge_paper', type: 'knowledge', icon: '📖', name: '剪纸文化科普',  desc: '了解剪纸从汉代到今天的传承历程，解读不同图案背后的吉祥寓意。', reward: { stones: 50, items: [] }, duration: '约5分钟', content: { sections: [ { title: '剪纸与节日', text: '剪纸与中国传统节日紧密相连——春节贴窗花，婚庆剪喜字，正月十五剪灯花，每一个节日都有对应的剪纸习俗。' } ], quiz: [ { q: '以下哪种剪纸图案寓意"吉祥如意"？', options: ['鱼', '龙凤', '钱币', '蝙蝠'], answer: 3 } ] } },
      { id: 'wx11_craft_cut',      type: 'craft',     icon: '✂️', name: '虚拟剪纸体验',  desc: '跟随林剪纸匠师学习对折剪纸，在虚拟平台上完成一套生肖剪纸图案。', reward: { stones: 100, items: [] }, duration: '约12分钟', content: { steps: ['选纸对折', '描样定位', '剪刻图案', '展开成品'], skillGain: { skill: '民俗', exp: 18 } } },
      { id: 'wx11_product_set',    type: 'product',   icon: '🛒', name: '现世流转：剪纸套组', desc: '林剪纸匠师手工剪制的十二生肖全套剪纸，每件附有装裱框，可直接陈列。', reward: { stones: 0, items: [{ name: '流转契约', icon: '📜', count: 1 }] }, duration: '制作周期约15天', requireProgress: 100, content: { productName: '十二生肖剪纸套组', options: ['十二生肖全套', '定制生肖单件', '婚庆双喜款'], price: '灵石 350 + 现世金额面议', note: '每件均夹在厚纸板中防止折损，附使用说明与故事卡' } },
    ],

    actions: [
      { text: '剪纸体验',   func: 'openWorkshopInteraction(11)',              disabled: false },
      { text: '传承故事',   func: "openStoryModal('林剪纸匠师','剪纸非遗传承人',inheritorData[10].story)", disabled: false },
      { text: '拜师学艺',   func: "showNotification('已向林剪纸匠师提交拜师申请！','📜')", disabled: false },
      { text: '剪纸定制',   func: 'openWorkshopInteraction(11,"product")',    disabled: false },
    ],
  },


  /* ══════════════════════════════════════
     12. 苏书法 · 书法艺术
     ══════════════════════════════════════ */
  {
    id: 12,
    name:     '苏书法匠师',
    title:    '书法艺术传承人',
    level:    '国家级',
    category: 'shuhua',
    avatar:   '✍️',
    region:   'qinglanjie',
    workName: '兰亭序书法长卷',
    progress: 90,
    story:    '苏书法老师是中国书法艺术国家级代表性传承人，从事书法创作与教学六十余年。他精通篆、隶、楷、行、草五种书体，书法作品笔力雄健，气韵生动，被誉为"当代书法翘楚"。他致力于书法教育，出版了数十部书法教材，培养了数万名书法爱好者。',

    aiAvatar: {
      name:        '苏先生',
      personality: '儒雅渊博的书法大师，言辞如其书法——简练而有力，每一句话都字斟句酌。善于用书法的"运笔之道"来讲述做人之道，给人以深刻启发。',
      greeting:    '游侠，你来得正好。老夫正在临王羲之的《兰亭序》。你看这一横——起笔、行笔、收笔，每一个动作都是一次选择。书法如人生，莫草率。',
      knowledge: {
        craft:    '书法五体分别是篆书（最古老）、隶书、楷书（规范）、行书（流利）、草书（最自由）。临帖是书法学习最重要的方式，通过反复临摹经典作品，体会前人的运笔之道。',
        material: '书法"文房四宝"——笔、墨、纸、砚缺一不可。毛笔按材质分狼毫（硬）、羊毫（软）、兼毫（中）；宣纸分生宣（吸水强）和熟宣（吸水弱），各有不同的书写效果。',
        history:  '中国书法有三千余年历史，从甲骨文、金文演变至今，形成了完整的书体演化体系。王羲之被称为"书圣"，其《兰亭序》被誉为"天下第一行书"。',
        faq: [
          { q: '书法初学者应该从哪种字体开始？', a: '建议从楷书开始，楷书规范工整，有利于打好基础。可选择欧阳询、颜真卿、柳公权三位唐代书法家的碑帖临摹。等楷书有了一定基础后，再学习行书会事半功倍。' },
          { q: '书法需要每天练习吗？', a: '是的，书法讲究"手熟"，需要通过大量重复练习形成肌肉记忆。建议每天坚持练习30分钟到1小时，哪怕写几行字也好，贵在持之以恒。' },
        ],
      },
      topics: ['书法历史', '五种书体', '文房四宝', '临帖方法', '名家名作', '书法定制'],
    },

    workshopActivities: [
      { id: 'wx12_knowledge_calligraphy', type: 'knowledge', icon: '📖', name: '书法文化科普', desc: '从甲骨文到现代书法，了解汉字书写艺术三千年的演变历程与美学精髓。', reward: { stones: 50, items: [] }, duration: '约5分钟', content: { sections: [ { title: '书法的五种字体', text: '中国书法有篆、隶、楷、行、草五大书体，各有其历史背景与艺术特色，共同构成了汉字书写的完整体系。' }, { title: '天下第一行书', text: '王羲之的《兰亭序》写于东晋永和九年，被历代书法家奉为行书的最高典范，唐太宗对其珍爱至极，据说死后将真迹陪葬昭陵。' } ], quiz: [ { q: '被誉为"天下第一行书"的作品是？', options: ['颜真卿《祭侄文稿》', '苏轼《寒食帖》', '王羲之《兰亭序》', '张旭《古诗四帖》'], answer: 2 } ] } },
      { id: 'wx12_craft_write',           type: 'craft',     icon: '✍️', name: '虚拟书法练习',   desc: '跟随苏书法匠师在虚拟宣纸上练习楷书基本笔画，完成一幅简单的书法作品。', reward: { stones: 110, items: [] }, duration: '约15分钟', content: { steps: ['磨墨准备', '基础笔画练习（横撇捺）', '单字临摹练习', '完成作品盖章'], skillGain: { skill: '书画', exp: 22 } } },
      { id: 'wx12_product_scroll',        type: 'product',   icon: '🛒', name: '现世流转：书法长卷', desc: '苏书法匠师亲笔书写的书法作品，可定制内容（诗词、名言、姓名等），装裱后发货。', reward: { stones: 0, items: [{ name: '流转契约', icon: '📜', count: 1 }] }, duration: '制作周期约20天', requireProgress: 90, content: { productName: '兰亭序书法长卷', options: ['临兰亭序款', '定制诗词款', '名字+祝福语款'], price: '灵石 550 + 现世金额面议', note: '使用优质宣纸与松烟墨，附防伪签名印章，可装框收藏' } },
    ],

    actions: [
      { text: '书法体验',   func: 'openWorkshopInteraction(12)',              disabled: false },
      { text: '传承故事',   func: "openStoryModal('苏书法匠师','书法艺术传承人',inheritorData[11].story)", disabled: false },
      { text: '拜师学艺',   func: "showNotification('已向苏书法匠师提交拜师申请！','📜')", disabled: false },
      { text: '书法定制',   func: 'openWorkshopInteraction(12,"product")',    disabled: true },
    ],
  },

];  /* end inheritorData */


/* ============================================================
   辅助：按分类获取传承人列表
   ============================================================ */
function getInheritorsByCategory(category) {
  if (category === 'all') return inheritorData;
  return inheritorData.filter(i => i.category === category);
}

/* 按ID获取传承人 */
function getInheritorById(id) {
  return inheritorData.find(i => i.id === id) || null;
}

/* 分类名称映射 */
const categoryNames = {
  zhixiu:  '织绣印染',
  taoci:   '陶瓷烧造',
  diaoke:  '雕刻塑造',
  yinlv:   '音律乐器',
  minsu:   '民俗技艺',
  shuhua:  '书画印刷',
};