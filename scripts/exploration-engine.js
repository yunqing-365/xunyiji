/**
 * scripts/exploration-engine.js
 * 寻遗集 · 沉浸式探索引擎 (终极防错大一统版)
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
    colliders: [], isPaused: false, walkFrame: 0, walkTick: 0,
    dynamicNodes: [], critters: [], lastSpawnTime: 0
};
const WALK_FRAMES = ['🧍', '🚶', '🧍', '🚶‍♀️'];

window.renderExplorationMap = function(sceneKey) {
    const config = typeof sceneConfig !== 'undefined' ? sceneConfig[sceneKey] : null;
    if (!config || !config.exploration) {
        if(typeof showNotification === 'function') showNotification(`未找到探索配置: ${sceneKey}`, '❌');
        return;
    }
    _initExplorationState(sceneKey, config);
};

function _initExplorationState(sceneKey, config) {
    _stopLoop();
    _exp.sceneKey = sceneKey; _exp.config = config;
    _exp.isPaused = false; _exp.target = null; _exp.nearbyNode = null;

    WORLD_W = config.exploration.mapWidth || 2400;
    WORLD_H = config.exploration.mapHeight || 1600;
    _exp.player = config.exploration.spawnPoint ? { x: config.exploration.spawnPoint.x, y: config.exploration.spawnPoint.y } : { x: WORLD_W / 2, y: WORLD_H / 2 };

    _ensureExplorationView();

    // 强行清理视图，切入探索界面
    document.querySelectorAll('.view-container').forEach(v => { v.classList.remove('active-view'); v.style.display = 'none'; });
    const expView = document.getElementById(EXP_VIEW_ID);
    expView.classList.add('active-view');
    expView.style.display = 'block'; // 绝对防错：强行显示
    
    const dock = document.getElementById('player-dock');
    if(dock) dock.classList.add('hidden');

    _buildMapLayers(config);
    _buildNodes(config.exploration.nodes || []);
    _buildColliders(config.exploration.blockedZones || []);
    _buildMinimap(config);
    _updateHUD(config);
    _renderPlayer();

    // 初始化生态与环境特效
    _initEcology(config);
    _spawnEnvironmentParticles(config);

    _updateCamera();
    _applyCamera();
    _startLoop();

    if(typeof playSound === 'function') playSound('exploration_enter');
    if(typeof showNotification === 'function') showNotification(`进入【${config.title}】 — WASD 移动，靠近节点按 F 交互`, '🗺️', 4500);
}

function _ensureExplorationView() {
    let expView = document.getElementById(EXP_VIEW_ID);
    if (!expView) {
        expView = document.createElement('div');
        expView.id = EXP_VIEW_ID;
        expView.className = 'view-container';
        // 绝对防错：加入 display: block 确保不会被 CSS 隐藏
        expView.style.cssText = 'position: relative; width: 100%; height: 100%; overflow: hidden; background: #2a3a2a; user-select: none; display: block;';
        
        const mainContent = document.getElementById('main-content') || document.body;
        mainContent.appendChild(expView);
    }
    
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
                🖱️ 点击移动 &nbsp;|&nbsp; ⌨️ WASD 控制 &nbsp;|&nbsp; V 灵视 &nbsp;|&nbsp; C 罗盘
            </div>
            <div id="exp-minimap-wrap" style="position:absolute; bottom:20px; right:20px; z-index:350; background:rgba(0,0,0,0.6); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:6px; backdrop-filter:blur(4px);">
                <div style="color:rgba(255,255,255,0.6); font-size:10px; margin-bottom:4px; text-align:center;">小地图</div>
                <canvas id="exp-minimap" width="120" height="70" style="display:block; border-radius:4px; cursor:crosshair;" onclick="minimapClick(event)"></canvas>
            </div>
            <div id="exp-click-layer" style="position:absolute; top:0; left:0; width:${WORLD_W}px; height:${WORLD_H}px; z-index:5; cursor:crosshair;"></div>
        `;
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
    
    // 深拷贝，防止修改原始配置
    const renderNodes = JSON.parse(JSON.stringify(nodes));
    
    renderNodes.forEach(node => {
        if (node.type === 'ruin') {
            const isRestored = gameState.restoredNodes && gameState.restoredNodes.includes(node.id);
            if (isRestored) {
                node.type = node.data.restoredType || 'npc';
                node.icon = node.data.restoredIcon || '✨';
                node.label = node.data.restoredLabel || '已净化';
                node.data = node.data.restoredData || {}; 
            } else {
                node.isCorrupted = true; 
            }
        }
    });

    renderNodes.forEach((node, idx) => {
        const px = node.pos.x, py = node.pos.y;
        const el = document.createElement('div');
        el.className = 'exp-node'; el.dataset.idx = idx; el.dataset.type = node.type; 
        el.dataset.label = node.label; el.dataset.wx = px; el.dataset.wy = py;
        el.dataset.spawnTime = node.spawnTime || 'all';
        
        el.style.cssText = `position:absolute; left:${px}px; top:${py}px; transform:translate(-50%,-50%); display:flex; flex-direction:column; align-items:center; cursor:pointer; z-index:15; animation: float 3s ease-in-out ${(idx * 0.4).toFixed(1)}s infinite; transition: opacity 0.8s ease, transform 0.4s ease, filter 0.2s ease;`;
        
        if (node.isCorrupted) {
            el.style.filter = 'grayscale(1) brightness(0.6) contrast(1.5)';
            // 简单处理故障效果
            el.style.animation = 'float 2s infinite, blink 3s step-end infinite';
        }

        el.innerHTML = `<div class="exp-node-aura" style="position:absolute; width:60px; height:60px; border-radius:50%; background:${_nodeAuraColor(node.type)}; opacity:0; transform:scale(0.8); transition: opacity 0.3s, transform 0.3s;"></div><div style="font-size:38px; filter:drop-shadow(0 4px 8px rgba(0,0,0,0.5)); position:relative; z-index:1; ${node.isCorrupted ? 'opacity:0.7;' : ''}">${node.icon}</div><div style="background:rgba(0,0,0,0.75); color:white; padding:4px 10px; border-radius:10px; font-size:12px; margin-top:5px; white-space:nowrap; position:relative; z-index:1; border:1px solid rgba(255,255,255,0.15); backdrop-filter:blur(4px); pointer-events:none;">${node.label}</div>`;
        el.addEventListener('click', (e) => { e.stopPropagation(); triggerInteraction(node.type, node.label, idx, renderNodes[idx]); });
        container.appendChild(el);
    });

    if (typeof updateWorldEcology === 'function') {
        const timeId = ['dawn','noon','dusk','night'][gameState.worldState || 1];
        updateWorldEcology(gameState.worldState || 1, timeId);
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
    const rect = layer.getBoundingClientRect();
    const viewRect = view.getBoundingClientRect();
    const wx = e.clientX - rect.left;
    const wy = e.clientY - rect.top;
    _exp.target = { x: wx, y: wy };
    _spawnClickRipple(e.clientX - viewRect.left, e.clientY - viewRect.top);
}

function _spawnClickRipple(sx, sy) {
    const view = document.getElementById(EXP_VIEW_ID); if (!view) return;
    const ripple = document.createElement('div');
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
    if (!isMoving) { _exp.walkTick = 0; return; }
    _exp.walkTick++; 
    if (_exp.walkTick >= 10) { 
        _exp.walkTick = 0; _exp.walkFrame++; 
        if (typeof dispatchQuestEvent === 'function') dispatchQuestEvent('explore_move', 1); 
    }
}

function _setLayerOffset(id, ox, oy) { const el = document.getElementById(id); if (el) el.style.transform = `translate(${-ox}px, ${-oy}px)`; }

function _checkProximity() {
    const nodes = document.querySelectorAll('#exp-nodes .exp-node');
    let closest = null, closestDist = Infinity;
    nodes.forEach(el => {
        if (el.style.opacity === '0' || el.style.pointerEvents === 'none') return;
        const wx = parseFloat(el.dataset.wx), wy = parseFloat(el.dataset.wy), dist = Math.hypot(_exp.player.x - wx, _exp.player.y - wy);
        if (dist < INTERACT_RADIUS && dist < closestDist) { closestDist = dist; closest = el; }
        const aura = el.querySelector('.exp-node-aura');
        if (aura) { const t = Math.max(0, 1 - dist / INTERACT_RADIUS); aura.style.opacity = (t * 0.5).toFixed(2); aura.style.transform = `scale(${0.8 + t * 0.4})`; }
    });
    const hint = document.getElementById('exp-interact-hint'); if (!hint) return;
    if (closest) { _exp.nearbyNode = closest; document.getElementById('exp-hint-label').innerText = closest.dataset.label; hint.style.display = 'block'; } else { _exp.nearbyNode = null; hint.style.display = 'none'; }
}

function triggerInteraction(type, label, idx, nodeDataFallback) {
    if(typeof playSound === 'function') playSound('interact');
    if (type === 'collect') _expCollect(label, idx);
    else if (type === 'npc') _expNPCDialogue(label, idx, nodeDataFallback);
    else if (type === 'workshop') _expWorkshop(label, idx);
    else if (type === 'game') _expGame(label);
    else if (type === 'shop') _expShop();
    else if (type === 'rest') _expRest(label);
    else if (type === 'hidden') _expHiddenEvent(label, idx);
    else if (type === 'ruin') _expRuinInteraction(idx, nodeDataFallback);
    else { if(typeof showNotification==='function') showNotification(`与【${label}】产生了神秘共鸣…`, '✨'); }
}

function _expCollect(label, idx) {
    const itemName = label.replace(/采集[:：]\s*/g, '').replace('采集', '').trim();
    const nodeEl = document.querySelector(`#exp-nodes .exp-node[data-idx="${idx}"]`);
    if (nodeEl) {
        if (nodeEl.style.pointerEvents === 'none') return;
        nodeEl.style.pointerEvents = 'none';
        nodeEl.style.transition = 'transform 0.4s ease, opacity 0.4s ease'; 
        nodeEl.style.transform = 'translate(-50%,-50%) scale(0) rotate(20deg)'; 
        nodeEl.style.opacity = '0';
        setTimeout(() => { 
            nodeEl.style.transition = 'transform 0.5s ease, opacity 0.5s ease'; 
            nodeEl.style.transform = 'translate(-50%,-50%) scale(1) rotate(0)'; 
            nodeEl.style.opacity = '1'; 
            nodeEl.style.pointerEvents = 'auto'; 
        }, 30000);
    }
    if(typeof addItem === 'function') addItem(itemName, 3);
    if(typeof showNotification === 'function') showNotification(`采集了【${itemName} ×3】，已放入灵犀袋！`, '🌿');
}

