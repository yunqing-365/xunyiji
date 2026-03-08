/**
 * core.js
 * 寻遗集 · 核心模块
 * 负责：全局状态管理 / 工具函数 / 通知系统 / 成就系统 / 音效系统
 */

// ============================================================
// ============================================================
// 核心模块 1：存档与状态引擎 (Save/Load Manager)
// ============================================================
const SaveManager = {
    saveKey: 'xunyiji_save_v1',

    // 默认初始状态模板
    getDefaultState() {
        return {
            stones: 1200,
            inventory: {},
            equipment: { '首': null, '佩': null, '袍': null, '履': null, '持': null },
            intimacy: {},
            quests: null, // 将由 quest-engine 初始化
            achievements: {},
            unlockedRecipes: [],
            unlockedCompendium:[],
            restoredNodes: [],
            worldState: 1, // 0晨曦, 1午时, 2黄昏, 3子夜
            settings: { sound: true, music: true, graphics: true }
        };
    },

    // 加载存档
    load() {
        try {
            const savedData = localStorage.getItem(this.saveKey);
            if (savedData) {
                // 深度合并存档数据和默认数据，防止新增功能导致读取旧存档报错
                Object.assign(gameState, this.getDefaultState(), JSON.parse(savedData));
                console.log("📦 存档读取成功！");
            } else {
                Object.assign(gameState, this.getDefaultState());
                console.log("🌱 创建全新存档！");
            }
        } catch (e) {
            console.error("存档读取失败，已重置", e);
            Object.assign(gameState, this.getDefaultState());
        }
    },

    // 写入存档
    save() {
        try {
            localStorage.setItem(this.saveKey, JSON.stringify(gameState));
        } catch (e) {
            console.error("存档保存失败", e);
        }
    },

    // 清除存档（重玩）
    clear() {
        localStorage.removeItem(this.saveKey);
        location.reload();
    }
};

// 每隔 30 秒自动存档
setInterval(() => SaveManager.save(), 30000);

// ============================================================
// 二、全局游戏状态（单例对象）
// ============================================================
const gameState = {
    // 经济
    stones: 1200,

    // 背包（物品名 -> 数量）
    inventory: {},

    // 任务进度
    quests: {},

    // 成就解锁记录（id -> boolean）
    achievements: {},

    // 当前场景标识
    currentScene: null,

    // 投壶小游戏
    gameScore:     0,
    power:         0,
    powerInterval: null,

    // 签到
    checkedIn:  false,
    checkinDay: 0,

    // 灯谜
    currentRiddle: 0,
    riddleScore:   0,

    // 设置
    settings: { sound: true, music: true, graphics: true, weather: true },

    // ── 知音羁绊系统 ──
    // intimacy 已有，补充扩展字段
    bonds: {},          // { npcName: { lastEvent:'', lastTime:0, gifts:0, letters:0 } }

    // ── 传习录 ──
    xiulilu: [],        // [ { type, title, desc, time, icon, color } ]

    // ── 手信邮寄 ──
    handsignOrders: [], // [ { id, inheritor, product, status, address, code, time } ]

    // ── 节气缓存 ──
    currentSolarTerm: null,
};

SaveManager.load();
// ============================================================
// 三、工具函数
// ============================================================





/**
 * 更新页面顶部灵石数字显示
 */
function updateStats() {
    const el = document.getElementById('stone-count');
    if (el) el.innerText = gameState.stones;
}

/**
 * 根据 gameState.inventory 重新渲染灵犀袋格子
 * @param {string} [filterType='all'] - 筛选类型
 */

/**
 * 根据 gameState.inventory 重新渲染灵犀袋格子
 */

// ============================================================
// 核心模块 4：体验优化工具 (UX & Performance)
// ============================================================

// 1. 节流函数 (限制高频触发，如角色走动时的频繁判定)
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 2. 防抖函数 (如窗口缩放、搜索输入)
function debounce(func, delay) {
    let inDebounce;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(inDebounce);
        inDebounce = setTimeout(() => func.apply(context, args), delay);
    }
}

// 3. 通用加载过渡动画控制器 (统一所有耗时操作的白屏体验)
const ScreenTransition = {
    show(text = "灵力流转中...") {
        let overlay = document.getElementById('global-transition');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'global-transition';
            overlay.style.cssText = `position:fixed; inset:0; background:var(--paper); background-image:var(--texture-paper); z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center; opacity:0; pointer-events:none; transition:opacity 0.4s ease;`;
            overlay.innerHTML = `<div class="loading-spinner"></div><div id="transition-text" style="margin-top:20px; color:var(--ink); font-weight:bold; letter-spacing:2px;">${text}</div>`;
            document.body.appendChild(overlay);
        }
        document.getElementById('transition-text').innerText = text;
        overlay.style.pointerEvents = 'auto';
        requestAnimationFrame(() => overlay.style.opacity = '1');
    },
    hide() {
        const overlay = document.getElementById('global-transition');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.style.pointerEvents = 'none', 400);
        }
    }
};

// ============================================================


//🛠️ 第三步：加强任务引擎的安全判定 (防报错地图卡死)


/* 
 * 从背包扣除灵石，若不足返回 false
 * @param {number} amount
 * @returns {boolean}
 */
function spendStones(amount) {
    if (gameState.stones < amount) return false;
    gameState.stones -= amount;
    updateStats();
    return true;
}

/**
 * 增加灵石并刷新显示
 * @param {number} amount
 */
function earnStones(amount) {
    gameState.stones += amount;
    updateStats();
}

/**
 * 获取非遗分类的中文名称
 * @param {string} type
 * @returns {string}
 */
function getCategoryName(type) {
    const MAP = {
        zhixiu: '织绣印染',
        taoci:  '陶瓷烧造',
        diaoke: '雕刻塑造',
        yinlv:  '音律乐器',
        minsu:  '民俗技艺',
        shuhua: '书画印刷'
    };
    return MAP[type] || '其他';
}


// ============================================================
// 四、通知系统
// ============================================================

/** 通知队列，防止多条通知互相覆盖 */
const _notifQueue = [];
let   _notifBusy  = false;

/**
 * 弹出顶部飘入通知条
 * @param {string} text - 通知内容
 * @param {string} [icon='✨'] - 左侧图标
 * @param {number} [duration=3000] - 显示毫秒数
 */
function showNotification(text, icon = '✨', duration = 3000) {
    _notifQueue.push({ text, icon, duration });
    if (!_notifBusy) _processNotifQueue();
}

function _processNotifQueue() {
    if (_notifQueue.length === 0) { _notifBusy = false; return; }
    _notifBusy = true;

    const { text, icon, duration } = _notifQueue.shift();
    const notif     = document.getElementById('notification');
    const notifIcon = document.getElementById('notif-icon');
    const notifText = document.getElementById('notif-text');

    if (!notif) { _notifBusy = false; return; }

    notifIcon.innerText = icon;
    notifText.innerText = text;
    notif.classList.add('show');

    setTimeout(() => {
        notif.classList.remove('show');
        // 等淡出动画结束后处理下一条
        setTimeout(_processNotifQueue, 400);
    }, duration);
}


// ============================================================
// 五、弹窗通用控制
// ============================================================

/**
 * 打开弹窗（添加 .show 类）
 * @param {string} modalId - 弹窗元素 id
 */
// ============================================================
// 🌟 基础优化 3：高级弹窗控制器 (带遮罩点击和全局 ESC 监听)
// ============================================================

// 初始化时自动在 DOM 插入一个全局遮罩层
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('global-modal-overlay')) {
        document.body.insertAdjacentHTML('beforeend', '<div id="global-modal-overlay" class="modal-overlay" onclick="closeAllModals()"></div>');
    }
    
    // 全局 ESC 键监听
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
});

window.openModal = function(modalId) {
    // 互斥：先关闭其他显示的弹窗
    document.querySelectorAll('.modal.show').forEach(m => m.classList.remove('show'));
    
    const el = document.getElementById(modalId);
    const overlay = document.getElementById('global-modal-overlay');
    
    if (el) {
        el.classList.add('show');
        if (overlay) overlay.classList.add('show');
    }
};

window.closeModal = function(modalId) {
    const el = document.getElementById(modalId);
    const overlay = document.getElementById('global-modal-overlay');
    
    if (el) el.classList.remove('show');
    
    // 若界面上没有其他处于 show 状态的弹窗了，就把遮罩层也关掉
    if (document.querySelectorAll('.modal.show').length === 0 && overlay) {
        overlay.classList.remove('show');
    }
};

window.closeAllModals = function() {
    document.querySelectorAll('.modal.show').forEach(m => m.classList.remove('show'));
    const overlay = document.getElementById('global-modal-overlay');
    if (overlay) overlay.classList.remove('show');
};

/**
 * 打开匠人故事弹窗
 * @param {string} name    - 匠人姓名
 * @param {string} title   - 匠人称谓
 * @param {string} content - 故事正文
 */
function openStoryModal(name, title, content) {
    document.getElementById('story-title').innerText   = `${name} · ${title}`;
    document.getElementById('story-content').innerText = content;
    openModal('story-modal');
}


// ============================================================
// 核心模块 2：全局事件总线 (Event Bus)
// ============================================================
const GameEvent = {
    events: {},

    // 订阅事件
    on(eventName, listener) {
        if (!this.events[eventName]) this.events[eventName] = [];
        this.events[eventName].push(listener);
    },

    // 触发事件
    emit(eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(listener => {
                try {
                    listener(data);
                } catch (e) {
                    console.error(`事件 ${eventName} 执行报错:`, e);
                }
            });
        }
        
        // 【核心解耦】所有事件自动同步给任务引擎
        if (typeof window.dispatchQuestEvent === 'function') {
            window.dispatchQuestEvent(eventName, data?.amount || 1);
        }
    }
};

// 订阅物品变动事件，自动刷新背包UI，不用再到处手动调
GameEvent.on('INVENTORY_CHANGED', () => {
    if (typeof updateInventory === 'function') updateInventory();
});


// ============================================================
// 核心模块 3：通用条件判定引擎 (Condition Engine)
// 负责解析数据中的 conditions 字段
// ============================================================
const ConditionEngine = {
    /**
     * 校验一组条件是否全部满足
     * @param {Array} conditions - 例如 [{ type: "equip", item: "金丝楠木皇冠" }, { type: "time", value: "night" }]
     */
    checkAll(conditions) {
        if (!conditions || conditions.length === 0) return true;
        
        return conditions.every(cond => {
            switch (cond.type) {
                // 检查装备
                case 'equip': 
                    return Object.values(gameState.equipment || {}).includes(cond.item);
                // 检查背包物品数量
                case 'item': 
                    return (gameState.inventory[cond.item] || 0) >= (cond.count || 1);
                // 检查时辰 (0晨曦, 1午时, 2黄昏, 3子夜)
                case 'time': 
                    const timeMap = { 'dawn': 0, 'noon': 1, 'dusk': 2, 'night': 3 };
                    return gameState.worldState === (typeof cond.value === 'string' ? timeMap[cond.value] : cond.value);
                // 检查某NPC的羁绊值
                case 'intimacy':
                    return (gameState.intimacy[cond.npc] || 0) >= cond.value;
                // 检查是否完成某任务
                case 'quest_completed':
                    return gameState.quests && ['main','side'].some(cat => 
                        gameState.quests[cat].find(q => q.id === cond.value && q.status === 'completed')
                    );
                default:
                    console.warn("未知的条件类型:", cond.type);
                    return false;
            }
        });
    }
};

// ============================================================
// 六、成就系统
// ============================================================

/**
 * 尝试解锁成就
 * 若已解锁则静默跳过；未解锁则弹出庆祝面板并奖励灵石。
 *
 * @param {string} id     - 成就唯一 id，需在 gameState.achievements 中注册
 * @param {string} name   - 成就名称
 * @param {string} desc   - 成就描述
 * @param {number} reward - 奖励灵石数
 * @param {string} icon   - 成就图标 emoji
 */
function unlockAchievement(id, name, desc, reward, icon) {
    if (gameState.achievements[id]) return;  // 已解锁，幂等

    gameState.achievements[id] = true;
    earnStones(reward);

    // 填充成就弹窗内容
    document.getElementById('achievement-icon').innerText   = icon;
    document.getElementById('achievement-name').innerText   = name;
    document.getElementById('achievement-desc').innerText   = desc;
    document.getElementById('achievement-reward').innerText = `奖励: 🪙 ${reward} 灵石`;

    document.getElementById('achievement-panel').classList.add('show');
    playSound('achievement');
}

/**
 * 关闭成就弹窗
 */
function closeAchievement() {
    document.getElementById('achievement-panel').classList.remove('show');
}


// ============================================================
// 七、视图切换
// ============================================================

/**
 * 切换主视图（含 Dock 高亮）
 * @param {string}      viewId  - 目标视图的元素 id
 * @param {HTMLElement} [dockEl] - 被激活的 Dock 按钮（可选）
 */
// ============================================================
// 🌟 进阶优化 1：统一的主视图切换与生命周期路由
// ============================================================
window.switchMainView = function(viewId, dockEl) {
    document.querySelectorAll('.view-container').forEach(v => {
        v.classList.remove('active-view');
        v.style.display = '';
    });
    const targetView = document.getElementById(viewId);
    if (targetView) targetView.classList.add('active-view');
    const dock = document.getElementById('player-dock');
    if (dock && viewId !== 'view-exploration' && viewId !== 'view-scene') dock.classList.remove('hidden');
    if (dockEl) {
        document.querySelectorAll('.dock-item').forEach(i => i.classList.remove('active'));
        dockEl.classList.add('active');
    }
    // 生命周期钩子 (原三个函数的内容合并到这里)
    if (viewId === 'view-inventory')   updateInventory('all');
    if (viewId === 'view-profile')     { renderAchievements?.(); meditatePersona?.(); renderXiulilu?.(); _renderHandsignPreview?.(); }
    if (viewId === 'view-workshop')    renderWorkshop?.();
    if (viewId === 'view-deduction')   renderDeductionBoard?.();
    if (viewId === 'view-lingshi')     renderLingshi?.();
    if (viewId === 'view-map')         dispatchQuestEvent?.('view_map');
    if (typeof playSound === 'function') playSound('view_switch');
};

// ============================================================
// 八、设置系统（存 gameState，渲染交给 UI 层）
// ============================================================

/**
 * 切换某一项设置的开/关状态，并同步 UI toggle 样式
 * @param {string} key - 设置项 key（sound / music / graphics / weather）
 */
function toggleSetting(key) {
    gameState.settings[key] = !gameState.settings[key];

    const el = document.getElementById(`toggle-${key}`);
    if (el) el.classList.toggle('active', gameState.settings[key]);

    const LABEL_MAP = {
        sound:    '音效',
        music:    '背景音乐',
        graphics: '高画质模式',
        weather:  '天气效果'
    };
    showNotification(
        `${LABEL_MAP[key] || key} 已${gameState.settings[key] ? '开启' : '关闭'}`,
        '⚙️'
    );
}

/**
 * 打开设置弹窗
 */
function openSettings() {
    openModal('settings-modal');
}


// ============================================================
// 九、商店系统 (修复：动态渲染商店内容)
// ============================================================
// ============================================================
// 终极版商店系统：千店千面、砍价限制与跨模块联动
// ============================================================

// 1. 修复关闭按钮
window.closeShop = function() {
    closeModal('shop-panel');
};

