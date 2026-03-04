/**
 * scene.js
 * 寻遗集 · 场景模块
 * 负责：九州大地图拖拽 / 场景枢纽渲染 / 漫游场景 / 交互节点 / 玩家角色移动
 *
 * 依赖：core.js（sceneConfig, gameState, playSound, showNotification,
 * switchMainView, addItem, advanceQuest, unlockAchievement,
 * earnStones, openShop）
 */

// ============================================================
// 一、九州大地图 · 拖拽系统
// ============================================================

/**
 * 初始化大地图鼠标拖拽滚动
 * 在玩家登录后、首次进入地图视图时调用一次。
 */
/**
 * scripts/scene.js
 */
function initMapDrag() {
    const mapContainer = document.getElementById('map-scroll');
    if (!mapContainer) return;
    let isDown = false, startX, startY, scrollLeft, scrollTop;

    setTimeout(() => { mapContainer.scrollLeft = 1100; mapContainer.scrollTop = 700; }, 50);

    mapContainer.addEventListener('mousedown', (e) => {
        if (e.target.closest('.anchor')) return;
        isDown = true;
        startX = e.pageX - mapContainer.offsetLeft;
        startY = e.pageY - mapContainer.offsetTop;
        scrollLeft = mapContainer.scrollLeft;
        scrollTop = mapContainer.scrollTop;
        mapContainer.style.cursor = 'grabbing';
    });
    mapContainer.addEventListener('mouseleave', () => { isDown = false; mapContainer.style.cursor = 'grab'; });
    mapContainer.addEventListener('mouseup', () => { isDown = false; mapContainer.style.cursor = 'grab'; });
    mapContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - mapContainer.offsetLeft;
        const y = e.pageY - mapContainer.offsetTop;
        mapContainer.scrollLeft = scrollLeft - (x - startX) * 1.5;
        mapContainer.scrollTop = scrollTop - (y - startY) * 1.5;
    });
}

// ============================================================
// 二、场景枢纽
// ============================================================

/**
 * 进入指定场景枢纽
 */
function enterScene(sceneKey) {
    const config = typeof sceneKey === 'string' ? sceneConfig[sceneKey] : sceneKey;
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

    // 场景任务埋点
    if (typeof dispatchQuestEvent === 'function') dispatchQuestEvent('enter_scene');

    _renderSceneActions(config.actions || []);
    if (typeof playSound === 'function') playSound('scene_enter');
}

/**
 * 离开场景枢纽，返回九州大地图
 */
function leaveScene() {
    gameState.currentScene = null;
    _hideAllViews();
    document.getElementById('view-map').classList.add('active-view');
    document.getElementById('player-dock').classList.remove('hidden');
    _setDockActive(0);
}

/**
 * 从场景枢纽跳转到天工阁
 */
function goToWorkshopFromScene() {
    document.getElementById('player-dock').classList.remove('hidden');
    switchMainView('view-workshop', document.getElementById('dock-workshop'));
    if (typeof renderWorkshop === 'function') renderWorkshop();
}

/**
 * 渲染场景行动卡片列表
 */
function _renderSceneActions(actions) {
    const grid = document.getElementById('scene-actions');
    if (!grid) return;
    grid.innerHTML = actions.map(action => `
        <div class="action-card" onclick='${action.func}'>
            <span class="action-icon">${action.icon}</span>
            <h3>${action.name}</h3>
            <p>${action.desc}</p>
        </div>
    `).join('');
}


// ============================================================
// 三、漫游场景 & 四、玩家角色移动 & 五、交互节点逻辑
// (这部分完全保留你原来的逻辑)
// ============================================================

function startPlayableScene(sceneKey) {
    const config = sceneConfig[sceneKey];
    if (!config) {
        console.warn(`[scene.js] startPlayableScene: 未找到场景 "${sceneKey}"`);
        return;
    }
    _hideAllViews();
    document.getElementById('view-playable').classList.add('active-view');
    const playBg = document.getElementById('play-bg');
    if (playBg) {
        playBg.style.backgroundColor = config.bgColor || '#6b8e23';
        playBg.style.backgroundImage = config.bgImage ? `url('${config.bgImage}')` : 'none';
    }
    const playView = document.getElementById('view-playable');
    if (playView) playView.style.backgroundColor = config.bgColor || '#6b8e23';
    _renderPlayableNodes(config.playableNodes || []);
    _resetPlayerPosition();
    if (typeof playSound === 'function') playSound('playable_enter');
}

function exitPlayableScene() {
    _hideAllViews();
    document.getElementById('view-scene').classList.add('active-view');
}

function _renderPlayableNodes(nodes) {
    const container = document.getElementById('interact-container');
    if (!container) return;
    container.innerHTML = nodes.map(node => `
        <div class="interact-node"
             style="top:${node.pos.top}; left:${node.pos.left};"
             onclick="interactNode('${node.type}', '${node.label}')">
            <div class="inode-icon">${node.icon}</div>
            <div class="inode-label">${node.label}</div>
        </div>
    `).join('');
}

function _resetPlayerPosition() {
    const playerChar = document.getElementById('player-char');
    if (!playerChar) return;
    playerChar.style.transition = 'none';
    playerChar.style.left       = '50%';
    playerChar.style.top        = '50%';
    playerChar.style.transform  = 'translate(-50%, -50%)';
}