function _expNPCDialogue(label, idx, nodeDataFallback) {
    _exp.isPaused = true;
    const node = nodeDataFallback || _exp.config.exploration.nodes[idx];
    let speaker = label; let avatar = '🧑'; let isInheritor = false; let inheritorDataRef = null;

    if (node && node.data && node.data.bindInheritorId && typeof inheritorData !== 'undefined') {
        inheritorDataRef = inheritorData.find(i => i.id === node.data.bindInheritorId);
        if (inheritorDataRef) { isInheritor = true; speaker = inheritorDataRef.name; avatar = inheritorDataRef.avatar; }
    } else if (typeof inheritorData !== 'undefined') {
        inheritorDataRef = inheritorData.find(i => label.includes(i.name.slice(0, 2)) || i.name.includes(label.slice(0, 2)));
        if (inheritorDataRef) { isInheritor = true; speaker = inheritorDataRef.name; avatar = inheritorDataRef.avatar; }
    }

    if (!isInheritor && node && node.data) {
        if (node.data.name) speaker = node.data.name;
        if (node.data.avatar) avatar = node.data.avatar;
    }

    _startDynamicDialogue(speaker, avatar, isInheritor, inheritorDataRef, node);
}

function _typewrite(elId, text, speed, onDone) {
    const el = document.getElementById(elId); 
    if (!el) { onDone?.(); return; }
    el.innerHTML = ''; 
    let i = 0; 
    const timer = setInterval(() => { 
        el.innerHTML += text[i] === '\n' ? '<br>' : text[i];
        i++;
        if (i >= text.length) { clearInterval(timer); onDone?.(); } 
    }, speed);
}