// 2. 九州商行 · O2O 千店千面数据库
// o2oType: '实体'=现货直邮 | '线下'=到店核销 | '线上'=即时解锁 | '预定'=定制排期
const REGION_SHOPS = {
    'default': {
        title: '🏪 九州云商 · 匠心集市', npcName: '云掌柜', npcEmoji: '📦',
        theme: 'modal-header-gold',
        greeting: '客官，这里汇聚九州匠师心血之作，每一件都有来处、有温度。',
        items: [
            { id:'d_p1', name:'苏绣香囊（梅花款）',       cat:'physical', price:380, realPrice:128, stock:5,  icon:'🌸', o2oType:'实体',  desc:'王雪萍匠师工坊监制，真丝底料，手工苏绣，内含天然薰衣草香料。', badge:'匠师监制', deliverDays:7 },
            { id:'d_p2', name:'龙泉青瓷小茶杯',           cat:'physical', price:600, realPrice:238, stock:3,  icon:'🏺', o2oType:'实体',  desc:'张景春匠师亲制，梅子青釉，每件孤品，附产品证书与匠师签名卡。', badge:'大师亲制', deliverDays:30 },
            { id:'d_p3', name:'东阳木雕书签（松竹）',      cat:'physical', price:220, realPrice:68,  stock:10, icon:'🪵', o2oType:'实体',  desc:'李木雕匠师手工雕刻，香樟木，天然防虫，附礼盒包装。', badge:'非遗手作', deliverDays:14 },
            { id:'d_p4', name:'剪纸·十二生肖套装',        cat:'physical', price:280, realPrice:88,  stock:8,  icon:'✂️', o2oType:'实体',  desc:'非遗传承人手剪，宣纸材质，压膜防水，附收藏级礼盒。', badge:'非遗手作', deliverDays:10 },
            { id:'d_p5', name:'手工皮影（小旦角）',        cat:'physical', price:450, realPrice:168, stock:4,  icon:'🎭', o2oType:'实体',  desc:'驴皮手工制作，全套上色工艺，可悬挂可把玩，附表演说明书。', badge:'绝版工艺', deliverDays:20 },
            { id:'d_o1', name:'苏绣入门体验课（1人）',     cat:'offline',  price:520, realPrice:198, stock:20, icon:'🪡', o2oType:'线下',  desc:'锦绣坊工坊·2小时·小班制·附带材料包，完成作品可带走。', badge:'体验热门', deliverDays:0 },
            { id:'d_o2', name:'青瓷拉坯体验（2人同行）',   cat:'offline',  price:780, realPrice:298, stock:10, icon:'🏺', o2oType:'线下',  desc:'百作镇工坊·3小时·张景春匠师亲授·成品烧制后邮寄。', badge:'大师亲授', deliverDays:0 },
            { id:'d_o3', name:'雅集私宴（6人包场）',       cat:'offline',  price:1800,realPrice:688, stock:5,  icon:'🍵', o2oType:'线下',  desc:'匠师内室私宴，茶道/琴乐/香道三选一主题，限定6人小圈。', badge:'私域限定', deliverDays:0 },
            { id:'d_c1', name:'苏绣视频课·基础班',        cat:'course',   price:200, realPrice:68,  stock:999,icon:'📹', o2oType:'线上',  desc:'王雪萍匠师录制·共12节·永久观看·附PDF针法图谱。', badge:'即买即看', deliverDays:0 },
            { id:'d_c2', name:'青瓷鉴赏直播课（月卡）',    cat:'course',   price:160, realPrice:58,  stock:999,icon:'🎓', o2oType:'线上',  desc:'每周日晚8点直播·可与匠师实时互动·含回放权限。', badge:'限时直播', deliverDays:0 },
            { id:'d_c3', name:'东阳木雕技法精讲（全集）',  cat:'course',   price:350, realPrice:128, stock:999,icon:'📚', o2oType:'线上',  desc:'李木雕匠师讲授·20集进阶课·含工具选购指南。', badge:'系列课程', deliverDays:0 },
        ]
    },
    'jinxiufang': {
        title: '🪡 锦绣坊·织绣匠铺', npcName: '王雪萍匠师', npcEmoji: '🪡',
        theme: 'modal-header-jade',
        greeting: '姑娘（小友），进来坐。这条丝线劈了六十四丝，比头发还细，摸一摸就知道了。',
        items: [
            { id:'jx_p1', name:'苏绣团扇（牡丹款）',      cat:'physical', price:800, realPrice:298, stock:3,  icon:'🌺', o2oType:'实体',  desc:'王雪萍匠师亲绣，纯蚕丝底，绣线可劈64丝，制作周期30天。', badge:'大师亲制', deliverDays:30 },
            { id:'jx_p2', name:'苏绣香囊（双面定制）',     cat:'physical', price:600, realPrice:228, stock:5,  icon:'🌸', o2oType:'预定',  desc:'可定制正反两面图案，含名字或日期，情侣/婚庆首选。', badge:'私人定制', deliverDays:45 },
            { id:'jx_o1', name:'苏绣小班工坊（周末班）',   cat:'offline',  price:480, realPrice:188, stock:8,  icon:'🪡', o2oType:'线下',  desc:'每期4人·2小时·完成一枚香囊·材料全包·可带朋友同来。', badge:'口碑推荐', deliverDays:0 },
            { id:'jx_c1', name:'苏绣系统课（共20节）',     cat:'course',   price:450, realPrice:168, stock:999,icon:'🎓', o2oType:'线上',  desc:'从零到独立完成团扇，含针法库PDF·永久有效。', badge:'系统学习', deliverDays:0 },
        ]
    },
    'baizuozhen': {
        title: '⚒️ 百作镇·天工材料铺', npcName: '铁老三', npcEmoji: '👨‍🏭',
        theme: 'modal-header-ink',
        greeting: '要打铁还是雕木头？我这儿材料管够，最近还进了一批龙泉的陶土，品质绝了！',
        items: [
            { id:'bz_p1', name:'龙泉青瓷花器（梅子青）',  cat:'physical', price:1200,realPrice:458, stock:2,  icon:'🏺', o2oType:'实体',  desc:'张景春匠师手制·独立签名证书·每件窑变独一无二。', badge:'孤品绝版', deliverDays:60 },
            { id:'bz_p2', name:'东阳木雕摆件（定制）',    cat:'physical', price:700, realPrice:268, stock:4,  icon:'🪵', o2oType:'预定',  desc:'可雕刻定制内容（人物/名言/纪念日），香樟木材质。', badge:'私人定制', deliverDays:60 },
            { id:'bz_o1', name:'青瓷拉坯·亲子体验',      cat:'offline',  price:580, realPrice:228, stock:12, icon:'🎡', o2oType:'线下',  desc:'亲子同行·2大1小·3小时·成品由匠师烧制后寄出。', badge:'亲子首选', deliverDays:0 },
            { id:'bz_o2', name:'木雕入门·周末体验营',    cat:'offline',  price:420, realPrice:158, stock:8,  icon:'🪵', o2oType:'线下',  desc:'2天集训·从零开始·完成一件浮雕小作品带走。', badge:'沉浸体验', deliverDays:0 },
            { id:'bz_c1', name:'窑火哲学·张景春讲座',    cat:'course',   price:120, realPrice:48,  stock:999,icon:'🎤', o2oType:'线上',  desc:'90分钟公开讲座录播·谈青瓷与人生·附Q&A精华回放。', badge:'思想沉淀', deliverDays:0 },
        ]
    },
    'qinglanjie': {
        title: '🍵 青岚界·茶道雅舍', npcName: '茶师阿玲', npcEmoji: '🍵',
        theme: 'modal-header-jade',
        greeting: '慢着慢着，水还没到温，茶叶要醒一醒。你先坐，等这壶茶开了再说话。',
        items: [
            { id:'ql_p1', name:'明前龙井（手采礼盒）',    cat:'physical', price:480, realPrice:188, stock:8,  icon:'🍃', o2oType:'实体',  desc:'清明前手采·匠师监制烘焙·附产地证书与冲泡指南。', badge:'节气限定', deliverDays:5 },
            { id:'ql_p2', name:'古法熏香线香（竹林香）',  cat:'physical', price:320, realPrice:118, stock:10, icon:'🪔', o2oType:'实体',  desc:'非遗香师古法调配，天然植物香料，无人工添加，约60根/盒。', badge:'非遗配方', deliverDays:7 },
            { id:'ql_o1', name:'私人茶席体验（2人）',     cat:'offline',  price:560, realPrice:218, stock:6,  icon:'🫖', o2oType:'线下',  desc:'90分钟·一师一席·从识茶到冲泡·含带走茶样50克。', badge:'私密小圈', deliverDays:0 },
            { id:'ql_c1', name:'茶道美学入门课',          cat:'course',   price:180, realPrice:68,  stock:999,icon:'📹', o2oType:'线上',  desc:'8节视频课·识茶器、懂茶礼、会冲泡·适合茶道零基础。', badge:'入门首选', deliverDays:0 },
        ]
    },
    'wanyicheng': {
        title: '🎭 万艺城·梨园百货', npcName: '陈掌柜', npcEmoji: '🎭',
        theme: 'modal-header-red',
        greeting: '哟，客官来啦！今儿有新到的皮影和唢呐谱，来来来，进来看看！',
        items: [
            { id:'wy_p1', name:'皮影人偶（老生/小旦）',   cat:'physical', price:460, realPrice:178, stock:5,  icon:'🎭', o2oType:'实体',  desc:'驴皮手工刻制·全套上色·含操控签及收藏证书。', badge:'非遗手作', deliverDays:20 },
            { id:'wy_p2', name:'戏曲脸谱摆件（关公）',    cat:'physical', price:380, realPrice:138, stock:8,  icon:'😤', o2oType:'实体',  desc:'纯手绘工艺脸谱，桐木底，丙烯颜料，寓意镇宅驱邪。', badge:'手绘孤品', deliverDays:14 },
            { id:'wy_o1', name:'皮影戏体验工坊',          cat:'offline',  price:390, realPrice:148, stock:10, icon:'🎪', o2oType:'线下',  desc:'亲手操控皮影演一出《西游记》片段，拍照留念，2小时。', badge:'趣味体验', deliverDays:0 },
        ]
    },
    'tongxiyu': {
        title: '🐪 丝路商行·异域珍品', npcName: '阿里法德', npcEmoji: '👳‍♂️',
        theme: 'modal-header-gold',
        greeting: '嗨！远方的朋友！刚到一批和田玉料和西域香料，新鲜着呢！',
        items: [
            { id:'tx_p1', name:'和田玉平安扣吊坠',        cat:'physical', price:880, realPrice:338, stock:3,  icon:'🪬', o2oType:'实体',  desc:'新疆和田白玉，天然无染色，附玉石鉴定证书。', badge:'原产地直供', deliverDays:7 },
            { id:'tx_p2', name:'丝绸之路香料礼盒',        cat:'physical', price:350, realPrice:128, stock:6,  icon:'🌶️', o2oType:'实体',  desc:'肉桂、番红花等6种香料，印花礼盒包装。', badge:'异域特产', deliverDays:5 },
        ]
    },
    'senzhidiyu': {
        title: '🧚 森之杂货·自然馈赠', npcName: '绿灵', npcEmoji: '🧚',
        theme: 'modal-header-jade',
        greeting: '轻声点，小鹿刚在这边喝完水~ 这里的每一件都是森林的心意，带走好吗？',
        items: [
            { id:'sz_p1', name:'野生松茸干（礼盒装）',    cat:'physical', price:580, realPrice:218, stock:4,  icon:'🍄', o2oType:'实体',  desc:'云南高山松茸·人工拣选·自然晾晒·附溯源码。', badge:'山林珍品', deliverDays:5 },
            { id:'sz_p2', name:'竹编蒸笼（三层套装）',    cat:'physical', price:420, realPrice:158, stock:6,  icon:'🎋', o2oType:'实体',  desc:'竹编非遗传承人手作，天然毛竹，可直接上灶使用。', badge:'非遗手作', deliverDays:10 },
        ]
    },
};


let currentShopRegion = 'default';
let currentShopCategory = 'material';
let currentDiscount = 1.0; 
let haggleCount = 0; // ✅ 新增：砍价次数计数器

// 3. 打开商店时，根据玩家所在区域读取不同数据
window.openShop = function() {
    // 优先从全局状态获取当前区域，如果没有则用 default
    currentShopRegion = (typeof gameState !== 'undefined' && gameState.currentScene) ? gameState.currentScene : 'default';
    
    // 如果该区域没有配置专属商店，用 default 兜底
    const shopData = REGION_SHOPS[currentShopRegion] || REGION_SHOPS['default'];

    // 每次进店重置状态
    currentDiscount = 1.0; 
    haggleCount = 0;
    document.getElementById('haggle-btn').disabled = false;
    
    // 动态替换 UI
    document.getElementById('shop-title').innerHTML = shopData.title;
    document.getElementById('shop-npc-name').innerText = shopData.npcName;
    document.getElementById('shop-npc-emoji').innerText = shopData.npcEmoji;
    document.getElementById('shopkeeper-dialogue').innerText = shopData.greeting;
    document.getElementById('shop-header').className = `modal-header ${shopData.theme}`;
    
    if (document.getElementById('shop-current-stones')) {
        document.getElementById('shop-current-stones').innerText = gameState.stones;
    }

    const tabs = document.querySelectorAll('.shop-tabs .shop-tab');
    if(tabs.length > 0) switchShopTab('physical', tabs[0]);
    
    openModal('shop-panel');
    if (typeof playSound === 'function') playSound('click');
};

window.switchShopTab = function(category, btnEl) {
    currentShopCategory = category;
    document.querySelectorAll('.shop-tabs .shop-tab').forEach(t => t.classList.remove('active'));
    btnEl.classList.add('active');
    renderShopItems();
};

function renderShopItems() {
    const grid = document.getElementById('shop-grid');
    if (!grid) return;

    const shopData = REGION_SHOPS[currentShopRegion] || REGION_SHOPS['default'];

    // 注入节气商品
    const seasonalItems = (typeof SolarTermEngine !== 'undefined') ? SolarTermEngine.getSeasonalItems() : [];
    const allItems = [...shopData.items, ...seasonalItems];

    const catMap = { material:'原料', physical:'实体手信', offline:'线下体验', course:'线上课程', seasonal:'节气限定', prop:'奇珍道具', collection:'绝版图纸' };
    const filtered = currentShopCategory === 'all' ? allItems : allItems.filter(i => i.cat === currentShopCategory);

    if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:#aaa; padding:40px; font-family:var(--font-kai);">掌柜正在进货中，稍后再来…</div>`;
        return;
    }

    const typeStyle = {
        '实体': { bg:'#fde8e8', color:'var(--cinnabar)', label:'📦 实体直邮' },
        '线下': { bg:'#e8f4ef', color:'var(--jade)',     label:'📍 到店体验' },
        '线上': { bg:'#e6f0fa', color:'#4a90e2',         label:'💻 即时解锁' },
        '预定': { bg:'#f0ebf6', color:'#8e44ad',         label:'✏️ 私人定制' },
    };

    grid.innerHTML = filtered.map(item => {
        const isSoldOut  = item.stock <= 0;
        const finalPrice = Math.floor(item.price * currentDiscount);
        const isDisc     = currentDiscount < 1.0;
        const ts         = typeStyle[item.o2oType] || { bg:'#eee', color:'#666', label: item.o2oType || '' };
        const realTag    = item.realPrice ? `<div style="font-size:11px;color:#aaa;margin-bottom:4px;">现实价约 ¥${item.realPrice}</div>` : '';
        const deliverTag = item.deliverDays > 0
            ? `<div style="font-size:10px;color:#888;margin-bottom:6px;">⏱ 发货 ${item.deliverDays} 天</div>`
            : (item.o2oType==='线下'||item.o2oType==='线上') ? `<div style="font-size:10px;color:${ts.color};margin-bottom:6px;">${item.o2oType==='线下'?'📍 预约后到店':'⚡ 购买后即时获取'}</div>` : '';
        const badgeHtml  = item.badge ? `<div style="position:absolute;top:0;right:0;background:${ts.color};color:white;font-size:10px;padding:2px 7px;border-bottom-left-radius:7px;">${item.badge}</div>` : '';

        return `
        <div class="shop-item ${isSoldOut ? 'sold-out' : ''}" style="position:relative; overflow:hidden;">
            ${badgeHtml}
            ${isDisc && !isSoldOut ? '<div class="discount-tag">特惠</div>' : ''}
            <div style="font-size:9px;font-weight:bold;padding:2px 7px;border-radius:10px;background:${ts.bg};color:${ts.color};margin-bottom:6px;display:inline-block;">${ts.label}</div>
            <div class="shop-item-icon">${item.icon}</div>
            <div class="shop-item-name" style="font-size:13px;line-height:1.3;">${item.name}</div>
            <div class="shop-item-desc" style="color:#888;font-size:11px;line-height:1.4;margin:5px 0;">${item.desc}</div>
            ${realTag}${deliverTag}
            <div class="shop-item-price">
                ${isDisc ? `<span style="text-decoration:line-through;color:#aaa;font-size:11px;margin-right:4px;">${item.price}</span>` : ''}
                🪙 ${finalPrice}
            </div>
            <div style="font-size:11px;color:#888;margin-bottom:8px;">库存: ${isSoldOut ? '<span style="color:var(--cinnabar);">已售罄</span>' : item.stock}</div>
            <button class="btn btn-sm ${isSoldOut ? 'btn-ghost' : 'btn-outline'}" style="width:100%;transition:all 0.2s;"
                onclick="buyItem('${item.id}')" ${isSoldOut ? 'disabled' : ''}>
                ${isSoldOut ? '已售罄' : (item.o2oType==='线下'?'预约体验': item.o2oType==='线上'?'立即解锁':item.o2oType==='预定'?'申请定制':'购买')}
            </button>
        </div>`;
    }).join('');
}


window.buyItem = function(itemId) {
    const shopData = REGION_SHOPS[currentShopRegion] || REGION_SHOPS['default'];
    const item = shopData.items.find(i => i.id === itemId);
    if (!item || item.stock <= 0) return;

    const finalPrice = Math.floor(item.price * currentDiscount);

    if (spendStones(finalPrice)) {
        item.stock--; // ✅ 扣除内存中的持久库存
        addItem(item.name, 1); 
        
        document.getElementById('shop-current-stones').innerText = gameState.stones;
        showNotification(`成功购买【${item.name}】！可前往[行囊]或[化身纪]查看。`, '🛒');
        if (typeof playSound === 'function') playSound('buy');
        
        const thanks = ["多谢客官惠顾！", "好眼光，这可是抢手货！", "货真价实，您收好！"];
        document.getElementById('shopkeeper-dialogue').innerText = thanks[Math.floor(Math.random() * thanks.length)];
        
        renderShopItems(); 
    } else {
        showNotification('灵石不足，掌柜摇了摇头', '❌');
        document.getElementById('shopkeeper-dialogue').innerText = "哎哟，客官，这灵石好像差了点意思啊？";
        document.getElementById('shop-npc-emoji').innerText = '😒';
    }
};

// 4. ✅ 修复：带严格限制的砍价系统
window.haggleInShop = function() {
    const dialog = document.getElementById('shopkeeper-dialogue');
    const emoji = document.getElementById('shop-npc-emoji');
    const btn = document.getElementById('haggle-btn');
    
    // 限制1：已经打过折了
    if (currentDiscount < 1.0) {
        dialog.innerText = "“客官，底裤都亏掉了，真不能再便宜了！再砍我可要倒贴了！”";
        emoji.innerText = '😭';
        return;
    }

    // 限制2：最多只能尝试 3 次砍价
    if (haggleCount >= 2) {
        dialog.innerHTML = "<span style='color:var(--cinnabar);'>“去去去！光砍价不买东西，捣乱是吧？恕不接待！”</span>";
        emoji.innerText = '🤬';
        btn.disabled = true;
        btn.innerText = '掌柜已生气';
        if(typeof showNotification === 'function') showNotification('掌柜失去了耐心，拒绝再和你讨价还价。', '⚠️');
        return;
    }

    haggleCount++; // 增加砍价次数
    const roll = Math.random();
    emoji.style.animation = 'shake 0.3s ease';
    setTimeout(() => emoji.style.animation = 'float 3s ease-in-out infinite', 300);

    // 概率判定：30%成功
    if (roll > 0.7) {
        currentDiscount = 0.8; 
        dialog.innerHTML = "<span style='color:var(--cinnabar); font-weight:bold;'>“算我怕了你了！看你骨骼惊奇，全场 8 折，就当交个朋友！”</span>";
        emoji.innerText = '😆';
        if(typeof showNotification === 'function') showNotification('砍价成功！全场商品 8 折！', '💸');
        renderShopItems(); 
    } else {
        dialog.innerText = `“这已经是进货价了客官！您再去别家打听打听？” (剩余尝试次数: ${3 - haggleCount})`;
        emoji.innerText = '😤';
    }
};


// ============================================================
// 十、背包更新 (修复：让初始物资正确渲染到页面上)
// ============================================================



// ============================================================
// 十、任务系统（面板折叠 & 标签切换由此控制）
// ============================================================

/**
 * 切换任务面板的展开/收起状态
 */
function toggleQuestPanel() {
    const content = document.getElementById('quest-content');
    const toggle  = document.getElementById('quest-toggle');
    const collapsed = content.style.display === 'none';
    content.style.display = collapsed ? 'block' : 'none';
    toggle.innerText = collapsed ? '▼' : '▶';
}

/**
 * 检查并推进任务进度
 * @param {string} questId - 任务 id（对应 gameState.quests 的 key）
 * @param {number} [delta=1] - 增加的进度量
 */
function advanceQuest(questId, delta = 1) {
    const quest = gameState.quests[questId];
    if (!quest || quest.progress >= quest.target) return;

    quest.progress = Math.min(quest.progress + delta, quest.target);

    // 同步 DOM（若对应节点存在）
    const progressEl = document.querySelector(`[data-quest-id="${questId}"] .quest-progress`);
    if (progressEl) {
        progressEl.innerText = `进度: ${quest.progress}/${quest.target}`;
    }

    // 任务完成判断
    if (quest.progress >= quest.target) {
        earnStones(quest.reward);
        showNotification(`任务完成：${quest.name}！获得 ${quest.reward} 灵石`, '🎉');
    }
}


// ============================================================
// 十一、页面初始化绑定（DOMContentLoaded）
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // 任务标签切换
    document.querySelectorAll('.quest-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.quest-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // 商店标签切换
    document.querySelectorAll('.shop-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
});


// ============================================================
// 十一、基础交互框架路由 (修复所有区域卡片点击无反应)
// ============================================================

// ============================================================
// 丰富交互框架路由 (响应各区域动作卡片)
// ============================================================

// 极其美观的通用占位弹窗

// 通用占位弹窗渲染函数
function _showGenericModal(title, text) {
    // 复用原有的 story-modal 作为通用展示容器
    const titleEl = document.getElementById('story-title');
    const contentEl = document.getElementById('story-content');
    
    if (titleEl && contentEl) {
        titleEl.innerText = title;
        contentEl.innerHTML = `<div style="text-align:center; padding: 40px 20px;">
                                   <div style="font-size: 50px; margin-bottom:20px; animation: float 3s infinite;">✨</div>
                                   <div style="font-size: 16px; color: var(--ink);">${text}</div>
                               </div>`;
        openModal('story-modal');
    } else {
        showNotification(text, '✨');
    }
}

// 
// ============================================================
// 核心模块 7：灵识数字生命引擎 (Lingshi AI Engine)
// 纯逻辑调用，数据依赖 data/game-content.js 中的 LINGSHI_DATA
// ============================================================

if (!gameState.lingshi) {
    gameState.lingshi = {
        status: 'awake', // awake (伴游中), roaming (息影漫游)
        traits: { craft: 0, explore: 0, social: 0, zen: 0 },
        logs: []
    };
}

const LingshiEngine = {
    // 监听玩家行为并转化性格经验
    initBehaviorListeners() {
        GameEvent.on('collect_item', () => this.addTrait('explore', 1));
        GameEvent.on('explore_move', () => this.addTrait('explore', 0.1));
        GameEvent.on('craft_success', () => this.addTrait('craft', 5));
        GameEvent.on('talk_npc', () => this.addTrait('social', 2));
        GameEvent.on('gift_npc', () => this.addTrait('social', 5));
        GameEvent.on('play_music', () => this.addTrait('zen', 3));
        GameEvent.on('brew_tea', () => this.addTrait('zen', 3));
    },

    addTrait(type, amount) {
        if (gameState.lingshi.status === 'roaming') return; 
        gameState.lingshi.traits[type] += amount;
    },

    getDominantTrait() {
        const traits = gameState.lingshi.traits;
        let max = -1, dom = 'explore';
        for (let key in traits) {
            if (traits[key] > max) { max = traits[key]; dom = key; }
        }
        return dom;
    },

    getTraitLabels() {
        const traits = gameState.lingshi.traits;
        const getLvl = (val) => val > 100 ? '宗师' : val > 50 ? '精通' : val > 20 ? '初窥' : '萌芽';
        return {
            craft:   { name: '🔥 匠心', level: getLvl(traits.craft), val: traits.craft },
            explore: { name: '🍃 寻幽', level: getLvl(traits.explore), val: traits.explore },
            social:  { name: '🤝 烟火', level: getLvl(traits.social), val: traits.social },
            zen:     { name: '🧘 禅定', level: getLvl(traits.zen), val: traits.zen }
        };
    },

    // 生成离线推演日志（调用数据层）
    generateLog() {
        if (typeof LINGSHI_DATA === 'undefined') return;
        const domTrait = this.getDominantTrait();
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')} · 九州历`;
        
        // 从数据层随机抽取
        const list = LINGSHI_DATA.eventPool[domTrait];
        const content = list[Math.floor(Math.random() * list.length)];
        
        let rewardHtml = '';
        if (domTrait === 'explore' || Math.random() > 0.6) {
            const items = ['苏绣丝线', '高岭陶土', '紫苏叶', '陈年宣纸碎片'];
            const item = items[Math.floor(Math.random() * items.length)];
            const qty = Math.floor(Math.random() * 2) + 1;
            addItem(item, qty); // 利用上一步优化的事件总线机制
            rewardHtml = `<div class="ys-log-reward">🎁 灵识拾遗：获得了【${item} ×${qty}】</div>`;
        }

        gameState.lingshi.logs.unshift({ time: timeStr, content: content, rewardHtml: rewardHtml, type: domTrait });
        if(gameState.lingshi.logs.length > 50) gameState.lingshi.logs.pop();
        SaveManager.save();
    },

    triggerAwakeQuestion() {
        if (typeof LINGSHI_DATA === 'undefined') return null;
        return LINGSHI_DATA.awakeQuestions[Math.floor(Math.random() * LINGSHI_DATA.awakeQuestions.length)];
    }
};

