/**
 * exploration-engine.js
 * 寻遗集 · 沉浸式探索引擎
 */

'use strict';

let WORLD_W = 2400;
let WORLD_H = 1600;
const EXP_VIEW_ID = 'view-exploration';
const PLAYER_SPEED = 4;
const INTERACT_RADIUS = 90;

const _exp = {
    sceneKey: null, config: null, player: { x: 0, y: 0 }, target: null,
    keys: { w: false, a: false, s: false, d: false }, facingLeft: false,
    camera: { x: 0, y: 0 }, nearbyNode: null, rafId: null,
    colliders: [], isPaused: false, walkFrame: 0, walkTick:  0,
    // 👇 新增生态追踪
    dynamicNodes: [], critters: [], lastSpawnTime: 0
};
const WALK_FRAMES = ['🧍', '🚶', '🧍', '🚶‍♀️'];

window.renderExplorationMap = function(sceneKey) {
    const config = typeof sceneConfig !== 'undefined' ? sceneConfig[sceneKey] : null;
    if (!config || !config.exploration) {
        console.warn(`未找到探索配置: ${sceneKey}`);
        return;
    }

    // 播放加载动画，提升沉浸感
    if (typeof playExplorationLoadingAnim === 'function') {
        playExplorationLoadingAnim(config.title, () => {
            _initExplorationState(sceneKey, config);
        });
    } else {
        _initExplorationState(sceneKey, config);
    }

   _buildMapLayers(config);
    _buildNodes(config.exploration.nodes || []);
    _buildColliders(config.exploration.blockedZones || []);
    _buildMinimap(config);
    _updateHUD(config);
    _renderPlayer();

    // 👇 新增：初始化生态与环境特效
    _initEcology(config);
    _spawnEnvironmentParticles(config);

    _updateCamera();
    _applyCamera();
    _startLoop();
};

function _ensureExplorationView() {
    let expView = document.getElementById(EXP_VIEW_ID);
    
    // 🌟 核心修复：如果 HTML 里没有画这个容器，引擎会自动创建一个并挂载到主屏幕！
    if (!expView) {
        expView = document.createElement('div');
        expView.id = EXP_VIEW_ID;
        expView.className = 'view-container';
        // 补齐被漏掉的 CSS 样式
        expView.style.cssText = 'position: relative; width: 100%; height: 100%; overflow: hidden; background: #2a3a2a; user-select: none;';
        
        const mainContent = document.getElementById('main-content') || document.body;
        mainContent.appendChild(expView);
    }
    
    // 如果容器里还没内容，才注入 UI，防止重复渲染卡顿
    if (expView.innerHTML.trim() === '') {
        expView.innerHTML = `
            <div id="exp-hud" style="position:absolute; top:0; left:0; width:100%; z-index:300; display:flex; justify-content:space-between; align-items:center; padding:12px 20px; background:rgba(0,0,0,0.45); backdrop-filter:blur(6px); pointer-events:none;">
                <div style="pointer-events:auto;">
                    <button class="btn btn-outline" style="border-color:rgba(255,255,255,0.5); color:white; padding:6px 14px; font-size:13px;" onclick="exitExploration()">⬅ 返回枢纽</button>
                </div>
                <div id="exp-hud-center" style="color:white; font-size:16px; font-weight:bold; letter-spacing:2px; text-shadow:0 2px 6px rgba(0,0,0,0.8);"></div>
                <div id="exp-hud-right" style="display:flex; gap:12px; align-items:center; color:white; font-size:13px; pointer-events:auto;"></div>
            </div>
            <div id="exp-bg-far" class="exp-layer" style="z-index:1; position:absolute; width:100%; height:100%;"></div>
            <div id="exp-bg-mid" class="exp-layer" style="z-index:2; position:absolute; width:100%; height:100%;"></div>
            <div id="exp-bg-ground" class="exp-layer" style="z-index:3; position:absolute; width:100%; height:100%;"></div>
            <div id="exp-nodes" style="position:absolute; top:0; left:0; width:${WORLD_W}px; height:${WORLD_H}px; z-index:10;"></div>
            <div id="exp-player" style="position:absolute; z-index:20; display:flex; flex-direction:column; align-items:center; pointer-events:none; transform:translate(-50%,-50%);">
                <div id="exp-player-shadow" style="width:36px; height:10px; background:rgba(0,0,0,0.3); border-radius:50%; margin-top:-4px; margin-bottom:2px;"></div>
                <div id="exp-player-char" style="font-size:34px; line-height:1; filter:drop-shadow(0 4px 6px rgba(0,0,0,0.5)); transition: transform 0.1s ease;">🧍</div>
                <div id="exp-player-name" style="background:rgba(0,0,0,0.6); color:white; padding:2px 8px; border-radius:8px; font-size:11px; white-space:nowrap; margin-top:4px;">游历者</div>
            </div>
            <div id="exp-interact-hint" style="position:absolute; bottom:80px; left:50%; transform:translateX(-50%); background:rgba(212,175,55,0.92); color:#3a3530; padding:8px 20px; border-radius:30px; font-size:14px; font-weight:bold; box-shadow:0 4px 12px rgba(0,0,0,0.3); z-index:400; display:none; pointer-events:none; white-space:nowrap;">
                按 <kbd style="background:white;padding:1px 6px;border-radius:4px;margin:0 4px;font-family:monospace;color:#333;">F</kbd> 与【<span id="exp-hint-label"></span>】互动
            </div>
            <div style="position:absolute; bottom:20px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.5); color:rgba(255,255,255,0.7); padding:6px 18px; border-radius:20px; font-size:12px; z-index:300; pointer-events:none; backdrop-filter:blur(4px);">
                🖱️ 点击地面移动 &nbsp;|&nbsp; ⌨️ WASD 键盘控制 &nbsp;|&nbsp; F 键交互
            </div>
            <div id="exp-minimap-wrap" style="position:absolute; bottom:20px; right:20px; z-index:350; background:rgba(0,0,0,0.6); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:6px; backdrop-filter:blur(4px);">
                <div style="color:rgba(255,255,255,0.6); font-size:10px; margin-bottom:4px; text-align:center;">小地图</div>
                <canvas id="exp-minimap" width="120" height="70" style="display:block; border-radius:4px; cursor:crosshair;" onclick="minimapClick(event)"></canvas>
            </div>
            <div id="exp-click-layer" style="position:absolute; top:0; left:0; width:${WORLD_W}px; height:${WORLD_H}px; z-index:5; cursor:crosshair;"></div>
        `;
        
        // 绑定点击地面移动事件
        document.getElementById('exp-click-layer').addEventListener('click', _onMapClick);
    }
}

function _buildMapLayers(config) {
    const farEl = document.getElementById('exp-bg-far'); const midEl = document.getElementById('exp-bg-mid'); const groundEl = document.getElementById('exp-bg-ground');
    if (!farEl) return;
    [farEl, midEl, groundEl].forEach(el => { el.style.position = 'absolute'; el.style.top = '0'; el.style.left = '0'; el.style.width = WORLD_W + 'px'; el.style.height = WORLD_H + 'px'; el.style.backgroundRepeat = 'repeat'; el.style.backgroundSize = 'auto'; });
    const layers = config.exploration.layers || [];
    if (layers[0]) { farEl.style.backgroundColor = layers[0].bg; farEl.style.backgroundImage = `url('${layers[0].texture}')`; farEl.style.opacity = layers[0].opacity; }
    if (layers[1]) { midEl.style.backgroundColor = layers[1].bg; midEl.style.backgroundImage = `url('${layers[1].texture}')`; midEl.style.opacity = layers[1].opacity; }
    if (layers[2]) { groundEl.style.backgroundColor = layers[2].bg; groundEl.style.backgroundImage = `url('${layers[2].texture}')`; groundEl.style.opacity = layers[2].opacity; }
}

function _buildNodes(nodes) {
    const container = document.getElementById('exp-nodes'); if (!container) return; container.innerHTML = '';
    nodes.forEach((node, idx) => {
        const px = node.pos.x, py = node.pos.y;
        const el = document.createElement('div');
        el.className = 'exp-node'; el.dataset.idx = idx; el.dataset.type = node.type; 
        el.dataset.label = node.label; el.dataset.wx = px; el.dataset.wy = py;
        
        // 🌟 注入时辰属性 (默认全天可见 'all')
        el.dataset.spawnTime = node.spawnTime || 'all';
        
        el.style.cssText = `position:absolute; left:${px}px; top:${py}px; transform:translate(-50%,-50%); display:flex; flex-direction:column; align-items:center; cursor:pointer; z-index:15; animation: float 3s ease-in-out ${(idx * 0.4).toFixed(1)}s infinite; transition: opacity 0.8s ease, transform 0.4s ease, filter 0.2s ease;`;
        
        el.innerHTML = `<div class="exp-node-aura" style="position:absolute; width:60px; height:60px; border-radius:50%; background:${_nodeAuraColor(node.type)}; opacity:0; transform:scale(0.8); transition: opacity 0.3s, transform 0.3s;"></div><div style="font-size:38px; filter:drop-shadow(0 4px 8px rgba(0,0,0,0.5)); position:relative; z-index:1;">${node.icon}</div><div style="background:rgba(0,0,0,0.75); color:white; padding:4px 10px; border-radius:10px; font-size:12px; margin-top:5px; white-space:nowrap; position:relative; z-index:1; border:1px solid rgba(255,255,255,0.15); backdrop-filter:blur(4px); pointer-events:none;">${node.label}</div>`;
        el.addEventListener('click', (e) => { e.stopPropagation(); triggerInteraction(node.type, node.label, idx); });
        container.appendChild(el);
    });

    // 初始加载时立刻同步一次生态
    if (typeof gameState !== 'undefined' && gameState.worldState !== undefined) {
        updateWorldEcology(gameState.worldState, ['dawn','noon','dusk','night'][gameState.worldState]);
    }
}