window._startDynamicDialogue = function(speaker, avatar, isInheritor, inheritorDataRef, nodeData) {
    if (typeof dispatchQuestEvent === 'function') dispatchQuestEvent('talk_npc', 1);
    
    document.getElementById('exp-dialogue')?.remove();
    const panel = document.createElement('div'); 
    panel.id = 'exp-dialogue';
    panel.style.cssText = `position:fixed; bottom:0; left:0; width:100%; z-index:2000; background:linear-gradient(to top, rgba(20,16,12,0.97), rgba(30,24,18,0.92)); border-top:2px solid rgba(212,175,55,0.4); padding:24px 40px 28px; backdrop-filter:blur(10px); animation: slideUpIn 0.35s ease;`;
    document.body.appendChild(panel);

    const renderState = (state, ctx = {}) => {
        let text = ''; let options = [];
        
        if (state === 'GREET') {
            if (isInheritor) {
                text = inheritorDataRef.aiAvatar.greeting;
                options.push({ text: '📖 请教非遗学问', next: 'TEACH_MENU' });
                options.push({ text: '⛩️ 随您前往工坊', next: 'WORKSHOP' });
            } else if (nodeData && nodeData.data && nodeData.data.dialog && nodeData.data.dialog.length > 0) {
                text = nodeData.data.dialog[0].text;
                (nodeData.data.dialog[0].options || []).forEach(opt => {
                    const optText = typeof opt === 'string' ? opt : opt.text;
                    const funcStr = typeof opt === 'string' ? null : opt.func;
                    options.push({ text: `💬 ${optText}`, next: 'CUSTOM_TALK', func: funcStr, ctx: { msg: optText } });
                });
            } else { text = `"哟，来了位游侠儿！好好探索吧。"`; }
            options.push({ text: '🎁 赠送行囊灵物', next: 'GIFT_MENU' });
            options.push({ text: '👋 暂且告辞', next: 'LEAVE' });
        }
        else if (state === 'CUSTOM_TALK') {
            text = `"哈哈，有意思！相逢即是缘，这九州奇闻，咱们日后再细细详聊。"`;
            options.push({ text: '🙏 多谢指教', next: 'GREET' });
        }
        else if (state === 'TEACH_MENU') {
            text = `"九州技艺，浩如烟海。你想了解什么？"`;
            const kn = inheritorDataRef.aiAvatar.knowledge;
            if(kn.history) options.push({ text: '📜 历史渊源', next: 'TEACH_DETAIL', ctx: { content: kn.history } });
            if(kn.material) options.push({ text: '🌿 原材挑选', next: 'TEACH_DETAIL', ctx: { content: kn.material } });
            if(kn.craft) options.push({ text: '⚒️ 核心技艺', next: 'TEACH_DETAIL', ctx: { content: kn.craft } });
            options.push({ text: '↩️ 返回', next: 'GREET' });
        }
        else if (state === 'TEACH_DETAIL') {
            text = `"${ctx.content}"`; options.push({ text: '🙏 受教了', next: 'TEACH_MENU' });
        }
        else if (state === 'GIFT_MENU') {
            text = `"哦？你要送老夫礼物？"`;
            let hasItem = false;
            if (gameState.inventory) {
                for (let itemName in gameState.inventory) {
                    if (gameState.inventory[itemName] > 0) {
                        hasItem = true;
                        options.push({ text: `🎁 送出【${itemName}】`, next: 'GIFT_RESULT', ctx: { itemName: itemName } });
                    }
                }
            }
            if (!hasItem) text = `(行囊空空如也...)`;
            options.push({ text: '↩️ 算了', next: 'GREET' });
        }
        else if (state === 'GIFT_RESULT') {
            const item = ctx.itemName;
            gameState.inventory[item]--;
            if (typeof updateInventory === 'function') updateInventory();
            gameState.intimacy[speaker] = (gameState.intimacy[speaker] || 0) + 20;
            
            if (item === '宋代冰裂纹残片' && speaker === '张景春匠师') {
                text = `<span style="color:var(--gold); font-size:16px;">"天呐！这...这是南宋失传的冰裂纹配方！"</span>\n\n张景春匠师的手颤抖着抚摸过残片，老泪纵横。`;
                setTimeout(() => { if(typeof showNotification==='function') showNotification('张景春传授了你绝学！', '🏺'); }, 1000);
            } else {
                text = `"哎呀，这【${item}】可是好东西！多谢小友！"\n<span style="color:var(--jade); font-size:12px;">(好感度 +20)</span>`;
            }
            options.push({ text: '🙏 不客气', next: 'GREET' });
        }

        if (state === 'LEAVE') {
            panel.style.animation = 'slideDownOut 0.3s ease forwards';
            setTimeout(() => { panel.remove(); _exp.isPaused = false; }, 300); return;
        }
        if (state === 'WORKSHOP') {
            panel.remove(); _exp.isPaused = false;
            if (typeof goToWorkshopFromScene === 'function') goToWorkshopFromScene(); return;
        }

        // 🌟 核心修改：渲染带有输入框的全新聊天界面
        panel.innerHTML = `
            <div style="display:flex; gap:20px; align-items:flex-start; max-width:900px; margin:0 auto;">
                <div style="width:64px; height:64px; border-radius:50%; background:rgba(255,255,255,0.08); border:2px solid ${isInheritor ? 'var(--cinnabar)' : 'var(--gold)'}; display:flex; align-items:center; justify-content:center; font-size:32px; flex-shrink:0; box-shadow: 0 0 15px rgba(212,175,55,0.2);">
                    ${avatar}
                </div>
                <div style="flex:1;">
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
                        <span style="color:var(--amber); font-weight:bold; font-size:16px;">${speaker}</span>
                        <span style="color:var(--jade); font-size:11px; border:1px solid var(--jade); padding:2px 8px; border-radius:12px; margin-left:8px;">✨ AI 灵识驱动</span>
                    </div>
                    
                    <div id="exp-dlg-text" style="color:#e8dcc8; font-size:15px; line-height:1.8; min-height:48px; margin-bottom:18px;">
                        ${text.replace(/\n/g, '<br>')}
                    </div>
                    
                    <div id="exp-dlg-options" style="display:flex; gap:12px; flex-wrap:wrap;"></div>
                    
                    <div id="exp-ai-input-area" style="margin-top: 15px; display: flex; gap: 10px; border-top: 1px dashed rgba(255,255,255,0.15); padding-top: 15px;">
                        <input type="text" id="ai-chat-input" placeholder="与 ${speaker} 自由交谈... (按Enter发送)" style="flex:1; background:rgba(0,0,0,0.5); border:1px solid rgba(212,175,55,0.4); color:#fff; padding:10px 15px; border-radius:8px; outline:none; font-family:inherit; font-size:14px; transition:0.3s;">
                        <button id="ai-chat-send" class="btn btn-gold" style="padding: 0 24px; font-size:14px; font-weight:bold;">发送</button>
                    </div>
                </div>
            </div>`;

        // 渲染选项按钮
        const optContainer = document.getElementById('exp-dlg-options');
        options.forEach(opt => { 
            const btn = document.createElement('button'); 
            btn.className = 'btn btn-outline'; 
            btn.style.cssText = 'color:#e8dcc8; border-color:rgba(232,220,200,0.3); font-size:13px; padding:8px 16px; background: rgba(0,0,0,0.3); cursor:pointer; border-radius: 6px;'; 
            btn.innerText = opt.text; 
            btn.onmouseover = () => { btn.style.background = 'var(--jade)'; btn.style.borderColor = 'var(--jade)'; btn.style.color = 'white'; };
            btn.onmouseout = () => { btn.style.background = 'rgba(0,0,0,0.3)'; btn.style.borderColor = 'rgba(232,220,200,0.3)'; btn.style.color = '#e8dcc8'; };
            btn.onclick = () => {
                if (opt.func) { try { eval(opt.func); } catch(e) {} }
                renderState(opt.next, opt.ctx); 
            };
            optContainer.appendChild(btn); 
        });

        // 🌟 核心：绑定向服务器发送消息的网络请求
        const sendBtn = document.getElementById('ai-chat-send');
        const inputEl = document.getElementById('ai-chat-input');
        
        inputEl.addEventListener('focus', () => { inputEl.style.borderColor = 'var(--gold)'; });
        inputEl.addEventListener('blur', () => { inputEl.style.borderColor = 'rgba(212,175,55,0.4)'; });

        const handleSendChat = async () => {
            const msg = inputEl.value.trim();
            if (!msg) return;

            // UI 切换为沉思状态
            optContainer.innerHTML = '';
            inputEl.value = '';
            inputEl.disabled = true;
            sendBtn.disabled = true;
            sendBtn.innerText = '凝神...';
            
            const textEl = document.getElementById('exp-dlg-text');
            textEl.innerHTML = `<span style="color:#aaa; font-size:13px;">你：${msg}</span><br><br><span style="color:var(--jade);" class="anim-blink">正在跨越时空沟通天道法则 (AI思考中)...</span>`;
            
            try {
                const role = isInheritor ? inheritorDataRef.title : (nodeData?.data?.role || '九州居民');
                const intimacy = (gameState.intimacy && gameState.intimacy[speaker]) ? gameState.intimacy[speaker] : 0;
                const npcType = isInheritor ? 'inheritor' : 'normal';
                
                // 🌟 读取玩家在匠师端调教的私有数据
                const customAIData = (gameState.customAI && gameState.customAI[speaker]) ? gameState.customAI[speaker] : null;

                const personality = customAIData 
                    ? customAIData.personality 
                    : (isInheritor ? inheritorDataRef.aiAvatar.personality : (nodeData?.data?.aiPersonality || '普通的九州居民'));
                
                const knowledgeBase = customAIData
                    ? { craft: customAIData.knowledge } 
                    : (isInheritor ? inheritorDataRef.aiAvatar.knowledge : null);

                // 📡 向 Node.js 服务器发起请求
                const response = await fetch('http://localhost:3000/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        npcName: speaker,
                        npcRole: role,
                        npcType: npcType,
                        personality: personality || '平静', // 防崩溃兜底
                        knowledgeBase: knowledgeBase || {}, // 防崩溃兜底
                        userMessage: msg,
                        intimacy: intimacy
                    })
                });
                
                if (!response.ok) throw new Error('服务器返回错误状态');
                const result = await response.json();
                
                // 打字机特效输出回复
                textEl.innerHTML = `<span style="color:#aaa; font-size:13px;">你：${msg}</span><br><br>`;
                const replySpan = document.createElement('span');
                replySpan.id = 'ai-reply-text';
                replySpan.style.color = 'var(--gold)';
                textEl.appendChild(replySpan);
                
                _typewrite('ai-reply-text', result.reply, 35, () => {
                    inputEl.disabled = false;
                    sendBtn.disabled = false;
                    sendBtn.innerText = '发送';
                    inputEl.focus();
                    optContainer.innerHTML = `<button class="btn btn-outline" style="border-color:var(--cinnabar); color:var(--cinnabar); border-radius: 6px;" onclick="document.getElementById('exp-dialogue').style.animation='slideDownOut 0.3s ease forwards'; setTimeout(() => { document.getElementById('exp-dialogue').remove(); _exp.isPaused = false; }, 300);">👋 暂且告辞</button>`;
                });
                
            } catch (error) {
                console.error("前端请求报错:", error);
                // 🌟 核心修复：这里绝对不能省略！当报错时必须把 UI 恢复，否则就会永远卡在“沟通天道”
                textEl.innerHTML = `<span style="color:#aaa; font-size:13px;">你：${msg}</span><br><br><span style="color:var(--cinnabar);">（天道连接中断，${speaker} 陷入了沉思... 请检查终端中的 node server.js 是否报错）</span>`;
                inputEl.disabled = false;
                sendBtn.disabled = false;
                sendBtn.innerText = '重试';
                optContainer.innerHTML = `<button class="btn btn-outline" style="border-color:var(--cinnabar); color:var(--cinnabar); border-radius: 6px;" onclick="document.getElementById('exp-dialogue').style.animation='slideDownOut 0.3s ease forwards'; setTimeout(() => { document.getElementById('exp-dialogue').remove(); _exp.isPaused = false; }, 300);">👋 暂且告辞</button>`;
            }
        };

        sendBtn.onclick = handleSendChat;
        inputEl.onkeydown = (e) => { if (e.key === 'Enter') handleSendChat(); };
    };
    
    renderState('GREET');
};