LingshiEngine.initBehaviorListeners();

// 托管开关逻辑
window.toggleAIHosting = function() {
    const isRoaming = gameState.lingshi.status === 'roaming';
    if (!isRoaming) {
        gameState.lingshi.status = 'roaming';
        showNotification('已进入息影漫游模式，安心离线吧', '☁️');
        LingshiEngine.generateLog();
    } else {
        gameState.lingshi.status = 'awake';
        const q = LingshiEngine.triggerAwakeQuestion();
        if (q) {
            _showGenericModal('🔮 灵犀共鸣：灵识的困惑', 
                `<div style="margin-bottom:20px;">"${q.q}"</div>
                 <div style="display:flex; gap:10px; justify-content:center;">
                    <button class="btn btn-outline" onclick="LingshiEngine.addTrait('${q.opts[0].trait}', ${q.opts[0].add}); closeModal('story-modal'); renderLingshi(); showNotification('${q.opts[0].reply}', '✨');">${q.opts[0].t}</button>
                    <button class="btn btn-outline" onclick="LingshiEngine.addTrait('${q.opts[1].trait}', ${q.opts[1].add}); closeModal('story-modal'); renderLingshi(); showNotification('${q.opts[1].reply}', '✨');">${q.opts[1].t}</button>
                 </div>`
            );
        }
    }
    renderLingshi(); // 刷新 UI
};

// UI渲染函数
window.renderLingshi = function() {
    const isRoaming = gameState.lingshi.status === 'roaming';
    const btn = document.getElementById('ys-toggle-btn');
    const status = document.getElementById('ys-current-status');
    const avatarCard = document.querySelector('.ys-avatar-card');

    if (btn && status && avatarCard) {
        if (isRoaming) {
            btn.innerText = "唤醒灵识 (停止托管)";
            btn.className = "btn btn-full btn-outline";
            btn.style.borderColor = "var(--cinnabar)";
            btn.style.color = "var(--cinnabar)";
            status.innerHTML = "<span class='anim-blink'>🌀 正在九州深网中游历...</span>";
            avatarCard.style.filter = "hue-rotate(45deg) saturate(1.2)";
        } else {
            btn.innerText = "启动息影漫游";
            btn.className = "btn btn-full btn-jade";
            btn.style.borderColor = "";
            btn.style.color = "";
            status.innerText = "状态：清醒伴游中";
            avatarCard.style.filter = "none";
        }
    }

    const traitsBox = document.getElementById('ys-dynamic-traits');
    if (traitsBox) {
        const labels = LingshiEngine.getTraitLabels();
        traitsBox.innerHTML = Object.values(labels).map(data => {
            const opacity = data.val > 0 ? Math.min(1, 0.4 + data.val / 100) : 0.3;
            return `
                <div style="background:rgba(255,255,255,${opacity * 0.2}); border:1px solid rgba(255,255,255,${opacity * 0.4}); padding:6px 12px; border-radius:20px; text-align:center;">
                    <div style="font-size:12px; font-weight:bold; color:white; opacity:${opacity}">${data.name} <span style="font-weight:normal; font-size:10px;">${data.level}</span></div>
                    <div style="height:2px; background:rgba(255,255,255,0.2); margin-top:4px; border-radius:2px; overflow:hidden;">
                        <div style="height:100%; width:${Math.min(100, data.val)}%; background:white;"></div>
                    </div>
                </div>`;
        }).join('');
    }

    const list = document.getElementById('ys-log-list');
    if (!list) return;
    if (gameState.lingshi.logs.length === 0) {
        list.innerHTML = `<div class="empty-state">暂无游历记录，尝试开启息影漫游吧。</div>`;
        return;
    }

    list.innerHTML = gameState.lingshi.logs.map((log, index) => {
        const colors = { craft: 'var(--cinnabar)', explore: 'var(--jade)', social: 'var(--amber)', zen: 'var(--purple)' };
        const color = colors[log.type] || 'var(--jade)';
        return `
        <div class="ys-log-item" style="border-left-color: ${color}; animation-delay: ${index * 0.1}s;">
            <style>.ys-log-item:nth-child(${index+1})::before { border-color: ${color}; }</style>
            <div class="ys-log-time" style="color: ${color};">${log.time}</div>
            <div class="ys-log-content">
                ${log.content}
                ${log.rewardHtml}
            </div>
        </div>`;
    }).join('');
};
// ============================================================
// 十三、天工造物 (合成系统)
// ============================================================
// ==========================================
// 🛠️ 天工造物 4.0：动态仪表盘渲染 (无概率，纯提示)
// ==========================================
window.openCraftingHub = function() {
    closeModal('station-work-modal');
    const grid = document.getElementById('station-grid');
    const envStatus = document.getElementById('hub-env-status');
    grid.innerHTML = '';
    
    // 1. 读取当前天地法则 (给玩家寻找配方分支的线索)
    let currentEnvStr = "☀️ 午时 (常规环境)";
    let envColor = "#ffb347";
    if (typeof gameState !== 'undefined' && gameState.worldState !== undefined) {
        const states = [
            { txt: "🌅 晨曦 · 水汽充沛 (适合洗炼带有露水的灵物)", col: "var(--jade)" },
            { txt: "☀️ 午时 · 阳气鼎盛 (适合常规造物与染布)", col: "#ffb347" },
            { txt: "🌇 黄昏 · 逢魔时刻 (万物沉寂)", col: "var(--cinnabar)" },
            { txt: "🌌 子夜 · 星汉灿烂 (极寒阴气交汇，是触发【窑变】的绝佳时机！)", col: "var(--purple)" }
        ];
        const st = states[gameState.worldState] || states[1];
        currentEnvStr = st.txt;
        envColor = st.col;
    }
    if (envStatus) {
        envStatus.innerText = currentEnvStr;
        envStatus.style.color = envColor;
    }

    // 2. 渲染设备卡片
    for (const [stationId, data] of Object.entries(CRAFTING_STATIONS)) {
        grid.innerHTML += `
            <div style="border: 1px solid #e0d5c1; border-radius: 12px; padding: 15px; background: white; cursor: pointer; position: relative; transition: all 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.02);" 
                 onclick="enterStation('${stationId}')"
                 onmouseover="this.style.borderColor='var(--gold)'; this.style.transform='translateY(-2px)';"
                 onmouseout="this.style.borderColor='#e0d5c1'; this.style.transform='translateY(0)';">
                
                <div style="display:flex; align-items:center; gap:12px; margin-bottom: 10px;">
                    <div style="font-size:35px;">${data.icon}</div>
                    <div style="text-align: left;">
                        <div style="font-weight:bold; font-size:15px; color:var(--ink);">${data.name}</div>
                        <div style="font-size:11px; color:#888;">${data.desc}</div>
                    </div>
                </div>
                
                <div style="background: rgba(126,182,161,0.08); border-left: 2px solid var(--jade); padding: 6px 10px; font-size: 11px; color: var(--jade); text-align: left; border-radius: 0 4px 4px 0;">
                    ${data.trait}
                </div>
            </div>
        `;
    }
    openModal('station-hub-modal');
};

// ==========================================
// 🛠️ 天工造物 3.0：进入具体设备与选择配方
// ==========================================
let currentWorkRecipe = null;

window.enterStation = function(stationId) {
    closeModal('station-hub-modal'); // 关闭大厅
    const station = CRAFTING_STATIONS[stationId];
    
    // 替换工作台标题
    document.getElementById('work-modal-title').innerHTML = `🛠️ ${station.name}`;
    
    // 过滤出该设备专属的配方
    const listEl = document.getElementById('work-recipe-list');
    listEl.innerHTML = '';
    const stationRecipes = ADVANCED_RECIPES.filter(r => r.station === stationId);
    
    stationRecipes.forEach(recipe => {
        listEl.innerHTML += `
            <div class="craft-recipe-item" style="border:1px solid #ddd; background:white; padding:12px; border-radius:8px; margin-bottom:10px; cursor:pointer; display:flex; align-items:center; gap:12px; transition:0.2s;" 
                 onclick="selectWorkRecipe('${recipe.id}', this)">
                <div style="font-size:24px; background:#fafaf8; width:40px; height:40px; display:flex; align-items:center; justify-content:center; border-radius:6px;">${recipe.icon}</div>
                <div>
                    <div style="font-weight:bold; font-size:14px; color:var(--ink);">${recipe.name}</div>
                    <div style="font-size:11px; color:var(--jade);">${recipe.type}</div>
                </div>
            </div>
        `;
    });

    // 重置右侧面板为空状态
    document.getElementById('crafting-empty-state').style.display = 'block';
    document.getElementById('crafting-active-state').style.display = 'none';
    document.getElementById('work-progress-bar').style.width = '0%';
    currentWorkRecipe = null;

    openModal('station-work-modal');
};

// 点击左侧配方，渲染右侧材料需求
window.selectWorkRecipe = function(recipeId, element) {
    // 处理高亮效果
    document.querySelectorAll('.craft-recipe-item').forEach(el => {
        el.style.borderColor = '#ddd'; el.style.boxShadow = 'none';
    });
    element.style.borderColor = 'var(--gold)';
    element.style.boxShadow = '0 4px 10px rgba(212,175,55,0.15)';

    currentWorkRecipe = ADVANCED_RECIPES.find(r => r.id === recipeId);
    if (!currentWorkRecipe) return;

    // 切换面板显示
    document.getElementById('crafting-empty-state').style.display = 'none';
    document.getElementById('crafting-active-state').style.display = 'flex';

    document.getElementById('work-target-icon').innerText = currentWorkRecipe.icon;
    document.getElementById('work-target-name').innerText = currentWorkRecipe.name;
    document.getElementById('work-target-desc').innerText = currentWorkRecipe.desc;

    // 校验材料库存
    let canCraft = true;
    let reqsHtml = '';
    if (!gameState.inventory) gameState.inventory = {};

    for (let matName in currentWorkRecipe.reqs) {
        const need = currentWorkRecipe.reqs[matName];
        const have = gameState.inventory[matName] || 0;
        if (have < need) canCraft = false;

        reqsHtml += `
        <div style="background:${have >= need ? '#fdfaf4' : '#fcf5f5'}; border:1px solid ${have >= need ? 'var(--gold)' : 'var(--cinnabar)'}; padding:10px 15px; border-radius:8px; text-align:center; min-width:90px;">
            <div style="font-size:13px; font-weight:bold; color:var(--ink); margin-bottom:5px;">${matName}</div>
            <div style="font-size:12px;">
                <span style="color:${have >= need ? 'var(--jade)' : 'var(--cinnabar)'}; font-weight:bold;">${have}</span> / ${need}
            </div>
        </div>`;
    }

    document.getElementById('work-req-mats').innerHTML = reqsHtml;

    // 更新按钮状态
    const btn = document.getElementById('btn-start-work');
    btn.disabled = !canCraft;
    if (canCraft) {
        btn.innerText = `✨ 注入灵力 (${currentWorkRecipe.timeCost / 1000}s)`;
        btn.style.filter = 'none';
    } else {
        btn.innerText = '材料不足，无法造物';
        btn.style.filter = 'grayscale(1)';
    }
};

// ==========================================
// 🛠️ 天工造物 4.0：确定性分支产出逻辑
// ==========================================
let isWorking = false;

window.startWorking = function() {
    if (isWorking || !currentWorkRecipe) return;
    
    // 严格扣除基础材料
    for (let matName in currentWorkRecipe.reqs) {
        if ((gameState.inventory[matName] || 0) < currentWorkRecipe.reqs[matName]) return;
        gameState.inventory[matName] -= currentWorkRecipe.reqs[matName];
    }
    if (typeof updateInventory === 'function') updateInventory();

    isWorking = true;
    const btn = document.getElementById('btn-start-work');
    const bar = document.getElementById('work-progress-bar');
    btn.disabled = true;
    btn.innerText = '天工造物中...';
    if (typeof playSound === 'function') playSound('magic');

    let progress = 0;
    const interval = 50; 
    const step = (interval / currentWorkRecipe.timeCost) * 100;

    const timer = setInterval(() => {
        progress += step;
        bar.style.width = `${Math.min(progress, 100)}%`;

        if (progress >= 100) {
            clearInterval(timer);
            isWorking = false;
            bar.style.width = '0%';
            
            _resolveCraftingMutation(currentWorkRecipe);
        }
    }, interval);
};

// 🌟 核心引擎：解析分支路线，产出多样性物品
function _resolveCraftingMutation(recipe) {
    const timeState = typeof gameState !== 'undefined' ? gameState.worldState : 1; 
    
    // 默认产物与默认奖励
    let finalItemName = recipe.name;
    let finalIcon = recipe.icon;
    let finalCompendium = recipe.compendium;

    // 检查是否有配方变异 (Mutations)
    if (recipe.mutations && recipe.mutations.length > 0) {
        for (let mut of recipe.mutations) {
            let triggered = false;

            // 条件1：环境/时辰触发 (比如子夜触发窑变)
            if (mut.conditionEnv !== undefined && mut.conditionEnv === timeState) {
                triggered = true;
            }
            
            // 条件2：行囊中有特定的额外材料 (跨区域彩蛋)
            if (mut.reqExtra && (gameState.inventory[mut.reqExtra] || 0) > 0) {
                gameState.inventory[mut.reqExtra] -= 1; // 消耗掉该彩蛋材料
                triggered = true;
            }

            // 一旦满足变异条件，立即改变产物！
            if (triggered) {
                finalItemName = mut.resultName;
                finalIcon = mut.icon;
                if (mut.compendium) finalCompendium = mut.compendium;
                
                // 弹出变异特写提示
                showNotification(`天生异象！由于特殊的环境与辅料，图谱发生了变异！`, '✨', 4000);
                break; // 只触发最高优先级的变异
            }
        }
    }

    const fxOverlay = document.getElementById('crafting-fx-overlay');
    fxOverlay.style.display = 'flex';

    setTimeout(() => {
        fxOverlay.style.display = 'none';

        // 1. 发放最终物品 (必定成功，只是拿到的东西不同)
        if (typeof addItem === 'function') addItem(finalItemName, 1);
        showNotification(`造物完成！获得【${finalItemName}】`, finalIcon);
        if (typeof playSound === 'function') playSound('achievement');

        // 2. 解锁多样性图鉴
        if (finalCompendium && !gameState.unlockedCompendium.includes(finalItemName)) {
            gameState.unlockedCompendium.push(finalItemName);
            earnStones(finalCompendium.reward);
            
            // 将此物品作为独立的词条注入到你现有的系统缓存里（为了在图鉴里显示）
            if (typeof itemDatabase !== 'undefined' && !itemDatabase[finalItemName]) {
                itemDatabase[finalItemName] = { icon: finalIcon, desc: finalCompendium.history, type: 'rare' };
            }

            showNotification(`【图鉴扩充】《万物鉴》收录全新分支物品【${finalItemName}】，奖励 ${finalCompendium.reward} 灵石！`, '📖', 6000);
        }

        // 刷新面板库存显示
        const activeItem = document.querySelector('.craft-recipe-item[style*="var(--gold)"]');
        if (activeItem) selectWorkRecipe(recipe.id, activeItem);
        
        const btn = document.getElementById('btn-start-work');
        btn.innerText = '准备就绪';
        btn.disabled = false;

    }, 800);
}

// ==========================================
// 📖 万物鉴 2.0：智能图谱与溯源系统
// ==========================================

let currentCompTab = 'all';

window.openCompendium = function() {
    // 兼容旧档：如果存档里没有 discoveredItems，根据当前背包反推
    if (!gameState.discoveredItems) {
        gameState.discoveredItems = Object.keys(gameState.inventory || {}).filter(k => gameState.inventory[k] > 0);
    }
    
    // 初始化时切回“全部”
    const firstTab = document.querySelector('.comp-tab');
    if (firstTab) switchCompendiumTab('all', firstTab);
    else _renderCompendiumGrid();

    openModal('compendium-modal');
    if (typeof playSound === 'function') playSound('click');
};

