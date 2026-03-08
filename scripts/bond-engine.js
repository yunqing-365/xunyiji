/**
 * bond-engine.js
 * 寻遗集 · 传承纽带引擎 (史诗级升级版)
 *
 * 模块：
 *   一、节气历引擎  (SolarTermEngine)    — 24节气驱动游戏内容
 *   二、传习录管理  (XiuliluManager)     — 非遗成长档案 + 传承人批注
 *   三、O2O订单流   (O2OOrderManager)    — 创建→制作→发货→签收→游戏奖励
 *   四、传承纽带    (BondSystem)         — 羁绊等级 + 飞鸽传书 + 情感链路
 *   五、工坊活动    (WorkshopActivityEngine) — 知识/制作/问答/产品活动实装
 *
 * 依赖：core.js (gameState, GameEvent, SaveManager, showNotification,
 *        earnStones, addItem, playSound, openModal, unlockAchievement)
 *        inheritors.js (inheritorData)
 */

'use strict';

// ============================================================
// 一、节气历引擎
// ============================================================
const SolarTermEngine = {

    TERMS: [
        {
            id:'lichun',   name:'立春', month:2,  day:4,  icon:'🌱',
            theme:'spring', bonus:'zhixiu',
            desc:'春回大地，万物复苏，最宜绣春花',
            specialActivity:'绣春迎新',
            sceneFilter:'saturate(1.3) hue-rotate(15deg) brightness(1.05)',
            shopItems:[
                { id:'st_lichun_1', name:'立春·迎春花苏绣小品', cat:'seasonal', price:280,
                  realPrice:88, stock:8, icon:'🌸', o2oType:'实体', badge:'节气限定', deliverDays:15,
                  desc:'立春限定，王雪萍匠师绣制，代表新岁新气象。' }
            ]
        },
        {
            id:'yushui',   name:'雨水', month:2,  day:19, icon:'🌧️',
            theme:'spring', bonus:'zhixiu',
            desc:'细雨润物，草木萌动，染布最佳时节',
            specialActivity:'春雨染布',
            sceneFilter:'saturate(0.9) brightness(0.93) hue-rotate(5deg)',
            shopItems:[]
        },
        {
            id:'jingzhe',  name:'惊蛰', month:3,  day:6,  icon:'⚡',
            theme:'spring', bonus:'taoci',
            desc:'春雷惊蛰，窑火重燃，陶瓷烧造首选',
            specialActivity:'唤醒窑火',
            sceneFilter:'brightness(1.1) contrast(1.1) saturate(1.2)',
            shopItems:[]
        },
        {
            id:'chunfen',  name:'春分', month:3,  day:21, icon:'☯️',
            theme:'spring', bonus:'all',
            desc:'昼夜均分，阴阳调和，万物平衡之时',
            specialActivity:'阴阳剪纸',
            sceneFilter:'saturate(1.1) brightness(1.05)',
            shopItems:[]
        },
        {
            id:'qingming', name:'清明', month:4,  day:5,  icon:'🌿',
            theme:'spring', bonus:'minsu',
            desc:'缅怀先人，传承记忆，民俗活动盛行',
            specialActivity:'清明祭礼',
            sceneFilter:'sepia(0.15) brightness(0.96) saturate(0.9)',
            shopItems:[
                { id:'st_qingming_1', name:'清明·手工青团礼盒（6枚）', cat:'seasonal',
                  price:180, realPrice:58, stock:20, icon:'🟢', o2oType:'实体', badge:'节气食礼',
                  deliverDays:3, desc:'清明节气传统食礼，江南手作，天然艾草染色。' }
            ]
        },
        {
            id:'guyu',     name:'谷雨', month:4,  day:20, icon:'🍃',
            theme:'spring', bonus:'zhixiu',
            desc:'谷雨茶最香，茶道与织绣共鸣之时',
            specialActivity:'雨前品茗',
            sceneFilter:'hue-rotate(10deg) saturate(1.25) brightness(1.02)',
            shopItems:[
                { id:'st_guyu_1', name:'谷雨·雨前龙井礼盒（50g）', cat:'seasonal',
                  price:520, realPrice:188, stock:10, icon:'🍵', o2oType:'实体', badge:'节气茶礼',
                  deliverDays:5, desc:'清明前封存，谷雨时节开封，茶香最盛。' }
            ]
        },
        {
            id:'lixia',    name:'立夏', month:5,  day:6,  icon:'☀️',
            theme:'summer', bonus:'taoci',
            desc:'夏火炽盛，助窑烧制，是陶瓷高温釉的黄金期',
            specialActivity:'夏窑封印',
            sceneFilter:'saturate(1.4) brightness(1.1) hue-rotate(-5deg)',
            shopItems:[]
        },
        {
            id:'xiaoman',  name:'小满', month:5,  day:21, icon:'🌾',
            theme:'summer', bonus:'minsu',
            desc:'蚕将满仓，织娘诵蚕神祈丰收',
            specialActivity:'蚕神祭礼',
            sceneFilter:'saturate(1.3) brightness(1.05)',
            shopItems:[]
        },
        {
            id:'mangzhong',name:'芒种', month:6,  day:6,  icon:'🌾',
            theme:'summer', bonus:'zhixiu',
            desc:'植物染色最鲜艳的节气，颜料活性最强',
            specialActivity:'草木染坊',
            sceneFilter:'saturate(1.5) brightness(1.08) hue-rotate(-8deg)',
            shopItems:[]
        },
        {
            id:'xiazhi',   name:'夏至', month:6,  day:21, icon:'🌅',
            theme:'summer', bonus:'all',
            desc:'一年最长之日，极昼通宵绣一幅',
            specialActivity:'极昼长绣',
            sceneFilter:'brightness(1.2) saturate(1.3)',
            shopItems:[]
        },
        {
            id:'xiaoshu',  name:'小暑', month:7,  day:7,  icon:'🌡️',
            theme:'summer', bonus:'diaoke',
            desc:'暑气入骨，篆刻与雕刻在热意中有别样禅意',
            specialActivity:'暑日刻石',
            sceneFilter:'sepia(0.3) saturate(1.2) brightness(0.95)',
            shopItems:[]
        },
        {
            id:'dashu',    name:'大暑', month:7,  day:23, icon:'🔥',
            theme:'summer', bonus:'taoci',
            desc:'极热触发窑变，奇异釉色只在大暑诞生',
            specialActivity:'窑变珍品',
            sceneFilter:'sepia(0.4) brightness(0.9) saturate(1.1)',
            shopItems:[]
        },
        {
            id:'liqiu',    name:'立秋', month:8,  day:7,  icon:'🍂',
            theme:'autumn', bonus:'shuhua',
            desc:'秋高气爽，气定神闲，最宜书法与绘画',
            specialActivity:'秋日笔墨',
            sceneFilter:'sepia(0.3) hue-rotate(-10deg) brightness(0.97)',
            shopItems:[]
        },
        {
            id:'chushu',   name:'处暑', month:8,  day:23, icon:'🌤️',
            theme:'autumn', bonus:'all',
            desc:'暑气渐消，整理藏物，传承得以沉淀',
            specialActivity:'晒书藏物',
            sceneFilter:'saturate(0.9) brightness(1.02)',
            shopItems:[]
        },
        {
            id:'bailu',    name:'白露', month:9,  day:8,  icon:'💧',
            theme:'autumn', bonus:'zhixiu',
            desc:'白露水染丝，色泽清透，织绣有独特光泽',
            specialActivity:'露水染丝',
            sceneFilter:'hue-rotate(5deg) saturate(0.95) brightness(1.0)',
            shopItems:[]
        },
        {
            id:'qiufen',   name:'秋分', month:9,  day:23, icon:'🍁',
            theme:'autumn', bonus:'all',
            desc:'秋分团圆，月饼模具是最古老的民间非遗之一',
            specialActivity:'月饼印记',
            sceneFilter:'sepia(0.2) saturate(1.1) brightness(0.98)',
            shopItems:[
                { id:'st_qiufen_1', name:'秋分·非遗月饼礼盒（4枚）', cat:'seasonal',
                  price:360, realPrice:128, stock:30, icon:'🥮', o2oType:'实体', badge:'中秋限定',
                  deliverDays:5, desc:'传统月饼模具手印，4种非遗纹样，团圆佳礼。' }
            ]
        },
        {
            id:'hanlu',    name:'寒露', month:10, day:8,  icon:'🌫️',
            theme:'autumn', bonus:'minsu',
            desc:'寒露后菊盛开，赏菊品酒是古老民俗',
            specialActivity:'菊花雅宴',
            sceneFilter:'sepia(0.35) brightness(0.95) saturate(0.92)',
            shopItems:[]
        },
        {
            id:'shuangjiang',name:'霜降',month:10,day:23,icon:'❄️',
            theme:'autumn', bonus:'diaoke',
            desc:'霜降刻石，气韵最深沉内敛',
            specialActivity:'霜刻篆印',
            sceneFilter:'sepia(0.4) saturate(0.85) brightness(0.9)',
            shopItems:[]
        },
        {
            id:'lidong',   name:'立冬', month:11, day:7,  icon:'🏔️',
            theme:'winter', bonus:'yinlv',
            desc:'寒夜漫长，最宜聆音习曲，音律在冬日别有韵味',
            specialActivity:'冬夜抚琴',
            sceneFilter:'brightness(0.9) saturate(0.8) hue-rotate(185deg)',
            shopItems:[]
        },
        {
            id:'xiaoxue',  name:'小雪', month:11, day:22, icon:'🌨️',
            theme:'winter', bonus:'all',
            desc:'初雪飘落，即兴写景，是所有技艺的灵感时刻',
            specialActivity:'雪絮写意',
            sceneFilter:'brightness(0.95) saturate(0.7) hue-rotate(190deg)',
            shopItems:[]
        },
        {
            id:'daxue',    name:'大雪', month:12, day:7,  icon:'❄️',
            theme:'winter', bonus:'shuhua',
            desc:'大雪压青松，墨迹在雪意中自然扩散',
            specialActivity:'雪中书法',
            sceneFilter:'brightness(0.88) saturate(0.6) hue-rotate(195deg)',
            shopItems:[]
        },
        {
            id:'dongzhi',  name:'冬至', month:12, day:22, icon:'🌑',
            theme:'winter', bonus:'all',
            desc:'一年最长夜，捏饺子花边是最古老的民间手艺',
            specialActivity:'冬至饺艺',
            sceneFilter:'brightness(0.8) saturate(0.7) hue-rotate(200deg)',
            shopItems:[
                { id:'st_dongzhi_1', name:'冬至·传承人手剪窗花套装（12张）', cat:'seasonal',
                  price:220, realPrice:78, stock:15, icon:'❄️', o2oType:'实体', badge:'冬至限定',
                  deliverDays:7, desc:'冬至节气限定，非遗剪纸传承人手剪，12种吉祥纹样。' }
            ]
        },
        {
            id:'xiaohan',  name:'小寒', month:1,  day:6,  icon:'🥶',
            theme:'winter', bonus:'taoci',
            desc:'小寒最冷，守窑旁烤火，窑变触手可及',
            specialActivity:'窑边守候',
            sceneFilter:'brightness(0.82) saturate(0.65) hue-rotate(200deg)',
            shopItems:[]
        },
        {
            id:'dahan',    name:'大寒', month:1,  day:20, icon:'🌬️',
            theme:'winter', bonus:'all',
            desc:'一年最后节气，提笔辞旧岁，万象皆可入画',
            specialActivity:'辞岁书信',
            sceneFilter:'brightness(0.78) saturate(0.6) hue-rotate(205deg)',
            shopItems:[]
        },
    ],

    getCurrentTerm() {
        const now = new Date();
        const year = now.getFullYear();
        let cur = this.TERMS[this.TERMS.length - 1];
        for (let i = 0; i < this.TERMS.length; i++) {
            const t  = this.TERMS[i];
            const tD = new Date(year, t.month - 1, t.day);
            const nT = this.TERMS[(i + 1) % this.TERMS.length];
            const nD = new Date(nT.month <= t.month && i < this.TERMS.length - 1 ? year : year + 1, nT.month - 1, nT.day);
            if (now >= tD && now < nD) { cur = t; break; }
        }
        return cur;
    },

    getNextTerm() {
        const cur = this.getCurrentTerm();
        const idx = this.TERMS.findIndex(t => t.id === cur.id);
        return this.TERMS[(idx + 1) % this.TERMS.length];
    },

    getDaysUntilNext() {
        const next = this.getNextTerm();
        const now  = new Date();
        let nd = new Date(now.getFullYear(), next.month - 1, next.day);
        if (nd <= now) nd.setFullYear(nd.getFullYear() + 1);
        return Math.ceil((nd - now) / 86400000);
    },

    getSeasonalItems() {
        return this.getCurrentTerm().shopItems || [];
    },

    getBonusMultiplier(category) {
        const cur = this.getCurrentTerm();
        return (cur.bonus === category || cur.bonus === 'all') ? 1.5 : 1.0;
    },

    applySceneFilter() {
        const cur  = this.getCurrentTerm();
        const view = document.getElementById('view-exploration');
        if (view && cur.sceneFilter) {
            view.style.filter     = cur.sceneFilter;
            view.style.transition = 'filter 4s ease';
        }
    },

    checkFirstVisitToday() {
        const cur = this.getCurrentTerm();
        if (gameState.currentSolarTerm !== cur.id) {
            gameState.currentSolarTerm = cur.id;
            if (typeof SaveManager !== 'undefined') SaveManager.save();
            setTimeout(() => {
                showNotification(`节气更替 · ${cur.icon} 【${cur.name}】— ${cur.desc}`, '🗓️', 7000);
                XiuliluManager.stampCurrentTerm(cur);
            }, 2000);
        }
    },

    renderCalendarWidget(containerId) {
        const el  = document.getElementById(containerId);
        if (!el) return;
        const cur  = this.getCurrentTerm();
        const next = this.getNextTerm();
        const days = this.getDaysUntilNext();
        const mult = (cur.bonus === 'all') ? '×2 全品类' : `×1.5 【${typeof getCategoryName === 'function' ? getCategoryName(cur.bonus) : cur.bonus}】`;
        el.innerHTML = `
            <div style="background:linear-gradient(135deg,rgba(212,175,55,.06),rgba(126,182,161,.05));border:1px solid rgba(212,175,55,.2);border-radius:12px;padding:14px 16px;font-family:var(--font-kai);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                    <div style="font-size:12px;color:#888;">当前节气</div>
                    <div style="font-size:11px;color:var(--jade);">距 ${next.icon}${next.name} 还有 ${days} 天</div>
                </div>
                <div style="display:flex;align-items:center;gap:14px;">
                    <div style="font-size:44px;">${cur.icon}</div>
                    <div>
                        <div style="font-size:22px;font-weight:bold;color:var(--gold);">${cur.name}</div>
                        <div style="font-size:12px;color:#aaa;margin-top:2px;">${cur.desc}</div>
                        ${cur.specialActivity ? `<div style="margin-top:7px;font-size:11px;color:var(--jade);border:1px solid var(--jade);display:inline-block;padding:2px 9px;border-radius:12px;">🎋 限定：${cur.specialActivity}</div>` : ''}
                    </div>
                </div>
                <div style="margin-top:10px;font-size:11px;color:var(--amber);">✨ 本节气工坊奖励加成：${mult}</div>
            </div>`;
    },
};