function _expWorkshop(label, idx) { _exp.isPaused = true; _showWorkshopPanel(label, () => { _exp.isPaused = false; }); }
function _showWorkshopPanel(label, onClose) {
    document.getElementById('exp-workshop-panel')?.remove();
    const panel = document.createElement('div'); panel.id = 'exp-workshop-panel';
    panel.style.cssText = `position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:white; width:min(680px,92vw); border-radius:20px; box-shadow:0 20px 60px rgba(0,0,0,0.4); z-index:2000; overflow:hidden; border: 1px solid #ccc;`;
    panel.innerHTML = `<div style="background:linear-gradient(135deg,var(--jade),#5f9e87); padding:20px 25px; display:flex; justify-content:space-between; align-items:center;"><div style="color:white; font-size:20px; font-weight:bold;">${label}</div><button onclick="document.getElementById('exp-workshop-panel').remove(); ${onClose ? '(' + onClose.toString() + ')()' : ''}" style="background:transparent; border:none; color:white; font-size:24px; cursor:pointer;">×</button></div><div style="padding:25px; text-align:center;"><h2>欢迎来到工坊</h2><button class="btn btn-jade mt-md" onclick="document.getElementById('exp-workshop-panel').remove(); ${onClose ? '(' + onClose.toString() + ')()' : ''}">关闭</button></div>`;
    document.body.appendChild(panel);
}

