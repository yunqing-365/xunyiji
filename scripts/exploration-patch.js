/**
 * exploration-patch.js
 * 寻遗集 · 探索引擎升级补丁
 *
 * 必须在 exploration-engine.js 之后加载。
 *
 * 升级内容：
 *   1. _initEcology          — 完整实装生态系统（动物 + 随机掉落）
 *   2. _expCollect           — 采集前展示叙事短文（关联传承人语音）
 *   3. updateWorldEcology    — 响应 worldState + 应用节气滤镜
 *   4. _buildMapLayers       — 时辰色调动态覆盖
 *   5. triggerInteraction    — 增强采集叙事 + 生态感知
 */

'use strict';

// ============================================================
// 一、生态系统 — 完整实装
// ============================================================

const ECOLOGY_PRESETS = {
    // 各场景生态配置
    wanyicheng: {
        critters: [
            { icon:'🐦', label:'戏台喜鹊',   behavior:'wander', drop:'戏服丝料',    dropIcon:'🎀', dropChance:.4 },
            { icon:'🦋', label:'彩蝶',        behavior:'flee',   drop:'昆曲曲谱碎片',dropIcon:'📜', dropChance:.2 },
            { icon:'🐈', label:'梨园花猫',    behavior:'wander', drop:'猫毛（稀奇）',dropIcon:'🐾', dropChance:.3 },
        ],
        ambientDrops: [
            { icon:'🎀', itemName:'戏服丝料',   weight:40 },
            { icon:'📜', itemName:'昆曲曲谱',   weight:25 },
            { icon:'🎭', itemName:'脸谱碎片',   weight:20 },
            { icon:'🪭', itemName:'旧折扇',     weight:15 },
        ],
        particleEffect: 'petals',
        spawnInterval: 8000,
        maxCritters: 5,
    },
    jinxiufang: {
        critters: [
            { icon:'🐛', label:'蚕宝宝',     behavior:'wander', drop:'生蚕丝',    dropIcon:'🧵', dropChance:.5 },
            { icon:'🦋', label:'蝴蝶',       behavior:'flee',   drop:'苏绣丝线',  dropIcon:'🪡', dropChance:.35 },
            { icon:'🐝', label:'采蜜蜂',     behavior:'wander', drop:'蜂蜡',     dropIcon:'🟡', dropChance:.2 },
        ],
        ambientDrops: [
            { icon:'🪡', itemName:'苏绣丝线',   weight:45 },
            { icon:'🧵', itemName:'生蚕丝',     weight:30 },
            { icon:'📐', itemName:'绣样图纸',   weight:15 },
            { icon:'🌸', itemName:'苏绣香囊',   weight:10 },
        ],
        particleEffect: 'petals',
        spawnInterval: 7000,
        maxCritters: 6,
    },
    baizuozhen: {
        critters: [
            { icon:'🐦', label:'工坊麻雀',   behavior:'wander', drop:'陶土碎片',   dropIcon:'🏺', dropChance:.35 },
            { icon:'🦎', label:'灶台壁虎',   behavior:'flee',   drop:'高岭土',    dropIcon:'⬜', dropChance:.25 },
        ],
        ambientDrops: [
            { icon:'🏺', itemName:'高岭陶土',   weight:50 },
            { icon:'⬜', itemName:'白瓷泥',     weight:30 },
            { icon:'🪵', itemName:'香樟木屑',   weight:20 },
        ],
        particleEffect: 'fireflies',
        spawnInterval: 9000,
        maxCritters: 4,
    },
    qinglanjie: {
        critters: [
            { icon:'🦌', label:'林间小鹿',   behavior:'flee',   drop:'清泉水',    dropIcon:'💧', dropChance:.3 },
            { icon:'🐦', label:'林鸟',       behavior:'wander', drop:'茶叶',     dropIcon:'🍃', dropChance:.45 },
        ],
        ambientDrops: [
            { icon:'🍃', itemName:'明前茶叶',   weight:45 },
            { icon:'🍄', itemName:'山野松茸',   weight:25 },
            { icon:'🌿', itemName:'紫苏叶',     weight:20 },
            { icon:'💧', itemName:'山泉水',     weight:10 },
        ],
        particleEffect: 'bamboo-leaves',
        spawnInterval: 6000,
        maxCritters: 7,
    },
    senzhidiyu: {
        critters: [
            { icon:'🦊', label:'森之小狐',   behavior:'flee',   drop:'灵狐毛',    dropIcon:'🦊', dropChance:.15 },
            { icon:'🐰', label:'林兔',       behavior:'flee',   drop:'兔毛',     dropIcon:'🐾', dropChance:.3 },
            { icon:'🐦', label:'彩雀',       behavior:'wander', drop:'彩羽',     dropIcon:'🪶', dropChance:.4 },
        ],
        ambientDrops: [
            { icon:'🍄', itemName:'野生松茸',   weight:35 },
            { icon:'🪶', itemName:'彩羽',       weight:30 },
            { icon:'🌰', itemName:'山栗子',     weight:25 },
            { icon:'🫐', itemName:'野果',       weight:10 },
        ],
        particleEffect: 'bamboo-leaves',
        spawnInterval: 5000,
        maxCritters: 8,
    },
};