window.switchCompendiumTab = function(tabName, btnEl) {
    currentCompTab = tabName;
    document.querySelectorAll('.comp-tab').forEach(btn => btn.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    _renderCompendiumGrid();
};

function _renderCompendiumGrid() {
    const grid = document.getElementById('compendium-grid');
    if (!grid || typeof itemDatabase === 'undefined') return;

    let html = '';
    let totalItems = 0;
    let unlockedItems = 0;

    // 遍历整个游戏物品库
    for (const [itemName, itemData] of Object.entries(itemDatabase)) {
        // 过滤掉没用的契约、货币
        if (['currency', 'contract'].includes(itemData.type)) continue;

        // Tab 分类过滤
        if (currentCompTab === 'material' && itemData.type !== 'material') continue;
        if (currentCompTab === 'craft' && itemData.type !== 'crafted' && itemData.type !== 'prop') continue;
        if (currentCompTab === 'rare' && itemData.type !== 'rare' && itemData.type !== 'collection' && itemData.rarity < 4) continue;

        totalItems++;
        
        // 判断是否已解锁（在记忆库中，或背包里存在过）
        const isUnlocked = gameState.discoveredItems.includes(itemName) || (gameState.inventory[itemName] !== undefined);
        if (isUnlocked) unlockedItems++;

        // 智能溯源获取途径
        const sourceHint = _findItemSource(itemName, itemData);

        // ── 渲染逻辑：三阶迷雾 ──
        if (isUnlocked) {
            // 已解锁：全彩展示
            html += `
                <div class="compendium-item-card unlocked" onclick="openItemDetail('${itemName}')">
                    <div class="item-icon-box" style="background: radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%);">
                        <div style="font-size: 45px; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.5));">${itemData.icon}</div>
                    </div>
                    <div class="item-name" style="color: var(--gold);">${itemName}</div>
                    <div class="item-rarity">${'★'.repeat(itemData.rarity || 1)}</div>
                    <div class="item-source" style="color: var(--jade);">✅ 已点亮</div>
                </div>`;
        } 
        else if (itemData.rarity >= 4 || itemData.type === 'rare' || itemData.type === 'collection') {
            // 未解锁的稀有品：完全隐藏（绝世孤品）
            html += `
                <div class="compendium-item-card locked-secret">
                    <div class="item-icon-box">
                        <div style="font-size: 35px; opacity: 0.3;">🔒</div>
                    </div>
                    <div class="item-name" style="color: #666; letter-spacing: 2px;">未知奇珍</div>
                    <div class="item-source" style="color: #555;">机缘未到，暂未现世</div>
                </div>`;
        } 
        else {
            // 未解锁的基础/中级物品：显示剪影和来源（引导玩家去肝）
            html += `
                <div class="compendium-item-card locked-known">
                    <div class="item-icon-box">
                        <div style="font-size: 45px; filter: brightness(0) invert(0.3); opacity: 0.6;">${itemData.icon}</div>
                    </div>
                    <div class="item-name" style="color: #999;">${itemName}</div>
                    <div class="item-source" style="color: var(--amber); opacity: 0.8;">📍 来源: ${sourceHint}</div>
                </div>`;
        }
    }

    grid.innerHTML = html || '<div style="grid-column:1/-1; text-align:center; color:#555; padding: 40px;">该分类下暂无造物记录</div>';

    // 更新进度条
    const progressEl = document.getElementById('compendium-progress-bar');
    const textEl = document.getElementById('compendium-progress-text');
    if (progressEl && textEl) {
        const pct = totalItems === 0 ? 0 : Math.round((unlockedItems / totalItems) * 100);
        progressEl.style.width = `${pct}%`;
        textEl.innerText = `${unlockedItems} / ${totalItems} (${pct}%)`;
        
        if (pct >= 100 && typeof unlockAchievement === 'function') {
            unlockAchievement('compendium_master', '万物通明', '点亮《万物鉴》中所有图谱', 1000, '📜');
        }
    }
}

// 🤖 核心黑科技：智能逆向溯源器
// 自动扫描 scenes.js 和 recipes 推导物品产出地，你以后加物品再也不用手动写来源了！
function _findItemSource(itemName, itemData) {
    // 1. 查造物配方
    if (typeof ADVANCED_RECIPES !== 'undefined') {
        const advRecipe = ADVANCED_RECIPES.find(r => r.name === itemName || (r.mutations && r.mutations.some(m => m.resultName === itemName)));
        if (advRecipe) {
            const stationName = (CRAFTING_STATIONS[advRecipe.station] || {}).name || '天工造物台';
            return `【天工阁】${stationName}合成`;
        }
    }
    if (typeof CRAFTING_RECIPES !== 'undefined') {
        if (CRAFTING_RECIPES.some(r => r.name === itemName)) return `【天工阁】基础造物`;
    }

    // 2. 查大地图采集点
    if (typeof sceneConfig !== 'undefined') {
        for (const [sceneKey, config] of Object.entries(sceneConfig)) {
            if (!config.exploration || !config.exploration.nodes) continue;
            const node = config.exploration.nodes.find(n => 
                (n.type === 'collect' && n.data && n.data.itemName === itemName) ||
                (n.type === 'hidden' && n.data && n.data.rewardItem === itemName)
            );
            if (node) {
                return `探索【${config.title}】获取`;
            }
        }
    }

    // 3. 查商店购买
    if (typeof shopConfig !== 'undefined') {
        for (const cat in shopConfig) {
            if (shopConfig[cat].some && shopConfig[cat].some(i => i.name === itemName)) {
                return `九州商铺购买`;
            }
        }
    }

    // 4. 查沙盘推演
    if (typeof DEDUCTION_RECIPES !== 'undefined') {
        if (DEDUCTION_RECIPES.some(r => r.resultName === itemName)) {
            return `【异闻沙盘】注入因果推演`;
        }
    }

    // 兜底
    if (itemData.type === 'crafted') return '天工阁工匠制作';
    return '九州机缘掉落';
}

// ============================================================
// 十四、寻遗留言板 (异步社交)
// ============================================================
function openMessageBoard(title) {
    const titleEl = document.getElementById('msg-board-title');
    if (titleEl) titleEl.innerText = title;
    openModal('message-board-modal');
}

function leaveMessage() {
    const input = document.getElementById('my-message-input');
    const list = document.getElementById('message-list');
    if (!input || !input.value.trim() || !list) return;
    
    const msgHTML = `
        <div style="background: #e8f4ef; padding: 12px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); border-left: 3px solid var(--jade); animation: slideUpIn 0.3s ease;">
            <div style="font-size: 12px; color: #888; margin-bottom: 4px;">@游历者·${document.getElementById('display-player-name')?.innerText || '你'} (刚刚)</div>
            <div style="font-size: 14px; color: var(--ink);">${input.value}</div>
            <div style="font-size: 12px; color: #888; text-align: right; margin-top: 5px;">等待点赞...</div>
        </div>
    `;
    list.insertAdjacentHTML('beforeend', msgHTML);
    input.value = '';
    
    // 滑动到底部
    list.scrollTop = list.scrollHeight;
    showNotification('留言成功，静待有缘人回复。', '🕊️');
}

// ============================================================
// ============================================================
// 🌟 基础优化 2：统一动作路由分发器 (消除多层嵌套覆盖)
// ============================================================
window.handleAction = function(actionType, target) {
    if (typeof playSound === 'function') playSound('click');
    
    switch (actionType) {
        case 'minigame':
            if (target === 'toupot' && typeof openMinigame === 'function') openMinigame();
            else if (target === 'riddle' && typeof openRiddleGame === 'function') openRiddleGame();
            else _showGenericModal('🎮 技艺沉浸体验', `即将进入【${target}】全息小游戏环节，请穿戴好体感设备...`, '🎮');
            break;
        case 'listen':
            _showGenericModal('🎵 听音赏乐', `正在连接数字留声机，为您播放九州百年流传的经典名段。请闭上眼睛感受...`, '🎧');
            break;
        case 'read':
            _showGenericModal('📖 秘典查阅', `正在翻阅非遗古籍善本... 字里行间流露出千年前的匠人精神。`, '📜');
            break;
        case 'trade':
            if (typeof openShop === 'function') openShop();
            break;
        case 'explore':
            _showGenericModal('🗺️ 秘境深潜', `您深入了【${target}】的隐藏区域。系统检测到前方有高浓度能量波动，似乎有奇遇在等待...`, '✨');
            break;
        case 'calendar':
            if (typeof openCheckin === 'function') openCheckin();
            break;
        // 以下为新增的高级模块路由
        case 'craft':
            if (typeof openCrafting === 'function') openCrafting();
            break;
        case 'message':
            if (typeof openMessageBoard === 'function') openMessageBoard(target);
            break;
        case 'appraise':
            if (typeof openAppraise === 'function') openAppraise();
            break;
        default:
            showNotification(`【${actionType}】模块正在修缮中，敬请期待...`, '🚧');
    }
};

// 通用占位弹窗渲染函数
function _showGenericModal(title, text) {
    const titleEl = document.getElementById('story-title');
    const contentEl = document.getElementById('story-content');
    if (titleEl && contentEl) {
        titleEl.innerText = title;
        contentEl.innerHTML = `<div style="text-align:center; padding: 40px 20px;">
                                   <div style="font-size: 50px; margin-bottom:20px; animation: float 3s infinite;">✨</div>
                                   <div style="font-size: 16px; color: var(--ink);">${text}</div>
                               </div>`;
        openModal('story-modal');
    } else {
        showNotification(text, '✨');
    }
}
// ============================================================
// 十五、慧眼鉴宝 (黑市盲盒)
// ============================================================
function openAppraise() {
    // 重置弹窗状态
    document.getElementById('appraise-item-icon').style.filter = 'grayscale(1) contrast(2) brightness(0.5)';
    document.getElementById('appraise-item-icon').innerText = '🏺';
    document.getElementById('appraise-item-name').innerHTML = '沾满泥土的神秘古物';
    document.getElementById('appraise-btn').style.display = 'block';
    openModal('appraise-modal');
}

function executeAppraise() {
    if (!spendStones(150)) {
        showNotification('灵石不足，商人对你翻了个白眼', '😒');
        return;
    }
    
    document.getElementById('appraise-btn').style.display = 'none';
    const iconEl = document.getElementById('appraise-item-icon');
    const nameEl = document.getElementById('appraise-item-name');
    
    // 洗泥动画
    iconEl.style.animation = 'shake 0.3s ease infinite';
    nameEl.innerText = "正在清洗表面泥土...";
    if(typeof playSound === 'function') playSound('magic');
    
    setTimeout(() => {
        iconEl.style.animation = '';
        iconEl.style.filter = 'none'; // 去掉灰色滤镜，展现真容
        iconEl.style.transform = 'scale(1.5)';
        
        const roll = Math.random();
        if (roll > 0.75) {
            iconEl.innerText = '👑';
            nameEl.innerHTML = '<span style="color:var(--cinnabar); font-size:20px;">【传世国宝】金丝楠木皇冠</span>';
            showNotification('赚翻了！绝世珍宝出世！', '🎉');
            addItem('金丝楠木皇冠', 1);
        } else if (roll > 0.35) {
            iconEl.innerText = '🫖';
            nameEl.innerHTML = '<span style="color:var(--jade); font-size:18px;">【真品】明代紫砂壶</span>';
            showNotification('眼光不错，是一件小赚的真品！', '✅');
            addItem('明代紫砂壶', 1);
        } else {
            iconEl.innerText = '🧱';
            nameEl.innerHTML = '<span style="color:#888;">【赝品】现代仿制破砖头</span>';
            showNotification('打眼了... 这只是个现代仿制品，交学费了。', '💥');
        }
        
        setTimeout(() => iconEl.style.transform = 'scale(1)', 500);
    }, 1800);
}


// ============================================================
// 修复：自动注入慧眼鉴宝 (黑市盲盒) 系统
// ============================================================

// 1. 自动在页面注入黑市弹窗的 HTML (无需手改 index.html)
if (!document.getElementById('appraise-modal')) {
    document.body.insertAdjacentHTML('beforeend', `
    <div id="appraise-modal" class="modal">
        <div class="modal-header modal-header-ink">
            <h3>👁️ 慧眼鉴宝 · 神秘黑市</h3>
            <button class="modal-close" onclick="closeModal('appraise-modal')">×</button>
        </div>
        <div class="modal-content" style="text-align: center; padding: 30px;">
            <div style="background: #fafaf8; border: 1.5px dashed var(--color-border); border-radius: 16px; padding: 40px 20px; margin-bottom: 20px; position: relative; overflow: hidden;">
                <div id="appraise-item-icon" style="font-size: 80px; filter: grayscale(1) contrast(2) brightness(0.5); transition: all 1s ease;">🏺</div>
                <div id="appraise-item-name" style="font-weight: bold; font-size: 16px; margin-top: 15px; color: var(--ink);">沾满泥土的神秘古物</div>
            </div>
            <p style="color: var(--color-text-sub); font-size: 14px; margin-bottom: 20px; line-height: 1.6;">
                黑市商人：这可是刚从西域遗迹里带出来的宝贝，只需 <strong style="color:var(--amber);">150 灵石</strong>！<br>
                买定离手，概不退换！敢赌一把吗？
            </p>
            <button id="appraise-btn" class="btn btn-gold btn-full" onclick="executeAppraise()" style="font-size:16px; padding:14px;">支付 150 灵石进行洗泥鉴定</button>
        </div>
    </div>
    `);
}

// 2. 劫持原有的打开商铺函数，在商铺顶部加入“黑市入口”横幅
const _originalOpenShop = window.openShop;
window.openShop = function() {
    if(typeof _originalOpenShop === 'function') _originalOpenShop();
    
    const grid = document.getElementById('shop-grid');
    if(grid && !document.getElementById('black-market-banner')) {
        // 在普通商店的顶部插入一个炫酷的黑市广告横幅
        grid.insertAdjacentHTML('afterbegin', `
            <div id="black-market-banner" style="grid-column: 1/-1; background: linear-gradient(135deg, #2a2a2a, #1a1a1a); color: white; padding: 18px 24px; border-radius: 12px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--gold); box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                <div>
                    <div style="font-weight: bold; color: var(--gold); margin-bottom: 5px; font-size: 16px;">👁️ 隐藏黑市 · 慧眼鉴宝</div>
                    <div style="font-size: 12px; color: #aaa;">神秘商人带来了盲盒古物，可能开出绝世珍宝！</div>
                </div>
                <button class="btn btn-gold" onclick="openAppraise()">前往鉴宝</button>
            </div>
        `);
    }
};

// 3. 盲盒鉴定逻辑
window.openAppraise = function() {
    closeModal('shop-panel'); // 先关掉普通商店
    document.getElementById('appraise-item-icon').style.filter = 'grayscale(1) contrast(2) brightness(0.5)';
    document.getElementById('appraise-item-icon').innerText = '🏺';
    document.getElementById('appraise-item-name').innerHTML = '沾满泥土的神秘古物';
    document.getElementById('appraise-btn').style.display = 'block';
    openModal('appraise-modal');
};

window.executeAppraise = function() {
    if (!spendStones(150)) {
        showNotification('灵石不足，商人对你翻了个白眼', '😒');
        return;
    }
    
    document.getElementById('appraise-btn').style.display = 'none';
    const iconEl = document.getElementById('appraise-item-icon');
    const nameEl = document.getElementById('appraise-item-name');
    
    iconEl.style.animation = 'shake 0.3s ease infinite';
    nameEl.innerText = "正在清洗表面泥土...";
    if(typeof playSound === 'function') playSound('magic');
    
    setTimeout(() => {
        iconEl.style.animation = '';
        iconEl.style.filter = 'none'; 
        iconEl.style.transform = 'scale(1.5)';
        
        const roll = Math.random();
        if (roll > 0.75) {
            iconEl.innerText = '👑';
            nameEl.innerHTML = '<span style="color:var(--cinnabar); font-size:20px;">【传世国宝】金丝楠木皇冠</span>';
            showNotification('赚翻了！绝世珍宝出世！', '🎉');
            addItem('金丝楠木皇冠', 1);
        } else if (roll > 0.35) {
            iconEl.innerText = '🫖';
            nameEl.innerHTML = '<span style="color:var(--jade); font-size:18px;">【真品】明代紫砂壶</span>';
            showNotification('眼光不错，是一件小赚的真品！', '✅');
            addItem('明代紫砂壶', 1);
        } else {
            iconEl.innerText = '🧱';
            nameEl.innerHTML = '<span style="color:#888;">【赝品】现代仿制破砖头</span>';
            showNotification('打眼了... 这只是个现代仿制品，交学费了。', '💥');
        }
        setTimeout(() => iconEl.style.transform = 'scale(1)', 500);
    }, 1800);
};

// 
// ============================================================
// 十六、化身纪核心逻辑：动态换装 · 性格演化 · 名号系统 (升级版)
// ============================================================

gameState.equipment = gameState.equipment || { '首': null, '佩': null, '袍': null, '履': null, '持': null };
gameState.title = gameState.title || null;

// ── 动态注入换装弹窗 HTML ──
if (!document.getElementById('equip-modal')) {
    document.body.insertAdjacentHTML('beforeend', `
    <div id="equip-modal" class="modal" style="width:480px;">
        <div class="modal-header modal-header-jade">
            <h3 id="equip-modal-title">装备灵物</h3>
            <button class="modal-close" onclick="closeModal('equip-modal')">×</button>
        </div>
        <div class="modal-content" id="equip-modal-content" style="padding:20px;"></div>
    </div>
    `);
}

// ── 打开换装弹窗（升级版：显示物品详情） ──
window.openEquipModal = function(slot) {
    document.getElementById('equip-modal-title').innerText = `灵物穿戴 · 【${slot}】部位`;
    const content = document.getElementById('equip-modal-content');
    
    // 防错：安全读取 game-content.js 中的字典
    const slotDict = (typeof WEARABLE_DICTIONARY !== 'undefined' ? WEARABLE_DICTIONARY[slot] : {}) || {};
    const currentEquip = gameState.equipment[slot];

    let html = '';
    if (currentEquip) {
        html += `
            <div style="margin-bottom:16px;padding:12px 16px;background:#fff8f0;border:1.5px solid var(--cinnabar);border-radius:10px;display:flex;justify-content:space-between;align-items:center;">
                <div style="font-size:13px;color:var(--cinnabar);">当前穿戴：${slotDict[currentEquip]?.emoji || ''} ${currentEquip}</div>
                <button class="btn btn-sm" style="background:var(--cinnabar);color:white;border:none;" onclick="equipItem('${slot}','${currentEquip}','')">卸下</button>
            </div>`;
    }

    let hasItems = false;
    for (const itemName in slotDict) {
        if ((gameState.inventory[itemName] || 0) <= 0) continue;
        hasItems = true;
        const meta = slotDict[itemName];
        const isEquipped = currentEquip === itemName;
        const dbEntry = (typeof itemDatabase !== 'undefined') ? itemDatabase[itemName] : null;
        const rarityStars = '★'.repeat(meta.rarity || 1) + '☆'.repeat(5 - (meta.rarity || 1));

        html += `
            <div onclick="equipItem('${slot}','${itemName}','')"
                 style="display:flex;align-items:center;gap:14px;padding:14px;border-radius:12px;border:2px solid ${isEquipped ? 'var(--jade)' : '#eee'};background:${isEquipped ? '#edf6f2' : '#fafaf8'};margin-bottom:10px;cursor:pointer;transition:0.2s;"
                 onmouseover="this.style.borderColor='var(--jade)';this.style.transform='translateX(3px)'"
                 onmouseout="this.style.borderColor='${isEquipped ? 'var(--jade)' : '#eee'}';this.style.transform='translateX(0)'">
                <div style="font-size:40px;flex-shrink:0;">${meta.emoji}</div>
                <div style="flex:1;min-width:0;">
                    <div style="font-weight:bold;font-size:14px;color:var(--ink);margin-bottom:2px;">${itemName}</div>
                    <div style="font-size:11px;color:var(--gold);margin-bottom:4px;">${rarityStars}</div>
                    <div style="font-size:12px;color:var(--jade);margin-bottom:3px;">⚡ ${meta.effect}</div>
                    ${dbEntry?.echo ? `<div style="font-size:11px;color:#aaa;font-style:italic;border-top:1px dashed #eee;padding-top:4px;margin-top:4px;">「${dbEntry.echo}」</div>` : ''}
                </div>
                ${isEquipped ? '<div style="color:var(--jade);font-size:18px;flex-shrink:0;">✓</div>' : ''}
            </div>`;
    }

    if (!hasItems && !currentEquip) {
        html = `<div style="text-align:center;padding:40px 20px;color:#888;">
            <div style="font-size:40px;margin-bottom:10px;">🪹</div>
            <p>行囊中暂无适合【${slot}】部位的灵物。</p>
            <p style="font-size:12px;margin-top:5px;">去探索、造物或黑市鉴宝获取吧！</p>
        </div>`;
    }

    content.innerHTML = html;
    openModal('equip-modal');
};

// ── 执行穿戴/卸下 ──
window.equipItem = function(slot, itemName, _emoji) {
    const slotDict = (typeof WEARABLE_DICTIONARY !== 'undefined' ? WEARABLE_DICTIONARY[slot] : {}) || {};
    if (gameState.equipment[slot] === itemName) {
        gameState.equipment[slot] = null;
        showNotification(`已卸下【${itemName}】`, '🧥');
    } else {
        gameState.equipment[slot] = itemName;
        const meta = slotDict[itemName];
        showNotification(`已穿戴【${itemName}】${meta?.effect ? ' · ' + meta.effect : ''}`, '✨');
        if (typeof playSound === 'function') playSound('achievement');
    }
    closeModal('equip-modal');
    _renderEquippedVisuals();
    meditatePersona();
    _updateEquipBuffCard();
};

function _detectCombo() {
    if (typeof PERSONA_COMBOS === 'undefined') return null;
    for (const combo of PERSONA_COMBOS) {
        const match = Object.entries(combo.require).every(
            ([slot, item]) => gameState.equipment[slot] === item
        );
        if (match) return combo;
    }
    return null;
}

function _renderEquippedVisuals() {
    const avatarEl = document.getElementById('main-avatar-emoji');
    if (avatarEl) {
        const robe = gameState.equipment['袍'];
        const head = gameState.equipment['首'];
        let baseEmoji = '🧑';
        if (robe === '苗族靛蓝染布') baseEmoji = '🧑‍🎨';
        else if (robe === '云锦布料' || robe === '云锦霞帔') baseEmoji = '🥻';
        else if (robe === '蜡染布料') baseEmoji = '🧑‍🎤';
        if (head === '金丝楠木皇冠' || head === '法老黄金面具') baseEmoji = '🫅';
        avatarEl.innerText = baseEmoji;
        avatarEl.style.animation = 'popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275)';
        setTimeout(() => avatarEl.style.animation = '', 400);
    }

    const visualBox = document.getElementById('equipped-visuals');
    if (visualBox) visualBox.innerHTML = '';

    const positions = {
        '首': 'top:8%;left:50%;transform:translateX(-50%);font-size:38px;',
        '佩': 'top:52%;left:15%;font-size:32px;',
        '袍': 'top:68%;left:50%;transform:translateX(-50%);font-size:26px;opacity:0.6;',
        '持': 'top:48%;right:15%;font-size:40px;animation:float 3s ease-in-out infinite;',
        '履': 'top:85%;left:50%;transform:translateX(-50%);font-size:32px;',
    };

    let powerScore = 100;

    for (const slot in gameState.equipment) {
        const itemName = gameState.equipment[slot];
        const btn = document.getElementById(`slot-btn-${slot}`);
        if (btn) {
            if (itemName) {
                const dict = typeof WEARABLE_DICTIONARY !== 'undefined' ? WEARABLE_DICTIONARY : {};
                const meta = (dict[slot] || {})[itemName];
                
                btn.innerHTML = meta ? meta.emoji : '📦';
                btn.classList.add('equipped');
                if (meta) {
                    powerScore += (meta.rarity * 20); 
                    if (visualBox) {
                        visualBox.innerHTML += `
                            <div style="position:absolute;${positions[slot]}filter:drop-shadow(0 2px 10px rgba(212,175,55,0.8));z-index:10;transition:all 0.4s ease;">
                                ${meta.emoji}
                            </div>`;
                    }
                }
            } else {
                btn.innerHTML = '🪹';
                btn.classList.remove('equipped');
            }
        }
    }

    const powerEl = document.getElementById('avatar-power-score');
    if (powerEl) {
        if (_detectCombo()) powerScore += 100; 
        powerEl.innerText = powerScore;
    }

    const avatarBox = document.querySelector('.avatar-hero-panel');
    if (avatarBox) {
        const combo = _detectCombo();
        if (combo) {
            avatarBox.style.boxShadow = `0 0 50px ${combo.color}66, inset 0 0 100px ${combo.color}44`;
            avatarBox.style.borderColor = combo.color;
        } else {
            avatarBox.style.boxShadow = '';
            avatarBox.style.borderColor = 'rgba(126, 182, 161, 0.3)';
        }
    }
    _updateTitle();
}

window.meditatePersona = function() {
    const tagsBox = document.getElementById('dynamic-persona-tags');
    if (!tagsBox) return;

    if (typeof playSound === 'function') playSound('magic');

    const statsGrid = document.getElementById('persona-stats-grid');
    if (statsGrid && gameState.lingshi && gameState.lingshi.traits) {
        const traits = gameState.lingshi.traits;
        const maxVal = Math.max(100, traits.craft, traits.explore, traits.social, traits.zen);
        
        const renderStat = (name, val, color) => `
            <div class="stat-pillar">
                <div class="stat-pillar-bg" style="height: ${(val/maxVal)*100}%; background: linear-gradient(to top, ${color}44, ${color}aa);"></div>
                <div class="stat-pillar-val" style="color:${color}; text-shadow: 0 0 10px ${color};">${Math.floor(val)}</div>
                <div class="stat-pillar-name">${name}</div>
            </div>`;
        
        statsGrid.innerHTML = 
            renderStat('🔥 匠心', traits.craft, '#b25d52') +
            renderStat('🍃 寻幽', traits.explore, '#7eb6a1') +
            renderStat('🤝 烟火', traits.social, '#e89a65') +
            renderStat('🧘 禅定', traits.zen, '#8a6da8');
    }

    const tags = [];
    const addTag = (text, color) => tags.push({ text, color });

    const inv = gameState.inventory || {};
    const eq  = gameState.equipment  || {};
    const combo = _detectCombo();

    if (gameState.stones >= 3000) addTag('🪙 富可敌国', 'var(--gold)');
    if (eq['首'] === '金丝楠木皇冠')  addTag('👑 天之骄子', 'var(--cinnabar)');
    if (combo) addTag(`✨ ${combo.name}`, combo.color);
    if ((inv['千年灵芝'] || 0) > 0) addTag('🍄 气运之子', 'var(--jade)');
    if ((gameState.restoredNodes || []).length > 0) addTag('🏮 九州点灯人', 'var(--amber)');

    if (tags.length === 0) addTag('🌱 初入凡尘', '#888');

    tagsBox.innerHTML = '';
    tags.forEach((tag, i) => {
        setTimeout(() => {
            tagsBox.innerHTML += `<span class="tag-pill" style="color:${tag.color}; border:1px solid ${tag.color}; background:rgba(0,0,0,0.3); animation: popIn 0.3s ease;">${tag.text}</span>`;
        }, i * 150);
    });

    const socialList = document.getElementById('social-bonds-list');
    if (socialList && gameState.intimacy) {
        let sHtml = '';
        for (let npcName in gameState.intimacy) {
            if (npcName.includes('_')) continue;
            const val = gameState.intimacy[npcName];
            if (val > 0) {
                sHtml += `
                <li>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <div style="width:30px; height:30px; border-radius:50%; background:rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:center; font-size:16px;">${val >= 50 ? '💖' : '🤝'}</div>
                        <span style="color:#e8dcc8; font-size:14px;">${npcName}</span>
                    </div>
                    <span style="color:var(--cinnabar); font-weight:bold; font-size:13px;">羁绊: ${val}</span>
                </li>`;
            }
        }
        socialList.innerHTML = sHtml || '<li style="color:#888; font-size:13px; justify-content:center;">九州之大，暂无故交</li>';
    }

    _updateTitle();
    _updateEquipBuffCard();
    if (typeof showNotification === 'function') showNotification('灵台空明，真我浮现…数据已同步至化身。', '🧘');
};

function _updateEquipBuffCard() {
    const list = document.getElementById('equip-buff-list');
    if (!list) return;

    let buffs = [];
    for (const slot in gameState.equipment) {
        const itemName = gameState.equipment[slot];
        if (!itemName) continue;
        
        const dict = typeof WEARABLE_DICTIONARY !== 'undefined' ? WEARABLE_DICTIONARY : {};
        const meta = (dict[slot] || {})[itemName];
        
        if (meta) buffs.push(`<div style="padding:6px 0; border-bottom:1px dashed #333; color:#ccc;">${meta.emoji} <strong style="color:white;">${itemName}</strong>：<span style="color:var(--jade);">${meta.effect}</span></div>`);
    }
    const combo = _detectCombo();
    if (combo) {
        buffs.push(`<div style="padding:10px; margin-top:10px; background:rgba(212,175,55,0.1); border-radius:8px; border-left:3px solid ${combo.color}; font-size:13px; color:${combo.color};"><strong>【套装】${combo.name}</strong>：${combo.desc}</div>`);
    }

    if (buffs.length === 0) {
        list.innerHTML = '<div style="color: #888; text-align: center; padding: 20px 0;">尚未穿戴任何灵物</div>';
    } else {
        list.innerHTML = buffs.join('');
    }
}

function _updateTitle() {
    const titleEl = document.getElementById('avatar-title-display');
    if (!titleEl) return;
    
    if (typeof TITLE_DATA === 'undefined') return; 
    
    for (const t of TITLE_DATA) {
        try {
            if (t.condition(gameState)) {
                gameState.title = t.name;
                titleEl.innerText = `「${t.name}」`;
                return;
            }
        } catch (e) {} 
    }
    titleEl.innerText = gameState.title ? `「${gameState.title}」` : '';
}
// ============================================================
// 十七、全动态成就图鉴系统
// ============================================================

// 1. 定义游戏中的成就字典库 (你可以随时在这里加新成就)
const ACHIEVEMENT_DATA = {
    'first_interact': { name: '初露锋芒', desc: '在探索中完成第一次交互，迈出九州第一步', icon: '🌟', reward: 100 },
    'collect_10':     { name: '采药达人', desc: '行囊中收集的物资总数达到 10 件', icon: '🌿', reward: 150 },
    'score_50':       { name: '神投手', desc: '在投壶游戏中单次/累计获得 50 分', icon: '🎯', reward: 200 },
    'craft_first':    { name: '天工开物', desc: '在造物台成功注入灵力，合成第一件灵物', icon: '🔨', reward: 300 }
};

// 确保状态库里有成就容器
if (!gameState.achievements) gameState.achievements = {};

// 2. 动态渲染成就面板
window.renderAchievements = function() {
    const grid = document.getElementById('dynamic-achievement-grid');
    const progress = document.getElementById('achievement-progress');
    if (!grid) return;

    let unlockedCount = 0;
    let html = '';
    
    for (let id in ACHIEVEMENT_DATA) {
        const data = ACHIEVEMENT_DATA[id];
        const isUnlocked = gameState.achievements[id];
        if (isUnlocked) unlockedCount++;

        html += `
            <div class="achievement-badge ${isUnlocked ? 'unlocked' : 'locked'}" 
                 onclick="showAchievementDetail('${id}')">
                ${isUnlocked ? data.icon : '🔒'}
                <div class="item-tooltip" style="width: 140px;">
                    <div style="font-weight:bold; font-size:14px; margin-bottom:5px; color:${isUnlocked ? 'var(--jade)' : '#aaa'};">${data.name}</div>
                    <div style="font-size:11px; white-space:normal; line-height:1.5;">${isUnlocked ? data.desc : '未解锁 (达成条件后显现)'}</div>
                </div>
            </div>
        `;
    }
    grid.innerHTML = html;
    if (progress) progress.innerText = `进度: ${unlockedCount} / ${Object.keys(ACHIEVEMENT_DATA).length}`;
};

// 3. 点击成就徽章的互动反馈
window.showAchievementDetail = function(id) {
    const data = ACHIEVEMENT_DATA[id];
    const isUnlocked = gameState.achievements[id];
    if (isUnlocked) {
        showNotification(`【${data.name}】已解锁！\n${data.desc}`, data.icon, 4000);
    } else {
        showNotification(`【未解锁】达成条件：${data.desc}`, '🔒', 4000);
        // 抖动提示
        const badge = document.querySelector(`.achievement-badge.locked`);
        if (badge) {
            badge.style.animation = 'shake 0.3s ease';
            setTimeout(() => badge.style.animation = '', 300);
        }
    }
};

// 4. 升级现有的解锁逻辑：解锁时立即更新面板
const originalUnlock = window.unlockAchievement;
window.unlockAchievement = function(id, name, desc, reward, icon) {
    // 调用之前的弹窗逻辑
    if (typeof originalUnlock === 'function') {
        originalUnlock(id, name, desc, reward, icon);
    } else {
        if (gameState.achievements[id]) return;
        gameState.achievements[id] = true; 
        earnStones(reward);
        document.getElementById('achievement-icon').innerText = icon;
        document.getElementById('achievement-name').innerText = name;
        document.getElementById('achievement-desc').innerText = desc;
        document.getElementById('achievement-reward').innerText = `奖励: 🪙 ${reward} 灵石`;
        const panel = document.getElementById('achievement-panel');
        if (panel) panel.classList.add('show'); 
        if (typeof playSound === 'function') playSound('achievement');
    }
    // ✅ 核心：解锁后立刻重新渲染成就图鉴！
    renderAchievements();
};

// 5. 挂钩：在造物系统里加入成就触发
const originalExecuteCrafting = window.executeCrafting;
window.executeCrafting = function() {
    if (typeof originalExecuteCrafting === 'function') {
        originalExecuteCrafting();
        // 只要合成成功（扣除了丝线，说明成功），就解锁造物成就
        setTimeout(() => {
            if (gameState.inventory['苏绣青皮团扇'] > 0) {
                unlockAchievement('craft_first', '天工开物', '在造物台成功注入灵力，合成第一件灵物', 300, '🔨');
            }
        }, 1000); // 延迟 1 秒弹出，错开造物成功的提示
    }
};


// ============================================================
// 十八、天地法则底层引擎 (全局时间、日夜交替、世界BUFF)
// ============================================================

// ============================================================
// 核心模块 6：世界时间引擎 (World Time Engine)
// ============================================================
const WorldTimeEngine = {
    states: [
        { id: 'dawn',  name: '晨曦 · 万物苏醒', icon: '🌅', color: 'var(--jade)',    buff: '万物生发：极品晨露等稀有材料现世' },
        { id: 'noon',  name: '午时 · 艳阳高照', icon: '☀️',  color: '#ffb347',       buff: '阳气鼎盛：视野开阔，体力充沛' },
        { id: 'dusk',  name: '黄昏 · 逢魔时刻', icon: '🌇',  color: 'var(--cinnabar)',buff: '阴阳交界：百鬼夜行即将开启' },
        { id: 'night', name: '子夜 · 星汉灿烂', icon: '🌌',  color: 'var(--purple)', buff: '天道共鸣：隐世鬼市商人出没' }
    ],
    tickInterval: null,

    start() {
        if (this.tickInterval) clearInterval(this.tickInterval);
        this.updateUI();
        SolarTermEngine.check();   // 登录时立即检查节气
        this.tickInterval = setInterval(() => {
            gameState.worldState = (gameState.worldState + 1) % 4;
            this.updateUI();
            GameEvent.emit('TIME_CHANGED', this.states[gameState.worldState]);
            SaveManager.save();
        }, 30000);
    },

    updateUI() {
        let ws = parseInt(gameState.worldState);
        if (isNaN(ws) || ws < 0 || ws > 3) { ws = 1; gameState.worldState = 1; }
        const state = this.states[ws];
        if (!state) return;
        const iconEl = document.getElementById('world-icon');
        const timeEl = document.getElementById('world-time');
        const buffEl = document.getElementById('world-buff');
        if (iconEl) iconEl.innerText = state.icon;
        if (timeEl) { timeEl.innerText = state.name; timeEl.style.color = state.color; }
        if (buffEl) buffEl.innerText = state.buff;
        if (typeof updateWorldEcology === 'function') updateWorldEcology(ws, state.id);
    }
};

// ============================================================
// 节气引擎 SolarTermEngine
// ============================================================
const SOLAR_TERMS = [
    { name: '小寒', month: 1,  day: 6,  icon: '❄️',  color: '#a0c4ff',
      buff: '严冬淬炼：陶艺造物大成功率 +15%',
      shopHint: '窑主特供「冬日御寒茶」限时上架',
      activity: { name: '围炉夜话·煮茶局', reward: '暖冬茶汤', stones: 80 } },
    { name: '大寒', month: 1,  day: 20, icon: '🌨️', color: '#bde0fe',
      buff: '岁末回望：获得双倍传习录经验',
      shopHint: '腊月限定「岁寒三友套装」补货',
      activity: { name: '岁末归仓·总结局', reward: '年终手信', stones: 120 } },
    { name: '立春', month: 2,  day: 4,  icon: '🌱',  color: '#b7e4c7',
      buff: '万物复苏：采集材料数量 +20%',
      shopHint: '春耕限定「嫩芽丝线」开放预购',
      activity: { name: '迎春踏青·采茶局', reward: '明前春茶', stones: 100 } },
    { name: '雨水', month: 2,  day: 19, icon: '🌧️', color: '#90e0ef',
      buff: '润物无声：知音羁绊成长速度 +25%',
      shopHint: '雨季特供「春雨纸浆」独家发售',
      activity: { name: '听雨抚琴·知音局', reward: '雨声碎片', stones: 90 } },
    { name: '惊蛰', month: 3,  day: 6,  icon: '⚡',  color: '#f4d35e',
      buff: '万物惊醒：探索隐藏节点出现率翻倍',
      shopHint: '惊蛰限定「百虫图鉴」解锁',
      activity: { name: '曲水流觞·泼墨局', reward: '春雷拓印', stones: 100 } },
    { name: '春分', month: 3,  day: 20, icon: '☯️',  color: '#c8b6ff',
      buff: '阴阳平衡：所有属性成长均衡 +10%',
      shopHint: '春分节气「彩蛋剪纸」限时发售',
      activity: { name: '红纸翻飞·剪纸局', reward: '春分剪花', stones: 110 } },
    { name: '清明', month: 4,  day: 5,  icon: '🌿',  color: '#52b788',
      buff: '慎终追远：传习录感悟深度 +30%',
      shopHint: '清明限定「青团香囊」开放预约',
      activity: { name: '古法制茶·焙茶局', reward: '清明前茶', stones: 150 } },
    { name: '谷雨', month: 4,  day: 20, icon: '🌾',  color: '#95d5b2',
      buff: '百谷滋润：物品合成材料消耗 -10%',
      shopHint: '谷雨特供「雨前龙井」大师亲制',
      activity: { name: '静心观火·开窑局', reward: '谷雨釉色', stones: 90 } },
    { name: '立夏', month: 5,  day: 6,  icon: '☀️',  color: '#f9c74f',
      buff: '夏日生长：技艺经验值获取 +20%',
      shopHint: '初夏限定「荷叶拓染布」开放',
      activity: { name: '手作共创·体验局', reward: '荷香碎片', stones: 100 } },
    { name: '小满', month: 5,  day: 21, icon: '🌻',  color: '#f9a825',
      buff: '小满盈仓：商行所有商品额外 9.5 折',
      shopHint: '小满特惠日：全场非遗手信 9.5 折',
      activity: { name: '穿针引线·苏绣局', reward: '满绣团扇', stones: 130 } },
    { name: '芒种', month: 6,  day: 6,  icon: '🌾',  color: '#e9c46a',
      buff: '芒种播种：拜师成功率 +20%',
      shopHint: '仲夏限定「麦穗书签」师门礼包',
      activity: { name: '笔墨纸砚·文房局', reward: '芒种墨香', stones: 80 } },
    { name: '夏至', month: 6,  day: 21, icon: '🌞',  color: '#ff9f1c',
      buff: '至阳极盛：灵石探索收益 +25%',
      shopHint: '夏至限定「端午五彩绳」特供',
      activity: { name: '彩线缠丝·结绳局', reward: '夏至五彩', stones: 120 } },
    { name: '小暑', month: 7,  day: 7,  icon: '🔥',  color: '#e07a5f',
      buff: '暑气蒸腾：窑变概率大幅提升',
      shopHint: '伏天限定「冰裂纹青瓷」限量开窑',
      activity: { name: '静心观火·开窑局', reward: '暑色窑变', stones: 140 } },
    { name: '大暑', month: 7,  day: 23, icon: '🌡️', color: '#c1440e',
      buff: '三伏淬炼：金属器物造物大成功率 +30%',
      shopHint: '大暑特供「伏茶·消暑香囊」套装',
      activity: { name: '锻金铸纹·錾刻局', reward: '烈日金纹', stones: 150 } },
    { name: '立秋', month: 8,  day: 7,  icon: '🍂',  color: '#e07a5f',
      buff: '金风送爽：织绣类物品合成加成 +15%',
      shopHint: '初秋限定「金叶书衣」独家发售',
      activity: { name: '同好相逢·分享局', reward: '秋实分享', stones: 100 } },
    { name: '处暑', month: 8,  day: 23, icon: '🌤️', color: '#f4a261',
      buff: '暑气消散：体力恢复速度加快',
      shopHint: '处暑特供「秋凉香枕」现货补充',
      activity: { name: '焚香静坐·品香局', reward: '处暑香薰', stones: 90 } },
    { name: '白露', month: 9,  day: 8,  icon: '🌫️', color: '#a8dadc',
      buff: '白露凝珠：稀有材料采集概率 +20%',
      shopHint: '白露限定「露草染布」手工特供',
      activity: { name: '古法制茶·焙茶局', reward: '白露秋茶', stones: 160 } },
    { name: '秋分', month: 9,  day: 23, icon: '🍁',  color: '#e76f51',
      buff: '秋实丰收：背包容量临时扩充 +20 格',
      shopHint: '秋分丰收祭：限定「五谷香囊」',
      activity: { name: '非遗研学·交流局', reward: '秋分图鉴', stones: 120 } },
    { name: '寒露', month: 10, day: 8,  icon: '🍂',  color: '#d4a373',
      buff: '寒意渐浓：制茶类活动奖励翻倍',
      shopHint: '寒露特供「霜降大红袍」预售',
      activity: { name: '围炉夜话·煮茶局', reward: '寒露红茶', stones: 130 } },
    { name: '霜降', month: 10, day: 23, icon: '❄️',  color: '#caf0f8',
      buff: '霜降木气：木雕类物品稀有度提升',
      shopHint: '霜降限定「霜染枫叶书签」特供',
      activity: { name: '闻香识木·雕刻局', reward: '霜降木香', stones: 110 } },
    { name: '立冬', month: 11, day: 7,  icon: '🌬️', color: '#90e0ef',
      buff: '万物收藏：传习录可额外存档一次',
      shopHint: '初冬限定「暖炉香薰套装」上架',
      activity: { name: '焚香静坐·品香局', reward: '立冬香炉', stones: 100 } },
    { name: '小雪', month: 11, day: 22, icon: '🌨️', color: '#e0f7fa',
      buff: '初雪洁净：造物台出品品质提升一级',
      shopHint: '小雪限定「雪白瓷釉」独家配方',
      activity: { name: '揉泥制胎·陶艺局', reward: '初雪素胎', stones: 120 } },
    { name: '大雪', month: 12, day: 7,  icon: '❄️',  color: '#b8d8d8',
      buff: '大雪封山：所有雅集体验时长 +50%',
      shopHint: '大雪限定「岁寒松竹梅套装」',
      activity: { name: '听雨抚琴·知音局', reward: '大雪曲谱', stones: 140 } },
    { name: '冬至', month: 12, day: 22, icon: '🌑',  color: '#6c757d',
      buff: '冬至一阳生：所有技艺属性成长 +20%（今日特惠）',
      shopHint: '冬至大节：全场匠师手信 8.5 折 · 限时一天',
      activity: { name: '围炉夜话·煮茶局', reward: '冬至汤圆', stones: 200 } },
];

// ============================================================
// 十九、非遗百科 (纯净科普系统)
// ============================================================

// 1. 纯净科普渲染 (完美还原竖向卡片、折角与青色渐变封面)
window.renderEncyclopedia = function(category = 'all', query = '') {
    const grid = document.getElementById('encyclopedia-grid');
    if (!grid) return;

    const dataSource = typeof encyclopediaData !== 'undefined' ? encyclopediaData : [];
    let list = dataSource;
    
    if (category !== 'all') {
        list = list.filter(item => item.category === category || item.cat === category);
    }
    if (query.trim()) {
        list = list.filter(item => item.title.includes(query) || (item.desc && item.desc.includes(query)));
    }

    // 映射分类标识为中文展示
    const categoryNameMap = {
        'zhixiu': '织绣印染',
        'taoci':  '陶瓷烧造',
        'diaoke': '雕刻塑造',
        'yinlv':  '音律乐器',
        'minsu':  '民俗技艺',
        'shuhua': '书画印刷'
    };

    // 去除破坏布局的内联 style，全面启用 views.css 中预设好的优美样式
    grid.innerHTML = list.map(item => {
        const catName = categoryNameMap[item.category] || item.type || item.level || '非遗科普';
        const subtitle = item.subtitle || '探索千年文化图鉴';

        return `
        <div class="encyclopedia-card scroll-reveal" onclick="openEncyclopediaDetail('${item.title}')" style="cursor: pointer;">
            <div class="encyclopedia-cover">
                ${item.icon || item.cover || '📚'}
            </div>
            <div class="encyclopedia-info">
                <div class="encyclopedia-card-title">${item.title}</div>
                <div class="encyclopedia-type-badge">${catName}</div>
                <div class="encyclopedia-desc">${subtitle}</div>
            </div>
        </div>
    `}).join('');
};

window.searchEncyclopedia = function() {
    const query = document.getElementById('encyclopedia-search-input').value;
    const activeCat = document.querySelector('.encyclopedia-cat.active').dataset.cat;
    renderEncyclopedia(activeCat, query);
};

window.filterEncyclopedia = function(category) {
    document.querySelectorAll('.encyclopedia-cat').forEach(btn => btn.classList.remove('active'));
    if(event && event.currentTarget) event.currentTarget.classList.add('active');
    renderEncyclopedia(category, document.getElementById('encyclopedia-search-input')?.value || '');
};

// 2. 打开纯净的科普弹窗 (完美过滤参数 + 博物馆级高雅排版)
window.openEncyclopediaDetail = function(title) {
    const dataSource = typeof encyclopediaData !== 'undefined' ? encyclopediaData : [];
    const item = dataSource.find(i => i.title === title);
    if (!item) return;
    
    document.getElementById('encyclopedia-detail-title').innerText = item.title;
    
    // 提取专属渐变色，如果没有则用默认浅色
    const iconBg = item.coverBg || 'linear-gradient(135deg, #fdfbf7, #f0ece4)';

    // 动态构建 HTML
    let html = `<div style="display:flex; gap:24px; margin-bottom:30px; align-items: flex-start;">`;
    
    // 左侧大图标：应用了专属渐变色、白色描边与高级阴影
    html += `<div style="width:120px; height:120px; background:${iconBg}; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:65px; flex-shrink:0; box-shadow: 0 8px 20px rgba(0,0,0,0.08); border: 3px solid white;">
                <span style="filter: drop-shadow(0 6px 8px rgba(0,0,0,0.15));">${item.icon || item.cover || '📚'}</span>
             </div>`;
    
    // 右侧主述及标签
    html += `<div style="flex:1;">
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; flex-wrap:wrap;">
                    <span style="font-size:12px; color:white; background:var(--jade); padding:4px 10px; border-radius:6px; font-weight:bold; letter-spacing:1px; box-shadow:0 2px 6px rgba(126,182,161,0.3);">
                        ${item.type || item.level || '国家级非遗'}
                    </span>`;
    
    // 渲染专属 Tag 标签 (优化了视觉比例)
    if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach(tag => {
            html += `<span style="color:var(--gold); border:1px solid rgba(212,175,55,0.3); background:rgba(212,175,55,0.04); padding:3px 10px; border-radius:6px; font-size:12px;">#${tag}</span>`;
        });
    }
    html += `</div>`;

    // 简介正文
    if (item.desc || item.eduDesc) {
        html += `<div style="font-size:14px; line-height:1.9; color:var(--ink); text-align:justify;">
                    ${item.desc || item.eduDesc}
                 </div>`;
    }
    html += `</div></div>`;

    // 核心档案：加上了背景纸纹与整齐的虚线网格
    if (item.details && Array.isArray(item.details)) {
        html += `<div style="margin-bottom: 25px; background: #fafaf8; background-image: var(--texture-paper); padding: 22px 24px; border-radius: 12px; border: 1px solid #eee5d8; box-shadow: inset 0 0 20px rgba(0,0,0,0.02);">
                    <h4 style="color:var(--cinnabar); margin-bottom:16px; font-size:15px; display:flex; align-items:center; gap:8px;">
                        <span>📜</span> 核心档案
                    </h4>
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px 24px;">`;
        item.details.forEach(d => {
            html += `<div style="font-size:13.5px; border-bottom: 1px dashed rgba(0,0,0,0.06); padding-bottom: 8px; display:flex;">
                        <span style="color:#888; width: 75px; flex-shrink:0;">${d.label}</span>
                        <span style="color:var(--ink); font-weight:bold;">${d.value}</span>
                     </div>`;
        });
        html += `</div></div>`;
    }

    // 🌟 核心修复：把 coverBg, unlocked 等非展示字段加入黑名单，防止漏出
    const ignoreKeys = [
        'id', 'title', 'icon', 'cover', 'coverBg', 'type', 'level', 
        'desc', 'eduDesc', 'category', 'cat', 'func', 'img', 'details', 
        'tags', 'relatedItems', 'relatedInheritors', 'subtitle', 'unlocked'
    ];
    
    // 遍历渲染其余纯文本字段 (增加了左侧翠绿边框的雅致设计)
    for (let key in item) {
        if (!ignoreKeys.includes(key) && typeof item[key] === 'string' && item[key].trim() !== '') {
            let sectionTitle = key;
            if (key === 'history') sectionTitle = '🕰️ 历史渊源';
            else if (key === 'process' || key === 'technique') sectionTitle = '⚒️ 核心技艺';
            else if (key === 'value') sectionTitle = '💎 文化价值';
            else if (key === 'inheritor') sectionTitle = '🧑‍🏫 代表传承人';
            else if (key === 'location') sectionTitle = '🗺️ 发源地';

            html += `
                <div style="margin-bottom: 20px;">
                    <h4 style="color:var(--ink); margin-bottom:10px; font-size:15px; display:flex; align-items:center; gap:6px;">
                        ${sectionTitle}
                    </h4>
                    <div style="font-size:14px; color:#555; line-height:1.8; background:rgba(0,0,0,0.02); padding:14px 18px; border-radius:8px; border-left:3px solid var(--jade);">
                        ${item[key]}
                    </div>
                </div>
            `;
        }
    }

    // 底部：居中圆形按钮，引导感更强
    const shopCat = item.category || item.cat || 'all';
    html += `
        <div style="margin-top: 40px; text-align:center;">
            <button class="btn btn-outline" style="padding: 12px 36px; font-size: 15px; border-radius: 30px; border-color:var(--jade); color:var(--jade); box-shadow: 0 4px 12px rgba(126,182,161,0.15);" 
                    onclick="closeModal('encyclopedia-detail-modal'); switchMainView('view-workshop', document.getElementById('dock-workshop')); filterWorkshop('${shopCat}');">
                ⛩️ 前往天工阁寻访
            </button>
        </div>
    `;
    
    document.getElementById('encyclopedia-detail-content').innerHTML = html;
    openModal('encyclopedia-detail-modal');
};
// ============================================================
// 二十、残卷图鉴系统 (独立的游戏化收集玩法)
// ============================================================