function _expGame(label) { if (label.includes('投壶') && typeof openMinigame === 'function') openMinigame(); else if (label.includes('灯谜') && typeof openRiddleGame === 'function') openRiddleGame(); else { if(typeof showNotification==='function') showNotification(`进入【${label}】小游戏！`, '🎮'); } }
function _expShop() { if (typeof openShop === 'function') openShop(); }
function _expRest(label) { if(typeof earnStones === 'function') earnStones(10); if(typeof showNotification==='function') showNotification(`在【${label}】处小憩，恢复精力`, '😌'); }
function _expHiddenEvent(label, idx) { if(typeof showNotification==='function') showNotification('触发奇遇！', '✨'); }

function _expRuinInteraction(idx, nodeDataFallback) {
    _exp.isPaused = true;
    const node = nodeDataFallback || _exp.config.exploration.nodes[idx];
    const inv = gameState.inventory || {};
    const clues = node.data.requireClues || [];
    const allClues = clues.every(c => (inv[c] || 0) > 0);
    const hasItem = (inv[node.data.requireItem] || 0) > 0;

    document.getElementById('exp-ruin-panel')?.remove();
    const panel = document.createElement('div'); panel.id = 'exp-ruin-panel';
    panel.style.cssText = `position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); width:500px; background:linear-gradient(180deg,#2c2a28,#1a1816); border:2px solid #555; border-radius:16px; padding:28px; z-index:3000; color:white; animation:popIn 0.3s ease;`;
    
    let btnHtml = `<button class="btn btn-outline" style="width:100%; margin-top:15px;" onclick="document.getElementById('exp-ruin-panel').remove(); _exp.isPaused=false;">暂且退下</button>`;
    if (hasItem) {
        btnHtml = `<button class="btn btn-gold" style="width:100%; margin-top:15px;" onclick="executeRestorationRitual(${idx}, '${node.data.requireItem}', '${node.id}')">✨ 交付【${node.data.requireItem}】· 唤醒灵场</button>` + btnHtml;
    }

    panel.innerHTML = `<div style="text-align:center; font-size:50px; filter:grayscale(1); opacity:0.8;">${node.icon}</div>
      <div style="text-align:center; font-size:18px; font-weight:bold; margin-top:10px;">${node.label}</div>
      <div style="background:rgba(126,182,161,0.1); border-left:3px solid var(--jade); padding:12px; margin-top:15px; font-size:13px;">🤖 ${node.data.hint}</div>
      ${btnHtml}`;
    document.body.appendChild(panel);
}