// 默认生态（未配置场景）
const DEFAULT_ECOLOGY = {
    critters: [
        { icon:'🐦', label:'野鸟', behavior:'wander', drop:'羽毛',  dropIcon:'🪶', dropChance:.3 },
        { icon:'🦋', label:'蝶',   behavior:'flee',   drop:'花粉',  dropIcon:'🌸', dropChance:.25 },
    ],
    ambientDrops: [
        { icon:'🌿', itemName:'野草',  weight:50 },
        { icon:'🪨', itemName:'灵石碎片', weight:30 },
        { icon:'🌸', itemName:'野花',  weight:20 },
    ],
    particleEffect: 'petals',
    spawnInterval: 10000,
    maxCritters: 4,
};

// 覆写 _initEcology
(function patchInitEcology() {
    const origInit = window._initEcology || function(){};

    window._initEcology = function(config) {
        const key = _exp.sceneKey;
        const eco = ECOLOGY_PRESETS[key] || DEFAULT_ECOLOGY;
        config.exploration = config.exploration || {};
        config.exploration.ecology = eco;

        // 补充 dropPool 供原有随机掉落逻辑使用
        eco.dropPool = eco.ambientDrops.map(d => ({ itemName: d.itemName, icon: d.icon }));

        // 启动生态繁殖定时器
        if (window._ecoInterval) clearInterval(window._ecoInterval);
        window._ecoInterval = setInterval(() => {
            if (_exp.isPaused) return;
            if (_exp.critters.length < (eco.maxCritters || 4)) {
                const def = eco.critters[Math.floor(Math.random() * eco.critters.length)];
                _spawnEnhancedCritter(def, eco);
            }
            // 随机生成地面掉落
            if (Math.random() < 0.3) {
                _spawnAmbientDrop(eco);
            }
        }, eco.spawnInterval || 8000);

        // 立即生成初始生态
        for (let i = 0; i < Math.min(3, eco.maxCritters || 4); i++) {
            setTimeout(() => {
                if (_exp.critters.length < (eco.maxCritters || 4)) {
                    const def = eco.critters[Math.floor(Math.random() * eco.critters.length)];
                    _spawnEnhancedCritter(def, eco);
                }
            }, i * 800);
        }
    };
})();

/** 增强版动物生成（带掉落逻辑 + 捕捉奖励） */
function _spawnEnhancedCritter(def, eco) {
    const container = document.getElementById('exp-nodes');
    if (!container) return;
    const rx = 100 + Math.random() * (WORLD_W - 200);
    const ry = 100 + Math.random() * (WORLD_H - 200);
    const el = document.createElement('div');
    el.className = 'eco-critter';
    el.title = def.label;
    el.style.cssText = `position:absolute;left:${rx}px;top:${ry}px;font-size:22px;z-index:22;pointer-events:auto;cursor:pointer;transition:top 3.5s ease-in-out, left 3.5s ease-in-out;user-select:none;filter:drop-shadow(0 4px 6px rgba(0,0,0,.4));`;
    el.innerHTML = def.icon;

    el.addEventListener('click', e => {
        e.stopPropagation();
        // 触碰小动物
        el.style.transition = 'opacity .4s, transform .4s';
        el.style.transform  = 'scale(0) translateY(-30px)';
        el.style.opacity    = '0';
        setTimeout(() => { el.remove(); _exp.critters = _exp.critters.filter(c => c.el !== el); }, 500);

        // 掉落判定
        if (Math.random() < (def.dropChance || 0.3)) {
            if (typeof addItem === 'function') addItem(def.drop, 1);
            showNotification(`${def.icon} ${def.label}受惊飞走，留下了【${def.drop}】！`, def.dropIcon, 3000);
            earnStones && earnStones(5);
        } else {
            showNotification(`${def.label}机敏地跑掉了~`, def.icon, 2000);
        }
    });

    container.appendChild(el);
    _exp.critters.push({ el, x: rx, y: ry, tx: rx, ty: ry, type: def.behavior, speed: Math.random()*1.5+0.5 });
}