function _buildColliders(blockedZones) {
    _exp.colliders = [...blockedZones]; const M = 30; 
    _exp.colliders.push({ x: 0, y: 0, w: M, h: WORLD_H }, { x: WORLD_W - M, y: 0, w: M, h: WORLD_H }, { x: 0, y: 0, w: WORLD_W, h: M }, { x: 0, y: WORLD_H - M, w: WORLD_W, h: M });
}

function _gameLoop() {
    if (!_exp.isPaused) { 
        _processKeyboardMove(); 
        _processTargetMove(); 
        _checkProximity(); 
        _tickWalkAnimation(); 
        
        // 👇 新增：让生态物资和活物动起来
        _tickEcology();
        _tickCritters();
    }
    _renderPlayer(); _updateCamera(); _applyCamera(); _updateMinimap();
    _exp.rafId = requestAnimationFrame(_gameLoop);
}

function _startLoop() { if (_exp.rafId) cancelAnimationFrame(_exp.rafId); _exp.rafId = requestAnimationFrame(_gameLoop); }
function _stopLoop() { if (_exp.rafId) { cancelAnimationFrame(_exp.rafId); _exp.rafId = null; } }

function _processKeyboardMove() {
    const { w, a, s, d } = _exp.keys; if (!w && !a && !s && !d) return;
    const speed = (w || s) && (a || d) ? PLAYER_SPEED * 0.707 : PLAYER_SPEED;
    let nx = _exp.player.x, ny = _exp.player.y;
    if (w) ny -= speed; if (s) ny += speed; if (a) { nx -= speed; _exp.facingLeft = true; } if (d) { nx += speed; _exp.facingLeft = false; }
    _exp.target = null; _moveTo(nx, ny);
}

function _processTargetMove() {
    if (!_exp.target) return;
    const dx = _exp.target.x - _exp.player.x, dy = _exp.target.y - _exp.player.y, dist = Math.hypot(dx, dy);
    if (dist < PLAYER_SPEED + 1) { _exp.player.x = _exp.target.x; _exp.player.y = _exp.target.y; _exp.target = null; return; }
    const nx = _exp.player.x + (dx / dist) * PLAYER_SPEED, ny = _exp.player.y + (dy / dist) * PLAYER_SPEED;
    _exp.facingLeft = dx < 0; _moveTo(nx, ny);
}

function _moveTo(nx, ny) {
    const R = 18;
    if (!_collides(nx, ny, R)) { _exp.player.x = nx; _exp.player.y = ny; return; }
    if (!_collides(nx, _exp.player.y, R)) { _exp.player.x = nx; return; }
    if (!_collides(_exp.player.x, ny, R)) { _exp.player.y = ny; }
}

function _collides(px, py, r) {
    for (const rect of _exp.colliders) {
        const nearX = Math.max(rect.x, Math.min(px, rect.x + rect.w));
        const nearY = Math.max(rect.y, Math.min(py, rect.y + rect.h));
        if (Math.hypot(px - nearX, py - nearY) < r) return true;
    }
    return false;
}

function _onMapClick(e) {
    if (_exp.isPaused) return;
    const layer = document.getElementById('exp-click-layer'); 
    const view  = document.getElementById(EXP_VIEW_ID);
    if (!layer || !view) return;
    
    // 获取图层和视口的边界
    const rect = layer.getBoundingClientRect();
    const viewRect = view.getBoundingClientRect();
    
    // ✅ 修复：因为 click-layer 已经跟随摄像机移动了，所以鼠标减去图层左上角，就是绝对的世界坐标！
    const wx = e.clientX - rect.left;
    const wy = e.clientY - rect.top;
    _exp.target = { x: wx, y: wy };
    
    // 生成点击波纹反馈（相对于屏幕视口）
    _spawnClickRipple(e.clientX - viewRect.left, e.clientY - viewRect.top);
}

function _spawnClickRipple(sx, sy) {
    const view = document.getElementById(EXP_VIEW_ID); if (!view) return;
    const ripple = document.createElement('div');
    // ✅ 修复波纹的样式，改成更显眼的金色水波纹
    ripple.style.cssText = `position:absolute; left:${sx}px; top:${sy}px; z-index:50; width:30px; height:30px; margin-left:-15px; margin-top:-15px; border:2px solid rgba(232, 154, 101, 0.8); border-radius:50%; animation: rippleOut 0.4s ease-out forwards; pointer-events:none;`;
    view.appendChild(ripple); setTimeout(() => ripple.remove(), 420);
}

function _updateCamera() {
    const view = document.getElementById(EXP_VIEW_ID); if (!view) return;
    const vw = view.clientWidth || window.innerWidth, vh = view.clientHeight || window.innerHeight - 80;
    let cx = _exp.player.x - vw / 2, cy = _exp.player.y - vh / 2;
    cx = Math.max(0, Math.min(cx, WORLD_W - vw)); cy = Math.max(0, Math.min(cy, WORLD_H - vh));
    _exp.camera.x += (cx - _exp.camera.x) * 0.12; _exp.camera.y += (cy - _exp.camera.y) * 0.12;
}

function _applyCamera() {
    const { x: cx, y: cy } = _exp.camera;
    _setLayerOffset('exp-bg-far', cx * 0.2, cy * 0.2); _setLayerOffset('exp-bg-mid', cx * 0.5, cy * 0.5); _setLayerOffset('exp-bg-ground', cx * 0.85, cy * 0.85);
    _setLayerOffset('exp-nodes', cx, cy); _setLayerOffset('exp-click-layer', cx, cy);
    const playerEl = document.getElementById('exp-player');
    if (playerEl) { playerEl.style.left = (_exp.player.x - cx) + 'px'; playerEl.style.top = (_exp.player.y - cy) + 'px'; }
}

function _renderPlayer() {
    const charEl = document.getElementById('exp-player-char'); if (!charEl) return;
    const isMoving = _exp.target !== null || _exp.keys.w || _exp.keys.a || _exp.keys.s || _exp.keys.d;
    charEl.innerText = isMoving ? WALK_FRAMES[_exp.walkFrame % WALK_FRAMES.length] : '🧍';
    charEl.style.transform = _exp.facingLeft ? 'scaleX(-1)' : 'scaleX(1)';
}

function _tickWalkAnimation() {
    const isMoving = _exp.target !== null || _exp.keys.w || _exp.keys.a || _exp.keys.s || _exp.keys.d;
    if (!isMoving) { 
        _exp.walkTick = 0; 
        return; 
    }
    
    _exp.walkTick++; 
    if (_exp.walkTick >= 10) { 
        _exp.walkTick = 0; 
        _exp.walkFrame++; 
        
        // 🌟【核心接线】：角色每迈出完整的一步，向任务大脑广播行走事件
        if (typeof dispatchQuestEvent === 'function') {
            dispatchQuestEvent('explore_move', 1); 
        }
    }
}

function _setLayerOffset(id, ox, oy) { const el = document.getElementById(id); if (el) el.style.transform = `translate(${-ox}px, ${-oy}px)`; }

function _checkProximity() {
    const nodes = document.querySelectorAll('#exp-nodes .exp-node');
    let closest = null, closestDist = Infinity;
    nodes.forEach(el => {
        const wx = parseFloat(el.dataset.wx), wy = parseFloat(el.dataset.wy), dist = Math.hypot(_exp.player.x - wx, _exp.player.y - wy);
        if (dist < INTERACT_RADIUS && dist < closestDist) { closestDist = dist; closest = el; }
        const aura = el.querySelector('.exp-node-aura');
        if (aura) { const t = Math.max(0, 1 - dist / INTERACT_RADIUS); aura.style.opacity = (t * 0.5).toFixed(2); aura.style.transform = `scale(${0.8 + t * 0.4})`; }
    });
    const hint = document.getElementById('exp-interact-hint'); if (!hint) return;
    if (closest) { _exp.nearbyNode = closest; document.getElementById('exp-hint-label').innerText = closest.dataset.label; hint.style.display = 'block'; } else { _exp.nearbyNode = null; hint.style.display = 'none'; }
}