window.executeRestorationRitual = function(idx, reqItem, nodeId) {
    document.getElementById('exp-ruin-panel')?.remove();
    gameState.inventory[reqItem]--;
    if(typeof playSound==='function') playSound('magic');
    
    if (!gameState.restoredNodes) gameState.restoredNodes = [];
    if (!gameState.restoredNodes.includes(nodeId)) gameState.restoredNodes.push(nodeId);

    const cinematic = document.createElement('div');
    cinematic.style.cssText = `position:fixed; inset:0; background:rgba(0,0,0,0.9); z-index:4000; display:flex; flex-direction:column; align-items:center; justify-content:center; transition: all 1.5s ease;`;
    cinematic.innerHTML = `<div style="color:var(--gold); font-size:30px; letter-spacing:8px; text-shadow:0 0 20px var(--gold);">天道归位 · 灵场重现</div>`;
    document.body.appendChild(cinematic);

    setTimeout(() => {
        cinematic.style.opacity = '0';
        _buildNodes(_exp.config.exploration.nodes);
        setTimeout(() => { cinematic.remove(); _exp.isPaused = false; }, 1500);
    }, 2500);
}

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
    ctx.fillStyle = `rgba(255,255,255,0.8)`; ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();
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
    document.getElementById('exp-dialogue')?.remove(); document.getElementById('exp-workshop-panel')?.remove(); document.getElementById('exp-ruin-panel')?.remove();
    document.querySelectorAll('.view-container').forEach(v => { v.classList.remove('active-view'); v.style.display = ''; });
    const sceneView = document.getElementById('view-scene'); if (sceneView) sceneView.classList.add('active-view');
    const dock = document.getElementById('player-dock'); if (dock) dock.classList.remove('hidden');
    if(typeof playSound === 'function') playSound('click');
}