/** 随机地面掉落物 */
function _spawnAmbientDrop(eco) {
    const container = document.getElementById('exp-nodes');
    if (!container) return;

    // 加权随机
    const total  = eco.ambientDrops.reduce((s, d) => s + d.weight, 0);
    let   rand   = Math.random() * total, chosen = eco.ambientDrops[0];
    for (const d of eco.ambientDrops) { rand -= d.weight; if (rand <= 0) { chosen = d; break; } }

    const rx  = 150 + Math.random() * (WORLD_W - 300);
    const ry  = 150 + Math.random() * (WORLD_H - 300);
    const uid = 'adrop_' + Date.now();
    const el  = document.createElement('div');
    el.className = 'exp-node eco-node';
    el.dataset.id    = uid;
    el.dataset.type  = 'collect';
    el.dataset.label = `采集 ${chosen.itemName}`;
    el.dataset.wx = rx;  el.dataset.wy = ry;
    el.style.cssText = `position:absolute;left:${rx}px;top:${ry}px;transform:translate(-50%,-50%);cursor:pointer;z-index:13;`;
    el.innerHTML = `<div style="font-size:22px;animation:float 3s infinite;filter:drop-shadow(0 4px 8px rgba(0,0,0,.5));">${chosen.icon}</div>
                    <div style="font-size:9px;color:rgba(255,255,255,.6);text-align:center;margin-top:3px;">${chosen.itemName}</div>`;
    el.addEventListener('click', e => {
        e.stopPropagation();
        _collectDynamicDrop(el, chosen.itemName, uid);
    });
    container.appendChild(el);
    _exp.dynamicNodes = _exp.dynamicNodes || [];
    _exp.dynamicNodes.push(uid);

    // 自动消失（30s）
    setTimeout(() => {
        if (el.parentNode) { el.style.opacity='0'; setTimeout(()=>el.remove(),600); }
        _exp.dynamicNodes = (_exp.dynamicNodes||[]).filter(id=>id!==uid);
    }, 30000);
}


// ============================================================
// 二、采集节点叙事增强
// ============================================================

/** 节点叙事数据库 */
const NODE_NARRATIVES = {
    '昆曲曲谱':  { text:'这张曲谱上的字迹已经褪色，仔细辨认，是一段失传已久的【游园惊梦】腔调……', icon:'📜', inheritorVoice:'梨园陈老板曾说：好腔调，靠的是一口气，得慢慢养。' },
    '戏服丝料':  { text:'绸子上的绣工还在，只是颜色旧了。这是哪位名角留下来的行头？', icon:'🎀', inheritorVoice:null },
    '苏绣丝线':  { text:'丝线细如发丝，在阳光下泛着淡淡的光晕。王雪萍匠师说，好丝线要劈到64丝，比头发还细。', icon:'🪡', inheritorVoice:'好丝线要劈到64丝，才能绣出那种似有若无的层次感。' },
    '生蚕丝':    { text:'蚕茧在手中轻如鸿毛，却是千百年来锦绣文章的根源。', icon:'🧵', inheritorVoice:null },
    '高岭陶土':  { text:'这里的土质细腻，握在手里有一种特殊的重量感，是张景春匠师最爱的原料产地。', icon:'🏺', inheritorVoice:'这片土，窑变后呈梅子青，是最难复制的颜色。' },
    '明前茶叶':  { text:'茶芽还带着今晨的露水，清香扑鼻，是清明前最后一批手采茶。', icon:'🍃', inheritorVoice:null },
    '山野松茸':  { text:'松茸藏在枯叶下，用脚尖轻轻一拨才露出来——大自然最不声张的礼物。', icon:'🍄', inheritorVoice:null },
    '野花':      { text:'无名的小花开在路边，却有一种静静的美，令人驻足。', icon:'🌸', inheritorVoice:null },
};

const DEFAULT_NARRATIVE = { text:'你在这里发现了一些有趣的东西，小心翼翼地收入囊中。', icon:'📦', inheritorVoice:null };

