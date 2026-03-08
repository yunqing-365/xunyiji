/**
 * scene.js  (史诗升级版)
 * 寻遗集 · 场景模块
 *
 * 升级内容：
 *   1. 时辰感知行动卡 — 条件过滤 + 时段可见性
 *   2. 场景入口叙事   — 进入行动前先呈现情景短文
 *   3. 节气横幅       — 场景枢纽顶部展示当前节气
 *   4. 传承纽带接入   — enterScene 时触发传习录 + 羁绊系统
 *   5. 传承人驻地提示 — 显示该场景驻留的传承人头像
 *
 * 依赖：core.js / bond-engine.js / exploration-engine.js
 */

// ============================================================
// 一、九州大地图 · 拖拽
// ============================================================
function initMapDrag() {
    const mc = document.getElementById('map-scroll');
    if (!mc) return;
    let down = false, sx, sy, sl, st;
    setTimeout(() => { mc.scrollLeft = 1100; mc.scrollTop = 700; }, 50);

    mc.addEventListener('mousedown', e => {
        if (e.target.closest('.anchor')) return;
        down = true; sx = e.pageX - mc.offsetLeft; sy = e.pageY - mc.offsetTop;
        sl = mc.scrollLeft; st = mc.scrollTop; mc.style.cursor = 'grabbing';
    });
    mc.addEventListener('mouseleave', () => { down = false; mc.style.cursor = 'grab'; });
    mc.addEventListener('mouseup',    () => { down = false; mc.style.cursor = 'grab'; });
    mc.addEventListener('mousemove',  e => {
        if (!down) return; e.preventDefault();
        const x = e.pageX - mc.offsetLeft, y = e.pageY - mc.offsetTop;
        mc.scrollLeft = sl - (x - sx) * 1.5;
        mc.scrollTop  = st - (y - sy) * 1.5;
    });
}


// ============================================================
// 二、时辰工具函数
// ============================================================
function _getTimeSlotId() {
    const h = new Date().getHours();
    if (h >= 5  && h < 9)  return 'dawn';
    if (h >= 9  && h < 17) return 'noon';
    if (h >= 17 && h < 21) return 'dusk';
    return 'night';
}

const TIME_SLOT_LABELS = {
    dawn:  { label:'晨曦', icon:'🌅', color:'#e0c060' },
    noon:  { label:'午时', icon:'☀️', color:'#f5b347' },
    dusk:  { label:'黄昏', icon:'🌇', color:'#e07050' },
    night: { label:'子夜', icon:'🌙', color:'#7090c0' },
};

const WORLD_STATE_TIME = {
    0: 'dawn', 1: 'noon', 2: 'dusk', 3: 'night',
};


// ============================================================
// 三、场景枢纽
// ============================================================
function enterScene(sceneKey) {
    const config = (typeof sceneKey === 'string') ? sceneConfig[sceneKey] : sceneKey;
    if (!config) return;

    gameState.currentScene = config.key;

    _hideAllViews();
    document.getElementById('view-scene').classList.add('active-view');
    document.getElementById('player-dock').classList.add('hidden');

    document.getElementById('scene-subtitle').innerText = `📍 ${config.subtitle}`;
    document.getElementById('scene-title').innerText    = config.title;
    document.getElementById('scene-desc').innerText     = config.desc;

    const breadcrumb = document.getElementById('scene-breadcrumb-name');
    if (breadcrumb) breadcrumb.innerText = config.title;

    const sceneBg = document.getElementById('scene-bg');
    if (sceneBg) {
        sceneBg.style.backgroundColor = config.bgColor || '#1a1a1a';
        sceneBg.style.backgroundImage = config.bgImage ? `url('${config.bgImage}')` : 'none';
    }

    // 传习录探索记录
    if (typeof XiuliluManager !== 'undefined') {
        XiuliluManager.addEntry('explore', `踏入：${config.title}`,
            `来到了${config.subtitle}——${config.desc.substring(0,40)}...`,
            {}
        );
    }

    // 场景任务事件
    if (typeof dispatchQuestEvent === 'function') dispatchQuestEvent('enter_scene');

    // 渲染行动卡 + 节气横幅 + 驻地传承人
    _renderSolarBanner(config);
    _renderResidentInheritors(config.key);
    _renderSceneActions(config.actions || [], config);

    if (typeof playSound === 'function') playSound('scene_enter');
}