function _nodeAuraColor(type) { const MAP = { collect: 'rgba(126,182,161,0.6)', npc: 'rgba(232,154,101,0.6)', workshop: 'rgba(178, 93, 82,0.6)', shop: 'rgba(212,175, 55,0.6)' }; return MAP[type] || 'rgba(255,255,255,0.3)'; }
function _nodeMinimapColor(type) { const MAP = { collect: '#7eb6a1', npc: '#e89a65', workshop:'#b25d52', shop: '#d4af37', ruin: '#444' }; return MAP[type] || '#aaaaaa'; }

function _initEcology(config) {
    _exp.dynamicNodes = []; _exp.critters = [];
    document.querySelectorAll('.eco-node, .eco-critter, .exp-particle').forEach(e => e.remove());
    const ecology = config.exploration.ecology;
    if (!ecology) return;
    for(let i=0; i<ecology.maxDrops / 2; i++) _spawnRandomDrop(ecology);
    if (ecology.critters) { ecology.critters.forEach(cDef => { for(let i=0; i<cDef.count; i++) _spawnCritter(cDef); }); }
}

function _tickEcology() {
    const ecology = _exp.config.exploration.ecology;
    if (!ecology || _exp.dynamicNodes.length >= ecology.maxDrops) return;
    const now = Date.now();
    if (now - _exp.lastSpawnTime > ecology.spawnInterval) { _exp.lastSpawnTime = now; _spawnRandomDrop(ecology); }
}

function _spawnRandomDrop(ecology) {
    let rx, ry; do { rx = Math.random() * WORLD_W; ry = Math.random() * WORLD_H; } while (_collides(rx, ry, 20));
    const dropId = 'eco_' + Date.now(); _exp.dynamicNodes.push(dropId);
    const container = document.getElementById('exp-nodes'); if (!container) return;
    const item = ecology.dropPool[Math.floor(Math.random() * ecology.dropPool.length)];
    const el = document.createElement('div'); el.className = 'exp-node eco-node'; el.dataset.id = dropId; el.dataset.type = 'collect'; el.dataset.label = `采集 ${item.itemName}`; el.dataset.wx = rx; el.dataset.wy = ry;
    el.style.cssText = `position:absolute; left:${rx}px; top:${ry}px; transform:translate(-50%,-50%); cursor:pointer; z-index:12;`;
    el.innerHTML = `<div style="font-size:24px; animation: float 3s infinite;">${item.icon}</div>`;
    el.addEventListener('click', (e) => { e.stopPropagation(); _collectDynamicDrop(el, item.itemName, dropId); });
    container.appendChild(el);
}

function _collectDynamicDrop(el, itemName, dropId) {
    if (el.style.pointerEvents === 'none') return;
    el.style.pointerEvents = 'none';
    el.style.transform = 'translate(-50%, -150px) scale(1.5)'; el.style.opacity = '0';
    setTimeout(() => { el.remove(); _exp.dynamicNodes = _exp.dynamicNodes.filter(id => id !== dropId); }, 600);
    if(typeof addItem === 'function') addItem(itemName, 1);
    if(typeof showNotification==='function') showNotification(`拾取【${itemName}】`, '✨');
}

function _spawnCritter(cDef) {
    const rx = Math.random() * WORLD_W, ry = Math.random() * WORLD_H;
    const el = document.createElement('div'); el.className = 'eco-critter'; el.innerHTML = cDef.icon;
    el.style.cssText = `position:absolute; left:${rx}px; top:${ry}px; font-size:20px; z-index:25; pointer-events:auto; cursor:pointer; transition: top 3s linear, left 3s linear;`;
    el.addEventListener('click', (e) => { e.stopPropagation(); el.style.opacity = '0'; setTimeout(()=>el.remove(), 500); if(typeof earnStones==='function') earnStones(5); _exp.critters = _exp.critters.filter(c=>c.el!==el); });
    document.getElementById('exp-nodes')?.appendChild(el);
    _exp.critters.push({ el, x: rx, y: ry, tx: rx, ty: ry, type: cDef.behavior, speed: Math.random()*2+1 });
}

function _tickCritters() {
    _exp.critters.forEach(c => {
        if (Math.hypot(c.tx - c.x, c.ty - c.y) < 10) {
            c.tx = Math.max(50, Math.min(WORLD_W-50, c.x + (Math.random()-0.5)*300));
            c.ty = Math.max(50, Math.min(WORLD_H-50, c.y + (Math.random()-0.5)*300));
        }
        if (c.type === 'flee' && Math.hypot(_exp.player.x - c.x, _exp.player.y - c.y) < 150) {
            c.tx = c.x + (c.x - _exp.player.x)*2; c.ty = c.y + (c.y - _exp.player.y)*2;
        }
        c.x += (c.tx - c.x) * 0.02 * c.speed; c.y += (c.ty - c.y) * 0.02 * c.speed;
        c.el.style.left = c.x + 'px'; c.el.style.top = c.y + 'px';
        c.el.style.transform = c.tx < c.x ? 'scaleX(-1)' : 'scaleX(1)';
    });
}

