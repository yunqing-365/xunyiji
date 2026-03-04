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
    checkinDay: 0,         // 当前连签天数（0-based 索引）

    // 灯谜
    currentRiddle: 0,
    riddleScore:   0,

    // 设置
    settings: {
        sound:    true,
        music:    true,
        graphics: true,
        weather:  true
    }
};


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


// 2. 核心：安全事件分发器（带错误拦截）
window.dispatchQuestEvent = function(eventName, amount = 1) {
    // 🌟 如果还没初始化任务数据，或者数据不对，自动初始化
    if (!gameState.quests || !gameState.quests.main) {
        if (typeof questData !== 'undefined') {
            gameState.quests = JSON.parse(JSON.stringify(questData));
        } else {
            return; // 没有数据源，直接退出，防止报错
        }
    }
    
    let isProgressUpdated = false;

    // 遍历任务大类
    ['main', 'side', 'daily'].forEach(category => {
        const list = gameState.quests[category];
        if (!list) return; // 🌟 核心防崩溃：如果没有这个分类则跳过

        list.forEach(quest => {
            if (quest.status !== 'active') return;

            let isQuestComplete = true;

            quest.objectives.forEach(obj => {
                // 匹配事件
                if (obj.event === eventName && obj.current < obj.required) {
                    obj.current = Math.min(obj.current + amount, obj.required);
                    isProgressUpdated = true;
                    
                    if (obj.current >= obj.required) {
                        if(typeof playSound === 'function') playSound('click');
                        if(typeof showNotification === 'function') showNotification(`目标达成：${obj.text}`, '📝');
                    }
                }
                
                // 检查是否全满
                if (obj.current < obj.required) {
                    isQuestComplete = false;
                }
            });

            if (isQuestComplete && isProgressUpdated) {
                _completeQuest(quest);
            }
        });
    });

    if (isProgressUpdated) {
        renderQuestPanel(currentQuestTab);
    }
};

/**
 * 向背包添加物品并触发 UI 刷新
 * @param {string} itemName - 物品名称
 * @param {number} [qty=1]  - 数量
 */
// 升级后的 addItem：加入图鉴解锁逻辑
function addItem(itemName, qty = 1) {
    gameState.inventory[itemName] = (gameState.inventory[itemName] || 0) + qty;
    
    // 初始化图鉴记忆库
    if (!gameState.discoveredItems) gameState.discoveredItems = [];
    
    // 如果是首次获得，永久点亮图鉴！
    if (!gameState.discoveredItems.includes(itemName)) {
        gameState.discoveredItems.push(itemName);
        // 如果是在大世界探索或造物中，可以悄悄弹个提示
        console.log(`【图鉴解锁】首次获得：${itemName}`);
    }

    // 触发事件总线和UI更新
    if (typeof GameEvent !== 'undefined') {
        GameEvent.emit('INVENTORY_CHANGED', { item: itemName, amount: qty });
        GameEvent.emit('collect_item', { amount: qty, item: itemName }); 
    }
    if (typeof updateInventory === 'function') updateInventory();
    if (typeof SaveManager !== 'undefined') SaveManager.save();
}

// 订阅物品变动事件，自动刷新背包UI，不用再到处手动调
GameEvent.on('INVENTORY_CHANGED', () => {
    if (typeof updateInventory === 'function') updateInventory();
});