/** 覆写 _expCollect 以支持叙事弹出 */
(function patchExpCollect() {
    window._expCollect = function(label, idx) {
        const itemName = label.replace(/采集[:：]\s*/g,'').replace('采集','').trim();
        const nodeEl   = document.querySelector(`#exp-nodes .exp-node[data-idx="${idx}"]`);

        const narData = NODE_NARRATIVES[itemName] || DEFAULT_NARRATIVE;

        // 显示叙事浮层
        _showCollectNarrative(itemName, narData, () => {
            // 实际采集
            if (nodeEl) {
                if (nodeEl.style.pointerEvents === 'none') return;
                nodeEl.style.pointerEvents = 'none';
                nodeEl.style.transition    = 'transform .4s ease, opacity .4s ease';
                nodeEl.style.transform     = 'translate(-50%,-50%) scale(0) rotate(20deg)';
                nodeEl.style.opacity       = '0';
                setTimeout(() => {
                    nodeEl.style.transition = 'transform .5s ease, opacity .5s ease';
                    nodeEl.style.transform  = 'translate(-50%,-50%) scale(1) rotate(0)';
                    nodeEl.style.opacity    = '1';
                    nodeEl.style.pointerEvents = 'auto';
                }, 30000);
            }
            if (typeof addItem === 'function') addItem(itemName, 3);
            showNotification(`采集了【${itemName} ×3】，已放入灵犀袋！`, '🌿');

            // 传习录
            if (typeof XiuliluManager !== 'undefined') {
                XiuliluManager.addEntry('explore', `采集：${itemName}`,
                    narData.text, { itemGained:`${itemName}×3` });
            }
            if (typeof dispatchQuestEvent === 'function') dispatchQuestEvent('collect_item');
            if (typeof GameEvent !== 'undefined') GameEvent.emit('collect_item',{ amount:3, item:itemName });
        });
    };
})();

function _showCollectNarrative(itemName, narData, onConfirm) {
    _exp.isPaused = true;
    document.getElementById('exp-collect-narrative')?.remove();

    const panel = document.createElement('div');
    panel.id = 'exp-collect-narrative';
    panel.style.cssText = `
        position:fixed; bottom:0; left:0; width:100%; z-index:1900;
        background:linear-gradient(to top, rgba(15,12,8,.97), rgba(20,16,10,.90));
        border-top:2px solid rgba(126,182,161,.4); padding:20px 36px 22px;
        backdrop-filter:blur(10px); animation:slideUpIn .3s ease;`;

    const voice = narData.inheritorVoice
        ? `<div style="margin-top:12px;padding:10px 14px;background:rgba(212,175,55,.06);border:1px dashed rgba(212,175,55,.3);border-radius:8px;font-size:12px;color:var(--gold);font-style:italic;">"${narData.inheritorVoice}"</div>`
        : '';

    panel.innerHTML = `
        <div style="max-width:800px;margin:0 auto;display:flex;align-items:flex-start;gap:16px;">
            <div style="font-size:32px;flex-shrink:0;">${narData.icon}</div>
            <div style="flex:1;">
                <div style="font-size:14px;font-weight:bold;color:var(--jade);margin-bottom:8px;">发现 · ${itemName}</div>
                <div style="font-size:14px;color:#e8dcc8;line-height:1.85;font-family:var(--font-kai);">${narData.text}</div>
                ${voice}
            </div>
        </div>
        <div style="max-width:800px;margin:14px auto 0;display:flex;justify-content:flex-end;gap:12px;">
            <button class="btn btn-outline" style="font-size:12px;border-color:rgba(255,255,255,.2);color:#888;" onclick="document.getElementById('exp-collect-narrative').remove();_exp.isPaused=false;">继续探索</button>
            <button class="btn btn-jade" style="font-size:13px;" onclick="document.getElementById('exp-collect-narrative').remove();_exp.isPaused=false;(${onConfirm.toString()})();">✅ 采集（×3）</button>
        </div>`;

    document.body.appendChild(panel);
}


// ============================================================
// 三、时辰 & 节气滤镜增强
// ============================================================