function triggerInteraction(type, label, idx) {
    if(typeof playSound === 'function') playSound('interact');
    if (type === 'collect') _expCollect(label, idx);
    else if (type === 'npc') window._expNPCDialogue(label, idx); // ✅ 加上 window.
    else if (type === 'workshop') _expWorkshop(label, idx);
    else if (type === 'game') _expGame(label);
    else if (type === 'shop') _expShop();
    else if (type === 'rest') _expRest(label);
    else if (type === 'hidden') _expHiddenEvent(label, idx);
    else if (type === 'ruin') window._expRuinInteraction(idx); // ✅ 废墟也确保调用最新的
    else showNotification(`与【${label}】产生了神秘共鸣…`, '✨');
}

function _expCollect(label, idx) {
    const itemName = label.replace(/采集[:：]\s*/g, '').replace('采集', '').trim();
    const nodeEl = document.querySelector(`#exp-nodes .exp-node[data-idx="${idx}"]`);
    if (nodeEl) {
        nodeEl.style.transition = 'transform 0.4s ease, opacity 0.4s ease'; 
        nodeEl.style.transform = 'translate(-50%,-50%) scale(0) rotate(20deg)'; 
        nodeEl.style.opacity = '0';
        setTimeout(() => { 
            nodeEl.style.transition = 'transform 0.5s ease, opacity 0.5s ease'; 
            nodeEl.style.transform = 'translate(-50%,-50%) scale(1) rotate(0)'; 
            nodeEl.style.opacity = '1'; 
        }, 30000);
    }
    
    if(typeof addItem === 'function') addItem(itemName, 3);
    
    // 🌟【核心接线】：向任务大脑广播采集事件，一次采集3个
    if (typeof dispatchQuestEvent === 'function') {
        dispatchQuestEvent('collect_item', 3);
    }
    
    showNotification(`采集了【${itemName} ×3】，已放入灵犀袋！`, '🌿');
}

function _expNPCDialogue(label, idx) {
    _exp.isPaused = true;
    
    // 捞取当前点击的节点数据
    const node = _exp.config.exploration.nodes[idx];
    let speaker = label;
    let avatar = '🧑';
    let lines = [];

    // ✅ 修复：如果该节点有你自定义的 data，优先使用你的设定！
    if (node && node.data) {
        if (node.data.name) speaker = node.data.name;
        if (node.data.avatar) avatar = node.data.avatar;
        // 把你 scenes.js 里的简单文字数组，自动转成引擎能识别的选项格式
        if (node.data.dialog && node.data.dialog.length > 0) {
            lines = node.data.dialog.map(line => ({
                text: line.text,
                options: (line.options || []).map(opt => 
                    typeof opt === 'string' ? { text: opt, next: -1 } : opt
                )
            }));
        }
    }

    // 如果该节点没有写特定的对话，就用传承人的设定兜底
    if (lines.length === 0) {
        const inheritor = typeof inheritorData !== 'undefined' ? inheritorData.find(i => label.includes(i.name.slice(0, 3))) || null : null;
        lines = _generateNPCLines(label, inheritor);
    }

    _showDialoguePanel({ speaker: speaker, avatar: avatar, lines: lines, onClose: () => { _exp.isPaused = false; } });
}

function _generateNPCLines(label, inheritor) {
    if (inheritor) return [ { text: `"游侠儿，你可来了！我是${inheritor.name}，${inheritor.title}。九州之大，有缘相遇，不如留下来学学？"`, options: [ { text: '✋ 请问您的技艺从何而来？', next: 1 }, { text: '🎓 我想正式拜入门下', next: 3 }, { text: '👋 改日再来', next: -1 } ] }, { text: `"${inheritor.title.replace('传承人', '')}技艺源远流长，每一件作品都是心血与时光的凝结。"`, options: [ { text: '👋 先离开', next: -1 } ] }, {}, { text: `"好！从今往后你便是我的弟子。先去天工阁看看我的工坊吧！"`, options: [ { text: '🚪 前往天工阁', next: 'workshop' } ] } ];
    return [ { text: `"哟，来了位游侠儿！这片【${label}】可是好去处，好好探索吧。"`, options: [ { text: '👋 告辞了', next: -1 } ] } ];
}

function _showDialoguePanel({ speaker, avatar, lines, onClose }) {
    document.getElementById('exp-dialogue')?.remove();
    const panel = document.createElement('div'); panel.id = 'exp-dialogue';
    panel.style.cssText = `position:fixed; bottom:0; left:0; width:100%; z-index:2000; background:linear-gradient(to top, rgba(20,16,12,0.97), rgba(30,24,18,0.92)); border-top:2px solid rgba(212,175,55,0.4); padding:24px 40px 28px; backdrop-filter:blur(10px); animation: slideUpIn 0.35s ease;`;
    const render = (lineIdx) => {
        if (lineIdx === -1) { panel.style.animation = 'slideDownOut 0.3s ease forwards'; setTimeout(() => { panel.remove(); onClose?.(); }, 300); return; }
        if (lineIdx === 'workshop') { panel.remove(); onClose?.(); if (typeof goToWorkshopFromScene === 'function') goToWorkshopFromScene(); return; }
        const line = lines[lineIdx]; if (!line) return;
        panel.innerHTML = `<div style="display:flex; gap:20px; align-items:flex-start; max-width:900px; margin:0 auto;"><div style="width:64px; height:64px; border-radius:50%; background:rgba(255,255,255,0.08); border:2px solid rgba(212,175,55,0.5); display:flex; align-items:center; justify-content:center; font-size:32px; flex-shrink:0;">${avatar}</div><div style="flex:1;"><div style="color:var(--amber,#e89a65); font-weight:bold; margin-bottom:10px; font-size:15px;">${speaker}</div><div id="exp-dlg-text" style="color:#e8dcc8; font-size:15px; line-height:1.8; min-height:48px; margin-bottom:18px;"></div><div id="exp-dlg-options" style="display:flex; gap:12px; flex-wrap:wrap;"></div></div></div>`;
        _typewrite('exp-dlg-text', line.text, 28, () => {
            const optContainer = document.getElementById('exp-dlg-options'); if (!optContainer) return;
            (line.options || []).forEach(opt => { const btn = document.createElement('button'); btn.className = 'btn btn-outline'; btn.style.cssText = 'color:#e8dcc8; border-color:rgba(232,220,200,0.3); font-size:13px; padding:8px 16px;'; btn.innerText = opt.text; btn.onclick = () => render(opt.next); optContainer.appendChild(btn); });
        });
    };
    document.body.appendChild(panel); render(0);
}

function _expWorkshop(label, idx) { _exp.isPaused = true; _showWorkshopPanel(label, () => { _exp.isPaused = false; }); }
function _showWorkshopPanel(label, onClose) {
    document.getElementById('exp-workshop-panel')?.remove();
    const panel = document.createElement('div'); panel.id = 'exp-workshop-panel';
    panel.style.cssText = `position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:white; width:min(680px,92vw); border-radius:20px; box-shadow:0 20px 60px rgba(0,0,0,0.4); z-index:2000; overflow:hidden; border: 1px solid #ccc;`;
    panel.innerHTML = `<div style="background:linear-gradient(135deg,var(--jade),#5f9e87); padding:20px 25px; display:flex; justify-content:space-between; align-items:center;"><div style="color:white; font-size:20px; font-weight:bold;">${label}</div><button onclick="document.getElementById('exp-workshop-panel').remove(); ${onClose ? '(' + onClose.toString() + ')()' : ''}" style="background:transparent; border:none; color:white; font-size:24px; cursor:pointer;">×</button></div><div style="padding:25px; text-align:center;"><h2>欢迎来到工坊</h2><p style="margin:20px 0; color:#666;">你可以在这里与匠人交流，学习非遗技艺。</p><button class="btn btn-jade" onclick="document.getElementById('exp-workshop-panel').remove(); ${onClose ? '(' + onClose.toString() + ')()' : ''}">关闭</button></div>`;
    document.body.appendChild(panel);
}

function _expGame(label) { if (label.includes('投壶') && typeof openMinigame === 'function') openMinigame(); else if (label.includes('灯谜') && typeof openRiddleGame === 'function') openRiddleGame(); else showNotification(`进入【${label}】小游戏！`, '🎮'); }
function _expShop() { if (typeof openShop === 'function') openShop(); }
function _expRest(label) { if(typeof earnStones === 'function') earnStones(10); showNotification(`在【${label}】处小憩，精力恢复，获得 10 灵石`, '😌'); }
function _expHiddenEvent(label, idx) { showNotification('触发了神秘奇遇，获得丰厚奖励！', '✨'); if(typeof earnStones === 'function') earnStones(100); }

function _buildMinimap(config) {
    const canvas = document.getElementById('exp-minimap'); if (!canvas) return;
    const ctx = canvas.getContext('2d'), cw = canvas.width, ch = canvas.height;
    ctx.fillStyle = '#112211'; ctx.fillRect(0, 0, cw, ch);
    (config.exploration.nodes || []).forEach(node => {
        const mx = (node.pos.x / WORLD_W) * cw, my = (node.pos.y / WORLD_H) * ch;
        ctx.fillStyle = _nodeMinimapColor(node.type); ctx.beginPath(); ctx.arc(mx, my, 3, 0, Math.PI * 2); ctx.fill();
    });
}