function _bindPlayerMovement() {
    const playableArea = document.getElementById('playable-area');
    const playerChar   = document.getElementById('player-char');
    if (!playableArea || !playerChar) return;
    playableArea.addEventListener('click', (e) => {
        if (e.target.closest('.interact-node') || e.target.closest('.play-ui-top')) return;
        const rect    = playableArea.getBoundingClientRect();
        const targetX = e.clientX - rect.left;
        const targetY = e.clientY - rect.top;
        const currentX = playerChar.offsetLeft;
        const currentY = playerChar.offsetTop;
        const dist     = Math.hypot(targetX - currentX, targetY - currentY);
        const duration = Math.max(dist / 0.2, 100);
        const scaleX = targetX < currentX ? -1 : 1;
        playerChar.style.transition = `top ${duration}ms linear, left ${duration}ms linear`;
        playerChar.style.left       = `${targetX}px`;
        playerChar.style.top        = `${targetY}px`;
        playerChar.style.transform  = `translate(-50%, -50%) scaleX(${scaleX})`;
    });
}

function interactNode(type, label) {
    if (typeof playSound === 'function') playSound(type);
    switch (type) {
        case 'collect': _handleCollect(label); break;
        case 'npc':     _handleNPC(label);     break;
        case 'game':    _handleGame(label);    break;
        case 'shop':    if(typeof openShop === 'function') openShop(); break;
        case 'rest':    if(typeof showNotification === 'function') showNotification('你在此处休憩，身心得到了放松', '😌'); break;
        default:        if(typeof showNotification === 'function') showNotification(`与【${label}】产生了互动`, '✨');
    }
}

function _handleCollect(label) {
    const itemName = label.replace(/采集[:：]\s*/g, '').replace('采集', '').trim();
    if(typeof addItem === 'function') addItem(itemName, 3);
    if(typeof advanceQuest === 'function') advanceQuest('daily1');
    if(typeof showNotification === 'function') showNotification(`获得了【${itemName} x3】！已放入灵犀袋。`, '📦');
    if(typeof unlockAchievement === 'function') {
        unlockAchievement('first_interact', '初露锋芒', '完成第一次交互', 100, '🌟');
        const totalItems = Object.values(gameState.inventory).reduce((a, b) => a + b, 0);
        if (totalItems >= 10) {
            unlockAchievement('collect_10', '采药达人', '收集物品总数达到 10 件', 150, '🌿');
        }
    }
}

function _handleNPC(label) {
    const confirmed = confirm(
        `一位【${label}】向你招手：\n"游侠儿，我看你骨骼惊奇，要不要随我学习技艺？"\n\n是否前往天工阁拜师？`
    );
    if (confirmed) {
        exitPlayableScene();
        goToWorkshopFromScene();
    }
}

function _handleGame(label) {
    if (label.includes('投壶')) {
        if (typeof openMinigame === 'function') openMinigame();
    } else if (label.includes('灯谜')) {
        if (typeof openRiddleGame === 'function') openRiddleGame();
    } else {
        if(typeof showNotification === 'function') showNotification(`进入【${label}】小游戏！`, '🎮');
    }
}

function _hideAllViews() {
    document.querySelectorAll('.view-container').forEach(v => {
        v.classList.remove('active-view');
        v.style.display = '';
    });
}

function _setDockActive(index) {
    const dockItems = document.querySelectorAll('#player-dock .dock-item');
    dockItems.forEach((item, i) => item.classList.toggle('active', i === index));
}

document.addEventListener('DOMContentLoaded', () => {
    initMapDrag();
    _bindPlayerMovement();
});

// ============================================================
// 新增：沉浸式探索跳转入口
// ============================================================
window.startExploration = function() {
    // 获取当前所在的场景 key
    const key = typeof gameState !== 'undefined' ? gameState.currentScene : null;
    
    if (!key) {
        if(typeof showNotification === 'function') showNotification('请先进入一个具体场景！', '⏳');
        return;
    }

    if (typeof renderExplorationMap === 'function') {
        // 调用 exploration-engine.js 中的渲染函数
        renderExplorationMap(key);
    } else {
        if(typeof showNotification === 'function') showNotification('正在加载中，请稍候', '⚠️');
    }
};



// ============================================================
// 终极修复补丁：强制启用高级 2.5D 探索引擎
// （替换 scene.js 最底部的代码）
// ============================================================

window.startExploration = function() {
    let key = gameState.currentScene;
    
    // 如果 gameState 里存的是中文标题（如"万艺城"），反查出对应的英文 key
    if (sceneConfig[key] === undefined) {
        key = Object.keys(sceneConfig).find(k => sceneConfig[k].title === gameState.currentScene);
    }
    
    if (!key || !sceneConfig[key]) {
        if(typeof showNotification === 'function') showNotification('请先点击地图上的区域图标！', '⏳');
        return;
    }

    // ⚠️ 关键修复：绝对不要调用旧版函数，强制调用新版高级探索引擎！
    if (typeof window.renderExplorationMap === 'function') {
        window.renderExplorationMap(key);
    } else {
        if(typeof showNotification === 'function') showNotification('高级探索引擎尚未加载！', '❌');
    }
};

// 确保探索引擎内的“退出”按钮无论何时都能生效
window.exitExploration = function() {
    // 关闭所有探索场景的弹窗
    document.getElementById('exp-dialogue')?.remove();
    document.getElementById('exp-workshop-panel')?.remove();
    document.getElementById('exp-hidden-panel')?.remove();

    // 隐藏所有视图，重新显示场景枢纽
    document.querySelectorAll('.view-container').forEach(v => {
        v.classList.remove('active-view');
        v.style.display = '';
    });
    
    const sceneView = document.getElementById('view-scene');
    if (sceneView) sceneView.classList.add('active-view');
    
    if(typeof playSound === 'function') playSound('click');
};