function leaveScene() {
    gameState.currentScene = null;
    _hideAllViews();
    document.getElementById('view-map').classList.add('active-view');
    document.getElementById('player-dock').classList.remove('hidden');
    _setDockActive(0);
}

function goToWorkshopFromScene() {
    document.getElementById('player-dock').classList.remove('hidden');
    if (typeof switchMainView === 'function') switchMainView('view-workshop', document.getElementById('dock-workshop'));
    if (typeof renderWorkshop === 'function') renderWorkshop();
}

/** 渲染节气横幅 */
function _renderSolarBanner(config) {
    let banner = document.getElementById('scene-solar-banner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'scene-solar-banner';
        // Insert before actions
        const actEl = document.getElementById('scene-actions')?.parentNode;
        if (actEl) actEl.insertBefore(banner, document.getElementById('scene-actions'));
    }

    if (typeof SolarTermEngine === 'undefined') { banner.innerHTML = ''; return; }

    const term = SolarTermEngine.getCurrentTerm();
    const slot = TIME_SLOT_LABELS[_getTimeSlotId()];
    const mult = SolarTermEngine.getBonusMultiplier(config?.mapTheme || '');
    const bonusStr = mult > 1 ? `<span style="color:var(--gold);font-weight:bold;">×${mult} 奖励加成</span>` : '';

    banner.style.cssText = 'margin-bottom:16px;';
    banner.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(0,0,0,.3);border:1px solid rgba(212,175,55,.15);border-radius:10px;padding:10px 16px;font-size:12px;">
            <div style="display:flex;align-items:center;gap:12px;">
                <span style="font-size:20px;">${term.icon}</span>
                <div>
                    <div style="color:var(--gold);font-weight:bold;">${term.name} · ${term.desc.slice(0,18)}…</div>
                    ${mult > 1 ? `<div style="color:#aaa;margin-top:2px;">本节气工坊活动 ${bonusStr}</div>` : ''}
                </div>
            </div>
            <div style="text-align:right;color:${slot.color};">
                <div style="font-size:16px;">${slot.icon}</div>
                <div>${slot.label}</div>
            </div>
        </div>`;
}

/** 渲染驻地传承人头像行 */
function _renderResidentInheritors(sceneKey) {
    let bar = document.getElementById('scene-resident-bar');
    if (!bar) {
        bar = document.createElement('div');
        bar.id = 'scene-resident-bar';
        const solar = document.getElementById('scene-solar-banner');
        if (solar?.parentNode) solar.parentNode.insertBefore(bar, solar.nextSibling);
    }

    if (typeof inheritorData === 'undefined') { bar.innerHTML = ''; return; }
    const residents = inheritorData.filter(i => i.region === sceneKey);
    if (!residents.length) { bar.innerHTML = ''; return; }

    bar.style.cssText = 'display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;';
    bar.innerHTML = residents.map(r => {
        const bond = (typeof BondSystem !== 'undefined') ? BondSystem.getLevel(r.name) : { name:'初识', color:'#888' };
        return `<div onclick="openWorkshopInteraction(${r.id})" style="display:flex;align-items:center;gap:8px;background:rgba(0,0,0,.3);border:1px solid rgba(212,175,55,.2);border-radius:20px;padding:5px 12px;cursor:pointer;transition:.2s;" onmouseover="this.style.borderColor='var(--gold)'" onmouseout="this.style.borderColor='rgba(212,175,55,.2)'">
            <span style="font-size:20px;">${r.avatar}</span>
            <div>
                <div style="font-size:12px;font-weight:bold;color:var(--amber);">${r.name}</div>
                <div style="font-size:10px;color:${bond.color};">${bond.name}</div>
            </div>
        </div>`;
    }).join('');
}


// ============================================================
// 四、行动卡渲染（时辰感知 + 条件判定 + 叙事钩子）
// ============================================================

/**
 * 行动卡叙事数据库 — 按场景/行动类型预设短叙事
 * 可在 scenes.js 的 action 对象上直接增加 narrative 字段覆盖
 */
const ACTION_NARRATIVES = {
    'startExploration': [
        '踏出枢纽门槛，青石板路向远处延伸，空气里混着炊烟与花香……',
        '巷子里传来叫卖声，一只花猫懒洋洋地横在路中间，望着你。',
        '你整了整行囊，推开了木栅栏——九州的某个角落正等待被发现。',
    ],
    'openShop': [
        '掌柜抬起头，笑眯眯地迎来客："里边请，今日新到了几样好物。"',
        '柜台上摆着琳琅满目的手信，每一件都带着匠人几十年的痕迹。',
    ],
    'openWorkshopInteraction': [
        '工坊里弥漫着木屑与松香的气息，传承人正低头忙碌着。',
        '学艺之道，始于心诚。你叩了叩门，里面传来一声"进来吧"。',
    ],
    'goToWorkshop': [
        '天工阁的门楣上挂着一盏灯笼，灯光摇曳，岁月悠长。',
        '十二位匠师的名字刻在石碑上——你又一次来到了传承汇聚之地。',
    ],
    'handleAction': [
        '时间在这里流淌得格外缓慢，每一个动作都显得意义非凡。',
    ],
    '_default': [
        '九州的故事，等待你去书写。',
        '每一步都是传承，每一眼都是遇见。',
        '慢下来，用心去感受这片土地。',
    ],
};

function _getNarrative(funcStr) {
    for (const key in ACTION_NARRATIVES) {
        if (funcStr.includes(key)) {
            const pool = ACTION_NARRATIVES[key];
            return pool[Math.floor(Math.random() * pool.length)];
        }
    }
    const d = ACTION_NARRATIVES['_default'];
    return d[Math.floor(Math.random() * d.length)];
}

/**
 * 显示行动入口叙事浮层，确认后执行 func
 */
function _showActionNarrative(narrative, func, actionName) {
    const existing = document.getElementById('action-narrative-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'action-narrative-overlay';
    overlay.style.cssText = `
        position:fixed; inset:0; z-index:2500;
        background:rgba(10,8,6,.88); backdrop-filter:blur(8px);
        display:flex; align-items:center; justify-content:center;
        animation:fadeIn .35s ease;`;

    overlay.innerHTML = `
        <div style="max-width:460px; width:90vw; background:linear-gradient(150deg,#1a1510,#110e09);
                    border:1px solid rgba(212,175,55,.3); border-radius:16px;
                    padding:36px 32px; text-align:center;
                    box-shadow:0 0 40px rgba(212,175,55,.12);">
            <div style="font-size:36px; margin-bottom:18px; animation:float 3s infinite;">✨</div>
            <p style="font-size:16px; color:#e8dcc8; line-height:2; font-family:var(--font-kai);
                      letter-spacing:1px; margin:0 0 28px;">
                ${narrative}
            </p>
            <div style="display:flex; gap:14px; justify-content:center;">
                <button class="btn btn-outline" style="border-color:rgba(255,255,255,.2);color:#aaa;font-size:13px;"
                        onclick="document.getElementById('action-narrative-overlay').remove()">
                    稍后再说
                </button>
                <button class="btn btn-jade" style="font-size:14px;letter-spacing:1px;"
                        onclick="document.getElementById('action-narrative-overlay').remove(); try{ ${func} }catch(e){console.warn(e)}">
                    前往 · ${actionName}
                </button>
            </div>
        </div>`;

    document.body.appendChild(overlay);
    // Auto-dismiss after 8s if no action
    setTimeout(() => overlay?.remove(), 8000);
}

/**
 * 渲染场景行动卡（时辰感知版）
 */
function _renderSceneActions(actions, config) {
    const grid = document.getElementById('scene-actions');
    if (!grid) return;

    const currentSlot = _getTimeSlotId();
    // 也响应 gameState.worldState（玩家可手动切换时辰）
    const gameSlot    = WORLD_STATE_TIME[gameState.worldState ?? 1] || currentSlot;

    const visible = actions.filter(action => {
        // 时段限制
        if (action.timeSlot && Array.isArray(action.timeSlot)) {
            if (!action.timeSlot.includes(currentSlot) && !action.timeSlot.includes(gameSlot)) return false;
        }
        // 条件引擎检查
        if (action.conditions && typeof ConditionEngine !== 'undefined') {
            if (!ConditionEngine.checkAll(action.conditions)) return false;
        }
        return true;
    });

    if (!visible.length) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:#888;font-family:var(--font-kai);">
            <div style="font-size:36px;margin-bottom:12px;">🌙</div>
            <p>此刻，这里的游历者们都已歇息。<br>换个时辰再来看看吧。</p>
        </div>`;
        return;
    }

    grid.innerHTML = visible.map(action => {
        // 是否限时可见
        const timeTag = action.timeSlot
            ? `<div style="position:absolute;top:8px;right:8px;font-size:10px;color:#888;border:1px solid rgba(255,255,255,.1);padding:1px 6px;border-radius:8px;">${action.timeSlot.map(s=>TIME_SLOT_LABELS[s]?.icon||s).join('')}</div>`
            : '';
        // 稀有度光晕
        const glow = action.rare ? 'box-shadow:0 0 20px rgba(212,175,55,.2);border-color:rgba(212,175,55,.4);' : '';

        return `
        <div class="action-card" style="position:relative;cursor:pointer;${glow}"
             onclick="_onActionCardClick('${action.func?.replace(/'/g,"\\'") || ''}','${(action.name||'').replace(/'/g,"\\'")}','${(action.narrative||'').replace(/'/g,"\\'")}')">
            ${timeTag}
            <span class="action-icon">${action.icon}</span>
            <h3>${action.name}</h3>
            <p>${action.desc}</p>
            ${action.reward ? `<div style="font-size:11px;color:var(--gold);margin-top:6px;">🪙 +${action.reward} 灵石</div>` : ''}
        </div>`;
    }).join('');
}