function _updateMinimap() {
    const canvas = document.getElementById('exp-minimap'); if (!canvas) return;
    const ctx = canvas.getContext('2d'), cw = canvas.width, ch = canvas.height;
    _buildMinimap(_exp.config);
    const view = document.getElementById(EXP_VIEW_ID), vw = view?.clientWidth || window.innerWidth, vh = view?.clientHeight || window.innerHeight;
    const rx = (_exp.camera.x / WORLD_W) * cw, ry = (_exp.camera.y / WORLD_H) * ch, rw = (vw / WORLD_W) * cw, rh = (vh / WORLD_H) * ch;
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1; ctx.strokeRect(rx, ry, rw, rh);
    const px = (_exp.player.x / WORLD_W) * cw, py = (_exp.player.y / WORLD_H) * ch;
    ctx.fillStyle = `rgba(255,255,255,${0.6 + 0.4 * Math.sin(Date.now() / 300)})`; ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();
}

window.minimapClick = function(e) {
    const canvas = document.getElementById('exp-minimap'); if (!canvas) return;
    const rect = canvas.getBoundingClientRect(), cx = (e.clientX - rect.left) / canvas.width, cy = (e.clientY - rect.top) / canvas.height;
    _exp.target = { x: cx * WORLD_W, y: cy * WORLD_H };
}

function _updateHUD(config) {
    const center = document.getElementById('exp-hud-center'), right = document.getElementById('exp-hud-right');
    if (center) center.innerText = `${config.title} · ${config.subtitle}`;
    if (right) right.innerHTML = `<div style="background:rgba(255,255,255,0.12); padding:5px 12px; border-radius:15px;">🪙 <span id="exp-stones">${typeof gameState !== 'undefined' ? gameState.stones : 0}</span></div>`;
}

window.exitExploration = function() {
    _stopLoop(); _exp.isPaused = false; _exp.target = null;
    document.getElementById('exp-dialogue')?.remove(); document.getElementById('exp-workshop-panel')?.remove(); document.getElementById('exp-hidden-panel')?.remove();
    document.querySelectorAll('.view-container').forEach(v => { v.classList.remove('active-view'); v.style.display = ''; });
    const sceneView = document.getElementById('view-scene'); if (sceneView) sceneView.classList.add('active-view');
    const dock = document.getElementById('player-dock'); if (dock) dock.classList.remove('hidden');
    if(typeof playSound === 'function') playSound('click');
}

function _typewrite(elId, text, speed, onDone) {
    const el = document.getElementById(elId); if (!el) { onDone?.(); return; }
    el.innerText = ''; let i = 0; const timer = setInterval(() => { el.innerText += text[i++]; if (i >= text.length) { clearInterval(timer); onDone?.(); } }, speed);
}
function _nodeAuraColor(type) { const MAP = { collect: 'rgba(126,182,161,0.6)', npc: 'rgba(232,154,101,0.6)', workshop: 'rgba(178, 93, 82,0.6)', game: 'rgba(138,109,168,0.6)', shop: 'rgba(212,175, 55,0.6)', rest: 'rgba(180,200,180,0.5)', hidden: 'rgba(255,255,255,0.4)' }; return MAP[type] || 'rgba(255,255,255,0.3)'; }
function _nodeMinimapColor(type) { const MAP = { collect: '#7eb6a1', npc: '#e89a65', workshop:'#b25d52', game: '#8a6da8', shop: '#d4af37', rest: '#a0b8a0', hidden: '#ffffff' }; return MAP[type] || '#aaaaaa'; }

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('keydown', (e) => {
        const view = document.getElementById(EXP_VIEW_ID); 
        if (!view?.classList.contains('active-view')) return;
        
        switch (e.key.toLowerCase()) { 
            case 'w': case 'arrowup': _exp.keys.w = true; break; 
            case 's': case 'arrowdown': _exp.keys.s = true; break; 
            case 'a': case 'arrowleft': _exp.keys.a = true; break; 
            case 'd': case 'arrowright': _exp.keys.d = true; break; 
            case 'f': 
                if (_exp.nearbyNode && !_exp.isPaused) { 
                    triggerInteraction(_exp.nearbyNode.dataset.type, _exp.nearbyNode.dataset.label, parseInt(_exp.nearbyNode.dataset.idx)); 
                } 
                break; 
            case 'escape': 
                document.getElementById('exp-dialogue')?.remove(); 
                document.getElementById('exp-workshop-panel')?.remove(); 
                document.getElementById('exp-hidden-panel')?.remove(); 
                _exp.isPaused = false; 
                break; 
            // ✅ 新增：按 V 键触发灵视模式
            case 'v': 
                const expView = document.getElementById(EXP_VIEW_ID);
                if(expView) {
                    expView.classList.toggle('spirit-vision');
                    const isOn = expView.classList.contains('spirit-vision');
                    if(typeof showNotification === 'function') {
                        showNotification(isOn ? '👁️ 灵视已开启：看破千年虚妄...' : '👁️ 灵视已关闭：重返现世...', isOn ? '🔮' : '✨');
                    }
                }
                break;
        }
    });

    window.addEventListener('keyup', (e) => { 
        switch (e.key.toLowerCase()) { 
            case 'w': case 'arrowup': _exp.keys.w = false; break; 
            case 's': case 'arrowdown': _exp.keys.s = false; break; 
            case 'a': case 'arrowleft': _exp.keys.a = false; break; 
            case 'd': case 'arrowright': _exp.keys.d = false; break; 
        } 
    });
});

// ============================================================
// 交互大升级补丁：寻幽罗盘 + 赠礼结缘系统
// ============================================================


// 1. 升级实时寻幽罗盘 (跟随玩家和采集物状态 60fps 动态更新)
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'c') {
        if(document.getElementById('compass-radar')) return; 
        const view = document.getElementById('view-exploration');
        if(!view || !view.classList.contains('active-view')) return;
        
        if(typeof showNotification === 'function') showNotification('八卦寻幽罗盘已启动，实时追踪灵气...', '🧭');
        if(typeof playSound === 'function') playSound('magic');
        
        const radar = document.createElement('div');
        radar.id = 'compass-radar'; radar.className = 'compass-radar';
        const pointer = document.createElement('div');
        pointer.className = 'compass-pointer';
        
        const playerEl = document.getElementById('exp-player');
        playerEl.appendChild(radar); playerEl.appendChild(pointer);

        let isRadarActive = true;
        // 罗盘持续时间延长到 4 秒
        setTimeout(() => { isRadarActive = false; radar.remove(); pointer.remove(); }, 4000);

        function updateCompass() {
            if(!isRadarActive) return;
            
            let targetNode = null; let minDist = Infinity;
            // 实时搜寻尚未被采集（透明度不为0）的节点
            document.querySelectorAll('.exp-node[data-type="collect"], .exp-node[data-type="hidden"]').forEach(el => {
                // 核心修复：如果该节点已经被采集（opacity被设为0），罗盘会立刻无视它！
                if (el.style.opacity === '0') return; 
                
                const wx = parseFloat(el.dataset.wx), wy = parseFloat(el.dataset.wy);
                const dist = Math.hypot(_exp.player.x - wx, _exp.player.y - wy);
                if(dist < minDist) { minDist = dist; targetNode = el; }
            });

            // 如果附近还有物品，计算角度实时跟随
            if(targetNode) {
                const tx = parseFloat(targetNode.dataset.wx), ty = parseFloat(targetNode.dataset.wy);
                const angle = Math.atan2(ty - _exp.player.y, tx - _exp.player.x) * 180 / Math.PI + 90;
                pointer.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
                pointer.style.opacity = 1;
            } else {
                // 附近没东西了，指针消失
                pointer.style.opacity = 0; 
            }
            
            // 下一帧继续检测
            requestAnimationFrame(updateCompass);
        }
        updateCompass();
    }
});

// ============================================================
// 终极交互大升级：智能 NPC 对话引擎与羁绊赠礼系统
// ============================================================

// 初始化羁绊（好感度）系统
if (typeof gameState !== 'undefined' && !gameState.intimacy) {
    gameState.intimacy = {};
}