/**
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
    // 1. 隐藏所有视图
    document.querySelectorAll('.view-container').forEach(v => {
        v.classList.remove('active-view');
        v.style.display = ''; // 清除可能残留的内联样式
    });

    // 2. 激活目标视图
    const targetView = document.getElementById(viewId);
    if (targetView) targetView.classList.add('active-view');

    // 3. 处理底部 Dock 的显示与高亮
    const dock = document.getElementById('player-dock');
    if (dock) {
        // 只要不是在探索视图和场景枢纽里，就强行显示底部 Dock
        if (viewId !== 'view-exploration' && viewId !== 'view-scene') {
            dock.classList.remove('hidden');
        }
    }
    if (dockEl) {
        document.querySelectorAll('.dock-item').forEach(item => item.classList.remove('active'));
        dockEl.classList.add('active');
    }

    // 4. 视图生命周期钩子：切入对应页面时自动执行对应的数据渲染
    if (viewId === 'view-map') {
        if (typeof dispatchQuestEvent === 'function') dispatchQuestEvent('view_map');
    } else if (viewId === 'view-inventory') {
        if (typeof dispatchQuestEvent === 'function') dispatchQuestEvent('view_inventory');
        if (typeof updateInventory === 'function') updateInventory('all'); // 强制刷新背包
    } else if (viewId === 'view-profile') {
        if (typeof renderAchievements === 'function') renderAchievements();
        if (typeof meditatePersona === 'function') meditatePersona();
    } else if (viewId === 'view-workshop') {
        if (typeof renderWorkshop === 'function') renderWorkshop();
    } else if (viewId === 'view-deduction') {
        if (typeof renderDeductionBoard === 'function') renderDeductionBoard();
    } else if (viewId === 'view-lingshi') {
        if (typeof renderLingshi === 'function') renderLingshi();
    }

    // 5. 播放切页音效
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

// 2. 建立“千店千面”的区域商店数据库
const REGION_SHOPS = {
    'wanyicheng': {
        title: '🏪 梨园百货', npcName: '陈掌柜', npcEmoji: '🎭', theme: 'modal-header-red',
        greeting: '客官，咱们这里的戏服料子，全九州数第一！',
        items: [
            { id: 'w1', name: '苏绣丝线', cat: 'material', price: 20, stock: 10, icon: '🧵', desc: '【联动】可用于造物台合成团扇' },
            { id: 'w2', name: '戏服碎布', cat: 'material', price: 15, stock: 8, icon: '🎀', desc: '缝制戏服的边角料' }
        ]
    },
    'tongxiyu': {
        title: '🐪 丝路商行', npcName: '阿里法德', npcEmoji: '👳‍♂️', theme: 'modal-header-gold',
        greeting: '远方的朋友，来看看纯正的西域香料和神秘宝物吧！',
        items: [
            { id: 't1', name: '西域香料', cat: 'material', price: 60, stock: 5, icon: '🌶️', desc: '异域神秘香料' },
            { id: 't2', name: '神秘符文石', cat: 'prop', price: 300, stock: 1, icon: '🔮', desc: '【联动】可在化身纪佩戴于[佩]槽' }
        ]
    },
    'baizuozhen': {
        title: '⚒️ 天工材料铺', npcName: '铁老三', npcEmoji: '👨‍🏭', theme: 'modal-header-ink',
        greeting: '要打铁还是雕木头？我这儿材料管够！',
        items: [
            { id: 'b1', name: '沉香木料', cat: 'material', price: 45, stock: 5, icon: '🪵', desc: '【联动】可用于造物台合成扇骨' },
            { id: 'b2', name: '高岭陶土', cat: 'material', price: 30, stock: 10, icon: '🏺', desc: '烧制瓷器的极品陶土' },
            { id: 'b3', name: '天工绝密图纸', cat: 'collection', price: 800, stock: 1, icon: '📜', desc: '【联动】解锁造物台高级配方' }
        ]
    },
    'senzhidiyu': {
        title: '🧚 精灵杂货', npcName: '绿灵', npcEmoji: '🧚', theme: 'modal-header-jade',
        greeting: '森林的馈赠，只要你带走，就是缘分~',
        items: [
            { id: 's1', name: '紫苏叶', cat: 'material', price: 10, stock: 20, icon: '🌿', desc: '新鲜草药' },
            { id: 's2', name: '百年红酒', cat: 'prop', price: 150, stock: 2, icon: '🍷', desc: '【联动】可作为礼物送给NPC' }
        ]
    },
    'default': {
        title: '🏪 九州云商', npcName: '云掌柜', npcEmoji: '📦', theme: 'modal-header-gold',
        greeting: '客官随便看，万物阁里的货全九州都有！',
        items: [
            { id: 'd1', name: '苏绣丝线', cat: 'material', price: 20, stock: 10, icon: '🧵', desc: '基础合成材料' },
            { id: 'd2', name: '沉香木料', cat: 'material', price: 45, stock: 5, icon: '🪵', desc: '基础合成材料' }
        ]
    }
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
    if(tabs.length > 0) switchShopTab('material', tabs[0]);
    
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
    const items = shopData.items.filter(item => item.cat === currentShopCategory);
    
    if (items.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:#aaa; padding:40px;">掌柜正在进货中...</div>`;
        return;
    }

    grid.innerHTML = items.map(item => {
        const isSoldOut = item.stock <= 0;
        const finalPrice = Math.floor(item.price * currentDiscount);
        const isDiscounted = currentDiscount < 1.0;

        return `
        <div class="shop-item ${isSoldOut ? 'sold-out' : ''}">
            ${isDiscounted && !isSoldOut ? `<div class="discount-tag">特惠</div>` : ''}
            <div class="shop-item-icon">${item.icon}</div>
            <div class="shop-item-name">${item.name}</div>
            <div class="shop-item-desc" style="color:var(--jade);">${item.desc}</div>
            
            <div class="shop-item-price">
                ${isDiscounted ? `<span style="text-decoration:line-through; color:#aaa; font-size:11px; margin-right:4px;">${item.price}</span>` : ''}
                🪙 ${finalPrice}
            </div>
            <div style="font-size:11px; color:#888; margin-bottom:8px;">库存: ${item.stock}</div>
            
            <button class="btn btn-sm ${isSoldOut ? 'btn-ghost' : 'btn-outline'}" 
                    style="width:100%; transition:all 0.2s;" 
                    onclick="buyItem('${item.id}')" 
                    ${isSoldOut ? 'disabled' : ''}>
                ${isSoldOut ? '已售罄' : '购买'}
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

// ============================================================
// 十六、化身纪核心逻辑：动态换装 · 性格演化 · 名号系统 (升级版)
// ============================================================

gameState.equipment = gameState.equipment || { '首': null, '佩': null, '袍': null, '履': null, '持': null };
gameState.title = gameState.title || null;

// ── 装备字典：物品名 → { emoji, slot, effect, rarity } ──
const WEARABLE_DICTIONARY = {
    '首': {
        '金丝楠木皇冠':   { emoji: '👑', effect: '气场全开，NPC好感度提升', rarity: 5 },
        '精美花灯':       { emoji: '🏮', effect: '夜间探索时，隐藏节点更易显现', rarity: 3 },
    },
    '佩': {
        '明代紫砂壶':     { emoji: '🫖', effect: '在茶道相关场景中，采集量+1', rarity: 4 },
        '神秘符文石':     { emoji: '🔮', effect: '推演沙盘时，灵识提示精准度提升', rarity: 4 },
        '南海珍珠':       { emoji: '💍', effect: '商店交易时随机触发折扣', rarity: 3 },
        '安神香囊':       { emoji: '🪬', effect: '抵御迷雾区域的异常状态', rarity: 2 },
    },
    '袍': {
        '云锦布料':       { emoji: '👘', effect: '进入锦绣坊区域时，丝线采集量翻倍', rarity: 3 },
        '蜡染布料':       { emoji: '🎨', effect: '染坊类制作成功率+15%', rarity: 3 },
        '苗族靛蓝染布':   { emoji: '💙', effect: '青岚界所有采集点额外产出+1', rarity: 4 },
    },
    '履': {
        '发条青鸟':       { emoji: '🕊️', effect: '探索时移动速度提升，可提前发现隐藏节点', rarity: 5 },
    },
    '持': {
        '苏绣青皮团扇':   { emoji: '🪭', effect: '交谈NPC时触发专属对话分支', rarity: 3 },
        '精美花灯':       { emoji: '🏮', effect: '夜间场景光照范围扩大', rarity: 3 },
        '宋式点茶茶碗':   { emoji: '🍵', effect: '进入青岚界时触发守岁人专属问候', rarity: 4 },
        '龙泉镇窑之壶':   { emoji: '🏺', effect: '陶瓷类造物材料消耗-1', rarity: 4 },
    },
};

// ── 套装联动配方 ──
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
];

// ── 称号库 ──
const TITLE_DATA = [
    { id: 'title_rich',       name: '富甲九州',   condition: s => s.stones >= 2000 },
    { id: 'title_collector',  name: '万物收藏家', condition: s => Object.values(s.inventory||{}).reduce((a,b)=>a+b,0) >= 30 },
    { id: 'title_restorer',   name: '灵场复苏者', condition: s => s.restoredNodes && s.restoredNodes.length >= 1 },
    { id: 'title_crafter',    name: '天工巨匠',   condition: s => s.achievements && s.achievements['craft_first'] },
    { id: 'title_explorer',   name: '九州行者',   condition: s => s.achievements && s.achievements['first_interact'] },
];

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
    const slotDict = WEARABLE_DICTIONARY[slot] || {};
    const currentEquip = gameState.equipment[slot];

    // 先渲染"卸下"按钮
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
        // 读取 itemDatabase 描述
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
    const slotDict = WEARABLE_DICTIONARY[slot] || {};
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

// ── 渲染化身视觉（升级版：动态换装 + 光晕特效） ──
function _renderEquippedVisuals() {
    // 1. 动态更换主 emoji
    const avatarEl = document.getElementById('main-avatar-emoji');
    if (avatarEl) {
        const robe   = gameState.equipment['袍'];
        const head   = gameState.equipment['首'];
        const held   = gameState.equipment['持'];
        let baseEmoji = '🧑';
        if (robe === '苗族靛蓝染布') baseEmoji = '🧑‍🎨';
        else if (robe === '云锦布料')  baseEmoji = '🥻';
        else if (robe === '蜡染布料')  baseEmoji = '🧑‍🎤';
        if (head === '金丝楠木皇冠')   baseEmoji = '🫅';
        avatarEl.innerText = baseEmoji;
        avatarEl.style.animation = 'popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275)';
        setTimeout(() => avatarEl.style.animation = '', 400);
    }

    // 2. 悬浮装备 emoji
    const visualBox = document.getElementById('equipped-visuals');
    if (!visualBox) return;
    visualBox.innerHTML = '';

    const positions = {
        '首': 'top:8%;left:50%;transform:translateX(-50%);font-size:28px;',
        '佩': 'top:52%;left:8%;font-size:26px;',
        '袍': 'top:68%;left:50%;transform:translateX(-50%);font-size:22px;opacity:0.6;',
        '持': 'top:48%;right:8%;font-size:30px;animation:float 3s ease-in-out infinite;',
        '履': 'top:88%;left:50%;transform:translateX(-50%);font-size:22px;',
    };

    let hasAny = false;
    for (const slot in gameState.equipment) {
        const itemName = gameState.equipment[slot];
        if (!itemName) continue;
        hasAny = true;
        const meta = (WEARABLE_DICTIONARY[slot] || {})[itemName];
        if (!meta) continue;
        visualBox.innerHTML += `
            <div style="position:absolute;${positions[slot]}filter:drop-shadow(0 2px 8px rgba(212,175,55,0.5));z-index:10;transition:all 0.4s ease;">
                ${meta.emoji}
            </div>`;
    }

    // 3. 套装光晕
    const avatarBox = document.getElementById('dynamic-avatar-box');
    if (avatarBox) {
        const combo = _detectCombo();
        if (combo) {
            avatarBox.style.boxShadow = `0 0 30px ${combo.color}88, inset 0 0 20px ${combo.color}22`;
        } else if (hasAny) {
            avatarBox.style.boxShadow = '0 0 20px rgba(126,182,161,0.35)';
        } else {
            avatarBox.style.boxShadow = '';
        }
    }

    // 4. 更新插槽按钮高亮
    document.querySelectorAll('.slot-btn').forEach(btn => {
        const slotName = btn.innerText.trim();
        btn.classList.toggle('equipped', !!gameState.equipment[slotName]);
    });

    // 5. 更新称号
    _updateTitle();
}

// ── 检测套装组合 ──
function _detectCombo() {
    for (const combo of PERSONA_COMBOS) {
        const match = Object.entries(combo.require).every(
            ([slot, item]) => gameState.equipment[slot] === item
        );
        if (match) return combo;
    }
    return null;
}

// ── 更新称号显示 ──
function _updateTitle() {
    const titleEl = document.getElementById('avatar-title-display');
    if (!titleEl) return;
    for (const t of TITLE_DATA) {
        if (t.condition(gameState)) {
            gameState.title = t.name;
            titleEl.innerText = `「${t.name}」`;
            return;
        }
    }
    titleEl.innerText = gameState.title ? `「${gameState.title}」` : '';
}

// ── 更新装备效果汇总卡片 ──
function _updateEquipBuffCard() {
    const card = document.getElementById('equip-buff-card');
    const list = document.getElementById('equip-buff-list');
    if (!card || !list) return;

    let buffs = [];
    for (const slot in gameState.equipment) {
        const itemName = gameState.equipment[slot];
        if (!itemName) continue;
        const meta = (WEARABLE_DICTIONARY[slot] || {})[itemName];
        if (meta) buffs.push(`<div style="padding:5px 0;border-bottom:1px dashed #eee;color:var(--ink);">${meta.emoji} <strong>${itemName}</strong>：<span style="color:var(--jade);">${meta.effect}</span></div>`);
    }
    const combo = _detectCombo();
    if (combo) {
        buffs.push(`<div style="padding:6px 10px;margin-top:6px;background:${combo.bg};border-radius:8px;border-left:3px solid ${combo.color};font-size:12px;color:${combo.color};"><strong>${combo.name}</strong> 套装效果：${combo.desc}</div>`);
    }

    if (buffs.length === 0) {
        card.style.display = 'none';
    } else {
        card.style.display = 'block';
        list.innerHTML = buffs.join('');
    }
}

// ── 🧘 冥想凝神：动态性格标签（升级版，逐个动画浮现） ──
window.meditatePersona = function() {
    const tagsBox = document.getElementById('dynamic-persona-tags');
    if (!tagsBox) return;

    const avatarBox = document.getElementById('dynamic-avatar-box');
    if (avatarBox) {
        avatarBox.style.animation = 'pulse 0.6s ease 2';
        setTimeout(() => avatarBox.style.animation = '', 1200);
    }
    if (typeof playSound === 'function') playSound('magic');

    const tags = [];
    const addTag = (text, color, bg) => tags.push({ text, color, bg });

    const inv = gameState.inventory || {};
    const eq  = gameState.equipment  || {};
    const totalItems = Object.values(inv).reduce((a, b) => a + b, 0);
    const combo = _detectCombo();

    // ── 财富 ──
    if (gameState.stones >= 3000)     addTag('🪙 富可敌国',     'var(--gold)',    '#fdf8e8');
    else if (gameState.stones >= 1500) addTag('🪙 富甲一方',    'var(--gold)',    '#fdf8e8');
    else if (gameState.stones < 100)   addTag('💸 囊中羞涩',    '#888',           '#eee');

    // ── 装备气质 ──
    if (eq['首'] === '金丝楠木皇冠')  addTag('👑 真命天子',     'var(--cinnabar)','#fde8e8');
    if (eq['持'] === '苏绣青皮团扇')  addTag('🦋 雅致风流',     'var(--jade)',    '#e8f4ef');
    if (eq['佩'] === '明代紫砂壶')    addTag('🍵 品茗居士',     '#5d3a29',        '#f0e6df');
    if (eq['佩'] === '神秘符文石')    addTag('🔮 异闻探知者',   'var(--purple)',  '#f0ebf6');
    if (eq['袍'] === '苗族靛蓝染布')  addTag('💙 苗疆传人',     '#3d6b8a',        '#e8f0f8');
    if (eq['持'] === '宋式点茶茶碗')  addTag('🍵 点茶宗师',     '#4a7c5a',        '#edf6f2');
    if (eq['持'] === '龙泉镇窑之壶')  addTag('🔥 窑火重燃',     '#c0512a',        '#fdeee8');
    if (eq['履'] === '发条青鸟')      addTag('🕊️ 墨家游侠',    '#5a5a8a',        '#eeeef8');

    // ── 套装联动 ──
    if (combo) addTag(combo.name, combo.color, combo.bg);

    // ── 背包物品 ──
    if (inv['现代仿制破砖头'] > 0)     addTag('🧱 黑市大冤种',  '#666',           '#e0e0e0');
    if (totalItems > 30)               addTag('🎒 仓鼠症晚期',   'var(--amber)',   '#fdf3e8');
    else if (totalItems > 15)          addTag('🎒 行囊充实',     'var(--amber)',   '#fdf3e8');
    if ((inv['百年红酒'] || 0) > 0 || (inv['陈年女儿红'] || 0) > 0)
                                        addTag('🍷 好酒之人',    'var(--cinnabar)','#fde8e8');
    if ((inv['明前龙井'] || 0) >= 5)   addTag('🍃 茶道入门',    'var(--jade)',    '#e8f4ef');

    // ── 复苏经历 ──
    const restored = (gameState.restoredNodes || []).length;
    if (restored >= 2)    addTag('✨ 九州守护者',    'var(--gold)',    '#fdf8e8');
    else if (restored >= 1) addTag('🌿 灵场点灯人', 'var(--jade)',    '#e8f4ef');

    // ── 成就 ──
    if (gameState.achievements?.['craft_first']) addTag('⚒️ 天工开物', 'var(--ink)', '#f5f0e8');

    // ── 兜底 ──
    if (tags.length === 0) {
        addTag('🌱 初入凡尘', 'var(--jade)',   '#e8f4ef');
        addTag('✨ 潜力无限', 'var(--purple)', '#f0ebf6');
    }

    // 逐个动画浮现
    tagsBox.innerHTML = '';
    tags.forEach((tag, i) => {
        setTimeout(() => {
            const span = document.createElement('span');
            span.className = 'tag-pill';
            span.style.cssText = `color:${tag.color};background:${tag.bg};padding:5px 12px;border-radius:15px;font-size:13px;font-weight:bold;border:1px solid ${tag.color}33;opacity:0;transform:translateY(8px);transition:all 0.35s ease;`;
            span.innerText = tag.text;
            tagsBox.appendChild(span);
            requestAnimationFrame(() => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            });
        }, i * 120);
    });

    // 刷新称号和效果卡片
    _updateTitle();
    _updateEquipBuffCard();
    showNotification('灵台空明，真我浮现…', '🧘');
};
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
        { id: 'dawn',  name: '晨曦 · 万物苏醒', icon: '🌅', color: 'var(--jade)', buff: '万物生发：极品晨露等稀有材料现世' },
        { id: 'noon',  name: '午时 · 艳阳高照', icon: '☀️', color: '#ffb347', buff: '阳气鼎盛：视野开阔，体力充沛' },
        { id: 'dusk',  name: '黄昏 · 逢魔时刻', icon: '🌇', color: 'var(--cinnabar)', buff: '阴阳交界：百鬼夜行即将开启' },
        { id: 'night', name: '子夜 · 星汉灿烂', icon: '🌌', color: 'var(--purple)', buff: '天道共鸣：隐世鬼市商人出没' }
    ],
    tickInterval: null,

    start() {
        if (this.tickInterval) clearInterval(this.tickInterval);
        
        // 初始渲染
        this.updateUI();

        // 真实时间每 30 秒，游戏内流逝一个时辰
        this.tickInterval = setInterval(() => {
            gameState.worldState = (gameState.worldState + 1) % 4;
            this.updateUI();
            
            // 触发全服时辰更替事件
            GameEvent.emit('TIME_CHANGED', this.states[gameState.worldState]);
            SaveManager.save();
        }, 30000); 
    },

    updateUI() {
        const state = this.states[gameState.worldState];
        const iconEl = document.getElementById('world-icon');
        const timeEl = document.getElementById('world-time');
        const buffEl = document.getElementById('world-buff');
        
        if (iconEl && timeEl && buffEl) {
            iconEl.innerText = state.icon;
            timeEl.innerText = state.name;
            timeEl.style.color = state.color;
            buffEl.innerText = state.buff;
        }

        // 同步探索地图的光影
        if (typeof updateWorldEcology === 'function') {
            updateWorldEcology(gameState.worldState, state.id);
        }
    }
};

// 在 auth.js 的 _initPlayerSession 中调用 WorldTimeEngine.start()

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

const _inventorySwitchHook = window.switchMainView;
window.switchMainView = function(viewId, dockEl) {
    if (typeof _inventorySwitchHook === 'function') _inventorySwitchHook(viewId, dockEl);
    if (viewId === 'view-inventory') {
        renderInventory('all');
    }
};


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