/** 行动卡点击 — 决定是否展示叙事层 */
function _onActionCardClick(func, name, customNarrative) {
    // 某些行动直接执行（无叙事，避免打断快节奏操作）
    const skipNarrative = ['openShop','switchMainView','handleAction\\("minigame"'];
    const skip = skipNarrative.some(s => func.includes(s));

    if (skip) {
        try { eval(func); } catch(e) { console.warn('[scene]', e); }
        return;
    }

    const narrative = customNarrative || _getNarrative(func);
    _showActionNarrative(narrative, func, name);
}


// ============================================================
// 五、漫游场景 & 角色移动（保留原有逻辑 + 小幅增强）
// ============================================================
function startPlayableScene(sceneKey) {
    const config = sceneConfig[sceneKey];
    if (!config) { console.warn(`[scene] 未找到场景 "${sceneKey}"`); return; }
    _hideAllViews();
    document.getElementById('view-playable').classList.add('active-view');
    const playBg = document.getElementById('play-bg');
    if (playBg) {
        playBg.style.backgroundColor = config.bgColor || '#6b8e23';
        playBg.style.backgroundImage = config.bgImage ? `url('${config.bgImage}')` : 'none';
    }
    _renderPlayableNodes(config.playableNodes || []);
    _resetPlayerPosition();
    if (typeof playSound === 'function') playSound('playable_enter');
}