// 1. 核心入口：拦截 NPC 点击事件 (修复传承人精准识别)
window._expNPCDialogue = function(label, idx) {
    _exp.isPaused = true;
    const node = _exp.config.exploration.nodes[idx];
    
    let speaker = label; 
    let avatar = '🧑'; 
    let isInheritor = false;
    let inheritorDataRef = null;

    // 🌟 修复 1：更精准的匠人匹配机制 (直接读取 ID 绑定)
    if (node && node.data && node.data.bindInheritorId) {
        if (typeof inheritorData !== 'undefined') {
            inheritorDataRef = inheritorData.find(i => i.id === node.data.bindInheritorId);
            if (inheritorDataRef) {
                isInheritor = true;
                speaker = inheritorDataRef.name;
                avatar = inheritorDataRef.avatar;
            }
        }
    } 
    // 兜底：如果没配 ID，尝试按名字前两个字比对
    else if (typeof inheritorData !== 'undefined') {
        inheritorDataRef = inheritorData.find(i => label.includes(i.name.slice(0, 2)) || i.name.includes(label.slice(0, 2)));
        if (inheritorDataRef) {
            isInheritor = true;
            speaker = inheritorDataRef.name;
            avatar = inheritorDataRef.avatar;
        }
    }

    // 普通 NPC 提取名字和头像
    if (!isInheritor && node && node.data) {
        if (node.data.name) speaker = node.data.name;
        if (node.data.avatar) avatar = node.data.avatar;
    }

    // 启动全新动态对话面板
    _startDynamicDialogue(speaker, avatar, isInheritor, inheritorDataRef, node);
};

// 2. 动态状态机对话引擎 (修复选项丢失)
window._startDynamicDialogue = function(speaker, avatar, isInheritor, inheritorDataRef, nodeData) {
    
    // 触发任务进度
    if (typeof dispatchQuestEvent === 'function') {
        dispatchQuestEvent('talk_npc', 1);
    }

    document.getElementById('exp-dialogue')?.remove();
    const panel = document.createElement('div');
    panel.id = 'exp-dialogue';
    
    panel.style.cssText = `position:fixed; bottom:0; left:0; width:100%; z-index:2000; background:linear-gradient(to top, rgba(20,16,12,0.97), rgba(30,24,18,0.92)); border-top:2px solid rgba(212,175,55,0.4); padding:24px 40px 28px; backdrop-filter:blur(10px); animation: slideUpIn 0.35s ease;`;
    document.body.appendChild(panel);

    const renderState = (state, ctx = {}) => {
        let text = '';
        let options = [];

        // -----------------------------------------
        // 状态：GREET (问候/主菜单)
        // -----------------------------------------
        if (state === 'GREET') {
            if (isInheritor) {
                // 如果是传承人，显示专属打招呼和学问菜单
                text = inheritorDataRef.aiAvatar.greeting;
                options.push({ text: '📖 请教非遗学问', next: 'TEACH_MENU' });
                options.push({ text: '⛩️ 随您前往工坊', next: 'WORKSHOP' });
            } else if (nodeData && nodeData.data && nodeData.data.dialog && nodeData.data.dialog.length > 0) {
                // 如果是普通 NPC，读取 scenes.js 里的专属对白
                text = nodeData.data.dialog[0].text;
                
                // 🌟 修复 2：读取你在 scenes.js 中配置的 options 选项
                const customOpts = nodeData.data.dialog[0].options || [];
                customOpts.forEach(opt => {
                    const optText = typeof opt === 'string' ? opt : opt.text;
                    options.push({ text: `💬 ${optText}`, next: 'CUSTOM_TALK', ctx: { msg: optText } });
                });
            } else {
                text = `"哟，来了位游侠儿！这片地方可是个好去处，好好探索吧。"`;
            }
            
            // 兜底通用选项：送礼和离开
            options.push({ text: '🎁 赠送行囊灵物', next: 'GIFT_MENU' });
            options.push({ text: '👋 暂且告辞', next: 'LEAVE' });
        }
        
        // -----------------------------------------
        // 状态：CUSTOM_TALK (普通 NPC 的互动回馈)
        // -----------------------------------------
        else if (state === 'CUSTOM_TALK') {
            text = `"哈哈，有意思！相逢即是缘，这九州奇闻，咱们日后再细细详聊。"`;
            options.push({ text: '🙏 多谢指教', next: 'GREET' });
        }
        
        // -----------------------------------------
        // 状态：TEACH_MENU (学问菜单 - 仅传承人)
        // -----------------------------------------
        else if (state === 'TEACH_MENU') {
            text = `"九州技艺，浩如烟海。你对老夫（老身）的哪部分学问感兴趣？"`;
            const kn = inheritorDataRef.aiAvatar.knowledge;
            if(kn.history) options.push({ text: '📜 历史与渊源', next: 'TEACH_DETAIL', ctx: { content: kn.history } });
            if(kn.material) options.push({ text: '🌿 原材与挑选', next: 'TEACH_DETAIL', ctx: { content: kn.material } });
            if(kn.craft) options.push({ text: '⚒️ 核心技艺', next: 'TEACH_DETAIL', ctx: { content: kn.craft } });
            if(kn.faq && kn.faq.length > 0) {
                options.push({ text: '❓ 常见疑惑(FAQ)', next: 'FAQ_MENU' });
            }
            options.push({ text: '↩️ 返回', next: 'GREET' });
        }

        // -----------------------------------------
        // 状态：TEACH_DETAIL / FAQ_DETAIL (展示知识)
        // -----------------------------------------
        else if (state === 'TEACH_DETAIL') {
            text = `"${ctx.content}"`;
            options.push({ text: '🙏 受教了 (返回)', next: 'TEACH_MENU' });
        }

        // -----------------------------------------
        // 状态：FAQ_MENU (问答菜单)
        // -----------------------------------------
        else if (state === 'FAQ_MENU') {
            text = `"平日里常有游历者问我这些问题，你也来看看吧。"`;
            inheritorDataRef.aiAvatar.knowledge.faq.forEach(qItem => {
                options.push({ 
                    text: `💬 ${qItem.q.length > 10 ? qItem.q.substring(0, 10) + '...' : qItem.q}`, 
                    next: 'TEACH_DETAIL', 
                    ctx: { content: qItem.a } 
                });
            });
            options.push({ text: '↩️ 返回', next: 'TEACH_MENU' });
        }

        // -----------------------------------------
        // 状态：GIFT_MENU (送礼菜单 - 动态读取背包)
        // -----------------------------------------
        else if (state === 'GIFT_MENU') {
            text = `"哦？你要送老夫礼物？九州灵物难得，你可想好了？"`;
            let hasItem = false;
            if (gameState.inventory) {
                for (let itemName in gameState.inventory) {
                    if (gameState.inventory[itemName] > 0) {
                        hasItem = true;
                        options.push({ text: `🎁 送出【${itemName}】`, next: 'GIFT_RESULT', ctx: { itemName: itemName } });
                    }
                }
            }

           // -----------------------------------------
        // 状态：GIFT_RESULT (送礼结算与羁绊判定)
        // -----------------------------------------
        else if (state === 'GIFT_RESULT') {
            const item = ctx.itemName;
            gameState.inventory[item]--;
            if (typeof updateInventory === 'function') updateInventory();

            gameState.intimacy[speaker] = (gameState.intimacy[speaker] || 0) + 20;

            // 👇 核心大联动：检查玩家送的是不是沙盘推演出的绝世卷宗！
            if (item === '宋代冰裂纹残片' && speaker === '张景春匠师') {
                text = `<span style="color:var(--gold); font-size:16px;">"天呐！这...这是南宋失传的冰裂纹配方！"</span>\n\n张景春匠师的手颤抖着抚摸过残片，老泪纵横。"七百年了，我龙泉窑的绝学终于找回来了！游侠儿，受老夫一拜！"`;
                
                // 给玩家发放顶级图纸奖励
                setTimeout(() => {
                    showNotification('张景春传授了你绝学！已在天工阁为你解锁【冰裂纹青瓷】专属定制配方！', '🏺', 6000);
                    if (!gameState.unlockedRecipes) gameState.unlockedRecipes = [];
                    gameState.unlockedRecipes.push('recipe_bingliewen'); // 假设的一个新配方
                    
                    // 🌟 给传承人端发消息：传承人的 OMO 后台被玩家行为改变了！
                    if (typeof inheritorState !== 'undefined') {
                        inheritorState.messages.unshift({ id: 999, from: '系统', content: `游历者为你寻回了【宋代冰裂纹残片】！您现在可以在工坊发布“冰裂纹研习”高阶任务了！` });
                    }
                }, 2000);
                
                options.push({ text: '能帮到您是我的荣幸', next: 'GREET' });
            } 
            // 如果是普通礼物，走正常好感度逻辑
            else {
                const currentIntimacy = gameState.intimacy[speaker];
                text = `"哎呀，这【${item}】可是好东西！多谢小友！"\n<span style="color:var(--jade); font-size:12px;">(提示：${speaker} 羁绊值: ${currentIntimacy})</span>`;
                
                if (currentIntimacy >= 60 && !gameState.intimacy[`${speaker}_rewarded`]) {
                    gameState.intimacy[`${speaker}_rewarded`] = true;
                    const rewardItem = isInheritor ? '天工绝密图纸' : '千年灵芝';
                    text += `\n\n<span style="color:var(--amber);">"看你这般有心，这件【${rewardItem}】就送予你吧！"</span>`;
                    setTimeout(() => { if (typeof addItem === 'function') addItem(rewardItem, 1); }, 1000);
                }
                options.push({ text: '🙏 不客气', next: 'GREET' });
            }
        }

            if (!hasItem) {
                text = `(你在行囊里摸索了半天，尴尬地发现里面空空如也...)`;
            }
            options.push({ text: '↩️ 算了，再看看', next: 'GREET' });
        }

        // -----------------------------------------
        // 状态：GIFT_RESULT (送礼结算与羁绊判定)
        // -----------------------------------------
        else if (state === 'GIFT_RESULT') {
            const item = ctx.itemName;
            gameState.inventory[item]--;
            if (typeof updateInventory === 'function') updateInventory();

            gameState.intimacy[speaker] = (gameState.intimacy[speaker] || 0) + 20;
            const currentIntimacy = gameState.intimacy[speaker];

            text = `"哎呀，这【${item}】可是好东西！多谢小友！"\n<span style="color:var(--jade); font-size:12px;">(提示：${speaker} 对你的好感度提升了，当前羁绊：${currentIntimacy})</span>`;
            if (typeof playSound === 'function') playSound('magic'); 

            // 好感度突破奖励
            if (currentIntimacy >= 60 && !gameState.intimacy[`${speaker}_rewarded`]) {
                gameState.intimacy[`${speaker}_rewarded`] = true;
                const rewardItem = isInheritor ? '天工绝密图纸' : '千年灵芝';
                text += `\n\n<span style="color:var(--amber);">"看你这般有心，这件我珍藏多年的【${rewardItem}】就送予你吧，切莫推辞！"</span>`;
                setTimeout(() => {
                    if (typeof addItem === 'function') addItem(rewardItem, 1);
                    if (typeof showNotification === 'function') showNotification(`羁绊突破！获得了 ${speaker} 的回礼【${rewardItem}】`, '💖', 4000);
                }, 1000);
            }
            options.push({ text: '🙏 不客气', next: 'GREET' });
        }

        // -----------------------------------------
        // 执行 UI 更新
        // -----------------------------------------
        if (state === 'LEAVE') {
            panel.style.animation = 'slideDownOut 0.3s ease forwards';
            setTimeout(() => { panel.remove(); _exp.isPaused = false; }, 300);
            return;
        }
        if (state === 'WORKSHOP') {
            panel.remove(); _exp.isPaused = false;
            if (typeof goToWorkshopFromScene === 'function') goToWorkshopFromScene();
            return;
        }

        // 组装气泡 HTML
        panel.innerHTML = `
            <div style="display:flex; gap:20px; align-items:flex-start; max-width:900px; margin:0 auto;">
                <div style="width:64px; height:64px; border-radius:50%; background:rgba(255,255,255,0.08); border:2px solid ${isInheritor ? 'var(--cinnabar)' : 'rgba(212,175,55,0.5)'}; display:flex; align-items:center; justify-content:center; font-size:32px; flex-shrink:0;">${avatar}</div>
                <div style="flex:1;">
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
                        <span style="color:var(--amber); font-weight:bold; font-size:16px;">${speaker}</span>
                        ${isInheritor ? `<span style="background:var(--cinnabar); color:white; font-size:10px; padding:2px 6px; border-radius:4px;">匠师</span>` : ''}
                        <span style="color:#888; font-size:12px; margin-left:auto;">羁绊值: ${gameState.intimacy[speaker] || 0}</span>
                    </div>
                    <div id="exp-dlg-text" style="color:#e8dcc8; font-size:15px; line-height:1.8; min-height:48px; margin-bottom:18px;"></div>
                    <div id="exp-dlg-options" style="display:flex; gap:12px; flex-wrap:wrap;"></div>
                </div>
            </div>`;

        // 支持 span 颜色标签，直接注入 HTML
        document.getElementById('exp-dlg-text').innerHTML = text; 
        
        // 挂载按钮
        const optContainer = document.getElementById('exp-dlg-options');
        options.forEach(opt => { 
            const btn = document.createElement('button'); 
            btn.className = 'btn btn-outline'; 
            btn.style.cssText = 'color:#e8dcc8; border-color:rgba(232,220,200,0.3); font-size:13px; padding:8px 16px; background: rgba(0,0,0,0.3); transition: all 0.2s; cursor:pointer;'; 
            btn.onmouseover = () => { btn.style.background = 'var(--jade)'; btn.style.borderColor = 'var(--jade)'; btn.style.color = 'white'; };
            btn.onmouseout = () => { btn.style.background = 'rgba(0,0,0,0.3)'; btn.style.borderColor = 'rgba(232,220,200,0.3)'; btn.style.color = '#e8dcc8'; };
            btn.innerText = opt.text; 
            btn.onclick = () => renderState(opt.next, opt.ctx); 
            optContainer.appendChild(btn); 
        });
    };

    renderState('GREET');
};