// ============================================================
// 二、传习录管理器
// ============================================================
const XiuliluManager = {

    ICONS: {
        study:   { icon:'📖', color:'#4a90e2',        label:'研习' },
        craft:   { icon:'⚒️', color:'var(--cinnabar)', label:'造物' },
        explore: { icon:'🗺️', color:'var(--jade)',     label:'探索' },
        bond:    { icon:'💛', color:'var(--amber)',    label:'羁绊' },
        o2o:     { icon:'📦', color:'#9b59b6',        label:'流转' },
        season:  { icon:'🍃', color:'var(--jade)',     label:'节气' },
        quest:   { icon:'📜', color:'var(--gold)',     label:'任务' },
    },

    addEntry(type, title, desc, opts = {}) {
        if (!gameState.xiulilu) gameState.xiulilu = [];
        const term  = SolarTermEngine.getCurrentTerm();
        const world = ['晨曦','午时','黄昏','子夜'];
        const entry = {
            id:          Date.now() + Math.random(),
            type,
            title,
            desc,
            time:        new Date().toLocaleString('zh-CN',{month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'}),
            solarTerm:   term.name,
            solarIcon:   term.icon,
            worldLabel:  world[gameState.worldState ?? 1],
            inheritorId:   opts.inheritorId   || null,
            inheritorName: opts.inheritorName || null,
            annotation:    null,
            annotationBy:  null,
            annotationIcon:'📝',
            score:         opts.score   !== undefined ? opts.score : null,
            itemGained:    opts.itemGained || null,
        };
        gameState.xiulilu.unshift(entry);
        if (gameState.xiulilu.length > 120) gameState.xiulilu.pop();

        if (opts.inheritorId) GameEvent.emit('xiulilu:new_entry', { entry, inheritorId: opts.inheritorId });

        this._checkMilestones();
        if (typeof SaveManager !== 'undefined') SaveManager.save();
        return entry;
    },

    addAnnotation(entryId, byName, text, icon = '📝') {
        if (!gameState.xiulilu) return;
        const e = gameState.xiulilu.find(x => x.id === entryId);
        if (!e) return;
        e.annotation = text;  e.annotationBy = byName;  e.annotationIcon = icon;
        showNotification(`【${byName}】为你的传习录留下了批注！`, '📜', 5500);
        if (typeof playSound === 'function') playSound('achievement');
        if (typeof SaveManager !== 'undefined') SaveManager.save();
    },

    stampCurrentTerm(term) {
        this.addEntry('season', `${term.icon} ${term.name}到来`,
            `节气更替，${term.desc}。此刻记下，日后回望，皆是传承的印记。`);
    },

    _checkMilestones() {
        const total = (gameState.xiulilu || []).length;
        [
            { count:1,  id:'xl_1',  name:'初立传习', reward:50,  icon:'📖', desc:'开始记录传习之路' },
            { count:10, id:'xl_10', name:'勤学不辍', reward:150, icon:'📚', desc:'传习录满10条' },
            { count:30, id:'xl_30', name:'积学之途', reward:300, icon:'🏮', desc:'传习录满30条' },
            { count:50, id:'xl_50', name:'传习宗师', reward:500, icon:'🌟', desc:'传习录满50条' },
        ].forEach(m => {
            if (total >= m.count && !gameState.achievements[m.id])
                if (typeof unlockAchievement === 'function')
                    unlockAchievement(m.id, m.name, m.desc, m.reward, m.icon);
        });
    },

    getStats() {
        const s = {};
        (gameState.xiulilu || []).forEach(e => { s[e.type] = (s[e.type] || 0) + 1; });
        return s;
    },

    renderList(containerId) {
        const el = document.getElementById(containerId);
        if (!el) return;
        const list = gameState.xiulilu || [];
        if (!list.length) {
            el.innerHTML = `<div style="text-align:center;padding:50px;color:#888;font-family:var(--font-kai);">
                <div style="font-size:50px;margin-bottom:15px;">📖</div>
                <p>传习录尚是空白。<br>去探索、研习、与传承人交流，留下你的印记吧。</p></div>`;
            return;
        }
        el.innerHTML = list.map(e => {
            const m = this.ICONS[e.type] || this.ICONS.study;
            return `<div style="margin-bottom:16px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-left:3px solid ${m.color};border-radius:8px;padding:16px;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:7px;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="font-size:18px;">${m.icon}</span>
                        <span style="font-size:14px;font-weight:bold;color:var(--amber);">${e.title}</span>
                        <span style="font-size:10px;padding:1px 7px;border-radius:8px;background:${m.color}20;color:${m.color};">${m.label}</span>
                    </div>
                    <div style="font-size:10px;color:#555;text-align:right;line-height:1.7;">
                        <div>${e.solarIcon}${e.solarTerm} · ${e.worldLabel}</div>
                        <div>${e.time}</div>
                    </div>
                </div>
                <p style="font-size:13px;color:#bbb;line-height:1.8;margin:0 0 7px;font-family:var(--font-kai);">${e.desc}</p>
                ${e.inheritorName ? `<div style="font-size:11px;color:var(--jade);">🏛️ ${e.inheritorName}</div>` : ''}
                ${e.itemGained    ? `<div style="font-size:11px;color:var(--gold);margin-top:3px;">🎁 ${e.itemGained}</div>` : ''}
                ${e.score != null ? `<div style="font-size:11px;color:#aaa;margin-top:3px;">📊 得分：${e.score}分</div>` : ''}
                ${e.annotation ? `
                    <div style="margin-top:10px;background:rgba(212,175,55,.06);border:1px dashed rgba(212,175,55,.3);border-radius:6px;padding:10px;">
                        <div style="font-size:11px;color:var(--gold);margin-bottom:4px;">${e.annotationIcon} ${e.annotationBy} · 传承批注</div>
                        <div style="font-size:13px;color:#e8dcc8;font-family:var(--font-kai);line-height:1.8;font-style:italic;">"${e.annotation}"</div>
                    </div>` : ''}
            </div>`;
        }).join('');
    },

    openModal() {
        let m = document.getElementById('xiulilu-modal');
        if (!m) {
            m = document.createElement('div');
            m.id = 'xiulilu-modal';
            m.className = 'modal';
            m.style.cssText = 'width:min(700px,96vw);max-height:82vh;display:flex;flex-direction:column;';
            m.innerHTML = `
                <div class="modal-header modal-header-jade" style="flex-shrink:0;">
                    <h3>📖 传习录 · 非遗成长档案</h3>
                    <button class="modal-close" onclick="closeModal('xiulilu-modal')">×</button>
                </div>
                <div id="xl-stats" style="padding:12px 20px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;gap:10px;flex-wrap:wrap;flex-shrink:0;"></div>
                <div id="xl-list" style="flex:1;overflow-y:auto;padding:20px;"></div>`;
            document.body.appendChild(m);
        }
        const statsEl = document.getElementById('xl-stats');
        if (statsEl) {
            const s = this.getStats();
            statsEl.innerHTML = Object.entries(s).map(([type, cnt]) => {
                const meta = this.ICONS[type] || this.ICONS.study;
                return `<div style="background:${meta.color}15;border:1px solid ${meta.color}40;padding:3px 10px;border-radius:12px;font-size:12px;color:${meta.color};">${meta.icon} ${meta.label} ×${cnt}</div>`;
            }).join('') || '<span style="font-size:12px;color:#666;">暂无记录</span>';
        }
        this.renderList('xl-list');
        if (typeof openModal === 'function') openModal('xiulilu-modal');
    },
};


// ============================================================
// 三、O2O订单流管理器
// ============================================================
const O2OOrderManager = {
    STS: {
        pending:   { label:'待确认', color:'#f59e0b', icon:'⏳' },
        confirmed: { label:'已确认', color:'#3b82f6', icon:'✅' },
        making:    { label:'制作中', color:'var(--cinnabar)', icon:'⚒️' },
        shipped:   { label:'已发货', color:'var(--jade)',    icon:'📮' },
        delivered: { label:'已签收', color:'var(--gold)',    icon:'🎉' },
        offline:   { label:'待核销', color:'#9b59b6',       icon:'📍' },
        done:      { label:'已完成', color:'var(--jade)',    icon:'🌟' },
        cancelled: { label:'已取消', color:'#666',          icon:'✖️' },
    },

    createOrder(inheritorId, productName, productIcon, o2oType, opts = {}) {
        if (!gameState.handsignOrders) gameState.handsignOrders = [];
        const inh = (typeof inheritorData !== 'undefined') ? inheritorData.find(x => x.id === inheritorId) : null;
        const order = {
            id:            'ORD_' + Date.now(),
            inheritorId,
            inheritorName: inh ? inh.name : (opts.inheritorName || '匠师'),
            product:       productName,
            productIcon:   productIcon || '📦',
            o2oType:       o2oType || '实体',
            status:        o2oType === '线下' ? 'offline' : 'pending',
            address:       opts.address || '',
            trackingCode:  '',
            note:          opts.customNote || '',
            createdAt:     new Date().toLocaleString('zh-CN'),
            updatedAt:     new Date().toLocaleString('zh-CN'),
            rewardGranted: false,
        };
        gameState.handsignOrders.unshift(order);

        XiuliluManager.addEntry('o2o',
            `下单：${productName}`,
            `已向【${order.inheritorName}】发起流转申请，等待匠师确认制作。匠人的手艺即将跨越虚实，抵达现世。`,
            { inheritorId, inheritorName: order.inheritorName }
        );
        GameEvent.emit('o2o:order_created', { order });
        SaveManager.save();
        showNotification(`手信已寄出！等待【${order.inheritorName}】接单。`, '📦', 5000);
        return order;
    },

    updateStatus(orderId, status, extra = {}) {
        if (!gameState.handsignOrders) return;
        const o = gameState.handsignOrders.find(x => x.id === orderId);
        if (!o) return;
        o.status    = status;
        o.updatedAt = new Date().toLocaleString('zh-CN');
        if (extra.trackingCode) o.trackingCode = extra.trackingCode;
        const st = this.STS[status] || {};
        showNotification(`【${o.product}】状态更新：${st.label || status}`, st.icon || '📦', 5000);
        if (status === 'delivered' || status === 'done') this._grantReward(o);
        GameEvent.emit('o2o:order_updated', { order: o, status });
        SaveManager.save();
    },

    _grantReward(o) {
        if (o.rewardGranted) return;
        o.rewardGranted = true;
        earnStones(200);
        if (!gameState.achievements['o2o_first'])
            if (typeof unlockAchievement === 'function')
                unlockAchievement('o2o_first', '现世流转', '完成首笔O2O流转', 300, '📦');
        XiuliluManager.addEntry('o2o',
            `流转完成：${o.product}`,
            `来自【${o.inheritorName}】的手信抵达现世，匠人的心意与技艺跨越了虚实的边界。`,
            { inheritorId: o.inheritorId, inheritorName: o.inheritorName, itemGained: `${o.productIcon} ${o.product}` }
        );
        if (!gameState.intimacy) gameState.intimacy = {};
        gameState.intimacy[o.inheritorName] = (gameState.intimacy[o.inheritorName] || 0) + 50;
        showNotification(`订单完成！获得 🪙200 灵石，与【${o.inheritorName}】羁绊大幅加深！`, '🎉', 7000);
    },

    renderOrders(containerId) {
        const el = document.getElementById(containerId);
        if (!el) return;
        const list = gameState.handsignOrders || [];
        if (!list.length) {
            el.innerHTML = `<div style="text-align:center;padding:40px;color:#888;font-family:var(--font-kai);">
                <div style="font-size:38px;margin-bottom:12px;">📭</div>
                <p>尚无手信订单。<br>在商铺或传承人工坊购买实体产品即可创建。</p></div>`;
            return;
        }
        el.innerHTML = list.map(o => {
            const st = this.STS[o.status] || { label: o.status, color:'#aaa', icon:'📦' };
            return `<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:15px;margin-bottom:12px;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <span style="font-size:26px;">${o.productIcon}</span>
                        <div>
                            <div style="font-size:14px;font-weight:bold;color:var(--amber);">${o.product}</div>
                            <div style="font-size:11px;color:#888;">来自：${o.inheritorName} · ${o.o2oType}</div>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:13px;color:${st.color};font-weight:bold;">${st.icon} ${st.label}</div>
                        <div style="font-size:10px;color:#555;margin-top:2px;">${o.updatedAt}</div>
                    </div>
                </div>
                ${o.trackingCode ? `<div style="font-size:11px;color:var(--jade);margin-bottom:6px;">🚚 快递单号：${o.trackingCode}</div>` : ''}
                ${(o.o2oType === '线下' && o.status === 'offline') ? `<button class="btn btn-sm btn-outline" style="font-size:11px;" onclick="O2OOrderManager.updateStatus('${o.id}','done')">✅ 确认核销</button>` : ''}
                <div style="font-size:10px;color:#444;margin-top:6px;">${o.id}</div>
            </div>`;
        }).join('');
    },

    // B端：传承人控制台用
    renderBsidePending(containerId) {
        const el = document.getElementById(containerId);
        if (!el) return;
        const list = (gameState.handsignOrders || []).filter(o => ['pending','confirmed','making'].includes(o.status));
        if (!list.length) {
            el.innerHTML = `<div style="text-align:center;padding:20px;color:#888;font-size:13px;">暂无待处理订单</div>`;
            return;
        }
        el.innerHTML = list.map(o => {
            const st = this.STS[o.status] || {};
            return `<div style="background:rgba(0,0,0,.35);border:1px solid rgba(212,175,55,.2);border-radius:8px;padding:13px;margin-bottom:9px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:7px;">
                    <span style="font-weight:bold;color:#e8dcc8;">${o.productIcon} ${o.product}</span>
                    <span style="font-size:11px;color:${st.color};">${st.icon} ${st.label}</span>
                </div>
                <div style="font-size:11px;color:#888;margin-bottom:8px;">${o.createdAt}</div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    ${o.status==='pending'   ? `<button class="btn btn-sm" style="font-size:11px;" onclick="O2OOrderManager._bConfirm('${o.id}')">确认接单</button>` : ''}
                    ${o.status==='confirmed' ? `<button class="btn btn-sm" style="font-size:11px;" onclick="O2OOrderManager._bMake('${o.id}')">开始制作</button>` : ''}
                    ${o.status==='making'    ? `<button class="btn btn-sm btn-jade" style="font-size:11px;" onclick="O2OOrderManager._bShip('${o.id}')">标记发货</button>` : ''}
                </div>
            </div>`;
        }).join('');
    },

    _bConfirm(id) { this.updateStatus(id,'confirmed'); showNotification('已确认接单！','✅'); this.renderBsidePending('bside-orders'); },
    _bMake(id)    { this.updateStatus(id,'making');    showNotification('制作中…','⚒️'); this.renderBsidePending('bside-orders'); },
    _bShip(id) {
        const code = prompt('请输入快递单号：');
        if (code) { this.updateStatus(id,'shipped',{trackingCode:code}); this.renderBsidePending('bside-orders'); }
    },
};


// ============================================================
// 四、传承纽带系统
// ============================================================
const BondSystem = {
    LEVELS: [
        { min:0,   name:'初识',     color:'#888',             perk:'可访问基础对话' },
        { min:30,  name:'相知',     color:'var(--jade)',      perk:'可发送飞鸽传书' },
        { min:80,  name:'知音',     color:'var(--amber)',     perk:'可领取专属师门任务' },
        { min:150, name:'传人',     color:'var(--cinnabar)',  perk:'可解锁定制款现世流转' },
        { min:300, name:'入门弟子', color:'var(--gold)',      perk:'可获得传承人开光加持' },
    ],

    getLevel(name) {
        const val = (gameState.intimacy && gameState.intimacy[name]) || 0;
        let lv = this.LEVELS[0];
        this.LEVELS.forEach(l => { if (val >= l.min) lv = l; });
        return { ...lv, intimacy: val };
    },

    add(name, amount, reason = '') {
        if (!gameState.intimacy) gameState.intimacy = {};
        const before = gameState.intimacy[name] || 0;
        gameState.intimacy[name] = before + amount;
        const after   = gameState.intimacy[name];
        const bLv = this.LEVELS.filter(l => before >= l.min).pop();
        const aLv = this.LEVELS.filter(l => after  >= l.min).pop();
        if (aLv && bLv && aLv.min !== bLv.min) {
            showNotification(`与【${name}】的羁绊升至【${aLv.name}】！解锁：${aLv.perk}`, '💛', 6000);
            if (typeof playSound === 'function') playSound('achievement');
            XiuliluManager.addEntry('bond',`羁绊升华：${name}`,
                `与【${name}】的情谊升至【${aLv.name}】。${aLv.perk}。`,{ inheritorName:name });
        }
        GameEvent.emit('bond:changed',{ name, before, after, reason });
        SaveManager.save();
    },

    sendLetter(name, content) {
        const lv = this.getLevel(name);
        if (lv.intimacy < 30) { showNotification('需达到【相知】才能发送飞鸽传书','🔒'); return false; }
        if (!gameState.bonds) gameState.bonds = {};
        if (!gameState.bonds[name]) gameState.bonds[name] = { letters:[] };
        const letter = { id:Date.now(), content, from:'游历者', to:name,
            time:new Date().toLocaleString('zh-CN'), replied:false, replyContent:null };
        gameState.bonds[name].letters.unshift(letter);
        showNotification(`飞鸽传书已寄出，等待【${name}】回信`, '🕊️', 4500);
        // Simulate reply
        setTimeout(() => this._simulateReply(name, letter.id), 4000 + Math.random()*6000);
        SaveManager.save();
        return true;
    },

    _simulateReply(name, letterId) {
        if (!gameState.bonds?.[name]) return;
        const letter = gameState.bonds[name].letters.find(l => l.id === letterId);
        if (!letter || letter.replied) return;
        const inh = (typeof inheritorData !== 'undefined') ? inheritorData.find(i => i.name === name || i.name.startsWith(name.slice(0,2))) : null;
        const pool = inh?.aiAvatar?.knowledge?.faq?.map(f => f.a) || [
            '收到你的来信，感到欣慰。传承之路漫长，愿你持之以恒。',
            '你的热情让老夫看到了技艺传承的希望，有缘再聚。',
            '九州之大，有你这样的游历者，非遗自有后继之人。',
        ];
        letter.replied = true;
        letter.replyContent = pool[Math.floor(Math.random() * pool.length)];
        showNotification(`【${name}】回信了！`, '💌', 5500);
        this.add(name, 10, '通信往来');
        XiuliluManager.addEntry('bond', `收到【${name}】回信`,
            `"${letter.replyContent.substring(0,60)}..."`, { inheritorName: name });
        SaveManager.save();
    },

    renderPanel(name, containerId) {
        const el = document.getElementById(containerId);
        if (!el) return;
        const lv   = this.getLevel(name);
        const next = this.LEVELS.find(l => l.min > lv.intimacy);
        const pct  = next ? Math.min(100,((lv.intimacy - lv.min) / (next.min - lv.min)) * 100) : 100;
        el.innerHTML = `
            <div style="background:rgba(0,0,0,.3);border:1px solid rgba(212,175,55,.2);border-radius:10px;padding:15px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                    <div style="font-size:16px;color:${lv.color};font-weight:bold;">💛 ${lv.name}</div>
                    <div style="font-size:12px;color:#888;">羁绊值 ${lv.intimacy}${next?` / ${next.min}`:' (满级)'}</div>
                </div>
                <div style="height:5px;background:rgba(0,0,0,.4);border-radius:4px;margin-bottom:8px;overflow:hidden;">
                    <div style="height:100%;width:${pct}%;background:${lv.color};transition:width .6s;border-radius:4px;"></div>
                </div>
                <div style="font-size:11px;color:#888;margin-bottom:10px;">当前权益：${lv.perk}</div>
                ${next ? `<div style="font-size:11px;color:var(--amber);">距【${next.name}】还需 ${next.min - lv.intimacy} 点</div>` : `<div style="font-size:11px;color:var(--gold);">✨ 最高羁绊</div>`}
                <button class="btn btn-sm btn-outline" style="margin-top:12px;font-size:12px;width:100%;" onclick="BondSystem._openLetterDialog('${name}')">🕊️ 写信给${name}</button>
            </div>`;
    },

    _openLetterDialog(name) {
        const lv = this.getLevel(name);
        if (lv.intimacy < 30) { showNotification('需达到【相知】才能发送飞鸽传书','🔒'); return; }
        const text = prompt(`给【${name}】写信（将随机延迟回信）：`);
        if (text && text.trim()) this.sendLetter(name, text.trim());
    },
};


// ============================================================
// 五、工坊活动引擎
// ============================================================
const WorkshopActivityEngine = {

    open(inheritorId, filterType = null) {
        const inh = (typeof inheritorData !== 'undefined') ? inheritorData.find(i => i.id === inheritorId) : null;
        if (!inh || !inh.workshopActivities) {
            showNotification('工坊数据加载失败','⚠️'); return;
        }
        let acts = inh.workshopActivities;
        if (filterType) acts = acts.filter(a => a.type === filterType);

        document.getElementById('wae-panel')?.remove();
        const overlay = document.getElementById('global-modal-overlay');
        if (overlay) overlay.classList.add('show');

        const panel = document.createElement('div');
        panel.id = 'wae-panel';
        panel.style.cssText = `position:fixed;inset:0;z-index:3000;background:rgba(8,6,4,.93);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;animation:fadeIn .3s ease;`;
        panel.innerHTML = `
            <div style="width:min(680px,96vw);max-height:88vh;background:linear-gradient(150deg,#1a1610,#120e09);border:1px solid rgba(212,175,55,.3);border-radius:16px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 0 50px rgba(212,175,55,.12);">
                <div style="padding:20px 24px;border-bottom:1px solid rgba(212,175,55,.18);display:flex;justify-content:space-between;align-items:center;background:rgba(0,0,0,.3);flex-shrink:0;">
                    <div>
                        <div style="font-size:19px;color:var(--gold);font-weight:bold;font-family:var(--font-kai);">${inh.avatar} ${inh.name} · 工坊研习</div>
                        <div style="font-size:12px;color:#888;margin-top:3px;">${inh.title}</div>
                    </div>
                    <button onclick="document.getElementById('wae-panel').remove();document.getElementById('global-modal-overlay')?.classList.remove('show');" style="background:none;border:none;color:#aaa;font-size:26px;cursor:pointer;line-height:1;">×</button>
                </div>
                <div id="wae-body" style="flex:1;overflow-y:auto;padding:20px;"></div>
            </div>`;
        document.body.appendChild(panel);
        this._renderList(inheritorId, acts, inh);
    },

    _renderList(id, acts, inh) {
        const body = document.getElementById('wae-body');
        if (!body) return;
        const term     = SolarTermEngine.getCurrentTerm();
        const bonus    = term.bonus === inh.category || term.bonus === 'all';
        const mult     = bonus ? 1.5 : 1;
        const progress = gameState[`inh_prog_${id}`] || {};

        body.innerHTML = `
            ${bonus ? `<div style="background:rgba(212,175,55,.08);border:1px solid rgba(212,175,55,.25);border-radius:8px;padding:10px 15px;margin-bottom:16px;font-size:12px;color:var(--amber);">✨ 节气加成：${term.icon}${term.name}期间，本工坊奖励 ×${mult} 灵石！</div>` : ''}
            <div style="display:flex;flex-direction:column;gap:12px;">
                ${acts.map(a => {
                    const done  = !!progress[a.id];
                    const final = Math.floor((a.reward?.stones||0)*mult);
                    return `<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,${done?.15:.07});border-radius:10px;padding:16px;display:flex;align-items:flex-start;gap:14px;${done?'opacity:.75;':'cursor:pointer;'}"
                            ${!done?`onclick="WorkshopActivityEngine.startActivity(${id},'${a.id}')"`:''}>
                        <div style="font-size:32px;flex-shrink:0;">${a.icon}</div>
                        <div style="flex:1;">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">
                                <span style="font-size:14px;font-weight:bold;color:${done?'var(--jade)':'var(--amber)'};">${a.name}${done?' ✓':''}</span>
                                <span style="font-size:11px;color:#888;">${a.duration}</span>
                            </div>
                            <div style="font-size:12px;color:#aaa;line-height:1.65;margin-bottom:8px;">${a.desc}</div>
                            <div style="display:flex;gap:12px;font-size:11px;flex-wrap:wrap;">
                                ${final>0?`<span style="color:var(--gold);">🪙 +${final}</span>`:''}
                                ${(a.reward?.items||[]).map(i=>`<span style="color:var(--jade);">+${i.count} ${i.name}</span>`).join('')}
                                ${done?'<span style="color:var(--jade);">已完成</span>':'<span style="color:var(--amber);">点击开始 →</span>'}
                            </div>
                        </div>
                    </div>`;
                }).join('')}
            </div>`;
    },

    startActivity(inhId, actId) {
        const inh = (typeof inheritorData !== 'undefined') ? inheritorData.find(i => i.id === inhId) : null;
        const act = inh?.workshopActivities?.find(a => a.id === actId);
        if (!inh || !act) return;
        const body = document.getElementById('wae-body');
        if (!body) return;
        if (act.type === 'knowledge') this._doKnowledge(body, inh, act);
        else if (act.type === 'quiz') this._doQuiz(body, inh, act);
        else if (act.type === 'craft') this._doCraft(body, inh, act);
        else if (act.type === 'product') this._doProduct(body, inh, act);
        else this._finish(inhId, act, 80);
    },

    _backBtn(inhId) {
        return `<button onclick="WorkshopActivityEngine.open(${inhId})" style="background:none;border:none;color:var(--jade);cursor:pointer;font-size:13px;margin-bottom:16px;display:block;">← 返回活动列表</button>`;
    },

    _doKnowledge(body, inh, act) {
        const sections = act.content?.sections || [];
        const quiz     = act.content?.quiz     || [];
        body.innerHTML = `${this._backBtn(inh.id)}
            <h3 style="color:var(--gold);font-family:var(--font-kai);margin-bottom:18px;">${act.icon} ${act.name}</h3>
            ${sections.map((s,i)=>`
                <div style="margin-bottom:18px;padding:16px;background:rgba(255,255,255,.03);border-left:3px solid var(--jade);border-radius:0 8px 8px 0;">
                    <div style="font-size:14px;font-weight:bold;color:var(--amber);margin-bottom:7px;">${i+1}. ${s.title}</div>
                    <div style="font-size:13px;color:#ccc;line-height:1.85;font-family:var(--font-kai);">${s.text}</div>
                </div>`).join('')}
            ${quiz.length ? `
                <div style="padding:20px;background:rgba(212,175,55,.05);border:1px dashed rgba(212,175,55,.3);border-radius:10px;margin-top:8px;">
                    <div style="font-size:14px;color:var(--gold);font-weight:bold;margin-bottom:15px;">📝 学习测验</div>
                    ${quiz.map((q,qi)=>`
                        <div style="margin-bottom:15px;">
                            <div style="font-size:13px;color:#e8dcc8;margin-bottom:8px;">${qi+1}. ${q.q}</div>
                            <div style="display:flex;flex-direction:column;gap:6px;">
                                ${q.options.map((opt,oi)=>`
                                    <div id="kq-${qi}-${oi}" onclick="WorkshopActivityEngine._answerKQ(${qi},${oi},${q.answer},${inh.id},${JSON.stringify(act).replace(/"/g,'&quot;')})"
                                         style="padding:8px 14px;background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.1);border-radius:6px;font-size:12px;color:#ccc;cursor:pointer;transition:.2s;"
                                         onmouseover="if(!this.dataset.locked)this.style.borderColor='var(--gold)'"
                                         onmouseout="if(!this.dataset.locked)this.style.borderColor='rgba(255,255,255,.1)'"
                                    >${String.fromCharCode(65+oi)}. ${opt}</div>`).join('')}
                            </div>
                        </div>`).join('')}
                    <button id="kq-finish" style="display:none;width:100%;margin-top:12px;" class="btn btn-jade" onclick="WorkshopActivityEngine._finish(${inh.id},${JSON.stringify(act).replace(/"/g,'&quot;')},85)">✅ 完成研习，记入传习录</button>
                </div>` 
            : `<button class="btn btn-jade btn-full" style="margin-top:18px;" onclick="WorkshopActivityEngine._finish(${inh.id},${JSON.stringify(act).replace(/"/g,'&quot;')},90)">✅ 已学习完毕，记入传习录</button>`}`;
    },

    _answerKQ(qi, oi, correct, inhId, act) {
        const chosen  = document.getElementById(`kq-${qi}-${oi}`);
        const correctEl = document.getElementById(`kq-${qi}-${correct}`);
        if (!chosen) return;
        const right = oi === correct;
        chosen.style.background    = right ? 'rgba(126,182,161,.25)' : 'rgba(200,50,50,.25)';
        chosen.style.borderColor   = right ? 'var(--jade)' : 'var(--cinnabar)';
        chosen.style.color         = right ? 'var(--jade)' : 'var(--cinnabar)';
        chosen.style.cursor        = 'default';
        if (!right && correctEl) { correctEl.style.background='rgba(126,182,161,.25)'; correctEl.style.borderColor='var(--jade)'; correctEl.style.color='var(--jade)'; }
        document.querySelectorAll(`[id^="kq-${qi}-"]`).forEach(el=>{el.style.cursor='default';el.onclick=null;el.onmouseover=null;el.dataset.locked='1';});
        const fb = document.getElementById('kq-finish');
        if (fb) fb.style.display = 'block';
    },

    _doQuiz(body, inh, act) {
        body.innerHTML = `${this._backBtn(inh.id)}
            <h3 style="color:var(--gold);font-family:var(--font-kai);margin-bottom:16px;">${act.icon} ${act.name}</h3>
            <div style="padding:24px;background:rgba(212,175,55,.05);border:1px dashed rgba(212,175,55,.3);border-radius:10px;text-align:center;">
                <div style="font-size:38px;margin-bottom:14px;">🎯</div>
                <div style="font-size:14px;color:#e8dcc8;margin-bottom:7px;">${act.desc}</div>
                <div style="font-size:12px;color:#888;margin-bottom:20px;">共${act.content?.questionCount||10}题 · 通过分${act.content?.passingScore||6}</div>
                <button class="btn btn-jade" onclick="WorkshopActivityEngine._runQuiz(${inh.id},${JSON.stringify(act).replace(/"/g,'&quot;')})">开始挑战</button>
            </div>`;
    },

    _runQuiz(inhId, act) {
        const score = Math.floor(Math.random() * 3) + 7;
        const pass  = score >= (act.content?.passingScore || 6);
        const body  = document.getElementById('wae-body');
        if (!body) return;
        body.innerHTML = `<div style="text-align:center;padding:48px 20px;">
            <div style="font-size:64px;margin-bottom:18px;">${score>=8?'🏆':'📖'}</div>
            <div style="font-size:24px;color:var(--gold);font-weight:bold;margin-bottom:8px;">${score}/${act.content?.questionCount||10} 分</div>
            <div style="font-size:14px;color:${pass?'var(--jade)':'var(--cinnabar)'};margin-bottom:22px;">${pass?'通关成功！':'再努力一把！'}</div>
            <button class="btn btn-jade" onclick="WorkshopActivityEngine._finish(${inhId},${JSON.stringify(act).replace(/"/g,'&quot;')},${score*10})">领取奖励</button>
        </div>`;
    },

    _doCraft(body, inh, act) {
        const steps = act.content?.steps || [];
        body.innerHTML = `${this._backBtn(inh.id)}
            <h3 style="color:var(--gold);font-family:var(--font-kai);margin-bottom:16px;">${act.icon} ${act.name}</h3>
            <p style="font-size:13px;color:#aaa;margin-bottom:18px;line-height:1.7;">逐步完成以下工序，体验虚拟制作流程：</p>
            <div style="display:flex;flex-direction:column;gap:10px;" id="craft-steps">
                ${steps.map((s,i)=>`
                    <div id="cs-${i}" onclick="WorkshopActivityEngine._stepDone(${i},${steps.length},${inh.id},${JSON.stringify(act).replace(/"/g,'&quot;')})"
                         style="display:flex;align-items:center;gap:14px;padding:13px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:8px;cursor:pointer;transition:.2s;"
                         onmouseover="this.style.borderColor='var(--gold)'" onmouseout="this.style.borderColor='rgba(255,255,255,.07)'">
                        <div id="cs-icon-${i}" style="width:28px;height:28px;border-radius:50%;background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:12px;color:#888;flex-shrink:0;">${i+1}</div>
                        <div style="font-size:13px;color:#ccc;">${s}</div>
                    </div>`).join('')}
            </div>`;
    },

    _stepDone(idx, total, inhId, act) {
        const icon = document.getElementById(`cs-icon-${idx}`);
        const card = document.getElementById(`cs-${idx}`);
        if (icon) { icon.innerText='✓'; icon.style.background='var(--jade)'; icon.style.color='white'; icon.style.border='none'; }
        if (card) { card.style.borderColor='var(--jade)'; card.onclick=null; card.onmouseover=null; }
        let done = 0;
        for (let i=0; i<total; i++) { const ic = document.getElementById(`cs-icon-${i}`); if(ic?.innerText==='✓') done++; }
        if (done >= total) setTimeout(() => this._finish(inhId, act, 92), 400);
    },

    _doProduct(body, inh, act) {
        const c    = act.content || {};
        const prog = inh.progress || 0;
        const ok   = prog >= (act.requireProgress || 100);
        body.innerHTML = `${this._backBtn(inh.id)}
            <h3 style="color:var(--gold);font-family:var(--font-kai);margin-bottom:16px;">${act.icon} ${act.name}</h3>
            ${!ok ? `<div style="background:rgba(200,50,50,.1);border:1px solid rgba(200,50,50,.3);border-radius:8px;padding:14px;text-align:center;margin-bottom:14px;">
                <div style="font-size:14px;color:var(--cinnabar);">🔒 需研习进度 ${act.requireProgress||100}%（当前 ${prog}%）</div></div>` : ''}
            <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);border-radius:10px;padding:20px;">
                <div style="font-size:16px;font-weight:bold;color:var(--amber);margin-bottom:12px;font-family:var(--font-kai);">${c.productName||act.name}</div>
                ${c.options ? `<div style="margin-bottom:15px;"><div style="font-size:12px;color:#888;margin-bottom:8px;">选择款式：</div>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                        ${c.options.map(o=>`<button class="btn btn-sm btn-outline prod-opt" style="font-size:12px;" onclick="document.querySelectorAll('.prod-opt').forEach(b=>b.classList.remove('active'));this.classList.add('active')">${o}</button>`).join('')}
                    </div></div>` : ''}
                <div style="font-size:13px;color:#bbb;line-height:1.75;margin-bottom:12px;">${act.desc}</div>
                <div style="display:flex;justify-content:space-between;padding:10px 0;border-top:1px dashed rgba(255,255,255,.1);font-size:13px;">
                    <span style="color:var(--gold);">💫 ${c.price||'面议'}</span>
                    <span style="color:#888;">⏱ ${act.duration}</span>
                </div>
                ${c.note?`<div style="font-size:12px;color:#888;margin-top:8px;font-style:italic;">📌 ${c.note}</div>`:''}
                <button class="btn btn-jade btn-full" style="margin-top:16px;" ${!ok?'disabled':''} onclick="WorkshopActivityEngine._orderProduct(${inh.id},'${act.id}')">
                    ${ok ? '📜 生成流转契约，发起现世流转' : '🔒 研习进度不足'}
                </button>
            </div>`;
    },

    _orderProduct(inhId, actId) {
        const inh = (typeof inheritorData !== 'undefined') ? inheritorData.find(i => i.id === inhId) : null;
        const act = inh?.workshopActivities?.find(a => a.id === actId);
        if (!inh || !act) return;
        const opt = document.querySelector('.prod-opt.active')?.innerText || act.content?.options?.[0] || '默认款';
        O2OOrderManager.createOrder(inhId, `${act.content?.productName||act.name}（${opt}）`, inh.avatar, '实体', { customNote:`款式：${opt}` });
        document.getElementById('wae-panel')?.remove();
        document.getElementById('global-modal-overlay')?.classList.remove('show');
    },

    _finish(inhId, act, score) {
        const inh    = (typeof inheritorData !== 'undefined') ? inheritorData.find(i => i.id === inhId) : null;
        const prog   = gameState[`inh_prog_${inhId}`] || {};
        prog[act.id] = true;
        gameState[`inh_prog_${inhId}`] = prog;

        const term  = SolarTermEngine.getCurrentTerm();
        const mult  = (term.bonus === inh?.category || term.bonus === 'all') ? 1.5 : 1;
        const final = Math.floor((act.reward?.stones||0)*mult);

        if (final > 0) earnStones(final);
        (act.reward?.items||[]).forEach(i => { if(typeof addItem==='function') addItem(i.name, i.count||1); });

        if (inh) inh.progress = Math.min(100, (inh.progress||0) + 10);
        BondSystem.add(inh?.name||'传承人', 15, `完成：${act.name}`);

        const itemStr = (act.reward?.items||[]).map(i=>`${i.name}×${i.count}`).join(', ') || null;
        XiuliluManager.addEntry('study', `研习完成：${act.name}`,
            `完成了【${inh?.name||'匠师'}】的「${act.name}」，得分${score}分。${mult>1?`（节气加成×${mult}）`:''}`,
            { inheritorId:inhId, inheritorName:inh?.name, score, itemGained:itemStr }
        );
        GameEvent.emit('workshop:activity_complete', { inheritorId:inhId, activityId:act.id, score });

        const body = document.getElementById('wae-body');
        if (body) body.innerHTML = `
            <div style="text-align:center;padding:50px 20px;">
                <div style="font-size:68px;margin-bottom:20px;animation:float 2s infinite;">${score>=90?'🌟':score>=70?'✅':'📖'}</div>
                <div style="font-size:22px;color:var(--gold);font-weight:bold;font-family:var(--font-kai);margin-bottom:8px;">${act.name} · 研习完成</div>
                <div style="font-size:15px;color:#bbb;margin-bottom:22px;">得分：<span style="color:var(--amber);font-size:20px;font-weight:bold;">${score}</span></div>
                <div style="background:rgba(212,175,55,.07);border:1px solid rgba(212,175,55,.25);border-radius:10px;padding:16px;margin-bottom:20px;display:inline-block;min-width:200px;text-align:center;">
                    ${final>0?`<div style="color:var(--gold);font-size:14px;margin-bottom:4px;">🪙 +${final} 灵石${mult>1?` (×${mult}节气加成)`:''}</div>`:''}
                    ${(act.reward?.items||[]).map(i=>`<div style="color:var(--jade);font-size:13px;margin-bottom:3px;">📦 +${i.count} ${i.name}</div>`).join('')}
                    <div style="color:var(--amber);font-size:12px;margin-top:4px;">💛 羁绊 +15</div>
                    <div style="color:#666;font-size:11px;margin-top:3px;">📖 已记入传习录</div>
                </div>
                <button class="btn btn-jade btn-full" onclick="WorkshopActivityEngine.open(${inhId})">继续研习其他活动</button>
            </div>`;

        if (typeof SaveManager !== 'undefined') SaveManager.save();
    },
};