const FRAGMENT_DATABASE = [
    { 
        id: 'frag_1', title: '残卷·天衣无缝', icon: '📜', 
        desc: '记载着苏绣上古技法的残卷。', 
        reqItems: ['苏绣丝线', '戏服碎布'], 
        secret: '【苏绣隐藏信息】传闻锦绣坊的王绣娘最喜好百年红酒。若将红酒赠予她，可大幅提升亲密度，解锁隐藏的“双面绣”图纸。',
        unlocked: false 
    },
    { 
        id: 'frag_2', title: '残卷·造化息壤', icon: '📜', 
        desc: '关于景德镇窑火的神秘记录。', 
        reqItems: ['高岭陶土', '沉香木料'], 
        secret: '【陶瓷隐藏信息】百作镇材料行的铁老三私藏了一块陨铁。拿着这本残卷去找他闲聊，或许能便宜买下。',
        unlocked: false 
    }
];

let currentFragmentId = null;

// 1. 打开图鉴画廊
window.openFragmentGallery = function() {
    const grid = document.getElementById('fragment-grid');
    
    grid.innerHTML = FRAGMENT_DATABASE.map(frag => {
        let collectedCount = 0;
        frag.reqItems.forEach(req => {
            if (gameState.inventory && gameState.inventory[req] > 0) collectedCount++;
        });
        const isReady = !frag.unlocked && collectedCount >= frag.reqItems.length;

        return `
        <div style="background: #2c2a28; border: 1px solid ${frag.unlocked ? 'var(--gold)' : '#444'}; border-radius: 8px; padding: 15px; text-align: center; cursor: pointer; transition: 0.3s; position: relative;" onclick="openFragmentDetail('${frag.id}')">
            ${isReady ? `<div style="position:absolute; top:-5px; right:-5px; width:12px; height:12px; background:var(--cinnabar); border-radius:50%; animation:pulse 1s infinite;"></div>` : ''}
            <div style="font-size: 40px; margin-bottom: 10px; filter: ${frag.unlocked ? 'none' : 'grayscale(1) opacity(0.5)'};">${frag.icon}</div>
            <div style="color: ${frag.unlocked ? 'var(--gold)' : '#aaa'}; font-weight: bold; font-size: 14px; margin-bottom: 5px;">${frag.title}</div>
            <div style="color: #666; font-size: 11px;">${frag.unlocked ? '👁️ 已唤醒' : `收集进度: ${collectedCount}/${frag.reqItems.length}`}</div>
        </div>
        `;
    }).join('');
    
    openModal('fragment-gallery-modal');
};