// 🌟 处理天地法则引发的地图与节点异变
window.updateWorldEcology = function(stateIndex, timeId) {
    const canvas = document.getElementById('exp-canvas');
    if (!canvas) return;

    // 1. 大世界滤镜光影更替
    const filters = [
        'sepia(0.2) brightness(1.05) hue-rotate(-10deg)', // Dawn (晨曦)
        'saturate(1.1) brightness(1.1)',                  // Noon (午时)
        'sepia(0.5) saturate(1.3) brightness(0.85) hue-rotate(-20deg)', // Dusk (黄昏)
        'brightness(0.55) contrast(1.2) saturate(0.8) hue-rotate(180deg)' // Night (子夜 - 幽蓝色调)
    ];
    canvas.style.transition = 'filter 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    canvas.style.filter = filters[stateIndex] || 'none';

    // 2. 节点幽灵刷新机制 (Time-gated Spawns)
    document.querySelectorAll('.exp-node').forEach(nodeEl => {
        const spawnTime = nodeEl.dataset.spawnTime;
        if (spawnTime && spawnTime !== 'all') {
            // 如果节点限定时间，且当前时间匹配，则显形，否则隐身并不可点击
            const isActive = (spawnTime === timeId);
            nodeEl.style.opacity = isActive ? '1' : '0';
            nodeEl.style.pointerEvents = isActive ? 'auto' : 'none';
            nodeEl.style.transform = isActive ? 'translate(-50%,-50%) scale(1)' : 'translate(-50%,-50%) scale(0.5)';
        }
    });
    
    // 3. 天地异象通知
    if (timeId === 'night') {
        if(typeof showNotification === 'function') showNotification('子夜降临，阴阳交汇，神秘的鬼市与灵物已在暗处现身...', '🌌');
    } else if (timeId === 'dawn') {
        if(typeof showNotification === 'function') showNotification('晨曦初露，天地清明，万物凝结出了最纯粹的灵气...', '🌅');
    }
};

// ============================================================
// 🌟 终极玩法：大遗忘灵场净化与修复系统
// ============================================================

// 1. 初始化全服修复记录
if (typeof gameState !== 'undefined' && !gameState.restoredNodes) {
    gameState.restoredNodes = [];
}

// 2. 劫持原始节点渲染（把废墟变灰，把已修复的替换为新节点）
const _originalBuildNodes = window._buildNodes || (typeof _buildNodes !== 'undefined' ? _buildNodes : null);
window._buildNodes = function(nodes) {
    // 深拷贝一份节点数据用于渲染替换
    const renderNodes = JSON.parse(JSON.stringify(nodes));
    
    renderNodes.forEach(node => {
        if (node.type === 'ruin') {
            const isRestored = gameState.restoredNodes && gameState.restoredNodes.includes(node.id);
            if (isRestored) {
                // 已经修复过：蜕变成全新的生态节点
                node.type = node.data.restoredType;
                node.icon = node.data.restoredIcon;
                node.label = node.data.restoredLabel;
                node.data = node.data.restoredData; // 继承新NPC的对话数据
            } else {
                // 未修复：加上特殊的 CSS 滤镜（会在 DOM 渲染后生效）
                node.isCorrupted = true; 
            }
        }
    });

    // 调用原本的渲染逻辑
    if (_originalBuildNodes) {
        _originalBuildNodes(renderNodes);
    } else {
        console.error("未找到原始 _buildNodes");
    }

    // 给未修复的废墟加上灰色迷雾和闪烁效果
    setTimeout(() => {
        document.querySelectorAll('.exp-node[data-type="ruin"]').forEach(el => {
            el.style.filter = 'grayscale(1) brightness(0.6) contrast(1.5)';
            el.style.animation = 'ruinGlitch 3s infinite';
            const icon = el.querySelector('.inode-icon');
            if(icon) icon.style.opacity = '0.7';
        });
    }, 50);
};

// 3. 拦截交互路由
const _originalTriggerInteraction = window.triggerInteraction;
window.triggerInteraction = function(type, label, idx) {
    if (type === 'ruin') {
        _expRuinInteraction(idx);
    } else if (typeof _originalTriggerInteraction === 'function') {
        _originalTriggerInteraction(type, label, idx);
    }
};