function _spawnEnvironmentParticles(config) {
    const layer = document.getElementById('exp-click-layer'); 
    const pType = config.exploration.ecology?.particleEffect;
    if (!layer || !pType) return;
    for(let i=0; i<30; i++) {
        const p = document.createElement('div'); p.className = `exp-particle particle-${pType}`;
        p.style.cssText = `position:absolute; left:${Math.random()*100}%; top:${Math.random()*100}%; animation-duration:${Math.random()*10+5}s; animation-delay:-${Math.random()*10}s; pointer-events:none; opacity:0.6; z-index:500;`;
        if (pType === 'bamboo-leaves') p.innerText = '🍃';
        else if (pType === 'petals') p.innerText = '🌸';
        else if (pType === 'fireflies') p.style.cssText += 'width:4px; height:4px; background:var(--jade); border-radius:50%; box-shadow:0 0 10px var(--jade);';
        layer.appendChild(p);
    }
}

document.addEventListener('keydown', (e) => {
    const view = document.getElementById(EXP_VIEW_ID); 
    if (!view || !view.classList.contains('active-view')) return;
    switch (e.key.toLowerCase()) { 
        case 'w': _exp.keys.w = true; break; case 's': _exp.keys.s = true; break; 
        case 'a': _exp.keys.a = true; break; case 'd': _exp.keys.d = true; break; 
        case 'f': if (_exp.nearbyNode && !_exp.isPaused) {
            if (_exp.nearbyNode.classList.contains('eco-node')) _collectDynamicDrop(_exp.nearbyNode, _exp.nearbyNode.dataset.label.replace('采集 ', ''), _exp.nearbyNode.dataset.id);
            else triggerInteraction(_exp.nearbyNode.dataset.type, _exp.nearbyNode.dataset.label, parseInt(_exp.nearbyNode.dataset.idx));
        } break; 
        case 'escape': exitExploration(); break;
        case 'v': view.classList.toggle('spirit-vision'); break;
        case 'c': 
            if(document.getElementById('compass-radar')) return; 
            const radar = document.createElement('div'); radar.id = 'compass-radar'; radar.className = 'compass-radar';
            const pointer = document.createElement('div'); pointer.className = 'compass-pointer';
            document.getElementById('exp-player').appendChild(radar); document.getElementById('exp-player').appendChild(pointer);
            setTimeout(() => { radar.remove(); pointer.remove(); }, 4000);
            function updateCompass() {
                if(!document.getElementById('compass-radar')) return;
                let t = null, min = Infinity;
                document.querySelectorAll('.exp-node[data-type="collect"], .exp-node[data-type="hidden"]').forEach(el => {
                    if (el.style.opacity === '0') return; 
                    const d = Math.hypot(_exp.player.x - parseFloat(el.dataset.wx), _exp.player.y - parseFloat(el.dataset.wy));
                    if(d < min) { min = d; t = el; }
                });
                if(t) { pointer.style.transform = `translate(-50%, -100%) rotate(${Math.atan2(parseFloat(t.dataset.wy) - _exp.player.y, parseFloat(t.dataset.wx) - _exp.player.x) * 180 / Math.PI + 90}deg)`; pointer.style.opacity = 1; }
                else pointer.style.opacity = 0; 
                requestAnimationFrame(updateCompass);
            }
            updateCompass();
            break;
    }
});
document.addEventListener('keyup', (e) => { 
    switch (e.key.toLowerCase()) { case 'w': _exp.keys.w = false; break; case 's': _exp.keys.s = false; break; case 'a': _exp.keys.a = false; break; case 'd': _exp.keys.d = false; break; } 
});

window.updateWorldEcology = function(stateIndex, timeId) {
    const canvas = document.getElementById('exp-canvas');
    if (!canvas) return;
    const filters = [ 'sepia(0.2) brightness(1.05) hue-rotate(-10deg)', 'saturate(1.1) brightness(1.1)', 'sepia(0.5) saturate(1.3) brightness(0.85) hue-rotate(-20deg)', 'brightness(0.55) contrast(1.2) saturate(0.8) hue-rotate(180deg)' ];
    canvas.style.transition = 'filter 3s ease'; canvas.style.filter = filters[stateIndex] || 'none';
    document.querySelectorAll('.exp-node').forEach(nodeEl => {
        const spawnTime = nodeEl.dataset.spawnTime;
        if (spawnTime && spawnTime !== 'all') {
            const isActive = (spawnTime === timeId);
            nodeEl.style.opacity = isActive ? '1' : '0'; nodeEl.style.pointerEvents = isActive ? 'auto' : 'none';
        }
    });
};