// 2. 打开单个残卷的献祭详情
window.openFragmentDetail = function(id) {
    const frag = FRAGMENT_DATABASE.find(i => i.id === id);
    if (!frag) return;
    currentFragmentId = id;
    
    document.getElementById('fragment-detail-title').innerText = frag.title;
    const content = document.getElementById('fragment-detail-content');
    
    if (frag.unlocked) {
        content.innerHTML = `
            <div style="text-align:center; font-size:50px; margin-bottom:15px;">🌟</div>
            <div style="color:#aaa; font-size:13px; margin-bottom:15px; text-align:center;">此残卷已被唤醒，记录着以下非遗隐秘：</div>
            <div style="background:rgba(212,175,55,0.1); border-left:3px solid var(--gold); padding:15px; color:var(--gold); line-height:1.8; font-size:14px; border-radius:4px;">
                ${frag.secret}
            </div>
        `;
    } else {
        let canUnlock = true;
        let slotsHtml = `
            <div style="color:#ccc; font-size:14px; margin-bottom:20px;">${frag.desc}</div>
            <div style="margin-bottom:10px; font-size:12px; color:#888;">需在行囊中集齐以下灵物方可唤醒：</div>
            <div style="display:flex; gap:10px; margin-bottom:25px;">
        `;
        
        frag.reqItems.forEach(reqName => {
            const hasCount = (gameState.inventory && gameState.inventory[reqName]) ? gameState.inventory[reqName] : 0;
            const isMet = hasCount > 0;
            if (!isMet) canUnlock = false;
            slotsHtml += `
                <div style="flex:1; background: ${isMet ? 'rgba(126,182,161,0.2)' : 'rgba(0,0,0,0.3)'}; border: 1px solid ${isMet ? 'var(--jade)' : '#555'}; padding: 12px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 14px; color: ${isMet ? '#fff' : '#aaa'}; font-weight: bold;">${reqName}</div>
                    <div style="font-size: 12px; color: ${isMet ? 'var(--jade)' : '#666'}; margin-top: 5px;">${isMet ? '✅ 已拥有' : '❌ 未拥有'}</div>
                </div>
            `;
        });
        slotsHtml += `</div>`;
        
        if (canUnlock) {
            slotsHtml += `<button id="unlock-frag-btn" class="btn btn-gold" style="width:100%; font-size:16px; padding:12px;" onclick="unlockFragment()">注入灵物 · 唤醒残卷</button>`;
        } else {
            slotsHtml += `<button class="btn btn-outline" style="width:100%; border-color:#555; color:#555; cursor:not-allowed;" disabled>灵物不足，无法唤醒</button>`;
        }
        
        content.innerHTML = slotsHtml;
    }
    
    openModal('fragment-detail-modal');
};

// 3. 唤醒残卷
window.unlockFragment = function() {
    const frag = FRAGMENT_DATABASE.find(i => i.id === currentFragmentId);
    if (!frag || frag.unlocked) return;
    
    // 扣除材料
    frag.reqItems.forEach(reqName => { gameState.inventory[reqName]--; });
    frag.unlocked = true;
    if (typeof updateInventory === 'function') updateInventory(); 
    
    const btn = document.getElementById('unlock-frag-btn');
    btn.innerText = '正在唤醒...';
    if (typeof playSound === 'function') playSound('magic');
    
    setTimeout(() => {
        openFragmentDetail(frag.id); // 刷新详情面板显示秘密
        openFragmentGallery();       // 刷新底层的画廊状态
        showNotification(`【图鉴系统】成功唤醒《${frag.title}》！`, '📜');
    }, 1000);
};

// ============================================================
// 二十一、灵犀袋 3.0 (兼容原生 itemDatabase 与 useFunc 回调)
// ============================================================

// ============================================================
// 🌟 进阶优化 2：大一统灵犀袋 (背包) 渲染引擎
// ============================================================
window.updateInventory = function(filter = 'all') {
    const grid = document.getElementById('inventory-list');
    if (!grid) return;

    // 1. 新手礼包安全兜底：如果背包完全为空或缺少关键道具，自动发放
    if (Object.keys(gameState.inventory).length === 0 || !gameState.inventory['茶经残卷']) {
        if (typeof STARTING_INVENTORY !== 'undefined') {
            for (let item in STARTING_INVENTORY) {
                if (!gameState.inventory[item]) {
                    gameState.inventory[item] = STARTING_INVENTORY[item];
                }
            }
        }
    }

    // 2. 构建渲染 HTML
    let html = '';
    let isEmpty = true;

    for (let itemName in gameState.inventory) {
        const count = gameState.inventory[itemName];
        if (count > 0) {
            // 安全读取图鉴数据库 (防报错)
            const itemData = (typeof itemDatabase !== 'undefined' && itemDatabase[itemName]) 
                ? itemDatabase[itemName] 
                : { type: 'unknown', icon: '📦', desc: '未知物品。', rarity: 1 };
            
            // 过滤逻辑
            if (filter === 'all' || itemData.type === filter || (filter === 'collection' && itemData.type === 'rare')) {
                isEmpty = false;
                // 稀有度发光边框颜色
                const rarityColors = { 1: '#eee', 2: '#a5d6a7', 3: '#90caf9', 4: '#ce93d8', 5: '#ffd54f' };
                const borderColor = rarityColors[itemData.rarity] || '#eee';

                html += `
                <div class="inventory-item scroll-reveal" style="background: white; border: 1.5px solid ${borderColor}; border-radius: 12px; padding: 15px; text-align: center; cursor: pointer; transition: all 0.2s; position: relative;" 
                     onclick="openItemDetail('${itemName}')" 
                     onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.1)';" 
                     onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                    <div style="font-size: 38px; margin-bottom: 10px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">${itemData.icon}</div>
                    <div style="font-size: 13px; font-weight: bold; color: var(--ink); margin-bottom: 4px;">${itemName}</div>
                    <div style="font-size: 11px; color: #888;">拥有: <span style="color:var(--jade); font-weight:bold;">${count}</span></div>
                    ${itemData.echo ? `<div style="position:absolute; top:-4px; right:-4px; width:12px; height:12px; background:var(--purple); border-radius:50%; box-shadow:0 0 10px var(--purple); animation: pulse 1.5s infinite;" title="蕴含记忆回音"></div>` : ''}
                </div>
                `;
            }
        }
    }

    // 3. 空状态展示
    if (isEmpty) {
        html = `<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #aaa;">
                    <div style="font-size: 50px; margin-bottom: 15px; opacity: 0.5;">🪹</div>
                    这里空空如也，去大世界探索吧！
                </div>`;
    }
    
    grid.innerHTML = html;
};

// 兼容别名：如果有别的旧代码试图调用 renderInventory，直接指向 updateInventory
window.renderInventory = window.updateInventory;


let currentInspectItem = null;

// 将英文 type 映射为中文展示
const ITEM_TYPE_MAP = {
    'material': '材料',
    'collection': '收藏',
    'prop': '道具',
    'rare': '奇珍',
    'contract': '契约',
    'currency': '货币'
};

// 1. 初始化开局物资 (修复：即使有旧存档，也会强制补发缺失的新手物资)
function _initStartingItems() {
    if (!gameState.inventory) gameState.inventory = {};
    
    // 强制检查：只要你包里没有 '茶经残卷'，就说明你没领过最新的新手礼包，直接强制发放！
    if (!gameState.inventory['茶经残卷'] && typeof STARTING_INVENTORY !== 'undefined') {
        for (let item in STARTING_INVENTORY) {
            // 只把没有的物品塞进去，不覆盖你原有已经攒下的好东西
            if (!gameState.inventory[item]) {
                gameState.inventory[item] = STARTING_INVENTORY[item];
            }
        }
        // 如果有保存函数，顺便保存一下新状态
        if (typeof saveGame === 'function') saveGame(); 
    }
}