function exitPlayableScene() {
    _hideAllViews();
    document.getElementById('view-scene').classList.add('active-view');
}

function _renderPlayableNodes(nodes) {
    const c = document.getElementById('interact-container');
    if (!c) return;
    c.innerHTML = nodes.map(n => `
        <div class="interact-node" style="top:${n.pos.top};left:${n.pos.left};"
             onclick="interactNode('${n.type}','${n.label}')">
            <div class="inode-icon">${n.icon}</div>
            <div class="inode-label">${n.label}</div>
        </div>`).join('');
}

function _resetPlayerPosition() {
    const p = document.getElementById('player-char');
    if (!p) return;
    p.style.transition = 'none';
    p.style.left = '50%'; p.style.top = '50%';
    p.style.transform = 'translate(-50%,-50%)';
}

function _bindPlayerMovement() {
    const area = document.getElementById('playable-area');
    const char = document.getElementById('player-char');
    if (!area || !char) return;
    area.addEventListener('click', e => {
        if (e.target.closest('.interact-node') || e.target.closest('.play-ui-top')) return;
        const r = area.getBoundingClientRect();
        const tx = e.clientX - r.left, ty = e.clientY - r.top;
        const cx = char.offsetLeft,    cy = char.offsetTop;
        const dist = Math.hypot(tx - cx, ty - cy);
        const dur  = Math.max(dist / 0.2, 100);
        char.style.transition = `top ${dur}ms linear, left ${dur}ms linear`;
        char.style.left       = `${tx}px`;
        char.style.top        = `${ty}px`;
        char.style.transform  = `translate(-50%,-50%) scaleX(${tx < cx ? -1 : 1})`;
    });
}