// ============================================================
// 六、B端：传承人批注面板
// ============================================================
window.openAnnotationPanel = function(containerId) {
    // Open a modal that lets the B-side user annotate recent xiulilu entries
    const entries = (gameState.xiulilu || []).filter(e => !e.annotation).slice(0, 10);
    let panel = document.getElementById('annotation-panel');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'annotation-panel';
        panel.className = 'modal';
        panel.style.cssText = 'width:min(600px,96vw);max-height:80vh;display:flex;flex-direction:column;';
        panel.innerHTML = `
            <div class="modal-header" style="background:linear-gradient(135deg,#1a1610,#120e09);flex-shrink:0;">
                <h3 style="color:var(--gold);">📝 批注学徒传习录</h3>
                <button class="modal-close" onclick="closeModal('annotation-panel')">×</button>
            </div>
            <div id="annotation-list" style="flex:1;overflow-y:auto;padding:20px;"></div>`;
        document.body.appendChild(panel);
    }
    const list = document.getElementById('annotation-list');
    if (list) {
        if (!entries.length) {
            list.innerHTML = `<div style="text-align:center;padding:30px;color:#888;">学徒暂无待批注的传习条目。</div>`;
        } else {
            list.innerHTML = entries.map(e => `
                <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:15px;margin-bottom:12px;">
                    <div style="font-size:13px;font-weight:bold;color:var(--amber);margin-bottom:5px;">${e.title}</div>
                    <div style="font-size:12px;color:#aaa;margin-bottom:10px;line-height:1.7;">${e.desc}</div>
                    <textarea id="ann-text-${e.id}" placeholder="写下你的批注与指导..." style="width:100%;height:70px;padding:10px;background:rgba(0,0,0,.4);border:1px dashed rgba(212,175,55,.3);border-radius:6px;color:#e8dcc8;font-family:var(--font-kai);font-size:13px;resize:none;outline:none;margin-bottom:8px;"></textarea>
                    <button class="btn btn-sm btn-jade" onclick="WorkshopActivityEngine._submitAnnotation(${JSON.stringify(String(e.id))})">📝 提交批注</button>
                </div>`).join('');
        }
    }
    if (typeof openModal === 'function') openModal('annotation-panel');
};