// 过滤标签切换
window.filterInventory = function(type) {
    document.querySelectorAll('.inventory-filter .filter-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
    renderInventory(type);
};

// 打开物品详情
window.openItemDetail = function(itemName) {
    currentInspectItem = itemName;
    const itemData = (typeof itemDatabase !== 'undefined' && itemDatabase[itemName]) 
        ? itemDatabase[itemName] 
        : { type: 'unknown', icon: '📦', desc: '神秘物件。', echo: null, usable: false };
    
    const count = gameState.inventory[itemName] || 0;
    const displayType = ITEM_TYPE_MAP[itemData.type] || '未知';

    document.getElementById('item-detail-name').innerText = itemName;
    document.getElementById('item-detail-icon').innerText = itemData.icon;
    document.getElementById('item-detail-type').innerText = `${displayType} · 珍品级${itemData.rarity}`;
    document.getElementById('item-detail-count').innerText = `拥有: ${count}`;
    document.getElementById('item-detail-desc').innerText = itemData.desc;

    const echoContainer = document.getElementById('item-echo-container');
    const echoText = document.getElementById('item-echo-text');
    document.getElementById('item-echo-glow').style.opacity = '0';
    
    let btnHtml = '';

    // 记忆回音按钮
    if (itemData.echo) {
        echoContainer.style.display = 'block';
        echoText.innerText = '（残留着远古的灵力波动，似乎隐藏着秘密...）';
        echoText.style.filter = 'blur(4px)';
        echoText.style.color = '#888';
        btnHtml += `<button class="btn btn-outline" style="flex:1; border-color:var(--purple); color:var(--purple);" onclick="extractMemoryEcho()">✨ 触碰回音</button>`;
    } else {
        echoContainer.style.display = 'none';
    }

    // 物品使用按钮 (兼容你预留的 useFunc)
    if (itemData.usable) {
        const actionStr = itemData.actionName || '使用';
        btnHtml += `<button class="btn btn-jade" style="flex:1; box-shadow: 0 4px 10px rgba(126, 182, 161, 0.4);" onclick="useItemInBag('${itemName}')">${actionStr}</button>`;
    }

    if (btnHtml === '') {
        btnHtml = `<button class="btn btn-outline" style="flex:1; border-color:#555; color:#888; cursor:not-allowed;" disabled>此物暂无特殊交互</button>`;
    }

    document.getElementById('item-action-buttons').innerHTML = btnHtml;
    if (typeof playSound === 'function') playSound('click');
    openModal('item-detail-modal');
};

// 提取记忆回音
window.extractMemoryEcho = function() {
    const itemData = itemDatabase[currentInspectItem];
    if (!itemData || !itemData.echo) return;

    if (typeof playSound === 'function') playSound('magic');
    const echoText = document.getElementById('item-echo-text');
    const btn = event.currentTarget;
    
    btn.innerText = '灵识解析中...';
    btn.disabled = true;
    document.getElementById('item-echo-glow').style.opacity = '1';

    setTimeout(() => {
        echoText.style.filter = 'blur(0px)';
        echoText.style.color = 'var(--gold)';
        echoText.innerText = itemData.echo;
        btn.style.display = 'none';
        showNotification('获得了一段隐秘的岁月线索！', '🧩');
    }, 1500);
};

// 新增：深度剧情向的物品使用逻辑 (调用你的 useFunc 挂载)
window.useItemInBag = function(itemName) {
    const itemData = itemDatabase[itemName];
    
    if (gameState.inventory[itemName] > 0) {
        // 如果你有设定特殊回调函数 (如 triggerQuest, readEncyclopedia)
        if (itemData.useFunc && typeof window[itemData.useFunc] === 'function') {
            closeModal('item-detail-modal');
            window[itemData.useFunc](itemName); // 触发你的专属事件！
            return;
        }

        // 通用的消耗反馈逻辑
        gameState.inventory[itemName]--;
        renderInventory(); 
        
        if (itemName === '传统年糕') {
            closeModal('item-detail-modal');
            showNotification('你吃下了一块传统年糕，体力恢复了20点！', '🎂');
        } else if (itemName === '百年红酒') {
            closeModal('item-detail-modal');
            showNotification('你一饮而尽，体力大涨，但视野开始产生奇妙的重影...', '🍷');
        } else {
            closeModal('item-detail-modal');
            showNotification(`你使用了【${itemName}】！`, '✨');
        }
    }
};

// 兜底函数：如果你还没写具体的 useFunc，系统不会报错，而是给提示
window.triggerQuest = function(itemName) { showNotification(`【系统提示】检测到关键道具 ${itemName}，即将触发隐藏支线任务... (待开发)`, '📜', 4000); }
window.readEncyclopedia = function(itemName) { showNotification(`你翻开了 ${itemName}，获得大量非遗文化知识。`, '📚', 4000); }
window.playHologram = function(itemName) { showNotification(`【全息投影已启动】正在播放百年前的传承录像...`, '📸', 4000); }



// ============================================================
// 二十二、天工造物引擎 2.0 (Crafting System)
// ============================================================

let currentCraftRecipeId = null;

// 1. 初始化造物状态 (确保有已解锁图纸数组)
function _initCraftingState() {
    if (!gameState.unlockedRecipes) {
        gameState.unlockedRecipes = [];
        // 把默认解锁的图纸加进去
        if (typeof CRAFTING_RECIPES !== 'undefined') {
            CRAFTING_RECIPES.forEach(recipe => {
                if (recipe.defaultUnlocked) gameState.unlockedRecipes.push(recipe.id);
            });
        }
    }
    
    // 如果玩家使用了“破砖头”获得了绝密图纸，我们在这里做一个判定解锁彩蛋
    if (gameState.inventory && gameState.inventory['天工绝密图纸'] > 0 && !gameState.unlockedRecipes.includes('recipe_qingniao')) {
        gameState.unlockedRecipes.push('recipe_qingniao');
        showNotification('检测到【天工绝密图纸】，已为你解锁隐藏配方《发条青鸟》！', '🕊️');
    }
}

// 2. 打开造物台面板并渲染左侧列表
window.openCrafting = function() {
    _initCraftingState();
    
    const listContainer = document.getElementById('crafting-recipe-list');
    if (!listContainer || typeof CRAFTING_RECIPES === 'undefined') return;

    let unlockedCount = 0;
    let listHtml = '';

    CRAFTING_RECIPES.forEach(recipe => {
        const isUnlocked = gameState.unlockedRecipes.includes(recipe.id);
        
        if (isUnlocked) {
            unlockedCount++;
            listHtml += `
            <div class="craft-recipe-item" style="background: white; border: 1.5px solid #ddd; border-radius: 8px; padding: 12px; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: 0.2s;" onclick="selectRecipe('${recipe.id}', this)">
                <div style="font-size: 24px; background: #fafaf8; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 6px;">${recipe.icon}</div>
                <div>
                    <div style="font-weight: bold; font-size: 14px; color: var(--ink);">${recipe.name}</div>
                    <div style="font-size: 11px; color: var(--jade);">${recipe.type}</div>
                </div>
            </div>`;
        } else {
            // 未解锁的图纸显示为暗影状态
            listHtml += `
            <div style="background: #eee; border: 1px dashed #ccc; border-radius: 8px; padding: 12px; display: flex; align-items: center; gap: 12px; opacity: 0.6;">
                <div style="font-size: 24px; filter: grayscale(1);">🔒</div>
                <div>
                    <div style="font-weight: bold; font-size: 14px; color: #888;">未知图谱</div>
                    <div style="font-size: 11px; color: #aaa;">需寻找机缘解锁</div>
                </div>
            </div>`;
        }
    });

    listContainer.innerHTML = listHtml;
    document.getElementById('unlocked-recipe-count').innerText = `${unlockedCount}/${CRAFTING_RECIPES.length}`;
    
    // 重置右侧面板为空状态
    document.getElementById('crafting-empty-state').style.display = 'block';
    document.getElementById('crafting-active-state').style.display = 'none';
    currentCraftRecipeId = null;

    openModal('crafting-modal');
    if (typeof playSound === 'function') playSound('click');
};

// 3. 选中图纸：在右侧渲染需求与校验库存
window.selectRecipe = function(recipeId, element) {
    // 处理左侧列表高亮
    document.querySelectorAll('.craft-recipe-item').forEach(el => {
        el.style.borderColor = '#ddd';
        el.style.boxShadow = 'none';
    });
    element.style.borderColor = 'var(--gold)';
    element.style.boxShadow = '0 4px 10px rgba(212,175,55,0.15)';

    const recipe = CRAFTING_RECIPES.find(r => r.id === recipeId);
    if (!recipe) return;
    
    currentCraftRecipeId = recipeId;

    // 切换右侧面板
    document.getElementById('crafting-empty-state').style.display = 'none';
    const activeState = document.getElementById('crafting-active-state');
    activeState.style.display = 'flex';
    
    // 带有轻微回弹动画
    activeState.style.animation = 'none';
    setTimeout(() => activeState.style.animation = 'fadeInUp 0.3s ease', 10);

    document.getElementById('craft-target-icon').innerText = recipe.icon;
    document.getElementById('craft-target-name').innerText = recipe.name;
    document.getElementById('craft-target-desc').innerText = recipe.desc;

    // 渲染材料需求卡片并校验
    let reqsHtml = '';
    let canCraft = true;
    
    if (!gameState.inventory) gameState.inventory = {};

    for (let matName in recipe.reqs) {
        const needAmount = recipe.reqs[matName];
        const haveAmount = gameState.inventory[matName] || 0;
        const isEnough = haveAmount >= needAmount;
        
        if (!isEnough) canCraft = false;

        reqsHtml += `
        <div style="background: ${isEnough ? '#fdfaf4' : '#fcf5f5'}; padding: 10px 15px; border-radius: 8px; border: 1px solid ${isEnough ? 'var(--gold)' : 'var(--cinnabar)'}; text-align: center; min-width: 90px;">
            <div style="font-size: 13px; font-weight: bold; color: var(--ink); margin-bottom: 5px;">${matName}</div>
            <div style="font-size: 12px;">
                <span style="color: ${isEnough ? 'var(--jade)' : 'var(--cinnabar)'}; font-weight: bold;">${haveAmount}</span> 
                <span style="color: #888;">/ ${needAmount}</span>
            </div>
        </div>`;
    }

    document.getElementById('craft-req-materials').innerHTML = reqsHtml;

    // 更新按钮状态
    const craftBtn = document.getElementById('execute-craft-btn');
    if (canCraft) {
        craftBtn.disabled = false;
        craftBtn.innerText = '✨ 注入灵力 · 立即造物';
        craftBtn.className = 'btn btn-gold btn-full';
    } else {
        craftBtn.disabled = true;
        craftBtn.innerText = '材料不足，无法造物';
        craftBtn.className = 'btn btn-outline btn-full';
        craftBtn.style.color = '#888';
        craftBtn.style.borderColor = '#ccc';
    }
};

// 4. 执行造物 (扣除材料、发放物品、特效反馈)
window.executeCrafting = function() {
    if (!currentCraftRecipeId) return;
    const recipe = CRAFTING_RECIPES.find(r => r.id === currentCraftRecipeId);
    if (!recipe) return;

    // 再次静默校验，防黑客(笑)
    for (let matName in recipe.reqs) {
        if ((gameState.inventory[matName] || 0) < recipe.reqs[matName]) return;
    }

    // 1. 扣除所需材料
    for (let matName in recipe.reqs) {
        gameState.inventory[matName] -= recipe.reqs[matName];
    }

    // 2. 播放炫酷特效
    if (typeof playSound === 'function') playSound('magic');
    const fxOverlay = document.getElementById('crafting-fx-overlay');
    const targetIcon = document.getElementById('craft-target-icon');
    
    targetIcon.style.transform = 'scale(1.5) rotate(10deg)';
    fxOverlay.style.display = 'flex';

    // 3. 延迟发放物品，模拟造物过程
    setTimeout(() => {
        fxOverlay.style.display = 'none';
        targetIcon.style.transform = 'scale(1) rotate(0deg)';
        
        // 调用你写好的通用 addItem 添加产物
        if (typeof addItem === 'function') {
            addItem(recipe.name, 1);
        } else {
            gameState.inventory[recipe.name] = (gameState.inventory[recipe.name] || 0) + 1;
        }

        showNotification(`天工开物！成功制造出绝品【${recipe.name}】！`, recipe.icon);
        
        // 重新选中当前配方，刷新材料数字
        const activeItem = document.querySelector('.craft-recipe-item[style*="var(--gold)"]');
        if (activeItem) selectRecipe(recipe.id, activeItem);
        
    }, 1200);
};


// ==========================================
// 🗺️ 辅助：查看当前物品的溯源树状图
// ==========================================
window.viewRecipeTree = function() {
    if (!currentWorkRecipe) return;
    
    let reqsText = [];
    for (let mat in currentWorkRecipe.reqs) {
        // 查找这个材料是不是也是某个配方做出来的
        const subRecipe = ADVANCED_RECIPES.find(r => r.name === mat);
        if (subRecipe) {
            const stationName = CRAFTING_STATIONS[subRecipe.station].name;
            reqsText.push(`需要前往【${stationName}】制作 [${mat}]`);
        } else {
            reqsText.push(`需要去大世界采集 [${mat}]`);
        }
    }
    
    const hint = `【${currentWorkRecipe.name}】工序溯源：\n\n` + reqsText.join('\n');
    alert(hint); // 暂时用 alert，你可以替换为你自定义的通用弹窗 _showGenericModal(title, text)
};

// ============================================================
// 🚨 强制覆盖：天工造物 3.0 核心入口 
// ============================================================

window.openCrafting = function() {
    console.log("尝试打开天工造物台...");
    
    // 1. 容错检查：看看 HTML 是否真的保存成功了
    if (!document.getElementById('station-hub-modal')) {
        alert("错误：在页面中找不到新的造物大厅 HTML！请检查 index.html 是否已经保存刷新。");
        return;
    }
    
    // 2. 互斥清理旧弹窗
    closeModal('crafting-modal'); 
    closeModal('station-work-modal');
    
    // 3. 渲染并打开新大厅
    const grid = document.getElementById('station-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    // 确保 CRAFTING_STATIONS 数据存在 (来自 game-content.js)
    if (typeof CRAFTING_STATIONS === 'undefined') {
        alert("错误：找不到 CRAFTING_STATIONS 数据！请检查 game-content.js 是否已保存。");
        return;
    }

    // 动态生成四个造物设备
    for (const [stationId, data] of Object.entries(CRAFTING_STATIONS)) {
        grid.innerHTML += `
            <div style="border:1.5px solid #ddd; border-radius:12px; padding:15px; text-align:center; cursor:pointer; background:#fafaf8; transition:0.2s;" 
                 onclick="enterStation('${stationId}')"
                 onmouseover="this.style.borderColor='var(--jade)'; this.style.transform='translateY(-2px)';"
                 onmouseout="this.style.borderColor='#ddd'; this.style.transform='translateY(0)';">
                <div style="font-size:45px; margin-bottom:10px;">${data.icon}</div>
                <div style="font-weight:bold; font-size:15px; color:var(--ink);">${data.name}</div>
                <div style="font-size:11px; color:#888; margin-top:5px;">${data.desc}</div>
            </div>
        `;
    }
    
    // 调用全局 openModal 打开新大厅
    openModal('station-hub-modal');
    if (typeof playSound === 'function') playSound('click');
};

// 顺便覆盖从工作台返回大厅的函数
window.openCraftingHub = function() {
    window.openCrafting();
};

// ============================================================
// 核心模块 5：音频管理器 (AudioManager)
// ============================================================
const AudioManager = {
    bgm: new Audio(),
    sfxPaths: {
        'click': 'assets/sounds/click.mp3', // 请确保未来有这些文件，目前不会报错，只会静默失败
        'magic': 'assets/sounds/magic_chime.mp3',
        'achievement': 'assets/sounds/gong_strike.mp3',
        'scene_enter': 'assets/sounds/wind_transition.mp3'
    },
    bgmPaths: {
        'wanyicheng': 'assets/sounds/bgm_kunqu.mp3',
        'qinglanjie': 'assets/sounds/bgm_guqin.mp3',
        'default': 'assets/sounds/bgm_main.mp3'
    },

    playSFX(type) {
        if (!gameState.settings.sound || !this.sfxPaths[type]) return;
        const sfx = new Audio(this.sfxPaths[type]);
        sfx.volume = 0.6;
        sfx.play().catch(e => {/* 忽略浏览器自动播放限制报错 */});
    },

    playBGM(sceneKey) {
        if (!gameState.settings.music) {
            this.bgm.pause();
            return;
        }
        const path = this.bgmPaths[sceneKey] || this.bgmPaths['default'];
        if (this.bgm.src.endsWith(path)) return; // 已经在播这首了

        // 简单的淡出淡入切换
        if (!this.bgm.paused) {
            this.bgm.volume = 0; // 真实项目中可以用 setInterval 做渐变
        }
        
        this.bgm.src = path;
        this.bgm.loop = true;
        this.bgm.volume = 0.3;
        this.bgm.play().catch(e => console.log("等待用户交互以播放BGM"));
    }
};

// 监听场景切换事件，自动切换背景音乐
GameEvent.on('ENTER_SCENE', (sceneKey) => {
    AudioManager.playBGM(sceneKey);
});

// ============================================================
// 传习录 · 技艺成长日志系统
// ============================================================

/** 向传习录追加一条记录（全局可调用） */
function _appendXiulilu(entry) {
    if (typeof gameState === 'undefined') return;
    if (!gameState.xiulilu) gameState.xiulilu = [];
    gameState.xiulilu.unshift({
        ...entry,
        time: Date.now()
    });
    if (gameState.xiulilu.length > 100) gameState.xiulilu.pop(); // 保留最近100条
    if (typeof SaveManager !== 'undefined') SaveManager.save();
}

window.renderXiulilu = function() {
    const container = document.getElementById('xiulilu-timeline');
    if (!container) return;

    const logs = gameState.xiulilu || [];

    // ── 技艺成长汇总 ──
    const skillSummary = _buildSkillSummary();

    if (logs.length === 0 && skillSummary.total === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:60px 20px; color:rgba(255,255,255,0.4);">
                <div style="font-size:48px; margin-bottom:16px; opacity:0.5;">📜</div>
                <div style="font-family:var(--font-kai); font-size:16px; letter-spacing:2px;">传习录尚空</div>
                <div style="font-size:12px; margin-top:8px;">参加雅集、拜访匠师、完成探索，皆可留下印记</div>
            </div>`;
        return;
    }

    const typeConfig = {
        yaji:    { icon:'🍵', color:'#e89a65', label:'雅集印记' },
        solar:   { icon:'🌿', color:'#7eb6a1', label:'节气感悟' },
        craft:   { icon:'⚒️', color:'#d4af37', label:'造物记录' },
        meet:    { icon:'🤝', color:'#c8a2c8', label:'知音相遇' },
        explore: { icon:'🗺️', color:'#6cb4ee', label:'探索所得' },
        achieve: { icon:'🏆', color:'#f4d03f', label:'成就解锁' },
        order:   { icon:'📦', color:'#95a5a6', label:'手信寄出' },
        default: { icon:'✦',  color:'#888',    label:'游历感悟' },
    };

    const timelineHtml = logs.map(log => {
        const cfg = typeConfig[log.type] || typeConfig.default;
        const dateStr = new Date(log.time).toLocaleDateString('zh-CN', { month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit' });
        return `
        <div style="display:flex; gap:12px; padding:14px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
            <div style="flex:0 0 36px; height:36px; border-radius:50%;
                        background:rgba(255,255,255,0.06); border:1px solid ${cfg.color}44;
                        display:flex; align-items:center; justify-content:center;
                        font-size:18px; flex-shrink:0;">${log.icon || cfg.icon}</div>
            <div style="flex:1; min-width:0;">
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:3px;">
                    <span style="font-size:12px; color:${cfg.color}; font-weight:bold;">${cfg.label}</span>
                    <span style="font-size:10px; color:rgba(255,255,255,0.3);">${dateStr}</span>
                </div>
                <div style="font-size:13px; color:#e8dcc8; font-family:var(--font-kai); line-height:1.6;">${log.title}</div>
                ${log.desc ? `<div style="font-size:11px; color:rgba(255,255,255,0.45); margin-top:3px; line-height:1.5;">${log.desc}</div>` : ''}
            </div>
        </div>`;
    }).join('');

    container.innerHTML = `
        ${skillSummary.html}
        <div style="margin-top:20px;">
            <div style="font-size:12px; color:rgba(255,255,255,0.4); letter-spacing:2px; margin-bottom:10px; font-family:var(--font-kai);">— 游历足迹 —</div>
            ${timelineHtml || '<div style="text-align:center;color:rgba(255,255,255,0.3);padding:20px;font-size:12px;">尚无记录</div>'}
        </div>`;
};

function _buildSkillSummary() {
    const traits = gameState?.lingshi?.traits || { craft:0, explore:0, social:0, zen:0 };
    const yajiCount    = (gameState.xiulilu||[]).filter(l=>l.type==='yaji').length;
    const orderCount   = (gameState.handsignOrders||[]).length;
    const bondCount    = Object.keys(gameState?.bonds||{}).length;
    const total = yajiCount + orderCount + bondCount;

    const items = [
        { icon:'🍵', label:'赴雅集',  val:yajiCount,  color:'#e89a65' },
        { icon:'🤝', label:'结知音',  val:bondCount,  color:'#c8a2c8' },
        { icon:'📦', label:'寄手信',  val:orderCount, color:'#7eb6a1' },
        { icon:'🔥', label:'匠心值',  val:Math.floor(traits.craft),   color:'var(--cinnabar)' },
        { icon:'🍃', label:'寻幽值',  val:Math.floor(traits.explore), color:'var(--jade)' },
        { icon:'🧘', label:'禅定值',  val:Math.floor(traits.zen),     color:'#8a6da8' },
    ];

    const html = `
        <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:4px;">
            ${items.map(it=>`
            <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
                        border-radius:10px; padding:12px 8px; text-align:center;">
                <div style="font-size:22px; margin-bottom:4px;">${it.icon}</div>
                <div style="font-size:20px; font-weight:bold; color:${it.color}; font-family:var(--font-kai);">${it.val}</div>
                <div style="font-size:10px; color:rgba(255,255,255,0.4); margin-top:2px;">${it.label}</div>
            </div>`).join('')}
        </div>`;
    return { html, total };
}


// ============================================================
// 知音系统增强 · 在 meditatePersona 中调用
// ============================================================

/** 增加与某 NPC 的亲密度，并更新知音卡 */
window.addIntimacy = function(npcName, amount = 5, eventDesc = '') {
    if (!gameState.intimacy)  gameState.intimacy  = {};
    if (!gameState.bonds)     gameState.bonds     = {};

    gameState.intimacy[npcName]  = Math.min(100, (gameState.intimacy[npcName]  || 0) + amount);
    if (!gameState.bonds[npcName]) {
        gameState.bonds[npcName] = { lastEvent:'', lastTime:0, gifts:0, letters:0 };
    }
    if (eventDesc) {
        gameState.bonds[npcName].lastEvent = eventDesc;
        gameState.bonds[npcName].lastTime  = Date.now();
    }

    _appendXiulilu({ type:'meet', icon:'🤝', color:'#c8a2c8',
        title: `与【${npcName}】的羁绊加深`,
        desc:  eventDesc || `亲密度 +${amount}，当前: ${gameState.intimacy[npcName]}`
    });

    if (typeof SaveManager !== 'undefined') SaveManager.save();
};

/** 渲染知音羁绊卡列表（供 meditatePersona 内调用） */
function _renderBondCards() {
    const socialList = document.getElementById('social-bonds-list');
    if (!socialList) return;

    const intimacy = gameState.intimacy || {};
    const bonds    = gameState.bonds    || {};

    const BOND_LEVELS = [
        { min:0,  label:'陌路',   icon:'👤', color:'#888' },
        { min:20, label:'相识',   icon:'🤝', color:'#7eb6a1' },
        { min:50, label:'知音',   icon:'💛', color:'#e89a65' },
        { min:80, label:'挚友',   icon:'💖', color:'var(--cinnabar)' },
        { min:100,label:'灵魂知己',icon:'✨', color:'var(--gold)' },
    ];
    const getLevel = val => {
        let lv = BOND_LEVELS[0];
        for (const l of BOND_LEVELS) { if (val >= l.min) lv = l; }
        return lv;
    };

    const entries = Object.entries(intimacy).filter(([k,v]) => !k.includes('_') && v > 0);
    if (entries.length === 0) {
        socialList.innerHTML = '<li style="color:#888;font-size:13px;justify-content:center;padding:15px 0;">九州之大，暂无故交</li>';
        return;
    }

    entries.sort(([,a],[,b]) => b - a);

    socialList.innerHTML = entries.map(([name, val]) => {
        const lv   = getLevel(val);
        const bond = bonds[name] || {};
        const pct  = Math.min(val, 100);
        const lastDate = bond.lastTime ? new Date(bond.lastTime).toLocaleDateString('zh-CN', {month:'numeric',day:'numeric'}) : '';
        const canGift  = val < 100;
        const canYaji  = val >= 50;

        return `
        <li style="flex-direction:column; align-items:stretch; gap:8px; padding:14px; background:rgba(255,255,255,0.03); border-radius:10px; border:1px solid rgba(255,255,255,0.06); margin-bottom:8px; list-style:none;">
            <div style="display:flex; align-items:center; justify-content:space-between;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <div style="width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,0.06);border:1.5px solid ${lv.color};display:flex;align-items:center;justify-content:center;font-size:18px;">${lv.icon}</div>
                    <div>
                        <div style="color:#e8dcc8;font-size:14px;font-family:var(--font-kai);">${name}</div>
                        <div style="font-size:11px;color:${lv.color};margin-top:1px;">${lv.label} · 羁绊 ${val}</div>
                    </div>
                </div>
                <div style="font-size:11px;color:rgba(255,255,255,0.3);">${lastDate}</div>
            </div>
            <div style="background:rgba(0,0,0,0.3);border-radius:4px;height:5px;overflow:hidden;">
                <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,${lv.color}88,${lv.color});transition:width 0.8s ease;"></div>
            </div>
            ${bond.lastEvent ? `<div style="font-size:11px;color:rgba(255,255,255,0.35);font-style:italic;padding:0 2px;">"${bond.lastEvent}"</div>` : ''}
            <div style="display:flex;gap:8px;margin-top:2px;">
                ${canGift  ? `<button onclick="sendGiftToBond('${name}')" style="flex:1;background:rgba(212,175,55,0.1);border:1px solid rgba(212,175,55,0.3);color:#d4af37;padding:5px;border-radius:6px;cursor:pointer;font-size:11px;font-family:var(--font-kai);">🎁 赠礼</button>` : ''}
                <button onclick="sendLetterToBond('${name}')" style="flex:1;background:rgba(126,182,161,0.1);border:1px solid rgba(126,182,161,0.3);color:#7eb6a1;padding:5px;border-radius:6px;cursor:pointer;font-size:11px;font-family:var(--font-kai);">✉️ 飞鸽</button>
                ${canYaji  ? `<button onclick="showNotification('已向【'+encodeURIComponent('${name}')+'】发送雅集邀约！','🍵')" style="flex:1;background:rgba(232,154,101,0.1);border:1px solid rgba(232,154,101,0.3);color:#e89a65;padding:5px;border-radius:6px;cursor:pointer;font-size:11px;font-family:var(--font-kai);">🍵 邀雅集</button>` : ''}
            </div>
        </li>`;
    }).join('');
}

window.sendGiftToBond = function(npcName) {
    const inv = gameState.inventory || {};
    const giftItems = Object.entries(inv).filter(([k,v]) => v > 0);
    if (giftItems.length === 0) { showNotification('行囊里暂无可赠之物', '🎁'); return; }

    // 简单弹窗选礼物
    const firstItem = giftItems[0][0];
    if (typeof spendStones === 'function' && gameState.inventory[firstItem] > 0) {
        gameState.inventory[firstItem]--;
        addIntimacy(npcName, 10, `赠予【${firstItem}】，情谊更深`);
        showNotification(`已将【${firstItem}】赠予 ${npcName}，羁绊 +10！`, '🎁', 4000);
        if (typeof meditatePersona === 'function') meditatePersona();
    }
};

window.sendLetterToBond = function(npcName) {
    const bond = gameState.bonds[npcName] || {};
    bond.letters = (bond.letters || 0) + 1;
    if (!gameState.bonds[npcName]) gameState.bonds[npcName] = bond;
    addIntimacy(npcName, 5, `互通书信，心意相知`);
    showNotification(`飞鸽已传往 ${npcName} 处，羁绊 +5！`, '✉️', 3500);
    if (typeof meditatePersona === 'function') meditatePersona();
};

// 补丁：在 meditatePersona 末尾调用 _renderBondCards
const _origMeditate = window.meditatePersona;
window.meditatePersona = function() {
    if (typeof _origMeditate === 'function') _origMeditate();
    _renderBondCards();
};

// ============================================================
// 手信驿站系统
// ============================================================

window.openHandsignStation = function() {
    // 填充可寄商品下拉（从背包中含"流转契约"或实物类已购商品）
    const select = document.getElementById('hs-product-select');
    if (select) {
        const inv = gameState.inventory || {};
        const opts = Object.entries(inv)
            .filter(([k,v]) => v > 0 && (k.includes('流转契约') || k.includes('手信') || k.includes('团扇') || k.includes('茶杯') || k.includes('书签') || k.includes('香囊') || k.includes('皮影') || k.includes('摆件') || k.includes('脸谱') || k.includes('线香')))
            .map(([k]) => `<option value="${k}">${k}</option>`)
            .join('');
        select.innerHTML = opts || '<option value="">行囊中暂无可寄手信</option>';
    }
    _renderHandsignOrders();
    openModal('handsign-modal');
};

function _renderHandsignOrders() {
    const container = document.getElementById('handsign-orders-list');
    if (!container) return;
    const orders = gameState.handsignOrders || [];
    if (orders.length === 0) {
        container.innerHTML = '<div style="text-align:center;color:#aaa;padding:24px;font-size:13px;">尚无寄递记录</div>';
        return;
    }
    const statusColor = { '待确认':'#e89a65','制作中':'#4a90e2','已发货':'#52b788','已签收':'#888' };
    const statusIcon  = { '待确认':'⏳','制作中':'⚒️','已发货':'🚚','已签收':'✅' };
    container.innerHTML = orders.map(o => {
        const dateStr = new Date(o.time).toLocaleDateString('zh-CN',{month:'numeric',day:'numeric'});
        const color   = statusColor[o.status] || '#888';
        const icon    = statusIcon[o.status]  || '📦';
        return `
        <div style="background:#fafafa;border:1px solid #eee;border-radius:10px;padding:14px;display:flex;gap:12px;align-items:flex-start;">
            <div style="font-size:28px;">${icon}</div>
            <div style="flex:1;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <div style="font-size:13px;font-weight:bold;color:#333;">${o.product}</div>
                    <span style="font-size:11px;background:${color}22;color:${color};padding:2px 8px;border-radius:10px;font-weight:bold;">${o.status}</span>
                </div>
                <div style="font-size:11px;color:#888;margin-top:4px;">收件：${o.name} · ${o.address}</div>
                ${o.trackingCode ? `<div style="font-size:11px;color:#4a90e2;margin-top:3px;">快递单号：${o.trackingCode}</div>` : ''}
                ${o.note ? `<div style="font-size:11px;color:#aaa;margin-top:3px;font-style:italic;">"${o.note}"</div>` : ''}
                <div style="font-size:10px;color:#ccc;margin-top:4px;">下单日期：${dateStr}</div>
            </div>
        </div>`;
    }).join('');
}

window.submitHandsignOrder = function() {
    const product = document.getElementById('hs-product-select')?.value;
    const name    = document.getElementById('hs-name')?.value.trim();
    const phone   = document.getElementById('hs-phone')?.value.trim();
    const address = document.getElementById('hs-address')?.value.trim();
    const note    = document.getElementById('hs-note')?.value.trim();

    if (!product) { showNotification('请先选择要寄送的手信', '⚠️'); return; }
    if (!name)    { showNotification('请填写收件人姓名', '⚠️'); return; }
    if (!phone || phone.length < 11) { showNotification('请填写有效的联系电话', '⚠️'); return; }
    if (!address) { showNotification('请填写收件地址', '⚠️'); return; }

    const orderId = 'HS' + Date.now().toString().slice(-8);
    const order = { id: orderId, product, name, phone, address, note, status:'待确认', time: Date.now(), trackingCode: '' };

    if (!gameState.handsignOrders) gameState.handsignOrders = [];
    gameState.handsignOrders.unshift(order);

    // 消耗背包中的物品
    if (gameState.inventory[product]) gameState.inventory[product]--;

    _appendXiulilu({ type:'order', icon:'📦', color:'#7eb6a1',
        title: `寄出手信【${product}】`,
        desc:  `收件人：${name}，${address.slice(0,15)}…`
    });

    if (typeof addIntimacy === 'function') {
        // 寄手信给某位匠师，羁绊加深
        addIntimacy('平台匠师', 8, `亲手将【${product}】寄往现实`);
    }

    SaveManager.save();

    // 清空表单
    ['hs-name','hs-phone','hs-address','hs-note'].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });

    showNotification(`手信订单【${orderId}】已提交！匠师将在 24 小时内确认并开始制作。`, '📮', 6000);
    if (typeof playSound === 'function') playSound('achievement');
    _renderHandsignOrders();

    // 更新化身纪预览
    _renderHandsignPreview();
};

/** 化身纪中的简要手信预览 */
function _renderHandsignPreview() {
    const container = document.getElementById('handsign-preview');
    if (!container) return;
    const orders = (gameState.handsignOrders || []).slice(0, 3);
    if (orders.length === 0) {
        container.innerHTML = '<div style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center;padding:14px 0;">尚未寄出任何手信</div>';
        return;
    }
    const statusColor = { '待确认':'#e89a65','制作中':'#4a90e2','已发货':'#52b788','已签收':'#888' };
    container.innerHTML = orders.map(o => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
            <div>
                <div style="font-size:13px;color:#e8dcc8;">${o.product}</div>
                <div style="font-size:11px;color:rgba(255,255,255,0.35);margin-top:2px;">${o.address?.slice(0,20)}…</div>
            </div>
            <span style="font-size:11px;padding:2px 9px;border-radius:10px;background:${statusColor[o.status]+'22'};color:${statusColor[o.status]||'#888'};white-space:nowrap;">${o.status}</span>
        </div>`).join('') +
        `<div style="margin-top:10px;text-align:right;">
            <button onclick="openHandsignStation()" style="background:transparent;border:none;color:var(--jade);font-size:12px;cursor:pointer;">查看全部订单 →</button>
        </div>`;
}