/** 覆写 updateWorldEcology：增加节气滤镜叠加 */
(function patchUpdateWorldEcology() {
    window.updateWorldEcology = function(stateIndex, timeId) {
        const expView = document.getElementById('view-exploration');

        // 时辰基础滤镜
        const timeFilters = [
            'sepia(0.12) brightness(1.06) hue-rotate(-8deg)',   // 晨曦 — 暖金
            'saturate(1.1) brightness(1.08)',                    // 午时 — 明亮
            'sepia(0.45) saturate(1.3) brightness(0.88) hue-rotate(-18deg)', // 黄昏 — 橙红
            'brightness(0.55) contrast(1.25) saturate(0.75) hue-rotate(180deg)', // 子夜 — 蓝黑
        ];
        const baseFilter = timeFilters[stateIndex] || 'none';

        // 节气叠加滤镜
        let solarFilter = '';
        if (typeof SolarTermEngine !== 'undefined') {
            const term = SolarTermEngine.getCurrentTerm();
            if (term.sceneFilter) solarFilter = term.sceneFilter;
        }

        // 合并（简单串联，CSS 会自动叠加）
        const finalFilter = solarFilter ? `${solarFilter}` : baseFilter;

        if (expView) {
            expView.style.transition = 'filter 3s ease';
            expView.style.filter     = finalFilter;
        }

        // 时段节点可见性
        document.querySelectorAll('.exp-node').forEach(nodeEl => {
            const st = nodeEl.dataset.spawnTime;
            if (st && st !== 'all') {
                const active = st === timeId;
                nodeEl.style.opacity       = active ? '1' : '0';
                nodeEl.style.pointerEvents = active ? 'auto' : 'none';
                nodeEl.style.transition    = 'opacity 1.5s ease';
            }
        });

        // 更新小地图色调
        const canvas = document.getElementById('exp-minimap');
        if (canvas) {
            const colorMap = ['rgba(255,200,100,.15)','rgba(255,255,200,.1)','rgba(255,120,60,.18)','rgba(40,60,120,.25)'];
            canvas.style.outline = `2px solid ${colorMap[stateIndex] || 'transparent'}`;
        }

        // HUD 时辰标签
        const hudCenter = document.getElementById('exp-hud-center');
        if (hudCenter) {
            const labels = ['🌅 晨曦','☀️ 午时','🌇 黄昏','🌙 子夜'];
            hudCenter.innerText = (typeof sceneConfig !== 'undefined' && _exp.sceneKey && sceneConfig[_exp.sceneKey])
                ? `${sceneConfig[_exp.sceneKey].title} · ${labels[stateIndex]}`
                : labels[stateIndex];
        }
    };
})();


// ============================================================
// 四、探索引擎启动时自动应用时辰
// ============================================================
(function patchInitExplorationState() {
    const origInit = window._initExplorationState || function(){};
    // We monkey-patch by hooking into DOMContentLoaded + exploration events
    GameEvent.on && GameEvent.on('exploration:entered', () => {
        const wState = gameState.worldState ?? 1;
        const timeId = ['dawn','noon','dusk','night'][wState];
        if (typeof updateWorldEcology === 'function') updateWorldEcology(wState, timeId);
        if (typeof SolarTermEngine !== 'undefined') SolarTermEngine.applySceneFilter();
    });
})();

// 补全 exploration 进入时触发事件（在 renderExplorationMap 调用后）
const _origRender = window.renderExplorationMap;
window.renderExplorationMap = function(sceneKey) {
    if (_origRender) _origRender(sceneKey);
    setTimeout(() => {
        if (typeof GameEvent !== 'undefined') GameEvent.emit('exploration:entered', { sceneKey });
        // 初始时辰同步
        const wState = gameState.worldState ?? 1;
        const timeId = ['dawn','noon','dusk','night'][wState];
        if (typeof updateWorldEcology === 'function') updateWorldEcology(wState, timeId);
    }, 200);
};


// ============================================================
// 五、世界时辰切换按钮（HUD 右侧）
// ============================================================
(function injectTimeToggle() {
    document.addEventListener('DOMContentLoaded', () => {
        // 在 HUD 右侧注入时辰切换
        const observer = new MutationObserver(() => {
            const hudRight = document.getElementById('exp-hud-right');
            if (hudRight && !hudRight.querySelector('.time-toggle-btn')) {
                const btn = document.createElement('button');
                btn.className = 'btn btn-outline time-toggle-btn';
                btn.style.cssText = 'border-color:rgba(255,255,255,.4);color:white;padding:5px 12px;font-size:12px;';
                btn.title = '切换时辰';
                const labels = ['🌅','☀️','🌇','🌙'];
                btn.innerText = labels[gameState.worldState ?? 1];
                btn.onclick = () => {
                    gameState.worldState = ((gameState.worldState ?? 1) + 1) % 4;
                    btn.innerText = labels[gameState.worldState];
                    const timeId = ['dawn','noon','dusk','night'][gameState.worldState];
                    updateWorldEcology(gameState.worldState, timeId);
                    if (typeof SaveManager !== 'undefined') SaveManager.save();
                    showNotification(`时辰切换：${'晨曦 午时 黄昏 子夜'.split(' ')[gameState.worldState]}`, labels[gameState.worldState]);
                };
                hudRight.prepend(btn);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