function interactNode(type, label) {
    if (typeof playSound === 'function') playSound(type);
    switch (type) {
        case 'collect': _handleCollect(label); break;
        case 'npc':     _handleNPC(label);     break;
        case 'game':    _handleGame(label);    break;
        case 'shop':    if (typeof openShop === 'function') openShop(); break;
        case 'rest':    showNotification('你在此处休憩，身心得到了放松','😌'); break;
        default:        showNotification(`与【${label}】产生了互动`,'✨');
    }
}

function _handleCollect(label) {
    const itemName = label.replace(/采集[:：]\s*/g,'').replace('采集','').trim();
    if (typeof addItem         === 'function') addItem(itemName, 3);
    if (typeof advanceQuest    === 'function') advanceQuest('daily1');
    if (typeof XiuliluManager  !== 'undefined') {
        XiuliluManager.addEntry('explore', `采集：${itemName}`,
            `在${gameState.currentScene ? sceneConfig[gameState.currentScene]?.title || '野外' : '野外'}采集了${itemName}×3，放入灵犀袋。`,
            { itemGained:`${itemName}×3` });
    }
    showNotification(`获得【${itemName} ×3】！已放入灵犀袋。`,'📦');
    if (typeof unlockAchievement === 'function') {
        unlockAchievement('first_interact','初露锋芒','完成第一次交互',100,'🌟');
    }
}

function _handleNPC(label) {
    const yes = confirm(`一位【${label}】向你招手：\n"游侠儿，我看你骨骼惊奇，要不要随我学习技艺？"\n\n是否前往天工阁拜师？`);
    if (yes) { exitPlayableScene(); goToWorkshopFromScene(); }
}

function _handleGame(label) {
    if (label.includes('投壶')) { if (typeof openMinigame    === 'function') openMinigame(); }
    else if (label.includes('灯谜')) { if (typeof openRiddleGame === 'function') openRiddleGame(); }
    else showNotification(`进入【${label}】小游戏！`,'🎮');
}


// ============================================================
// 六、私有工具函数
// ============================================================
function _hideAllViews() {
    document.querySelectorAll('.view-container').forEach(v => {
        v.classList.remove('active-view');
        v.style.display = '';
    });
}

function _setDockActive(index) {
    document.querySelectorAll('#player-dock .dock-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}


// ============================================================
// 七、沉浸式探索跳转入口（修复版）
// ============================================================
window.startExploration = function(keyArg) {
    let key = keyArg || gameState.currentScene;

    if (!key || typeof sceneConfig === 'undefined') {
        showNotification('请先点击地图上的区域图标！','⏳'); return;
    }
    if (sceneConfig[key] === undefined) {
        key = Object.keys(sceneConfig).find(k => sceneConfig[k].title === gameState.currentScene || sceneConfig[k].key === gameState.currentScene);
    }
    if (!key || !sceneConfig[key]) {
        showNotification('读取场景数据失败！','⚠️'); return;
    }

    // 进入叙事提示
    const cfg = sceneConfig[key];
    const narrative = `你整了整行囊，离开${cfg.title}枢纽，踏入了真正的街巷之中……\n${cfg.desc.substring(0, 40)}`;
    _showActionNarrative(narrative, `window.renderExplorationMap && window.renderExplorationMap('${key}')`, `探索${cfg.title}`);
};

window.exitExploration = function() {
    document.getElementById('exp-dialogue')?.remove();
    document.getElementById('exp-workshop-panel')?.remove();
    document.getElementById('exp-ruin-panel')?.remove();
    document.getElementById('action-narrative-overlay')?.remove();

    document.querySelectorAll('.view-container').forEach(v => {
        v.classList.remove('active-view'); v.style.display = 'none';
    });
    const sv = document.getElementById('view-scene');
    if (sv) { sv.classList.add('active-view'); sv.style.display = 'block'; }
    const dk = document.getElementById('player-dock');
    if (dk) dk.classList.remove('hidden');
    if (typeof playSound === 'function') playSound('click');
};

// 全局暴露供 scenes.js 直接调用
window.goToWorkshop = function() {
    document.getElementById('player-dock').classList.remove('hidden');
    if (typeof switchMainView === 'function')
        switchMainView('view-workshop', document.getElementById('dock-workshop'));
    if (typeof renderWorkshop === 'function') renderWorkshop();
};


// ============================================================
// 八、DOMContentLoaded 初始化
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    initMapDrag();
    _bindPlayerMovement();
});