// 4. 废墟交互逻辑
window._expRuinInteraction = function(idx) {
    _exp.isPaused = true;
    const node = _exp.config.exploration.nodes[idx];
    const inv = gameState.inventory || {};
    const restoredNodes = gameState.restoredNodes || [];

    // 读取各阶段完成状态
    const clues = node.data.requireClues || [];
    const allClues = clues.every(c => (inv[c] || 0) > 0);
    const recipeKey = `recipe_unlocked_${node.id}`;
    const recipeUnlocked = !!gameState[recipeKey];
    const hasItem = (inv[node.data.requireItem] || 0) > 0;

    // Phase 1 灵识感应台词
    const persona = _detectPersonaForRuin();
    const aiHint = node.data[`aiHint_${persona}`] || node.data.hint;

    // 构建面板内容
    let stageHtml = '';

    // ── Phase 1 ──
    stageHtml += `
      <div style="background:rgba(126,182,161,0.08); border-left:3px solid var(--jade); padding:12px; border-radius:4px; margin-bottom:12px; font-size:13px; color:#e8dcc8; font-family:var(--font-kai); line-height:1.75;">
        🤖 ${aiHint}
      </div>`;

    // ── Phase 2 线索 ──
    if (clues.length > 0) {
        stageHtml += `<div style="margin-bottom:12px;">
          <div style="font-size:11px; color:#888; margin-bottom:6px; letter-spacing:1px;">📜 PHASE 2 · 线索收集${allClues ? ' ✓' : ''}</div>
          <div style="display:flex; gap:8px;">
            ${clues.map(c => {
              const ok = (inv[c] || 0) > 0;
              return `<div style="flex:1; background:${ok ? 'rgba(126,182,161,0.15)' : 'rgba(0,0,0,0.3)'}; border:1px solid ${ok ? 'var(--jade)' : '#555'}; border-radius:8px; padding:8px; text-align:center; font-size:12px; color:${ok ? 'var(--jade)' : '#aaa'};">
                ${ok ? '✅' : '🔍'} ${c}
              </div>`;
            }).join('')}
          </div>
        </div>`;
    }

    // ── 按钮区 ──
    let btnHtml = '';
    if (!allClues) {
        // 尚未收集线索 → 提示探索本场景
        btnHtml = `
          <div style="font-size:12px; color:#aaa; margin-bottom:15px;">💡 继续在本区域探索，线索有概率从采集点掉落</div>
          <button class="btn btn-outline" style="width:100%;" onclick="closeRuinPanel()">暂且退下</button>`;

    } else if (!recipeUnlocked) {
        // 线索齐全，未推演 → 跳去沙盘
        btnHtml = `
          <button class="btn btn-gold" style="width:100%; margin-bottom:10px;" onclick="closeRuinPanel(); _ruinGoDeduction('${node.id}', '${node.data.requireItem}', ${JSON.stringify(clues).replace(/"/g, '&quot;')})">
            🔮 前往异闻沙盘推演图纸
          </button>
          <button class="btn btn-outline" style="width:100%;" onclick="closeRuinPanel()">暂且退下</button>`;

    } else if (!hasItem) {
        // 已推演，去造物
        btnHtml = `
          <div style="color:var(--jade); font-size:13px; margin-bottom:12px;">✅ 图纸已推演，前往天工阁造物【${node.data.requireItem}】</div>
          <button class="btn btn-jade" style="width:100%; margin-bottom:10px;" onclick="closeRuinPanel(); exitExploration(); setTimeout(()=>openCrafting(), 400);">
            ⛩️ 前往天工阁造物
          </button>
          <button class="btn btn-outline" style="width:100%;" onclick="closeRuinPanel()">暂且退下</button>`;

    } else {
        // 万事俱备 → 交付
        btnHtml = `
          <button class="btn" style="width:100%; margin-bottom:10px; background:linear-gradient(135deg,#c8a820,#f0d060); color:#1a1200; font-weight:bold; font-size:15px;" 
                  onclick="executeRestorationRitual(${idx}, '${node.data.requireItem}')">
            ✨ 交付【${node.data.requireItem}】· 唤醒灵场
          </button>
          <button class="btn btn-outline" style="width:100%;" onclick="closeRuinPanel()">暂且退下</button>`;
    }

    // 渲染面板
    document.getElementById('exp-ruin-panel')?.remove();
    const panel = document.createElement('div');
    panel.id = 'exp-ruin-panel';
    panel.style.cssText = `position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); width:500px; background:linear-gradient(180deg,#2c2a28,#1a1816); border:2px solid #555; border-radius:16px; padding:28px; z-index:3000; box-shadow:0 20px 50px rgba(0,0,0,0.8); color:white; animation:popIn 0.3s cubic-bezier(0.175,0.885,0.32,1.275);`;
    panel.innerHTML = `
      <div style="font-size:55px; text-align:center; margin-bottom:10px; filter:grayscale(1); opacity:0.8;">${node.icon}</div>
      <div style="text-align:center; font-size:18px; color:#ccc; font-weight:bold; margin-bottom:4px; letter-spacing:2px;">${node.label}</div>
      <div style="text-align:center; font-size:11px; color:#666; margin-bottom:20px; letter-spacing:3px;">≋ 大遗忘迷雾区 ≋</div>
      ${stageHtml}
      ${btnHtml}
    `;
    document.body.appendChild(panel);
};

// 检测灵识性格（给废墟面板用）
function _detectPersonaForRuin() {
    const eq = gameState.equipment || {};
    const inv = gameState.inventory || {};
    if (eq['首'] === '金丝楠木皇冠') return 'mojiaziju';
    if (inv['百年红酒'] > 0 || inv['陈年女儿红'] > 0) return 'taozhu';
    return 'default';
}

// 消耗线索 + 跳转推演沙盘
window._ruinGoDeduction = function(nodeId, requireItem, clues) {
    closeRuinPanel();

    // 消耗线索
    clues.forEach(c => { if (gameState.inventory[c] > 0) gameState.inventory[c]--; });

    // 解锁图纸（对接造物台）
    const recipeKey = `recipe_unlocked_${nodeId}`;
    gameState[recipeKey] = true;

    // 如果 CRAFTING_RECIPES 里还没有这个配方，动态插入
    // （配方数据需要你在 game-content.js 的 CRAFTING_RECIPES 里预先定义好）

    showNotification(`推演成功！解锁了造物图纸，前往天工阁合成【${requireItem}】`, '📜', 5000);
    if (typeof playSound === 'function') playSound('achievement');

    // 自动跳去造物台
    setTimeout(() => {
        exitExploration();
        setTimeout(() => openCrafting(), 500);
    }, 2000);
};

window.closeRuinPanel = function() {
    document.getElementById('exp-ruin-panel')?.remove();
    _exp.isPaused = false;
};

// 5. 核心演出：净化仪式 (全屏高光特效)
window.executeRestorationRitual = function(idx, reqItem) {
    closeRuinPanel();
    _exp.isPaused = true;
    const node = _exp.config.exploration.nodes[idx];

    // 扣除道具
    gameState.inventory[reqItem]--;
    if(typeof updateInventory === 'function') updateInventory();

    // 播放神圣音效
    if(typeof playSound === 'function') playSound('achievement');

    // 生成全屏遮罩与演出层
    const cinematic = document.createElement('div');
    cinematic.style.cssText = `position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:4000; display:flex; flex-direction:column; align-items:center; justify-content:center; transition: all 1.5s ease;`;
    
    cinematic.innerHTML = `
        <div id="cine-item" style="font-size:80px; transform:translateY(50px); opacity:0; transition:all 2s cubic-bezier(0.1, 0.9, 0.2, 1); filter:drop-shadow(0 0 30px var(--gold));">
            ${typeof itemDatabase !== 'undefined' && itemDatabase[reqItem] ? itemDatabase[reqItem].icon : '✨'}
        </div>
        <div id="cine-text" style="color:var(--gold); font-size:24px; font-family:var(--font-kai); letter-spacing:8px; margin-top:40px; opacity:0; transition:all 1.5s ease; text-shadow:0 0 20px var(--gold);">
            天道归位 · 灵场重现
        </div>
        <div id="cine-flash" style="position:absolute; inset:0; background:white; opacity:0; pointer-events:none; transition:opacity 0.8s ease;"></div>
    `;
    document.body.appendChild(cinematic);

    // 动画时间轴编排
    setTimeout(() => {
        document.getElementById('cine-item').style.opacity = '1';
        document.getElementById('cine-item').style.transform = 'translateY(0) scale(1.5)';
    }, 100);

    setTimeout(() => {
        document.getElementById('cine-text').style.opacity = '1';
    }, 1500);

    // 白屏爆闪 + 节点蜕变
    setTimeout(() => {
        document.getElementById('cine-flash').style.opacity = '1';
        if(typeof playSound === 'function') playSound('magic');
        
        // 记录状态，永久改变世界
        if (!gameState.restoredNodes.includes(node.id)) {
            gameState.restoredNodes.push(node.id);
            if(typeof unlockAchievement === 'function') {
                unlockAchievement('restore_first', '九州点灯人', '成功驱散迷雾，修复了第一座大遗忘废墟', 500, '🏮');
            }
        }
        
     
setTimeout(() => {
    // 闪白褪去，刷新地图
    _buildNodes(_exp.config.exploration.nodes); // 重新渲染地图节点
    cinematic.style.opacity = '0';
    setTimeout(() => {
        cinematic.remove();
        _exp.isPaused = false;
        showNotification(`已净化【${node.label}】，该区域生态已永久改变！`, '🌟', 5000);
    }, 1500);
}, 800);
    }, 3500);
};