// ── openShop 增强：注入节气商品 + 切到 physical 默认 ──
const _origOpenShop = window.openShop;
window.openShop = function() {
    _origOpenShop();
    // 注入节气商品（避免重复）
    const shopData = REGION_SHOPS[currentShopRegion] || REGION_SHOPS['default'];
    const seasonal = typeof SolarTermEngine !== 'undefined' ? SolarTermEngine.getSeasonalItems() : [];
    seasonal.forEach(si => {
        if (!shopData.items.find(i => i.id === si.id)) shopData.items.push(si);
    });
    // 默认显示实体手信
    const firstTab = document.querySelector('.shop-tab');
    if (firstTab) switchShopTab('physical', firstTab);
};

// ── buyItem 增强：线下体验生成核销码，记录传习录 ──
const _origBuyItem = window.buyItem;
window.buyItem = function(itemId) {
    const shopData = REGION_SHOPS[currentShopRegion] || REGION_SHOPS['default'];
    const seasonal = typeof SolarTermEngine !== 'undefined' ? SolarTermEngine.getSeasonalItems() : [];
    const allItems = [...shopData.items, ...seasonal];
    const item = allItems.find(i => i.id === itemId);
    if (!item || item.stock <= 0) return;

    const finalPrice = Math.floor(item.price * currentDiscount);
    if (!spendStones(finalPrice)) {
        showNotification('灵石不足，掌柜摇了摇头', '❌');
        document.getElementById('shopkeeper-dialogue').innerText = "哎哟，客官，这灵石好像差了点意思啊？";
        return;
    }

    item.stock--;

    if (item.o2oType === '线下') {
        // 生成6位核销码
        const code = 'YJ' + Math.random().toString(36).slice(2,7).toUpperCase();
        addItem(`${item.name}·核销码(${code})`, 1);
        _appendXiulilu({ type:'craft', icon:'📍', color:'#7eb6a1',
            title:`预约【${item.name}】`,
            desc: `核销码：${code}，凭码到店体验`
        });
        showNotification(`预约成功！到店核销码：【${code}】已存入行囊。`, '📍', 6000);
    } else if (item.o2oType === '线上') {
        addItem(item.name, 1);
        _appendXiulilu({ type:'craft', icon:'💻', color:'#4a90e2',
            title:`解锁课程【${item.name}】`,
            desc: '已加入学习列表，随时可观看'
        });
        showNotification(`课程【${item.name}】已解锁！可在传习录中查看。`, '📚', 4000);
    } else if (item.o2oType === '预定') {
        addItem('定制申请书', 1);
        _appendXiulilu({ type:'order', icon:'✏️', color:'#8e44ad',
            title:`提交定制申请【${item.name}】`,
            desc: '匠师将在48小时内联系确认方案'
        });
        showNotification(`定制申请已提交！匠师将联系你确认细节。`, '✏️', 5000);
    } else {
        addItem(item.name, 1);
        _appendXiulilu({ type:'order', icon:'📦', color:'#95a5a6',
            title:`购入【${item.name}】`,
            desc: item.deliverDays ? `预计 ${item.deliverDays} 天内发货` : '已加入行囊'
        });
        showNotification(`成功购买【${item.name}】！${item.deliverDays?'预计 '+item.deliverDays+' 天发货':''}`, '🛒', 4000);
    }

    document.getElementById('shop-current-stones').innerText = gameState.stones;
    const thanks = ['多谢惠顾！', '好眼光！', '货真价实，您放心！'];
    document.getElementById('shopkeeper-dialogue').innerText = thanks[Math.floor(Math.random()*thanks.length)];
    renderShopItems();
    if (typeof playSound === 'function') playSound('buy');
};



// ── 节气公告弹窗（由 SolarTermEngine.check 升级调用） ──
window.openSolarTermModal = function() {
    const term = typeof SolarTermEngine !== 'undefined' ? SolarTermEngine.getCurrentTerm() : null;
    if (!term) return;
    const header = document.getElementById('solar-term-modal-header');
    const title  = document.getElementById('solar-term-modal-title');
    const body   = document.getElementById('solar-term-modal-body');
    if (!body) return;
    if (header) header.style.background = `linear-gradient(135deg, ${term.color}cc, ${term.color}66)`;
    if (title)  title.innerText = `${term.icon} 今日节气·${term.name}`;
    body.innerHTML = `
        <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:60px;margin-bottom:10px;animation:float 3s ease-in-out infinite;">${term.icon}</div>
            <div style="font-size:22px;font-weight:bold;color:${term.color};font-family:var(--font-kai);margin-bottom:6px;">${term.name}</div>
            <div style="font-size:13px;color:#666;">${new Date().toLocaleDateString('zh-CN',{year:'numeric',month:'long',day:'numeric'})}</div>
        </div>
        <div style="background:${term.color}11;border-left:3px solid ${term.color};padding:14px 16px;border-radius:0 8px 8px 0;margin-bottom:14px;">
            <div style="font-size:12px;color:${term.color};font-weight:bold;margin-bottom:5px;">✨ 节气增益</div>
            <div style="font-size:13px;color:#444;line-height:1.6;">${term.buff}</div>
        </div>
        <div style="background:#fffdf5;border:1px dashed #e8c97a;padding:14px 16px;border-radius:8px;margin-bottom:14px;">
            <div style="font-size:12px;color:#c9a83c;font-weight:bold;margin-bottom:5px;">🛒 商行上新</div>
            <div style="font-size:13px;color:#555;line-height:1.6;">${term.shopHint}</div>
        </div>
        <div style="background:#f0f9f5;border:1px dashed var(--jade);padding:14px 16px;border-radius:8px;">
            <div style="font-size:12px;color:var(--jade);font-weight:bold;margin-bottom:5px;">🍵 节气雅集</div>
            <div style="font-size:13px;color:#444;line-height:1.6;">
                <strong>${term.activity.name}</strong><br>
                参与可获得【${term.activity.reward}】+ ${term.activity.stones} 灵石
            </div>
        </div>`;
    openModal('solar-term-modal');
};

window.goToWorkshopFromScene = function() {
    if (typeof leaveScene === 'function') leaveScene();
    switchMainView('view-workshop', document.getElementById('dock-workshop'));
    if (typeof renderWorkshop === 'function') renderWorkshop();
};

window.renderDeductionBoard = function() {
    const inv = document.getElementById('deduction-inventory');
    if (!inv) return;
    inv.innerHTML = Object.entries(gameState.inventory || {})
        .filter(([,v]) => v > 0)
        .map(([name]) => {
            const data = (typeof itemDatabase !== 'undefined' && itemDatabase[name]) || { icon:'📦' };
            return `<div onclick="addToDeductionSlot('${name}')" style="border:1px solid #333;border-radius:8px;padding:10px;text-align:center;cursor:pointer;background:#1a1816;">
                <div style="font-size:28px;">${data.icon}</div>
                <div style="font-size:11px;color:#aaa;margin-top:4px;">${name}</div>
            </div>`;
        }).join('') || '<div style="color:#666;text-align:center;padding:20px;">行囊为空</div>';
};
window.addToDeductionSlot = function(itemName) {
    const s1 = document.getElementById('deduction-slot-1');
    const s2 = document.getElementById('deduction-slot-2');
    const target = s1.dataset.item ? s2 : s1;
    target.innerHTML = `<div style="font-size:36px;">${(itemDatabase?.[itemName]||{}).icon||'📦'}</div><div style="font-size:12px;color:var(--gold);margin-top:4px;">${itemName}</div>`;
    target.dataset.item = itemName;
    const btn = document.getElementById('btn-execute-deduction');
    if (s1.dataset.item && s2.dataset.item) { btn.disabled = false; btn.style.opacity = '1'; }
};
window.clearDeductionSlot = function(n) {
    const slot = document.getElementById(`deduction-slot-${n}`);
    slot.innerHTML = `<div style="font-size:30px;opacity:0.3;">➕</div><div style="font-size:12px;color:#888;margin-top:5px;">线索${n===1?'一':'二'}</div>`;
    delete slot.dataset.item;
    document.getElementById('btn-execute-deduction').disabled = true;
    document.getElementById('btn-execute-deduction').style.opacity = '0.5';
};
window.executeDeduction = function() {
    showNotification('因果推演中...', '🔮');
    setTimeout(() => showNotification('推演完成！两件灵物之间存在神秘的历史渊源。', '✨', 5000), 1500);
};

window.generateFakeAILog = function() {
    if (typeof LingshiEngine !== 'undefined') {
        LingshiEngine.generateLog();
        renderLingshi();
        showNotification('灵识感知已刷新', '🔮');
    }
};