WorkshopActivityEngine._submitAnnotation = function(entryId) {
    const ta = document.getElementById(`ann-text-${entryId}`);
    if (!ta || !ta.value.trim()) { showNotification('批注内容不可为空','⚠️'); return; }
    const inhName = document.getElementById('display-inheritor-name')?.innerText || '传承人';
    XiuliluManager.addAnnotation(parseFloat(entryId), inhName, ta.value.trim(), '🖊️');
    ta.value = '';
    ta.parentElement.querySelector('button').innerText = '✅ 已批注';
    ta.parentElement.querySelector('button').disabled  = true;
    closeModal('annotation-panel');
};


// ============================================================
// 七、全局导出与初始化
// ============================================================
window.SolarTermEngine         = SolarTermEngine;
window.XiuliluManager          = XiuliluManager;
window.O2OOrderManager         = O2OOrderManager;
window.BondSystem               = BondSystem;
window.WorkshopActivityEngine   = WorkshopActivityEngine;

// 覆写工坊交互入口（替代workshop.js中的空实现）
window.openWorkshopInteraction = function(inhId, type = null) {
    WorkshopActivityEngine.open(inhId, type);
};

// 传习录快捷入口
window.openXiulilu = function() { XiuliluManager.openModal(); };

// 订单快捷入口
window.openOrders = function() {
    let modal = document.getElementById('orders-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'orders-modal';
        modal.className = 'modal';
        modal.style.cssText = 'width:min(600px,96vw);max-height:80vh;display:flex;flex-direction:column;';
        modal.innerHTML = `
            <div class="modal-header" style="background:linear-gradient(135deg,#1a1610,#120e09);flex-shrink:0;">
                <h3 style="color:var(--amber);">📦 手信订单 · 现世流转记录</h3>
                <button class="modal-close" onclick="closeModal('orders-modal')">×</button>
            </div>
            <div id="orders-list" style="flex:1;overflow-y:auto;padding:20px;"></div>`;
        document.body.appendChild(modal);
    }
    O2OOrderManager.renderOrders('orders-list');
    if (typeof openModal === 'function') openModal('orders-modal');
};

// 事件监听
GameEvent.on('workshop:activity_complete', data => {
    // 推进传承任务进度
    if (typeof dispatchQuestEvent === 'function') dispatchQuestEvent('workshop_activity', 1);
});

GameEvent.on('o2o:order_created', () => {
    if (typeof dispatchQuestEvent === 'function') dispatchQuestEvent('o2o_order', 1);
});

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        SolarTermEngine.checkFirstVisitToday();
        SolarTermEngine.renderCalendarWidget('solar-term-widget');
    }, 2500);
});