function _nodeAuraColor(type) { 
    const MAP = { 
        collect: 'rgba(126,182,161,0.6)', npc: 'rgba(232,154,101,0.6)', 
        workshop: 'rgba(178, 93, 82,0.6)', game: 'rgba(138,109,168,0.6)', 
        shop: 'rgba(212,175, 55,0.6)', rest: 'rgba(180,200,180,0.5)', 
        hidden: 'rgba(255,255,255,0.4)', 
        ruin: 'rgba(50,50,50,0.8)' // 🌟 新增废墟专属的阴影光环
    };
    return MAP[type] || 'rgba(255,255,255,0.3)'; 
}

function _nodeMinimapColor(type) { 
    const MAP = { 
        collect: '#7eb6a1', npc: '#e89a65', workshop:'#b25d52', 
        game: '#8a6da8', shop: '#d4af37', rest: '#a0b8a0', 
        hidden: '#ffffff', 
        ruin: '#444444' // 🌟 新增小地图废墟专属深灰色雷达点
    };
    return MAP[type] || '#aaaaaa'; 
}


// ==========================================
// 🌿 探索引擎 2.0：动态生态与活物系统
// ==========================================

function _initEcology(config) {
    _exp.dynamicNodes = [];
    _exp.critters = [];
    document.querySelectorAll('.eco-node, .eco-critter, .exp-particle').forEach(e => e.remove());
    
    const ecology = config.exploration.ecology;
    if (!ecology) return;

    // 初始撒下几生物资
    for(let i=0; i<ecology.maxDrops / 2; i++) _spawnRandomDrop(ecology);
    
    // 生成活物
    if (ecology.critters) {
        ecology.critters.forEach(cDef => {
            for(let i=0; i<cDef.count; i++) _spawnCritter(cDef);
        });
    }
}

function _tickEcology() {
    const ecology = _exp.config.exploration.ecology;
    if (!ecology || _exp.dynamicNodes.length >= ecology.maxDrops) return;

    const now = Date.now();
    if (now - _exp.lastSpawnTime > ecology.spawnInterval) {
        _exp.lastSpawnTime = now;
        _spawnRandomDrop(ecology);
    }
}

function _spawnRandomDrop(ecology) {
    // 权重随机池抽取
    const totalWeight = ecology.dropPool.reduce((sum, item) => sum + item.weight, 0);
    let rand = Math.random() * totalWeight;
    let selectedDrop = ecology.dropPool[0];
    for (let item of ecology.dropPool) {
        if (rand < item.weight) { selectedDrop = item; break; }
        rand -= item.weight;
    }

    // 在可行走区域随机生成坐标
    let rx, ry;
    do {
        rx = Math.random() * WORLD_W;
        ry = Math.random() * WORLD_H;
    } while (_collides(rx, ry, 20));

    const dropId = 'eco_drop_' + Date.now() + Math.floor(Math.random()*100);
    _exp.dynamicNodes.push(dropId);

    const container = document.getElementById('exp-nodes');
    if (!container) return;
    
    const el = document.createElement('div');
    el.className = 'exp-node eco-node'; 
    el.dataset.id = dropId;
    el.dataset.type = 'collect';
    el.dataset.label = `采集 ${selectedDrop.itemName}`;
    el.dataset.wx = rx; 
    el.dataset.wy = ry;
    
    el.style.cssText = `position:absolute; left:${rx}px; top:${ry}px; transform:translate(-50%,-50%) scale(0); opacity:0; cursor:pointer; z-index:12; transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);`;
    
    // 发光底座与图标
    el.innerHTML = `
        <div style="position:absolute; width:40px; height:40px; background:radial-gradient(circle, rgba(126,182,161,0.4) 0%, transparent 70%); border-radius:50%; animation: pulse 2s infinite;"></div>
        <div style="font-size:24px; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4)); animation: float 3s ease-in-out infinite;">${selectedDrop.icon}</div>
    `;

    el.addEventListener('click', (e) => {
        e.stopPropagation();
        _collectDynamicDrop(el, selectedDrop.itemName, dropId);
    });

    container.appendChild(el);
    
    // 弹出动画
    requestAnimationFrame(() => {
        el.style.transform = 'translate(-50%,-50%) scale(1)';
        el.style.opacity = '1';
    });
}

function _collectDynamicDrop(el, itemName, dropId) {
    if(typeof playSound === 'function') playSound('collect');
    
    // 动态吸附反馈特效
    el.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    el.style.transform = 'translate(-50%, -150px) scale(1.5)';
    el.style.opacity = '0';
    el.style.filter = 'brightness(2) drop-shadow(0 0 20px white)';

    setTimeout(() => {
        el.remove();
        _exp.dynamicNodes = _exp.dynamicNodes.filter(id => id !== dropId);
    }, 600);

    const qty = Math.random() > 0.8 ? 2 : 1; // 小概率暴击双倍
    if(typeof addItem === 'function') addItem(itemName, qty);
    if(typeof showNotification === 'function') showNotification(`在路边拾取了【${itemName} ×${qty}】`, '✨');
}

// 🦋 活物游荡 AI
function _spawnCritter(cDef) {
    const rx = Math.random() * WORLD_W;
    const ry = Math.random() * WORLD_H;
    const el = document.createElement('div');
    el.className = 'eco-critter';
    el.innerHTML = cDef.icon;
    el.style.cssText = `position:absolute; left:${rx}px; top:${ry}px; font-size:20px; z-index:25; filter:drop-shadow(0 5px 5px rgba(0,0,0,0.3)); transition: top 3s linear, left 3s linear, transform 0.3s; pointer-events:auto; cursor:pointer;`;
    
    const critterObj = { el, x: rx, y: ry, tx: rx, ty: ry, type: cDef.behavior, speed: Math.random()*2 + 1 };
    
    // 彩蛋互动
    el.addEventListener('click', (e) => {
        e.stopPropagation();
        el.style.transform = 'scale(2) rotate(360deg)';
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 500);
        if(typeof showNotification === 'function') showNotification(`你惊动了一只小生灵，它留下了一丝灵气。`, '🍃');
        if(typeof earnStones === 'function') earnStones(5);
        _exp.critters = _exp.critters.filter(c => c !== critterObj);
    });

    document.getElementById('exp-nodes').appendChild(el);
    _exp.critters.push(critterObj);
}

function _tickCritters() {
    _exp.critters.forEach(c => {
        // 到达目标点，分配新目标
        if (Math.hypot(c.tx - c.x, c.ty - c.y) < 10) {
            c.tx = c.x + (Math.random() - 0.5) * 300;
            c.ty = c.y + (Math.random() - 0.5) * 300;
            c.tx = Math.max(50, Math.min(WORLD_W-50, c.tx));
            c.ty = Math.max(50, Math.min(WORLD_H-50, c.ty));
        }

        // 逃跑逻辑：如果玩家靠近，立刻反向移动
        if (c.type === 'flee' && Math.hypot(_exp.player.x - c.x, _exp.player.y - c.y) < 150) {
            c.tx = c.x + (c.x - _exp.player.x) * 2;
            c.ty = c.y + (c.y - _exp.player.y) * 2;
        }

        // 插值移动
        c.x += (c.tx - c.x) * 0.02 * c.speed;
        c.y += (c.ty - c.y) * 0.02 * c.speed;

        c.el.style.left = c.x + 'px';
        c.el.style.top = c.y + 'px';
        
        // 转向
        if (c.tx < c.x) c.el.style.transform = 'scaleX(-1)';
        else c.el.style.transform = 'scaleX(1)';
    });
}

// ✨ 环境沉浸粒子生成器
function _spawnEnvironmentParticles(config) {
    const layer = document.getElementById('exp-click-layer'); // 借用一下顶层
    if (!layer) return;
    
    const pType = config.exploration.ecology?.particleEffect;
    if (!pType) return;

    const count = 30; // 粒子数量
    for(let i=0; i<count; i++) {
        const p = document.createElement('div');
        p.className = `exp-particle particle-${pType}`;
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.animationDuration = (Math.random() * 10 + 5) + 's';
        p.style.animationDelay = '-' + (Math.random() * 10) + 's';
        
        // 不同粒子的外观
        if (pType === 'bamboo-leaves') p.innerText = '🍃';
        else if (pType === 'petals') p.innerText = '🌸';
        else if (pType === 'fireflies') {
            p.innerText = '';
            p.style.width = '4px'; p.style.height = '4px';
            p.style.background = 'var(--jade)';
            p.style.boxShadow = '0 0 10px var(--jade)';
            p.style.borderRadius = '50%';
        }
        
        layer.appendChild(p);
    }
}